"""Prepare the ferry atlas from the WSDOT and shoreline downloads described in readme.md."""

import csv
import io
import json
import sys
from collections import defaultdict
from pathlib import Path
from zipfile import ZipFile

from osgeo import ogr


SOURCE = Path(sys.argv[1]).resolve()
OUTPUT = Path(__file__).resolve().parents[1] / "data"
START, END = "20261124", "20261206"
TERMINALS = {
    "1": (7, "Anacortes"), "10": (24, "Friday Harbor"), "15": (19, "Orcas Island"),
    "18": (18, "Shaw Island"), "13": (17, "Lopez Island"), "17": (4, "Port Townsend"),
    "11": (8, "Coupeville"), "14": (42, "Mukilteo"), "5": (5, "Clinton"),
    "8": (3, "Edmonds"), "12": (11, "Kingston"), "7": (37, "Seattle"),
    "3": (9, "Bainbridge Island"), "4": (10, "Bremerton"), "9": (15, "Fauntleroy"),
    "22": (13, "Vashon Island"), "20": (2, "Southworth"), "16": (1, "Point Defiance"),
    "21": (14, "Tahlequah"),
}
SPECIAL = (set("1 10 15 18 13".split()), set("9 20 22".split()))
GIS_LEGS = {
    2: ("16", "21"), 8: ("9", "20"), 9: ("4", "7"), 10: ("17", "11"),
    11: ("12", "8"), 12: ("7", "3"), 17: ("9", "22"), 18: ("20", "22"),
    32: ("14", "5"),
}


def csv_rows(archive, name):
    with archive.open(f"{name}.txt") as stream:
        return list(csv.DictReader(io.TextIOWrapper(stream, encoding="utf-8-sig")))


def features(name):
    raw = json.loads((SOURCE / f"{name}.geojson").read_text(encoding="utf-8"))
    return {feature["properties"]["OBJECTID"]: feature["geometry"]["coordinates"]
            for feature in raw["features"]}


def minutes(value):
    hours, mins, _ = map(int, value.split(":"))
    return hours * 60 + mins


def leg_key(a, b):
    return "-".join(sorted((a, b)))


def rounded(path):
    return [[round(value, 5) for value in point] for point in path]


def terminal_coordinates():
    points = features("terminals")
    result = {key: {"name": name, "point": rounded([points[oid]])[0]}
              for key, (oid, name) in TERMINALS.items()}
    result["sidney"] = {"name": "Sidney, B.C.", "point": rounded([points[21]])[0]}
    return result


