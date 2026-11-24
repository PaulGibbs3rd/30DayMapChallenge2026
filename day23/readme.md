# The Coffee Atlas

**Day 23 · Senses: Taste · November 23, 2026**

Explore 15 coffees from 14 countries on an Equal Earth world map. Filter the tasting menu by flavor, open an origin’s tasting card, or add two coffees to a flight. The starter flight pairs two washed coffees with jasmine notes from Yirgacheffe and Boquete. [Official challenge](https://30daymapchallenge.com/2026/) · [Working spec](spec.md)

## Explore the atlas

- Choose a flavor family to filter both the menu and the map. Open a coffee from either surface. Click a numbered marker to zoom into the nearby origins it represents.
- Each tasting card names the coffee, process, and sources for both its notes and position. The map shows approximate geographic anchors such as a town within a growing region. The Kannur point marks an area where Monsooned Malabar coffee is processed.
- Choose **Try the jasmine pair** or build a two-coffee flight from the tasting cards. A flight keeps its coffees when the flavor filter changes.

## Sources and methodology

The [local GeoJSON catalog](data/coffees.geojson) holds the tasting descriptors and location sources for each coffee. The descriptions come from the named producer, roaster, importer, or regional organization and describe that example. Variety, processing, roast, and brewing can change how a coffee tastes. The app uses broad flavor families for browsing and shows shared notes as text. [World Coffee Research Sensory Lexicon](https://worldcoffeeresearch.org/resources/sensory-lexicon) · [Specialty Coffee Association Coffee Value Assessment](https://sca.coffee/value-assessment)

The world outline uses Natural Earth 1:110 million land geometry. Location references include GeoNames, Mapcarta, the municipality of Patrocínio, and World Coffee Research. The catalog identifies the reference behind each point. [Natural Earth](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) · [Public domain terms](https://www.naturalearthdata.com/about/terms-of-use/) · [GeoNames attribution](https://www.geonames.org/about.html)

## ArcGIS build

Generated the [CDN starter](starter/index.html) from `day23/` with `npx -y @arcgis/create --name starter --template cdn`. The CLI reported `1.0.0-0`. The generated starter and atlas load ArcGIS Maps SDK for JavaScript `5.2` from the CDN. The atlas uses a custom map with local layers, the ArcGIS map and zoom components, and Calcite design tokens. Visitors can use it anonymously. The menu and flight remain available if the ArcGIS CDN fails to load. [Esri setup and CLI](https://developers.arcgis.com/javascript/latest/get-started/)

The build used the Esri requirements, authentication, ArcGIS Maps SDK for JavaScript, and Calcite skills. The Esri Developer Documentation MCP supplied the SDK setup guidance, map and view references, client-side projection example, and Calcite theming guidance. [Client-side projection](https://developers.arcgis.com/javascript/latest/sample-code/client-projection/) · [ArcGIS map component](https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/) · [Calcite colors and theming](https://developers.arcgis.com/calcite-design-system/foundations/colors/)

## Run locally

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day23/`. Run `npm run check` to validate the catalog, flavor and flight examples, and packaged site.

[Open the map](index.html) · [All challenge days](../directory/)
