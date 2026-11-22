# Earth Unfolded

**Day 22 · Projections · November 22, 2026**

Compare the same distance from a point in Web Mercator and a second world projection. Both views start with a 500 km buffer around Reykjavík. The dashed equator ring uses the same radius and stays centered at 0°, 30° E.

- **Move the center.** Click either map, select Reykjavík, Quito, or Pacific seam, or enter latitude and longitude.
- **Compare the projections.** Web Mercator stays on the left. Choose Peirce Quincuncial, Equal Earth, Berghaus Star AAG, or Fuller/Dymaxion on the right. Try Reykjavík in Equal Earth to compare the areas of the two rings, or Pacific seam to see the buffer split across world edges.
- **Change the radius.** The slider ranges from 250 to 1,500 km and updates the selected and equator buffers in both maps.

## How the comparison works

The ArcGIS Maps SDK for JavaScript 5.2 calculates the buffers geodesically in WGS 84, then projects their polygons and boundaries into each map's spatial reference. Comparisons of apparent size are easiest within one map, using the equator ring. Each panel fits its own world extent. Web Mercator clips geometry at 85.05° north and south.

| Projection | WKID |
| --- | --- |
| Web Mercator Auxiliary Sphere | `3857` |
| Peirce Quincuncial North Pole in a square | `54090` |
| Equal Earth | `54035` |
| Berghaus Star AAG | `102299` |
| World Fuller | `54050` |

The page loads the SDK from Esri's CDN and performs all geometry operations in the browser. The land file is served with the page. There are no protected layers or location services in the app.

## Run locally

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day22/`.

## Sources

- The world land outline is Natural Earth's generalized 1:110 million land geometry. [Natural Earth land](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) · [Public domain terms](https://www.naturalearthdata.com/about/terms-of-use/)
- The world grid and buffers are generated in the browser. The city presets use United Nations Cartographic Section coordinates. [Reykjavík](https://ungegn.un.org/dashboard/cities/details?crM49=352&id=237) · [Quito](https://ungegn.un.org/dashboard/cities/details?id=181)
- The projection IDs and geometry operations come from Esri. [Esri coordinate system catalog](https://github.com/Esri/projection-engine-db-doc/blob/main/csv/pe_list_projcs.csv) · [Geodesic buffer operator](https://developers.arcgis.com/javascript/latest/references/core/geometry/operators/geodesicBufferOperator/)
- The UN General Assembly encourages the use of Equal Earth and other equal-area projections when relative size matters. [UN General Assembly resolution A/RES/80/307](https://docs.un.org/en/A/RES/80/307)

[Open the map](index.html) · [All challenge days](../directory/)
