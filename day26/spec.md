# Day 26 · Where the Elwha Built Land

**Water · November 26, 2026**

Show where the high-water shoreline moved around the Elwha River mouth between a survey before dam removal and one after it. Center the map on the delta and use the inset to connect it to the two former dams upstream. The story is visible in the changes at the mouth, where the river carried formerly trapped sediment into the Strait of Juan de Fuca. [Challenge prompt](https://30daymapchallenge.com/2026/) · [Coastal change study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6764949/)

## Experience

- Open on **Change**. Draw the September 2009 shoreline with a dashed line and July 2017 with a solid line. Mark ground that rose above mean high water in ochre and ground that fell below it in patterned purple. Show the shared survey edge, scale bar and north arrow.
- Offer **September 2009**, **July 2017**, and **Change** as three equally accessible controls. Keep the reader’s zoom and position when switching surveys. Offer zoom, pan, and a reset to the initial extent. The legend and caption update to match the selected view, and the scale bar follows the zoom.
- Name the Elwha River and the Strait of Juan de Fuca on the map. Show the river mouth, both former dam sites and Port Angeles in the locator. Credit the Lower Elwha Klallam Tribe in the restoration caption. [Tribal habitat restoration](https://www.elwha.org/departments/natural-resources/habitat-restoration/)

## Sources and calculations

The pre-removal baseline is the USGS September 2009 bathymetry and topography survey. The May 2011 grid proposed during brainstorming was unavailable during download. Interpolate the 2009 profiles to the July 2017 USGS grid at 5 m spacing, using Washington State Plane North NAD83 and NAVD88 and excluding triangles with an edge longer than 50 m. Use the same **1.86 m NAVD88** high-water threshold for both dates. Count only cells that were mapped in both surveys and lie in the map’s fixed extent. Read the resulting numbers as areas that crossed the elevation threshold over the survey interval. [2009 USGS profiles](https://pubs.usgs.gov/ds/288/) · [July 2017 USGS grid](https://www.usgs.gov/data/bathymetry-topography-and-sediment-grain-size-data-elwha-river-delta-washington-july-2017) · [Published high-water method](https://repository.library.noaa.gov/view/noaa/62100/noaa_62100_DS1.pdf)

## Delivery and acceptance

- Serve the static `day26/` page in the existing GitHub Pages collection. Use the ArcGIS Maps SDK for JavaScript with local WGS 84 GeoJSON and provide the same three views as local images for browsers without the SDK or WebGL. The page works without signing in.
- The default view distinguishes gained and lost ground with colors and patterns. The two outlines keep their line styles in each dated view. Compare the spatial pattern at the river mouth with the published USGS study and check that totals match the derived 5 m cells in shared coverage.
- Verify the survey and navigation controls with keyboard and touch input and check the layout at desktop and phone widths. The downloadable PNG includes both survey dates, legend, scale, former dam sites and USGS credit. [Open the map](index.html) · [Download the map](assets/elwha-change.png)
