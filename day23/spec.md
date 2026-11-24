# Day 23 · The Coffee Atlas

**Working spec · Senses: Taste · November 23, 2026**

Build a world coffee map that feels like opening a café menu. Pick a flavor you like, see where it shows up, then put two coffees on a tasting flight. The opening comparison pairs two washed coffees with jasmine notes from opposite sides of the world, one from Yirgacheffe in Ethiopia and one from Boquete in Panama. [Official challenge](https://30daymapchallenge.com/2026/) · [Yirgacheffe](https://coffeehunter.com/coffee/gersay-beyou-yirgacheffe-grade-1/) · [Boquete](https://lacabra.com/products/esmeralda)

## Café design

Give the world map the most room on the page. Use a toasted brown page, a caramel tasting menu, and espresso text. Set chestnut land against lighter brown water and a softly printed graticule. Use a serif like Fraunces for the title and origin names, with a clear sans serif like DM Sans for controls and small text. Pull the accent colors from the menu itself, including plum for berry notes, burnt orange for citrus, and cocoa brown for chocolate and nuts.

Pair the map with a **Tasting menu** on the right. Use compact menu rows, fine horizontal rules, and a small coffee-bean motif on the origin pins. Selected pins get a visible double outline and a place label. Keep flavor labels in text so the colors can stay subtle. On phones, stack the map and menu, with the selected coffee directly below the map.

## World map and tasting menu

- Open in Equal Earth with all 15 regions represented. Draw the equator and the two tropics as quiet reference lines. Keep the base map neutral and show individual coffees as points, with region-level placement where the source describes a wider area. Use a count marker for overlapping points at world scale and let visitors zoom into that group. Every coffee is also selectable from the menu.
- Offer **All coffees**, **Floral**, **Citrus**, **Berry**, **Other fruit**, **Chocolate & nuts**, **Caramel & brown sugar**, and **Spice, herbs & earth** as flavor filters. A coffee can match several filters. Use one active filter at a time and keep the map, menu, and result count in sync.
- Selecting a map pin or menu row opens the same tasting card. Lead with the origin and tasting notes. Show the coffee name, grower or mill when published, species or variety when reported, and processing method. Add elevation, body, or acidity only where the named source describes them. Give each card a direct source link.
- **Tasting flight** lets visitors pin up to two coffees and see their notes, shared flavor families, and processes side by side. Keep a pinned coffee available when changing the flavor filter. Offer Yirgacheffe and Boquete as a one-click starting pair, with the two locations highlighted on the world view.
- Give the map zoom and reset controls. Keep the menu keyboard-accessible, announce filter counts and selections, and provide tap controls for every action. Keep the menu and its sources usable if the map fails to load.

## Opening menu

Each row is a published example from the named origin. Sources include growers, roasters, importers, and regional organizations. The tasting card should say **Notes reported by [source name]** and name the lot, regional offering, or processing profile behind the description. Taste can vary with variety, processing, roast, and brewing. These notes describe what a cup can evoke, such as jasmine or chocolate. Group them into broad filters informed by the World Coffee Research lexicon. [World Coffee Research Sensory Lexicon](https://worldcoffeeresearch.org/resources/sensory-lexicon) · [Specialty Coffee Association Coffee Value Assessment](https://sca.coffee/value-assessment)

| Mapped origin | Coffee and process | Reported notes | Source |
| --- | --- | --- | --- |
| Kona, Hawaiʻi, United States | Aloha Star 100% Kona medium roast · washed | Dried cherry, green grape, caramel, brown sugar, anise | [Aloha Star Coffee](https://www.alohastarcoffee.com/shop/p/private-reserve-100-kona-washed-medium-roast) |
| Huehuetenango, Guatemala | Regional selection · washed | Orange, milk chocolate, biscuit | [InterAmerican Coffee](https://interamericancoffee.de/wp-content/uploads/2024/08/Factsheet_GUA_Huehuetenango-Regional.pdf) |
| Tarrazú, Costa Rica | Kwiso, San Marcos de Tarrazú · honey | Pronounced sweetness, chocolate | [Kwiso Coffee](https://kwiso-coffee.com/finca-y-procesos) |
| Boquete, Panama | Hacienda La Esmeralda Geisha · washed | Jasmine, Meyer lemon, white peach | [La Cabra](https://lacabra.com/products/esmeralda) |
| Huila, Colombia | Regional selection · washed | Fruit and caramel, with bright acidity | [InterAmerican Coffee](https://interamericancoffee.de/wp-content/uploads/2024/08/FactSheet_COL_Huila_Regionals.pdf) |
| Cerrado Mineiro, Brazil | Topázio MG 1190 · natural | Milk chocolate, caramel, brown sugar, honey | [Cerrado Mineiro trace record](https://intranet.cerradomineiro.org/trace/index.php/trace/verde/cod/7898328781777393438) |
| Yirgacheffe, Ethiopia | Gersay Beyou Grade 1 · fully washed | Jasmine, raisin, brown sugar | [Mercanta](https://coffeehunter.com/coffee/gersay-beyou-yirgacheffe-grade-1/) |
| Sidama, Ethiopia | Kontema Grade 1 · natural | Blueberry, strawberry, milk chocolate, spice | [Mercanta](https://coffeehunter.com/coffee/sidama-kontema-g1-3/) |
| Nyeri, Kenya | Gichathaini AA · washed | Blackcurrant, blood orange, grapefruit, caramel | [Terra Coffee Roasters](https://terracoffeeroasters.jp/en/blogs/origin/kenya-gichathaini-aa-washed) |
| Nyamasheke, Rwanda | Rwamatamu Hirwa peaberry · washed | Orange, sweet chocolate, floral notes | [Atomic Coffee Roasters](https://atomicroastery.com/products/rwanda-nyamasheke) |
| East Haraz, Yemen | Haraz Coffee micro-lot · anaerobic | Honey, dark chocolate, berry, orange | [Haraz Coffee](https://haraz-coffee.com/en/products/) |
| Kannur, India | Monsooned Malabar Arabica · monsooned | Earthy, nutty, spicy, with mild acidity | [Invest India](https://static.investindia.gov.in/s3fs-public/2021-11/ODOP%20PAR.pdf) |
| Gayo Highlands, Indonesia | Ratu Ketiara, Aceh, Sumatra · wet-hulled | Baking spice, cacao, lemongrass, honey | [Royal Coffee](https://cdn.royalcoffee.com/wp-content/uploads/2023/02/17074644/Crown-Jewel-Sumatra-FTO-Aceh-Ratu-Ketiara-Gayo-Wet-Hulled-CJO1518.pdf) |
| Đắk Lắk, Vietnam | Ea Tân Fine Robusta · anaerobic natural | Passion fruit, jackfruit, pink guava | [RAAW Coffee](https://raaw.coffee/dak-lak-fine-robusta) |
| Eastern Highlands, Papua New Guinea | Colbran family, Baroida Estate · washed | Dried fig, lime, cola, sugarcane | [Genovese Coffee](https://genovese.com.au/product/papua-new-guinea-the-colbran-family-washed/) |

## Data and geography

Store one local record per coffee with a stable ID, display name, country, region, coffee name, producer or mill, species and variety where known, process, tasting notes, flavor tags, and source name, URL, and access date. Give it a WGS 84 point with its own location source and precision label, such as **Growing region**, **Mill area**, or **Processing location**. Verify coordinates during data preparation. Use a point around Kannur for the Monsooned Malabar processing example and label it accordingly. [Coffee Board of India](https://coffeeboard.gov.in/coffee-regions-india.html?page=CoffeeRegionsIndia)

Let generic source descriptors stay generic, such as **fruit** or **floral notes**, and apply flavors only as specific as the source supports. Treat the family tags as search terms. Compare coffees by shared notes and families without assigning intensity scores. Link producer, importer, and roaster text in the credits and use short tasting descriptors in the menu.

## ArcGIS build workflow

1. Use the Esri plugin’s `gather-arcgis-application-requirements` skill and carry forward this spec’s decisions about audience, data, projection, and hosting. Apply `follow-arcgis-authentication-patterns` to confirm the anonymous access design, `build-with-arcgis-maps-sdk-for-javascript` and its CDN reference for the scaffold and map, and `build-with-calcite-design-system` for the menu controls, responsive layout, and café theme.
2. Consult the **Esri Developer Documentation MCP** before scaffolding and before selecting version-sensitive APIs. Verify the CDN template, Equal Earth projection with local geometry, map selection and overlapping markers, and Calcite component and token support against the SDK version the starter loads. If the MCP is unavailable or lacks a page, use Esri’s official docs directly and note the fallback in the project readme. [JavaScript setup and CLI](https://developers.arcgis.com/javascript/latest/get-started/) · [Client-side projection](https://developers.arcgis.com/javascript/latest/sample-code/client-projection/) · [Calcite colors and theming](https://developers.arcgis.com/calcite-design-system/foundations/colors/)
3. From `day23/`, check `npx -y @arcgis/create --help` and generate the official vanilla JavaScript CDN starter with `npx -y @arcgis/create --name starter --template cdn`. Preserve the generated baseline in `day23/starter/`, following Day 3’s convention. On subsequent runs, reuse that baseline. Adapt its SDK bootstrap for `day23/index.html` and replace the starter’s sample map configuration with the local land and coffee data. Use Calcite controls and documented design tokens for the café styling. [Official CDN template](https://github.com/Esri/jsapi-resources/tree/main/templates/js-maps-sdk-cdn) · [Day 3 scaffold notes](../day3/readme.md)
4. In `day23/readme.md`, record the scaffold command and template, the CLI and CDN SDK versions used, the skills applied, and the Esri references that guided the implementation. Run `npm run check` from the repository root and verify the map, filter, and tasting flight in a browser under the GitHub Pages subpath. Check the layout at desktop and phone widths and exercise the menu and flight by keyboard.

## Delivery and acceptance

Proposed delivery is a public, read-only web map in `day23/` on the collection’s GitHub Pages site. Follow Day 22’s ArcGIS Maps SDK for JavaScript and local Natural Earth land approach. Use a client-side Equal Earth map with local origin data and land geometry, so the page can run without an ArcGIS account, API key, or hosted feature service. [Day 22 implementation notes](../day22/readme.md) · [Esri client-side projection sample](https://developers.arcgis.com/javascript/latest/sample-code/client-projection/) · [Natural Earth land](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) · [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)

- At first load, visitors can see the world map and discover the tasting menu. Each of the 15 coffees is individually reachable, including nearby markers in East Africa.
- Selecting **Floral** brings up the sourced Boquete and Yirgacheffe examples. Selecting **Other fruit** includes the Fine Robusta from Đắk Lắk. Each selected origin opens the same card from the map or the menu.
- The starting flight highlights Yirgacheffe and Boquete, makes their shared jasmine note visible, and shows differences such as white peach and raisin. Visitors can remove or replace either coffee.
- Every card has traceable flavor and location sources, a defensible pin position, and a label that distinguishes a growing area from a processing location where relevant.
- On desktop and mobile, origin details, controls, and source links remain readable and operable by keyboard or touch. Verify the GitHub Pages subpath and capture one shareable image of the world view after implementation.
