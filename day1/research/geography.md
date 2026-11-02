# Geography sources and processing

Checked November 1, 2026.

## Tour points

`data/tour.geojson` contains the 23 US and Canada dates on the user-provided Gorillaz The Mountain Tour 2026 poster, in chronological order. Every feature records a direct `coordinateSource` URL and a `coordNote`. Coordinates are approximate venue centers in WGS84, stored as longitude then latitude. They are suitable for a continental tour map, not arrival guidance, entrances, or seating.

The Shaky Knees point represents Piedmont Park, not the stage. The festival's official [neighborhood guidance](https://help.shakykneesfestival.com/article/1033-neighborhood) confirms Piedmont Park for September 18–20, 2026. The park center comes from the [Piedmont Park geographic record](https://en.wikipedia.org/wiki/Piedmont_Park). The [park's own directions](https://piedmontpark.org/directions/) provide a visitor GPS address if arrival directions are needed.

The Los Angeles stop is plotted at Kia Forum in Inglewood, retaining the poster's Los Angeles city label. The Fort Worth coordinate is published by the [City of Fort Worth](https://www.fortworthtexas.gov/departments/public-events/dickies-arena). Other features cite MusicBrainz, Wikipedia, Mapcarta, VenueStats, or LatLong geographic venue records individually. Mapcarta records use OpenStreetMap and Wikidata; their geographic data is credited to those projects. No photographs were downloaded from these sources.

## Background geography

Local files come from [Natural Earth](https://www.naturalearthdata.com/), a [public-domain map dataset](https://www.naturalearthdata.com/about/terms-of-use/). This is generalized 1:110 million geography, appropriate to a continental overview. It does not depict street-level detail. Political boundaries follow the source and do not imply a position on sovereignty.

- [Admin-0 country polygons, GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson): filtered to `CONTINENT === 'North America'` (18 features). Retained properties `id`, `name`, `iso3`; geometry is unchanged.
- [Admin-1 states/provinces boundary lines, GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces_lines.geojson): filtered to `ADM0_A3 === 'USA'` (109 boundary segments); retained properties `id` and `name`; geometry is unchanged. At this resolution the source only provides United States state boundaries, so Canada and Mexico do not show equivalent province/state boundaries.

These are static local GeoJSON files. The app does not call geocoding, routing, hosted feature layers, or a credential-protected basemap service.
