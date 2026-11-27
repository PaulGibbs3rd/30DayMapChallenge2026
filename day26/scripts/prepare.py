"""Build the Elwha comparison from the USGS 2009 archive and July 2017 grid."""

import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile

import numpy as np
from osgeo import gdal, ogr, osr
from scipy.interpolate import LinearNDInterpolator
from scipy.spatial import Delaunay


OUT = Path(__file__).resolve().parents[1] / "data"
CELL = 5
HIGH_WATER = 1.86
NODATA = -9999
MAX_TRIANGLE_EDGE = 50
MAP_BOUNDS = (295450, 129900, 298650, 131980)
BASELINE = ("September 2009", "2009-09-15", "2009-09-17", "10.3133/ds288")
FOLLOWUP = ("July 2017", "2017-07-20", "2017-07-23", "10.5066/P9AJ8ALB")


def reference(epsg):
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(epsg)
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    return srs


def read_grid(path):
    grid = gdal.Open(str(path))
    if grid.GetDriver().ShortName != "AAIGrid":
        raise ValueError(f"Expected a USGS ASCII grid: {path}")
    x, dx, rx, y, ry, dy = grid.GetGeoTransform()
    if (dx, rx, ry, dy) != (CELL, 0, 0, -CELL) or x % CELL or y % CELL:
        raise ValueError(f"Grid does not align with the USGS 5 m lattice: {path}")
    if grid.GetRasterBand(1).GetNoDataValue() != NODATA:
        raise ValueError(f"Unexpected NoData value: {path}")
    return grid, (int(x), int(y))


def canvas(values, origin, srs, data_type):
    rows, columns = values.shape
    grid = gdal.GetDriverByName("MEM").Create("", columns, rows, 1, data_type)
    grid.SetGeoTransform((origin[0], CELL, 0, origin[1], 0, -CELL))
    grid.SetSpatialRef(srs)
    grid.GetRasterBand(1).WriteArray(values)
    return grid


def vector_layer(srs, geometry_type):
    source = ogr.GetDriverByName("MEM").CreateDataSource("")
    layer = source.CreateLayer("features", srs, geometry_type)
    layer.CreateField(ogr.FieldDefn("value", ogr.OFTInteger))
    return source, layer


def polygonize(values, origin, srs):
    grid = canvas(values, origin, srs, gdal.GDT_Byte)
    band = grid.GetRasterBand(1)
    source, layer = vector_layer(srs, ogr.wkbPolygon)
    gdal.Polygonize(band, band, layer, 0)
    return [(feature["value"], feature.GetGeometryRef().Clone()) for feature in layer]


def shoreline(values, origin, srs):
    grid = canvas(values, origin, srs, gdal.GDT_Float32)
    source, layer = vector_layer(srs, ogr.wkbLineString)
    gdal.ContourGenerate(grid.GetRasterBand(1), 0, 0, [HIGH_WATER], 1, NODATA, layer, -1, -1)
    # A cell exactly at the contour level can produce a degenerate point on export.
    return [(1, feature.GetGeometryRef().Clone()) for feature in layer if feature.GetGeometryRef().Length() >= 0.05]


def write_layers(path, layers, transform, srs):
    source = ogr.GetDriverByName("MEM").CreateDataSource("")
    layer = source.CreateLayer("elwha", srs, ogr.wkbUnknown)
    layer.CreateField(ogr.FieldDefn("kind", ogr.OFTString))
    for label, shapes in layers.items():
        for _, shape in shapes:
            shape.Transform(transform)
            feature = ogr.Feature(layer.GetLayerDefn())
            feature["kind"] = label
            feature.SetGeometry(shape)
            layer.CreateFeature(feature)
    output = gdal.VectorTranslate(str(path), source, format="GeoJSON",
                                  layerCreationOptions=["RFC7946=YES", "COORDINATE_PRECISION=7"])
    output.Close()


def date_record(grid_path, date):
    label, start, end, doi = date
    return {"label": label, "start": start, "end": end, "doi": doi,
            "file": grid_path.name, "sha256": hashlib.sha256(grid_path.read_bytes()).hexdigest()}


