"""Build the replay from NASA GEOS-FP aerosol diagnostics.

Requires netCDF4, NumPy, SciPy, and Pillow. Run from any directory.
"""

from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta
from hashlib import sha256
import json
from pathlib import Path
from urllib.request import urlretrieve

from netCDF4 import Dataset
import numpy as np
from PIL import Image
from scipy.interpolate import RegularGridInterpolator


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".source-cache"
DATA = ROOT / "data"
ARCHIVE = "https://portal.nccs.nasa.gov/datashare/gmao/geos-fp/das"
LAND = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson"
START = date(2014, 4, 4)
DAYS = [START + timedelta(days=index) for index in range(8)]
WORLD = 20037508.342789244
BOUNDS = [-WORLD / 2, -WORLD / 4, WORLD / 4, WORLD / 4]
WIDTH, HEIGHT = 432, 288
RAMP = [
    (0, (64, 86, 95, 0)),
    (25, (125, 87, 58, 45)),
    (50, (164, 102, 52, 110)),
    (100, (205, 130, 62, 167)),
    (200, (239, 169, 87, 212)),
    (400, (255, 211, 137, 244)),
    (800, (255, 238, 190, 255)),
]


def fetch(job):
    name, url = job
    path = CACHE / name
    if not path.exists():
        temporary = path.with_suffix(path.suffix + ".download")
        urlretrieve(url, temporary)
        temporary.replace(path)


def write_json(path, value):
    path.write_text(json.dumps(value, separators=(",", ":"), allow_nan=False) + "\n",
                    encoding="utf-8", newline="\n")


def source_for(day):
    return (f"{ARCHIVE}/{day:%Y%Y/M%m/D%d}".replace(f"/{day.year}{day.year}/", f"/Y{day.year}/")
            + f"/GEOS.fp.asm.tavg3_2d_aer_Nx.{day:%Y%m%d}_1330.V01.nc4")


def map_coordinates():
    xmin, ymin, xmax, ymax = BOUNDS
    x = xmin + (np.arange(WIDTH) + 0.5) * (xmax - xmin) / WIDTH
    y = ymax - (np.arange(HEIGHT) + 0.5) * (ymax - ymin) / HEIGHT
    lon = x / WORLD * 180
    lat = np.degrees(np.arctan(np.sinh(y / WORLD * np.pi)))
    return np.stack(np.meshgrid(lat, lon, indexing="ij"), axis=-1)


def prepare_frame(day, coordinates):
    source = source_for(day)
    with Dataset(CACHE / f"geosfp-{day:%Y%m%d}.nc4") as dataset:
        if (dataset.RangeBeginningDate, dataset.RangeBeginningTime,
                dataset.RangeEndingDate, dataset.RangeEndingTime) != (
                    str(day), "12:00:00.000000", str(day), "15:00:00.000000"):
            raise ValueError(f"Unexpected GEOS-FP time window for {day}")
        axes = (dataset["lat"][:], dataset["lon"][:])
        units = {"DUCMASS": "kg m-2", "DUFLUXU": "kg m-1 s-1", "DUFLUXV": "kg m-1 s-1"}
        fields = {}
        for name, unit in units.items():
            variable = dataset[name]
            if variable.dimensions != ("time", "lat", "lon") or variable.units != unit:
                raise ValueError(f"Unexpected {name} dimensions or units for {day}")
            values = variable[0].filled(np.nan)
            fields[name] = RegularGridInterpolator(axes, values)(coordinates)

    # Divide interpolated flux by interpolated mass so both map layers refer to
    # the same dust column. The result is its effective horizontal velocity.
    mass = fields["DUCMASS"]
    if not np.isfinite(mass).all() or np.any(mass <= 0):
        raise ValueError(f"Missing or nonpositive dust loading for {day}")
    u, v = (fields[name] / mass for name in ("DUFLUXU", "DUFLUXV"))
    speed = np.hypot(u, v)
    if not np.isfinite(speed).all() or speed.max() > 100:
        raise ValueError(f"Unexpected dust transport speed for {day}")

    transport = f"transport-{day}.json"
    write_json(DATA / transport, {"u": u.round(2).ravel().tolist(), "v": v.round(2).ravel().tolist()})
    dust = f"dust-{day}.png"
    levels, colors = zip(*RAMP)
    rgba = np.stack([np.interp(mass * 1e6, levels, channel) for channel in zip(*colors)], axis=-1)
    Image.fromarray(rgba.round().astype(np.uint8)).save(DATA / dust, optimize=True)
    print(f"{day}: maximum dust loading {mass.max() * 1e6:.0f} mg/m², maximum transport {speed.max():.1f} m/s")
    return {"time": f"{day}T13:30:00Z", "dust": dust, "transport": transport, "source": source}


def main():
    CACHE.mkdir(exist_ok=True)
    DATA.mkdir(exist_ok=True)
    jobs = [(f"geosfp-{day:%Y%m%d}.nc4", source_for(day)) for day in DAYS] + [("land.geojson", LAND)]
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(fetch, jobs))

    coordinates = map_coordinates()
    frames = [prepare_frame(day, coordinates) for day in DAYS]
    land = json.loads((CACHE / "land.geojson").read_text(encoding="utf-8"))
    write_json(DATA / "land.geojson", land)
    assets = ["land.geojson"] + [frame[key] for frame in frames for key in ("dust", "transport")]
    manifest = {
        "crs": 3857, "bounds": BOUNDS, "width": WIDTH, "height": HEIGHT,
        "source": "NASA GEOS-FP DFPT3NXAER", "averagingHours": 3,
        "dustUnits": "mg/m²", "transportUnits": "m/s", "landSource": LAND, "ramp": RAMP,
        "frames": frames,
        "sha256": {name: sha256((DATA / name).read_bytes()).hexdigest() for name in sorted(assets)},
    }
    write_json(DATA / "manifest.json", manifest)


if __name__ == "__main__":
    main()
