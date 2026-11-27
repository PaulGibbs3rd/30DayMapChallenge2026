"""Render the three local map images, locator and shareable Elwha plate."""

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.patheffects as effects
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import PathPatch, Rectangle
from matplotlib.path import Path as ShapePath
from osgeo import osr


DAY = Path(__file__).resolve().parents[1]
ASSETS = DAY / "assets"
PAPER, INK = "#f5f1e7", "#172c29"
WHITE = "#faf0d2"
PLATE, TYPE, MUTED, GOLD = "#14272d", "#f5eedc", "#b9cfcc", "#e8b45d"
osr.UseExceptions()


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def reference(epsg):
    crs = osr.SpatialReference()
    crs.ImportFromEPSG(epsg)
    crs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    return crs


transform = osr.CoordinateTransformation(reference(4326), reference(32148))
survey = read(DAY / "data/survey.json")
design = read(DAY / "data/design.json")
features = {}
for source in ("areas", "shorelines"):
    for feature in read(DAY / f"data/{source}.geojson")["features"]:
        features.setdefault(feature["properties"]["kind"], []).append(feature["geometry"])


def project(points):
    return [point[:2] for point in transform.TransformPoints(points)]


def polygon(ax, rings, **style):
    paths = []
    for ring in rings:
        points = project(ring)
        paths.append(ShapePath(points, [ShapePath.MOVETO] + [ShapePath.LINETO] * (len(points) - 2)
                               + [ShapePath.CLOSEPOLY]))
    ax.add_patch(PathPatch(ShapePath.make_compound_path(*paths), **style))


def frame(ax, bounds, background):
    x1, y1, x2, y2 = bounds
    ax.set(xlim=(x1, x2), ylim=(y1, y2), aspect="equal", xticks=[], yticks=[], facecolor=background)
    for spine in ax.spines.values():
        spine.set_visible(False)


def render_map(ax, view, label_size=16, show_frame_marks=False):
    frame(ax, survey["bounds"], design["background"])
    dash_styles = {"dot": ":", "short-dash": (0, (4, 3))}
    # Matplotlib gives lines their own default z-order. Assign the cartographic order explicitly.
    for order, kind in enumerate(design["views"][view], start=1):
        style = design["styles"][kind]
        dash = dash_styles.get(style.get("style"), "-")
        for geometry in features[kind]:
            shape, coordinates = geometry["type"], geometry["coordinates"]
            if shape.endswith("Polygon"):
                for rings in coordinates if shape == "MultiPolygon" else [coordinates]:
                    polygon(ax, rings, facecolor=style.get("fill", "none"), edgecolor=style.get("line", "none"),
                            linewidth=0.68, linestyle=dash, hatch="///" if "hatch" in style else None, zorder=order)
            else:
                for line in coordinates if shape == "MultiLineString" else [coordinates]:
                    xs, ys = zip(*project(line))
                    if "casing" in style:
                        ax.plot(xs, ys, color=style["casing"], linewidth=2.4, zorder=order)
                    ax.plot(xs, ys, color=style["line"], linewidth=1.2, linestyle=dash, zorder=order + 0.1)

    halo = [effects.withStroke(linewidth=2.6, foreground=design["background"])]
    for label in design["labels"]:
        ax.text(*label["point"], label["text"], color=WHITE, fontsize=label_size, ha="center", va="center",
                style="italic" if label.get("italic") else "normal", path_effects=halo, zorder=20)
    if not show_frame_marks:
        return
    xs, ys = zip(*design["northArrow"])
    ax.fill(xs, ys, color=WHITE, zorder=20)
    ax.text(xs[1], ys[1] + 75, "N", color=WHITE, fontsize=label_size, ha="center", va="center", zorder=20,
            path_effects=halo)
    x, y = design["scale"]["start"]
    meters = design["scale"]["meters"]
    ax.plot((x, x + meters), (y, y), color=WHITE, linewidth=1.3, zorder=20)
    for end in (x, x + meters):
        ax.plot((end, end), (y - 12, y + 12), color=WHITE, linewidth=1.3, zorder=20)
    ax.text(x + meters / 2, y + 40, f"{meters} m", color=WHITE, fontsize=label_size * .72, ha="center", zorder=20,
            path_effects=halo)


