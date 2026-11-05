# Day 4 — Warehouse / Country
**November 4, 2026 · Clusters**

Where warehouses meet neighborhoods. This dark, neon map opens near Redlands in California's Inland Empire and highlights warehouse concentrations within the surrounding building fabric.

[Open map](https://thisismyproject.site/day4/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day4) · [Interface preview](warehouse-ui-refined.jpg) · [Map image](warehouse-country.png)

## Explore
- Choose Redlands, Ontario, Fontana, Rialto, or Bloomington, or search for a place anywhere in the US.
- Filter eight categories: Residential, Commercial, Warehouses, Other industrial, Civic/education, Religious, Other, and Unknown.
- **Clusters** shows the selected type only as circles. **Footprints** shows it only as polygons. Other categories remain as footprint context at detailed scales; selected buildings are excluded from that context layer to avoid duplication.
- Adjust cluster reach from 40–140 screen pixels. Click a cluster for its category mix and zoom action, or a footprint for its available tags.
- Use the desktop sidebar or the narrow-screen Filters drawer. Legend opens from the footer. Reset view returns to the opening warehouse district.
- Share view copies the map location and settings. Save image downloads a branded map PNG; it does not publish anything.

## Data and interpretation
© [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL. The app queries Esri's public, read-only [OpenStreetMap Buildings for North America](https://www.arcgis.com/home/item.html?id=8573b205d20d4be38b6e11eb05dd151b) [feature service](https://services6.arcgis.com/Do88DoK2xjTUCXd1/arcgis/rest/services/OSM_Buildings_NA/FeatureServer/0), accessed November 4, 2026. The publisher describes minutely updates; the app does not independently guarantee freshness. Esri basemap credits remain visible and are included in exports.

Only `building=warehouse` is classified as a warehouse. Architectural type may differ from current use. Specific tags outside the mappings remain Other; `building=yes`, missing and unspecified tags remain Unknown. `building=no` is excluded. Unknown footprints are never inferred to be homes or warehouses.

The map illustrates **current proximity**, rather than historical encroachment, demolition, truck routes, pollution exposure, or health impacts. These require additional dated records or monitoring data. [Research notes](research-notes.md) document sources and interpretation; Story & sources in the app links the agency and community assessments.

Counts describe mapped buildings, not a complete census, people, homes, floor area, or standardized density. Detailed-view counts use server-side grouped statistics for buildings intersecting the map extent. Regional warehouse views query warehouses only; unavailable surrounding counts display an em dash. Clusters use centroids and change with zoom and screen-space radius. Dominant-type ties follow legend order.

## Scale and performance
The zoom-out floor is level 10; the opening view is level 13. Warehouse clusters load through 1:600,000. Surrounding footprints, other categories, and Footprints mode load at 1:80,000 and closer. Wider views pause detailed geometry to control loading. US exploration includes Alaska and Hawaii where OSM footprints exist. The source covers North America, so neighboring countries may also appear. Coverage and tagging vary.

## Develop and publish
Scaffolded with **@arcgis/create**, using the official Vite template. The app uses TypeScript, ArcGIS map components/Core API 5.1 and Calcite 5.x. Installed versions are pinned in the lockfile.

From the repository root, with Node.js 24:
```powershell
npm --prefix day4/scripts/app ci
npm --prefix day4/scripts/app run dev -- --port 4194
npm --prefix day4/scripts/app run export
npm run check
```

Development source is in `day4/scripts/app`. Export copies the production page to `day4/index.html` and its runtime into `day4/assets`, pruning obsolete hashed Vite output. The existing collection publisher excludes the scripts directory, dependencies, and nested dist output. Runtime URLs are relative for project-subpath and custom-domain hosting. Commit the exported files with the source and generated collection directory.

No secrets or ArcGIS credentials are shipped. Place search uses the public World Geocoding service for interactive results; search results are not stored. [Vendor license and attribution files](vendor/README.md) accompany the bundled runtime.

## Validation
- Strict TypeScript check, production bundle, full collection checks, generated directory and runtime-reference validation passed.
- Live service schema, grouped counts, type filters, Alaska/Hawaii sample coverage, category normalization, disjoint mappings and NULL/unknown handling were checked.
- Browser checked warehouse clusters without duplicate warehouse polygons, explicit footprint mode without circles, regional zoom to level 10, category changes preserving context, and sourced data information.
- Layout checked at 1200×850 and 580×760. The local location selector and relocated US search navigated the map; Escape dismisses the drawer and restores focus.
- The 1600×1000 PNG download was exercised in the browser and its saved output visually inspected. The same real map image supplies social-link preview metadata.
- Some SDK chunks exceed Vite's 500 kB warning threshold. Performance depends on device, viewport and network.


