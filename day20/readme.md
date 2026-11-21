# Day 20: Hexagons

November 20, 2026

Day 20 uses a hexagon as the footprint for a 3D city model. Open the [Day 20 map](index.html) or the [standalone portal](https://paulgibbs3rd.github.io/city-download-portal/), choose a scene, draw an area, and select **Hexagon** under **Footprint**. Keep terrain extrusion enabled for a flat-bottomed base, then download GLB or STL. The portal opens a preview of the downloaded file.

## How it works

The portal samples the terrain within a square extent that covers the hexagon. It clips the surface and buildings to the hexagon, then extends the terrain edges down to a flat cap. The same mesh becomes the GLB or STL file.

## Data and source

The ArcGIS city scenes list their sources in the map attribution. OpenStreetMap 3D uses [OpenStreetMap building footprints](https://www.openstreetmap.org/copyright) with recorded or estimated heights. The app includes source credit in its OpenStreetMap exports.

The app lives in the [City Download Portal repository](https://github.com/PaulGibbs3rd/city-download-portal). The challenge page uses the same deployed app.
