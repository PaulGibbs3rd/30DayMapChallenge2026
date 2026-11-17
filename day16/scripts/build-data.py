"""Create the Day 16 route snapshot and vector tile style from the public source files."""
import argparse
from collections import Counter, defaultdict
import csv
from datetime import date
import io
import json
from pathlib import Path
from zipfile import ZipFile

OUTPUT = Path(__file__).resolve().parents[1] / "data"
SEATTLE = (-122.435, 47.495, -122.235, 47.737)
SERVICE = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
TYPES = {"0": "rail", "1": "rail", "2": "rail", "3": "bus", "4": "ferry"}
FERRIES = {
    "973": "West Seattle ↔ Downtown Seattle",
    "975": "Vashon Island ↔ Downtown Seattle",
    "400": "Bremerton ↔ Seattle",
    "403": "Bremerton ↔ Seattle",
    "401": "Kingston ↔ Seattle",
    "404": "Kingston ↔ Seattle",
    "402": "Southworth ↔ Seattle",
    "405": "Southworth ↔ Seattle",
}


def rows(feed, name):
    with io.TextIOWrapper(feed.open(name + ".txt"), encoding="utf-8-sig") as content:
        yield from csv.DictReader(content)


def route_snapshot(feed, day):
    service_day = day.strftime("%Y%m%d")
    weekday = ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")[day.weekday()]
    active = {r["service_id"] for r in rows(feed, "calendar")
              if r["start_date"] <= service_day <= r["end_date"] and r[weekday] == "1"}
    for row in rows(feed, "calendar_dates"):
        if row["date"] == service_day:
            if row["exception_type"] == "1":
                active.add(row["service_id"])
            else:
                active.discard(row["service_id"])
    agencies = {r["agency_id"]: r["agency_name"] for r in rows(feed, "agency")}
    routes = {r["route_id"]: r for r in rows(feed, "routes") if r["route_type"] in TYPES}
    patterns = defaultdict(Counter)
    for trip in rows(feed, "trips"):
        if trip["service_id"] in active and trip["route_id"] in routes and trip["shape_id"]:
            patterns[trip["route_id"]][trip["shape_id"]] += 1
    shape_ids = {shape for route in patterns.values() for shape in route}
    shapes = defaultdict(list)
    for row in rows(feed, "shapes"):
        if row["shape_id"] in shape_ids:
            shapes[row["shape_id"]].append((int(row["shape_pt_sequence"]),
                round(float(row["shape_pt_lon"]), 5), round(float(row["shape_pt_lat"]), 5)))

    west, south, east, north = SEATTLE
    features = {}
    for route_id, counts in patterns.items():
        route = routes[route_id]
        touching = [shape for shape in counts if any(
            west <= x <= east and south <= y <= north for _, x, y in shapes[shape])]
        if not touching:
            continue
        shape = max(touching, key=lambda key: (counts[key], len(shapes[key]), key))
        points = []
        for _, longitude, latitude in sorted(shapes[shape]):
            if not points or points[-1] != (longitude, latitude):
                points.append((longitude, latitude))
        if len(points) < 2:
            continue
        agency = agencies[route["agency_id"]]
        if route["agency_id"] == "1":
            agency = "King County Metro"
        mode = TYPES[route["route_type"]]
        short = route["route_short_name"].strip()
        long = route["route_long_name"].strip()
        name = short or long
        key = route_id
        if mode == "ferry":
            terminals = sorted(part.strip() for part in long.split(" - "))
            name = FERRIES.get(short) or " ↔ ".join(terminals) or short
            long = ""
            key = f"{agency}/{name}"
        feature = {
            "type": "Feature", "id": route_id,
            "properties": {"mode": mode, "name": name, "description": long if long != name else "", "agency": agency},
            "geometry": {"type": "LineString", "coordinates": points},
        }
        if key not in features or counts[shape] > features[key][0]:
            features[key] = (counts[shape], feature)
    return {"type": "FeatureCollection", "features": [feature for _, feature in features.values()]}


