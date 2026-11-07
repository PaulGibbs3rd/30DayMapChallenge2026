### ArcGIS requirements handoff summary

- **Work Target:** Replace the Day 6 Vintage placeholder with a new application.
- **Project Folder:** `day6/`; package-managed source in `day6/scripts/app/`.
- **ArcGIS Product Context:** Client-side ArcGIS Maps SDK for JavaScript; no portal items or hosted ArcGIS location services are required.
- **Target Platform:** Responsive web application in the existing static GitHub Pages collection.
- **Delivery Scope:** Finished challenge application: eight guided levels, pixel terrain, map exploration, place stories, sources, and responsive controls.
- **Identity & Access Model:** Public collection, anonymous use, no sign-in; geography and place data are bundled locally. No credentials or protected resources.
- **Core Features and Operations:** 2D map navigation; georeferenced pixel raster; selected beacons; schematic story links; guided level transitions; browser-local exploration history.

#### Remaining assumptions
1. Use the existing collection's public GitHub Pages delivery model on the main branch, publishing through the configured origin. No new hosting service is created.
2. Coordinates are approximate representative points. Generalized terrain and story connections are unsuitable for navigation.
3. Visual theme is vintage 16-bit sci-fi, with real Japanese geography and original illustrations.

#### Next agent actions
- [x] Route to `build-with-arcgis-maps-sdk-for-javascript` and `build-with-calcite-design-system` for implementation.
- [x] Review `follow-arcgis-authentication-patterns`: no identity or protected-resource access is required.
- [x] Scaffold with the official `npx @arcgis/create --name app --template js-maps-sdk-vite`.
