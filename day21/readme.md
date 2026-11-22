# Day 21: OpenStreetMap to print

November 21, 2026

[OpenStreetMap 3D](https://paulgibbs3rd.github.io/city-download-portal/1c071fcf8ff2448599b0547116e2de55) turns a selected neighborhood into a relief model. Select an area and confirm it, choose a rectangular or hexagonal footprint, and set the longest horizontal side and base thickness in millimeters. The default STL is 100 mm across its longest side, with a 3 mm minimum base. The slicer receives the model with its flat underside at Z=0. The portal shows the exported dimensions in its preview.

## Data and interpretation

Buildings are extruded from [OpenStreetMap footprints](https://www.openstreetmap.org/copyright) using mapped heights or estimates. ArcGIS World Elevation provides the terrain. OpenStreetMap building queries cover selections up to 1.5 km across, and dense selections may take longer to build. Use the checkbox to export terrain alone. GLB is also available for 3D editing.

**Use mapped roofs and building parts** adds gabled, hipped, pyramidal, and skillion roofs where OpenStreetMap has the tags. Individual building parts can contribute different heights and raised sections. Missing or unsupported roof shapes use a flat cap. Check raised sections and overhangs in the slicer before printing.

Day 21 embeds the dedicated OpenStreetMap scene from the [City Download Portal](https://github.com/PaulGibbs3rd/city-download-portal). [All challenge days](../directory/index.html).