def vector_style(style):
    # Reuse the tile schema, filters, ordering, zoom stops, and fonts from Esri’s source stylesheet.
    water = "#21656d"
    land = "#075f94"
    parks = {"Openspace or forest": "#77ad74", "Park or farming": "#a9d98b",
             "Golf course": "#8bc17e", "Zoo": "#9ccf83", "Cemetery": "#7eb776",
             "Admin0 forest or park": "#7caf74", "Admin1 forest or park": "#79aa76",
             "Vegetation small scale": "#468e75"}
    buildings = {"Building/fill": "#124e70", "Building/outer shadow": "#0e4661", "Building/inner shadow": "#0e4661"}
    labels = {"City small scale", "City large scale", "Neighborhood", "Marine area/label",
              "Marine waterbody/label", "Water area/label", "Water area large scale/label",
              "Water area medium scale/label", "Water area small scale/label", "Road/label"}
    edited = [{"id": "Puget Sound background", "type": "background", "paint": {"background-color": water}}]
    for layer in style["layers"]:
        source = layer.get("source-layer", "")
        kind = layer["type"]
        paint = layer.setdefault("paint", {})
        if kind == "fill":
            if source.startswith(("Water area", "Marine area", "Bathymetry")):
                color = water
            elif source in parks:
                color = parks[source]
            elif source == "Building":
                color = buildings[layer["id"]]
            elif source == "Land":
                color = land
            elif source in {"Airport", "Port", "Industry", "Freight"}:
                color = "#146384"
            else:
                continue
            paint["fill-color"] = color
            if "fill-outline-color" in paint:
                paint["fill-outline-color"] = color
        elif kind == "line":
            if source in {"Road", "Road tunnel"}:
                if any(text in layer["id"] for text in ("Highway", "Freeway", "Major")):
                    paint["line-color"] = "#a0aeb0"
                else:
                    paint["line-color"] = "#70949f"
                paint["line-opacity"] = 0.59 if "casing" in layer["id"] else 0.73
            elif source.startswith("Water line") or source == "Coastline":
                paint["line-color"] = water
            else:
                continue
        elif kind == "symbol" and source in labels and layer.get("layout", {}).get("text-field"):
            if source == "Road/label" and "shield" in layer["id"].lower():
                continue
            layer["layout"] = {k: v for k, v in layer["layout"].items() if not k.startswith("icon-")}
            paint = {k: v for k, v in paint.items() if not k.startswith("icon-")}
            layer["paint"] = paint
            paint.update({"text-color": "#aedfce" if "/label" in source else "#e5efd8",
                          "text-halo-color": "#103e55", "text-halo-width": 1.2})
            if source == "Road/label":
                layer["minzoom"] = max(layer.get("minzoom", 0), 14)
        else:
            continue
        edited.append(layer)
    style["sources"]["esri"]["url"] = SERVICE
    style["glyphs"] = SERVICE + "/resources/fonts/{fontstack}/{range}.pbf"
    style["sprite"] = SERVICE + "/resources/sprites/sprite"
    style["name"] = "Seattle, in Common"
    style["layers"] = edited
    return style


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("gtfs", type=Path)
    parser.add_argument("esri_style", type=Path)
    parser.add_argument("--day", type=date.fromisoformat, default=date(2026, 11, 16))
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    with ZipFile(args.gtfs) as feed:
        routes = route_snapshot(feed, args.day)
    counts = Counter(feature["properties"]["mode"] for feature in routes["features"])
    if set(counts) != {"bus", "rail", "ferry"}:
        raise ValueError(f"Expected all three modes for {args.day}: {counts}")
    (OUTPUT / "routes.geojson").write_text(json.dumps(routes, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf8")
    style = vector_style(json.loads(args.esri_style.read_text(encoding="utf-8-sig")))
    (OUTPUT / "seattle-style.json").write_text(json.dumps(style, indent=2) + "\n", encoding="utf8")
    print(dict(counts), f"{len(style['layers'])} vector style layers")


if __name__ == "__main__":
    main()