def build_network():
    with ZipFile(SOURCE / "gtfs.zip") as feed:
        agency, = csv_rows(feed, "agency")
        assert agency["agency_id"] == "WSF"
        assert set(TERMINALS) == {row["stop_id"] for row in csv_rows(feed, "stops")}
        dates = {row["service_id"]: row["start_date"] for row in csv_rows(feed, "calendar")
                 if START <= row["start_date"] <= END and row["start_date"] == row["end_date"]}
        assert len(dates) == 13, "Expected daily service IDs for the complete snapshot window"
        trip_rows = {row["trip_id"]: row for row in csv_rows(feed, "trips") if row["service_id"] in dates}
        times = defaultdict(list)
        for row in csv_rows(feed, "stop_times"):
            if row["trip_id"] in trip_rows:
                times[row["trip_id"]].append(row)
        shapes = defaultdict(list)
        for row in csv_rows(feed, "shapes"):
            shapes[row["shape_id"]].append((int(row["shape_pt_sequence"]),
                                           (float(row["shape_pt_lon"]), float(row["shape_pt_lat"]))))

    # The WSF feed publishes one two-stop trip per advertised terminal pair.
    # Match duplicated through-fares by shared departure/arrival events on the same date.
    departures = defaultdict(list)
    arrivals = defaultdict(list)
    trips = []
    for trip_id, stop_times in times.items():
        origin, destination = sorted(stop_times, key=lambda row: int(row["stop_sequence"]))
        if origin["pickup_type"] not in ("", "0") or destination["drop_off_type"] not in ("", "0"):
            continue
        a, b = origin["stop_id"], destination["stop_id"]
        start, end = minutes(origin["departure_time"]), minutes(destination["arrival_time"])
        day = dates[trip_rows[trip_id]["service_id"]]
        shape = trip_rows[trip_id]["shape_id"]
        trips.append((day, a, b, start, end, shape))
        departures[day, a, start].append((b, end))
        arrivals[day, b, end].append((a, start))

    def intermediate(day, a, b, start, end, visited):
        if not any({a, b} <= group for group in SPECIAL):
            return []
        candidates = [(dock, arrive, leave) for dock, arrive in departures[day, a, start]
                      for other, leave in arrivals[day, b, end]
                      if dock == other and dock not in visited and start < arrive <= leave < end
                      and leave - arrive <= 22]
        if not candidates:
            return []
        dock, arrive, leave = min(candidates, key=lambda call: (call[1], call[2], call[0]))
        visited = visited | {dock}
        return (intermediate(day, a, dock, start, arrive, visited) + [dock]
                + intermediate(day, dock, b, leave, end, visited))

    patterns = defaultdict(set)
    used_shapes = {}
    for day, a, b, start, end, shape in sorted(trips):
        via = intermediate(day, a, b, start, end, {a, b})
        patterns[a, b].add(tuple(via))
        if not via and shape in shapes:
            used_shapes[leg_key(a, b)] = shape

    # Both directions have explicit “Via Southworth” notes in the Fall 2026
    # Fauntleroy–Vashon timetable, even when timed pair records do not line up.
    patterns["9", "22"].add(("20",))
    patterns["22", "9"].add(("20",))

    raw = features("routes")
    docks = terminal_coordinates()
    geometry = {leg_key(a, b): raw[oid] for oid, (a, b) in GIS_LEGS.items()}
    geometry[leg_key("1", "13")] = raw[30][0]
    for key, shape in used_shapes.items():
        geometry.setdefault(key, [point for _, point in sorted(shapes[shape])])

    needed = set()
    connections = []
    for (a, b), vias in sorted(patterns.items()):
        variants = [list(via) for via in sorted(vias, key=lambda via: (len(via), via))]
        connections.append({"from": a, "to": b, "via": variants})
        for via in variants:
            path = [a, *via, b]
            needed.update(leg_key(first, second) for first, second in zip(path, path[1:]))

    legs = {}
    for key in sorted(needed):
        a, b = (docks[dock]["point"] for dock in key.split("-"))
        line = list(geometry[key])
        if sum((line[-1][axis] - a[axis]) ** 2 for axis in range(2)) < sum(
                (line[0][axis] - a[axis]) ** 2 for axis in range(2)):
            line.reverse()
        legs[key] = rounded([a, *line, b])

    return {"dates": ["2026-11-24", "2026-12-06"], "terminals": docks, "connections": connections,
            "legs": legs, "suspended": [rounded(path) for path in raw[30][1:]]}


def build_shoreline():
    bbox = ogr.CreateGeometryFromWkt("POLYGON ((-125 46.8,-121 46.8,-121 49.4,-125 49.4,-125 46.8))")
    parts = ogr.Geometry(ogr.wkbMultiPolygon)

    def add_parts(geometry):
        if geometry.GetGeometryName() == "POLYGON" and not geometry.IsEmpty():
            parts.AddGeometry(geometry)
        elif geometry.GetGeometryName() in ("MULTIPOLYGON", "GEOMETRYCOLLECTION"):
            for part in geometry:
                add_parts(part)

    for archive, layer_name, field, value in (
        ("counties.zip", "cb_2024_us_county_500k", "STATEFP", "53"),
        ("countries.zip", "ne_10m_admin_0_countries", "ADM0_A3", "CAN"),
    ):
        data = ogr.Open(f"/vsizip/{(SOURCE / archive).as_posix()}/{layer_name}.shp")
        layer = data.GetLayer()
        layer.SetAttributeFilter(f"{field} = '{value}'")
        layer.SetSpatialFilter(bbox)
        for feature in layer:
            add_parts(feature.GetGeometryRef().MakeValid().Intersection(bbox))

    simplified = parts.UnionCascaded().SimplifyPreserveTopology(0.0004)
    return json.loads(simplified.ExportToJson(["COORDINATE_PRECISION=5"]))


if __name__ == "__main__":
    ogr.UseExceptions()
    OUTPUT.mkdir(exist_ok=True)
    for name, payload in (("network.json", build_network()), ("shoreline.geojson", build_shoreline())):
        (OUTPUT / name).write_text(json.dumps(payload, separators=(",", ":")) + "\n", encoding="utf-8")
