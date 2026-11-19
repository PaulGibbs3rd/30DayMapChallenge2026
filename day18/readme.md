# Visit Null Island

**Day 18 · NULL · November 18, 2026**

A fictional tourist resort at 0°, 0°, where missing coordinates go on vacation. The page opens with an illustrated guide to the airport, customs, the John Nelson Theater, and other stops drawn from GIS mistakes. The Coordinate Lab below maps guest locations and your own plotted points.

## Explore

- **Hotel 9999999999.** Select a guest, choose coordinates in the Coordinate Lab, and select **Plot point** to save the guest’s location. The register shows the original and saved coordinates side by side. **Use zero as the default** fills missing values for guests without a saved location. Three guests with two missing values arrive at 0°, 0°.
- **Coordinate lab.** Pan and zoom the map, click a location to read its coordinates, or plot your own point. Plotting a selected guest again moves their pin. **Clear map pins** removes the blue pins, and **Reset register** clears saved guest locations. The page keeps guest edits while it stays open. Try swapping longitude and latitude or copy a result as a GeoJSON coordinate pair. The airport has a New York example ready to try.
- **John Nelson Theater.** Start *One Minute Map Hacks* in the screening room. The YouTube playlist is configured to repeat, and leaving the theater closes the player. [John Nelson Maps](https://www.youtube.com/@JohnNelsonMaps) · [One Minute Map Hacks](https://www.youtube.com/playlist?list=PLPjPOZQjCWEnsT8RPYluAx3Eqe4ZVxDvS)
- **Download the visitor’s map.** Save a still of the illustrated island, attraction key, and locator. [Visitor’s map](visitor-map.jpg)

## Run locally

The page started with `@arcgis/create@5.2.5 --template js-maps-sdk-cdn`. It uses the ArcGIS Maps SDK for JavaScript 5.2 and Calcite from the CDN. Start the collection with `npm run dev` from the repository root and open `/30DayMapChallenge2026/day18/`. The Coordinate Lab loads a local GeoJSON file and uses Canvas if the SDK is unavailable. The page uses no ArcGIS sign-in or API key. YouTube playback loads when the theater opens.

## Data and artwork

- **Geography.** The map opens at the WGS 84 intersection of the Equator and Prime Meridian and uses Natural Earth 1:110m land for the world outline. The guest records and illustrated resort are fictional. [Natural Earth land](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) · [Public domain terms](https://www.naturalearthdata.com/about/terms-of-use/) · [Library of Congress on Null Island](https://blogs.loc.gov/maps/2016/04/the-geographical-oddity-of-null-island/)
- **Artwork.** The island illustration was made with the built-in ImageGen tool and converted to JPEG for the page. [Island artwork](island.jpg)

<details>
<summary>Island illustration prompt</summary>

Use case: illustration-story. Asset type: unlabeled foundation artwork for a clickable fictional tourist map. Generate one 3:2 landscape full-bleed vintage 1950s travel-brochure island illustration, depicting tiny fictional Null Island completely surrounded by blue-green tropical ocean. Art direction: hand-drawn lithograph with crisp navy ink, restrained engraving and stipple, period flat gouache greens, parchment-sand shore, coral-red roofs and sun-faded turquoise ocean. A little sophisticated and witty, old travel atlas rather than children's cartoon. View is mostly overhead, tilted just enough for the buildings to have visible front faces. One large irregular island shaped loosely like a tilted zero or horseshoe, centrally framed with modest ocean space on all four sides and a bright interior lagoon. Curving pale road joins sites. Place a small tall grand coral-and-cream resort hotel with tower in the north-center of the island; a compact airfield with two crossing runways on the eastern headland; a small red-roofed Art Deco cinema on the west-central island shore with a blank facade signboard; a tiny customs hut beside a low pier on the southern shore; a sandy beach at southwest; a lush green park at northwest; subtle dark-blue chart-like depth rings and a small raster checkerboard in the ocean southeast. Give buildings room to breathe and keep each assigned area visually distinct. The island and illustrations are the only graphics. The app will add all text and labels after generation. Absolutely no typography, letters, numerals, captions, faux lettering, grid lines, inset map, compass, frame, border, legend or watermark. Output a single illustration, not a website mockup.

</details>

[Working spec](spec.md) · [Official 2026 challenge](https://30daymapchallenge.com/2026/) · [All challenge days](../directory/)
