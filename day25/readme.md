# Day 25 — Is this a map?

November 25, 2026

Two 3D-printed relief maps show different reasons a city rises. In Seattle's Queen Anne neighborhood, streets and buildings climb with the hill. On the southern tip of Manhattan, the buildings supply most of the height. Both prints make the shape of the city something you can feel. [Open the Day 25 exhibit](index.html)

## Models

| Print | Model dimensions | Original export |
| --- | --- | --- |
| Queen Anne, Seattle | 100.0 × 86.6 × 15.1 mm | [STL, 26.8 MB](assets/queen-anne.stl) |
| Lower Manhattan, New York City | 100.0 × 86.6 × 34.9 mm | [STL, 35.7 MB](assets/lower-manhattan.stl) |

Dimensions are the bounding boxes of the exported meshes, given as X × Y × Z. The files are in millimeters with Z up and the flat base at Z = 0. Open either STL in a slicer using millimeters to keep the original print size.

## 3D viewer

Use **View in 3D** under either photograph to open that model. Drag to orbit and use the scroll wheel or a two-finger pinch to zoom. With the canvas focused, the arrow keys rotate, **+** and **−** zoom, and **Home** resets the camera. **Top view** gives a straight-down view of the footprint.

The viewer loads compressed copies of the STL geometry on demand. Each preview preserves the original vertex positions, triangle order, and relative dimensions. It runs locally with WebGL 2 in a modern browser. The bundled renderer uses Three.js. [Three.js license](vendor/three-license.txt)

To regenerate the preview assets, run `node day25/scripts/prepare-viewer.mjs` from the repository root with the City Download Portal checkout and its Node dependencies present under `day20/city-download-portal`.

## From the portal to the printer

The two prints use the hexagonal footprint introduced on [Day 20](../day20/readme.md) and the print-sized OpenStreetMap exporter documented on [Day 21](../day21/readme.md). The portal clips the terrain and buildings to the chosen footprint and exports them together on a flat base. [City Download Portal source](https://github.com/PaulGibbs3rd/city-download-portal)

The buildings are from OpenStreetMap and the terrain is from ArcGIS World Elevation. The original STL headers retain the OpenStreetMap credit. Paul Gibbs printed and photographed both models. [© OpenStreetMap contributors and data license](https://www.openstreetmap.org/copyright)

[All challenge days](../directory/) · [Official 2026 challenge](https://30daymapchallenge.com/2026/)
