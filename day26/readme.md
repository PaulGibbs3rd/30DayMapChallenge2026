# Day 26 · Where the Elwha Built Land

November 26, 2026 · Water

Compare two surveys of Washington’s Elwha River delta. Sediment that had accumulated behind two dams moved downstream after dam removal began in 2011. The September 2009 and July 2017 shorelines show the delta building outward at the river mouth. Within the mapped area surveyed both times, about **22.8 hectares** rose above the estimated high-water shoreline and **1.0 hectare** fell below it. [Open the map](index.html) · [Download the shareable map](assets/elwha-change.png) · [Read the spec](spec.md)

The Lower Elwha Klallam Tribe helped secure the restoration of the river and continues to carry out habitat work in the watershed. [Tribal habitat restoration](https://www.elwha.org/departments/natural-resources/habitat-restoration/) · [National Park Service restoration history](https://www.nps.gov/olym/learn/nature/elwha-ecosystem-restoration.htm)

## Sources and processing

| Input | Use |
| --- | --- |
| [USGS Data Series 288, Appendix J](https://pubs.usgs.gov/ds/288/ds288_v1.1.pdf) · [2009 profile archive](https://pubs.usgs.gov/ds/288/data/data_09.zip) | Bathymetric and beach topographic profiles from September 15–17, 2009. |
| [USGS July 2017 release](https://www.usgs.gov/data/bathymetry-topography-and-sediment-grain-size-data-elwha-river-delta-washington-july-2017) · [DEM catalog entry](https://www.sciencebase.gov/catalog/item/5c9bf7bae4b0b8a7f62c32cb) | The published 5 m grid `ew17_july_dem_5m.asc`, surveyed July 20–23, 2017. |
| [Gelfenbaum et al. coastal geomorphology study](https://repository.library.noaa.gov/view/noaa/62100/noaa_62100_DS1.pdf) | Definition of the local mean high water shoreline and interpretation of the coastal surveys. |
| [USGS dam locations](https://www.usgs.gov/media/images/dam-locations) · [Day 24 regional land data](../day24/readme.md) | Approximate former dam locations and generalized shoreline in the locator inset. |

The May 2011 ScienceBase download was unavailable during preparation. The September 2009 profiles provide a pre-removal baseline from the same USGS monitoring program. The Data Series report specifies Washington State Plane North NAD83 and NAVD88 for the profile files. Its older FAQ gives conflicting units and reference labels in examples. This map follows the main report’s finished-products description and Appendix J. [USGS Data Series 288](https://pubs.usgs.gov/ds/288/ds288_v1.1.pdf) · [USGS metadata FAQ](https://pubs.usgs.gov/ds/288/metadata/ElwhaRiver.faq.html)

The preparation script averages duplicate sample positions and interpolates the 2009 profiles onto the 2017 grid by linear Delaunay interpolation. It discards triangles with an edge longer than 50 m, crops the grids to the mapped delta, and uses **1.86 m NAVD88** for both high-water contours. The area calculation counts **25 m²** for each supported cell that crossed the threshold. The stippled outline shows the overlap used for those counts. The two surveys measure net change over the interval, including any channel movement and beach change before and after the dam removals. Near the threshold, interpolation and survey uncertainty can affect which class a cell falls into. [Survey dates, checksums and counts](data/survey.json)

## Run and regenerate

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day26/`. Use **+**, **−**, and **Reset map view** to explore the delta. Drag to pan, or use the arrow keys with the map focused. The ArcGIS map also supports wheel and pinch zoom. Switching survey views preserves the camera. The map uses ArcGIS Maps SDK for JavaScript 5.2 with local data and no account sign-in. Local images support all three views, zoom, and pan if the SDK or WebGL is unavailable.

Run the following with a Python environment that includes GDAL 3.11+, NumPy, SciPy, and Matplotlib. ArcGIS Pro’s bundled Python was used for this edition.

```text
python day26/scripts/prepare.py PATH/TO/data_09.zip PATH/TO/ew17_july_dem_5m.asc
python day26/scripts/render.py
```

USGS survey data are U.S. government work. The local layers and images are derived from those inputs. [All challenge days](../directory/) · [Official theme](https://30daymapchallenge.com/2026/)
