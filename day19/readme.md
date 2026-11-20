# Day 19 · Follow Your Nose

**November 19, 2026 · Senses: Smell**

A self-guided Seattle smell walk from Westlake through Pike Place Market’s flower tables and Pier 62, then through Pioneer Square to Chinatown and Little Saigon. The mapped route is about 2.6 miles one way. Allow 60–75 minutes for walking and brief stops. [Official challenge](https://30daymapchallenge.com/2026/)

## Explore

- [Walking map and itinerary](index.html)
- [Downloadable map](walk-map.svg)
- [Working spec and source accounts](spec.md)
- [GitHub Pages](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day19/) · [Source folder](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day19)

Choose a pin or a stop in the itinerary to open directions and the first-person account behind the scent clue. The stop pins mark suggested standing points. The notes describe past visits, and which scents come through varies with conditions. The North Arcade and Overlook Walk connections are generalized on the map. Follow posted pedestrian signs and check venue access before the walk.

## Data and attribution

- [Basemap GeoJSON](basemap.geojson) contains selected shoreline, street, rail, park, and pier features from OpenStreetMap. [Walk GeoJSON](walk.geojson) contains the walking line, scent-stop pins, and map labels. The line combines traced OpenStreetMap footways and crossings with hand-drawn sidewalk-scale connections based on the public directions in the spec. The approximate distance is the sum of the mapped segments.
- The OpenStreetMap extracts were retrieved November 19, 2026. The derived geodata is available under the Open Database License. © OpenStreetMap contributors. [Data attribution and license](https://www.openstreetmap.org/copyright)
- Stop notes paraphrase linked public reviews and first-person accounts. The fortune-cookie account describes a historical smell at 8th and King. Yelp required device verification during research.
- The Pike Place bouquet photograph is by Daniel Eriksson, taken July 6, 2015. The page uses the Wikimedia Commons 960-pixel copy, with a display crop on small screens. [Original photograph](https://commons.wikimedia.org/wiki/File:Flowers_at_Pike_Place_Market.jpg) · [CC BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/)

## Run locally

From the project root, run `npm run dev` and open the Day 19 route at the server address printed in the terminal. The app uses ArcGIS Maps SDK for JavaScript 5.2 with local geometry. The interactive map loads the SDK from its CDN. The SVG route overview and HTML itinerary are available if the SDK cannot load.

Run `node day19/scripts/render-walk.mjs` from the project root to regenerate the downloadable map from the local GeoJSON. Run `npm run check` to regenerate the collection and validate its static Pages artifact.