def render_locator(ax, size=7):
    bounds = (286500, 113750, 316500, 134250)
    frame(ax, bounds, "#d3e2df")
    coast = read(DAY.parent / "day24/data/shoreline.geojson")
    for rings in coast["coordinates"]:
        polygon(ax, rings, facecolor="#afbea5", edgecolor="#647c6e", linewidth=.5)
    ax.text(302100, 132650, "Strait of Juan de Fuca", fontsize=size - .4, ha="center", style="italic", color="#2b544e")
    points = [
        ("River mouth", (-123.5646, 48.1421), (287350, 131420), "#2d5950", "o"),
        ("Former Elwha Dam", (-123.55669, 48.09497), (298400, 124750), "#8b4c24", "s"),
        ("Former Glines Canyon Dam", (-123.598611, 48.002222), (295100, 116275), "#8b4c24", "s"),
    ]
    for text, point, label, color, marker in points:
        x, y = project([point])[0]
        ax.scatter([x], [y], s=13, marker=marker, c=color, edgecolor=PAPER, linewidth=.45, zorder=4)
        ax.annotate(text, (x, y), xytext=label, fontsize=size, weight="medium", color=INK,
                    arrowprops={"arrowstyle": "-", "color": color, "linewidth": .65},
                    path_effects=[effects.withStroke(linewidth=1.8, foreground="#d8e1cd")], zorder=5)
    ax.text(306650, 127900, "Port Angeles", fontsize=size - .45, ha="left", color=INK)


def share():
    figure = plt.figure(figsize=(16, 10), dpi=100, facecolor=PLATE)
    figure.text(.046, .945, "30 DAY MAP CHALLENGE  /  DAY 26  /  WATER", fontsize=11, color=GOLD, weight="bold")
    figure.text(.043, .875, "Where the Elwha built land", fontsize=48, fontfamily="serif", color=TYPE)
    figure.text(.046, .823, "Elwha River delta, Washington  ·  September 2009 to July 2017", fontsize=15, color=MUTED)
    render_map(figure.add_axes([.044, .112, .682, .697]), "change", label_size=12, show_frame_marks=True)
    legend_ax = figure.add_axes([.75, .45, .211, .3])
    legend_ax.set_axis_off()
    gain = survey["gainSquareMeters"] / 10000
    loss = survey["lossSquareMeters"] / 10000
    handles = [
        Rectangle((0, 0), 1, 1, fc="#e8b45d", ec="#795012", label=f"Rose above high water · {gain:.1f} ha"),
        Rectangle((0, 0), 1, 1, fc="#ad87c5", ec="#604579", hatch="///", label=f"Fell below high water · {loss:.1f} ha"),
        Line2D([0], [0], color=TYPE, linestyle="--", label="September 2009 shoreline"),
        Line2D([0], [0], color=TYPE, label="July 2017 shoreline"),
        Line2D([0], [0], color=MUTED, linestyle=":", label="Surveyed both times"),
        Rectangle((0, 0), 1, 1, fc=design["background"], ec="#8aacae", label="Outside survey coverage"),
    ]
    legend_ax.legend(handles=handles, loc="upper left", frameon=False, fontsize=12, handlelength=2.1,
                     labelcolor=TYPE, borderaxespad=0, labelspacing=.9)
    render_locator(figure.add_axes([.749, .19, .21, .244]), size=8.8)
    figure.text(.046, .063, "USGS surveys  ·  High-water shoreline estimated at 1.86 m NAVD88  ·  Change limited to shared coverage", fontsize=11, color=TYPE)
    figure.text(.046, .034, "Paul Gibbs  /  30DayMapChallenge 2026", fontsize=9.5, color=MUTED)
    figure.savefig(ASSETS / "elwha-change.png")
    plt.close(figure)


ASSETS.mkdir(exist_ok=True)
for state in design["views"]:
    figure = plt.figure(figsize=(12, 7.8), dpi=150, facecolor=design["background"])
    render_map(figure.add_axes([0, 0, 1, 1]), state)
    figure.savefig(ASSETS / f"map-{state}.png")
    plt.close(figure)

figure = plt.figure(figsize=(6, 4.1), dpi=100)
render_locator(figure.add_axes([0, 0, 1, 1]), size=12)
figure.savefig(ASSETS / "locator.png")
plt.close(figure)
share()
