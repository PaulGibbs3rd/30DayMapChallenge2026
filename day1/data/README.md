# Day 1 data

All geographic layers are local GeoJSON in WGS84 (longitude, latitude). They are rendered client-side; no hosted feature service, geocoder or ArcGIS credentials are required.

| File | Contents | Source and interpretation |
| --- | --- | --- |
| `tour.geojson` | 23 approximate concert venue/park centers | User-supplied 2026 tour poster; each feature includes a coordinate source and accuracy note. |
| `countries.geojson` | Simplified North American country polygons | Natural Earth, public domain. |
| `states.geojson` | US state boundary segments | Natural Earth, public domain. |
| `setlists.json` | An ordered setlist for each dated show | Individual setlist.fm records, researched November 1, 2026. |

Tour properties include a stable `id`, chronological `stop` number, `date`, `city`, `region`, `country` (`US` or `CA`), `venue`, `coordNote`, and `coordinateSource`. Locations are approximate and do not identify entrances or provide navigation. The Atlanta festival point represents Piedmont Park; the Los Angeles stop is at Kia Forum in Inglewood.

Setlists preserve source order and mark an encore using a one-based `encoreStartsAt` value where recorded. Counts exclude tape-only music and soundchecks; performance notes identify false starts, covers and other caveats. A missing encore marker does not prove there was no encore.

See the [geography notes](../research/geography.md), [show-by-show sources](../research/README.md), and [project README](../readme.md). Run `npm run check` from the repository root to validate dates, coordinates, source coverage and song counts.
