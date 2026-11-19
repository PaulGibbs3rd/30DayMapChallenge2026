# Day 18 · Visit Null Island

**Working spec · NULL · November 18, 2026**

*Where missing coordinates go on vacation.* Make a deadpan tourist map for a fictional resort populated by GIS mistakes. Its mailing address is `0°, 0°`, where the Equator and Prime Meridian cross in the Gulf of Guinea. A pipeline that substitutes zeros for two missing coordinates can send a record to that real point in open water. [Official 2026 challenge](https://30daymapchallenge.com/2026/) · [Library of Congress](https://blogs.loc.gov/maps/2016/04/the-geographical-oddity-of-null-island/)

## The visitor’s map

Open on the illustrated resort as a fictional attraction guide. Give the island chart the earnest look of a vintage tourist brochure and keep signs short enough to read on the map itself. Below the illustration, use the Coordinate Lab’s live Gulf of Guinea map for both the guest register and visitor-plotted points. Show West Africa, the Equator, the Prime Meridian, and the real `0°, 0°` offshore.

### Main attractions

- **Hotel 9999999999.** “Something unexpected happened to your reservation.” Put all ten nines on the biggest sign on the island. A short field note identifies its inspiration as ArcGIS Pro’s six-digit `999999` geoprocessing error. [Esri error reference](https://doc.esri.com/en/arcgis-pro/latest/tool-reference/tool-errors-and-warnings/999001-999999/tool-errors-and-warnings-999998-999999-999999.html)
- **Lat/Long International Airport.** “Departures have been swapped with arrivals.” Draw two crossed runways and a departures board with the same two coordinate values in opposite orders. Point out that GeoJSON expects longitude first. [GeoJSON specification](https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1)
- **NoData Trench.** “Depth unmeasured. Printed as −9,999 m anyway.” Give a patch of sea a checkerboard of missing raster cells and one suspiciously precise sounding. `-9999` is a missing-data value in some rasters. [USGS raster example](https://pubs.usgs.gov/tm/14/a01/pdf/tm14-a1.pdf)
- **Shapefile Customs.** “Please declare all accompanying files.” Draw `.shp`, `.shx`, and `.dbf` at passport control and a lost-property notice for the `.prj` file that carries coordinate-system information. [Esri shapefile components](https://doc.esri.com/en/arcgis-pro/latest/tool-reference/appendices/geoprocessing-considerations-for-shapefile-output.html)

### Extra stops if the map has room

- **Bowtie National Park.** “The boundary crosses itself at the scenic overlook.” Draw the park as a self-intersecting polygon with the overlook where the two edges cross. [Esri geometry checks](https://doc.esri.com/en/arcgis-pro/latest/help/data/validating-data/invalid-geometry.html)
- **Buffer Beach.** “Please stay 0.01 degrees from the lifeguard.” Draw concentric rings around a single beach chair. The joke is giving a beach setback in angular units. [Esri buffer distance units](https://doc.esri.com/en/arcgis-pro/latest/tool-reference/analysis/buffer.html)

## Hotel check-in

Make the coordinate demo the hotel’s guest register. Start with sample guests whose missing coordinates leave them **Awaiting location**. **Use zero as the default** substitutes zero for each missing coordinate on guests without a saved location. Guests with two missing values now appear as a counted cluster at `0°, 0°`. Display the original and plotted coordinates side by side. Include a sample with a genuine numeric zero and another with just one coordinate missing so readers can see which records check in. Selecting a guest links the coordinate lab to their record. **Plot point** saves the selected guest’s location and updates their position on the map. A register reset returns the guests to their opening state.

## Coordinate lab

Open the live map on the Gulf of Guinea with pan, zoom, and reset controls. Click the map to read its WGS 84 coordinates. Accept a longitude and latitude from the reader, flag missing or out-of-range values, and add a point graphic on each valid **Plot point** submission. Replotting a guest replaces that guest’s previous graphic. Keep the plotted points on the map as readers edit the inputs, and provide a control to clear the pins. Let readers swap the axes or copy the valid GeoJSON pair. Load the New York example from Lat/Long International Airport so visitors can see where swapping two individually valid coordinates puts the point.

## John Nelson Theater

Give the island a little cinema with a marquee that reads **Now projecting. Always projecting.** Select the theater on the map to open the screening room. Use John Nelson’s *One Minute Map Hacks* as the opening program. Once the visitor presses play, the official YouTube player plays the playlist and returns to the first video at the end. Keep the player controls available and stop playback when the visitor leaves the theater. Offer a **Watch on YouTube** link beside the player. [John Nelson’s playlist](https://www.youtube.com/playlist?list=PLPjPOZQjCWEnsT8RPYluAx3Eqe4ZVxDvS) · [YouTube playlist playback](https://developers.google.com/youtube/player_parameters#loop)

## Sources and delivery

- Use Natural Earth’s public-domain coastline as a candidate for the regional view. Its release notes also document a fictional one-meter-square Null Island feature added as a troubleshooting aid. That story could be a short map annotation. [Coastline](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-coastline/) · [Terms of use](https://www.naturalearthdata.com/about/terms-of-use/) · [Natural Earth release notes](https://www.naturalearthdata.com/blog/natural-earth-version-1-3-release-notes/)
- The NOAA listing for Station 13010, “Soul,” gives the chart a documented connection to ocean observation. If included, use it as a historical reference. [NOAA station history](https://www.ndbc.noaa.gov/station_history.php?station=13010)
- Host the Day 18 page on the project’s existing static site. Choose the renderer after the map format is settled. Verify the coordinate examples, theater playback and close behavior, keyboard controls, and label legibility at phone width.

Let the illustrated chart work as a shareable still, with the guest register available on the web page.
