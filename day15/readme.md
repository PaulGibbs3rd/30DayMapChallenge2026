# Pacific, Inside Out

**Day 15 · Inside out · November 15, 2026**

Turn the ocean floor inside out on a globe. The animation reflects seafloor elevations across sea level, so a point 8 km below it moves through zero and ends 8 km above it. The sampled shoreline stays at zero and land elevations stay fixed. The sea-level grid provides a reference during the flip.

Drag to orbit and scroll or pinch to zoom. The **Hawaiʻi** and **Mariana Trench** viewpoints show the change closer up. With the globe focused, use the arrow keys to orbit, `+` and `−` to zoom, and `Home` to return to the Pacific. The scene honors the system’s reduced-motion preference.

## Run locally

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day15/`. The page uses WebGL 2 and bundles both the elevation grid and Three.js. Once the page files load, the globe needs no external map service.

## Data and rendering

- Elevations come from [NOAA ETOPO1, ice-surface version](https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.html). The [ERDDAP CSV request](https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.csv?altitude%5B0%3A18%3A10800%5D%5B0%3A18%3A21600%5D) samples every 18th row and column, yielding a 0.3° grid. The close-ups show basin-scale structures at this resolution.
- Below-sea-level samples connected to the Pacific across the global grid form the ocean mask. The mesh interpolates these data and splits coastal triangles at the sampled zero-elevation contour. The flip only affects the resulting ocean elevations.
- The mesh exaggerates vertical relief 40×. The on-screen 8 km example is illustrative and shows unexaggerated distances. Contours mark 1,000 m intervals of original depth.
- The bundled renderer is [Three.js r180](https://github.com/mrdoob/three.js/tree/r180), under the [MIT license](vendor/LICENSE.txt).

After downloading the ERDDAP CSV, regenerate the bundled grid with `python day15/scripts/pack-terrain.py etopo.csv day15/data/terrain.json`.

## Validation

Chrome checks covered the flip and restore, the Mariana Trench viewpoint, the sea-level grid, keyboard controls, reduced motion, and a 390 px mobile viewport. The repository’s `npm run check` verifies the static build and local asset paths.
