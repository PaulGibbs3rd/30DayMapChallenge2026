# Seattle at Full Detail

**Date:** November 14, 2026  
**Status:** Published

## Theme

Experiment with extreme detail and scale, asking what happens when a map approaches the complexity and extent of the territory it represents.

Start with a citywide view of Seattle’s stairways and zoom in to see painted road markings, sign text, and individual sidewalk observations. Choose **Pioneer Square** or **East Howe Street** to jump to a close-up, or choose **Show everything** to let the records and labels accumulate. Select a symbol to inspect the records at that location. With the map focused, press **Enter** to inspect the center and **Escape** to close the records.

Toggle **Aerial basemap** to see the same data layers over a photograph. **Building footprints** and **Road centerlines** have separate controls and adapt their colors to the basemap. Use **Show everything** with either basemap.

## Data and attribution

- The map uses 68 layer sources from City of Seattle GeoData and ArcGIS Online. **Show everything** adds 25 close-up sources, including lane-width measurements, curb records, tree crowns, utility poles, pothole work orders, and building outlines from 1993 and 2015. The active count describes the enabled map stack at the current scale. City inventories vary by department, location, and collection date. [Layer inventory](spec.md) · [Seattle GeoData](https://data-seattlecitygis.opendata.arcgis.com/search)
- The comparison uses King County's 2025 imagery with Esri World Imagery as a fallback. The footer identifies the imagery source currently displayed. The preview uses King County because the planned City of Seattle 2023 service failed to load during browser testing. [King County imagery metadata](https://www5.kingcounty.gov/sdc?Layer=IMAGE_Ortho2025KCNAT)

## Run locally

Run `npm run dev` from the repository root and open `http://127.0.0.1:4174/30DayMapChallenge2026/day14/`. The page uses ArcGIS Maps SDK for JavaScript 5.2 and reads public services anonymously. Live mapping needs an internet connection.

- [Source folder on GitHub](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day14)
- [GitHub Pages route](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day14/)
- [All challenge days](../directory/index.html)

## Validation

The expansion research tested approximate extents around both bookmarks and found 53 sidewalk observation points inside mapped areaway outlines at Pioneer Square. [Layer query counts](spec.md#more-layers-for-show-everything)

Theme reference: [Official 2026 challenge](https://30daymapchallenge.com/2026/).