def interpolate_baseline(path, size, origin):
    with ZipFile(path) as archive:
        names = [name for name in archive.namelist() if name.startswith(
            ("data_09/septb/bathy/", "data_09/septb/topo/")) and name.endswith(".xyz")]
        if len(names) != 334:
            raise ValueError("Expected 186 bathymetric and 148 topographic profiles")
        points = np.concatenate([np.loadtxt(archive.open(name), usecols=(0, 1, 2), ndmin=2) for name in names])

    rows, cols = size
    left, top = origin
    bottom, right = top - rows * CELL, left + cols * CELL
    margin = MAX_TRIANGLE_EDGE
    selected = ((points[:, 0] >= left - margin) & (points[:, 0] <= right + margin)
                & (points[:, 1] >= bottom - margin) & (points[:, 1] <= top + margin))
    points = points[selected]
    # Average duplicate horizontal positions before building the triangulation.
    xy, index, counts = np.unique(points[:, :2], axis=0, return_inverse=True, return_counts=True)
    elevations = np.bincount(index, weights=points[:, 2]) / counts
    mesh = Delaunay(xy)
    vertices = xy[mesh.simplices]
    edge_lengths = np.linalg.norm(vertices - np.roll(vertices, 1, axis=1), axis=2)
    supported = np.max(edge_lengths, axis=1) <= MAX_TRIANGLE_EDGE

    x, y = np.meshgrid(left + (np.arange(cols) + 0.5) * CELL, top - (np.arange(rows) + 0.5) * CELL)
    cells = np.column_stack([x.ravel(), y.ravel()])
    triangles = mesh.find_simplex(cells)
    valid = (triangles >= 0) & supported[triangles]
    grid = np.full(len(cells), NODATA, dtype=np.float32)
    grid[valid] = LinearNDInterpolator(mesh, elevations)(cells[valid])
    grid[~np.isfinite(grid)] = NODATA
    return grid.reshape(size)


def build(before_path, after_path):
    projected, geographic = reference(32148), reference(4326)
    transform = osr.CoordinateTransformation(projected, geographic)
    after, (source_left, source_top) = read_grid(after_path)
    left, bottom, right, top = MAP_BOUNDS
    origin = (left, top)
    last = after.ReadAsArray((left - source_left) // CELL, (source_top - top) // CELL,
                             (right - left) // CELL, (top - bottom) // CELL)
    first = interpolate_baseline(before_path, last.shape, origin)
    first_valid, last_valid = first != NODATA, last != NODATA
    common = first_valid & last_valid
    first_land = first_valid & (first >= HIGH_WATER)
    last_land = last_valid & (last >= HIGH_WATER)
    gained = common & ~first_land & last_land
    lost = common & first_land & ~last_land
    if not (np.any(gained) and np.any(lost)):
        raise ValueError("The aligned surveys did not yield both change classes")
    OUT.mkdir(exist_ok=True)
    fill = {
        "water-before": polygonize(first_valid, origin, projected),
        "water-after": polygonize(last_valid, origin, projected),
        "land-before": polygonize(first_land, origin, projected),
        "land-after": polygonize(last_land, origin, projected),
        "common": polygonize(common, origin, projected),
        "gain": polygonize(gained, origin, projected),
        "loss": polygonize(lost, origin, projected),
    }
    lines = {"shore-before": shoreline(first, origin, projected),
             "shore-after": shoreline(last, origin, projected)}
    write_layers(OUT / "areas.geojson", fill, transform, geographic)
    write_layers(OUT / "shorelines.geojson", lines, transform, geographic)
    metadata = {
        "before": date_record(before_path, BASELINE),
        "after": date_record(after_path, FOLLOWUP),
        "cellMeters": CELL, "highWaterMetersNavd88": HIGH_WATER, "baselineMaxTriangleEdgeMeters": MAX_TRIANGLE_EDGE,
        "commonSquareMeters": int(common.sum()) * CELL**2,
        "gainSquareMeters": int(gained.sum()) * CELL**2,
        "lossSquareMeters": int(lost.sum()) * CELL**2,
        "bounds": list(MAP_BOUNDS),
    }
    (OUT / "survey.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("before", type=Path)
    parser.add_argument("after", type=Path)
    options = parser.parse_args()
    if options.after.name != "ew17_july_dem_5m.asc":
        parser.error("Provide the original USGS July 2017 5 m grid")
    for module in (gdal, ogr, osr):
        module.UseExceptions()
    build(options.before, options.after)
