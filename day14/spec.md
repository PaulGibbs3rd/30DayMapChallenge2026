# Seattle at Full Detail

Day 14 · Borgesian map · November 14, 2026 · Draft

## What the map does

Open on Seattle with shoreline, street names, and stairways. As the reader zooms in, the city fills with buildings, streetcar tracks, sidewalks, crosswalk paint, tree points, signs, racks, and defects in the pavement. At the closest scale, the map can show a recorded crack above the outline of an areaway beneath the sidewalk. The subject is the accumulation of real city records across an ordinary block. [Day 14 prompt](https://30daymapchallenge.com/2026/) · [SDOT areaways documentation](https://www.seattle.gov/Documents/Departments/SDOT/GIS/Areaways_OD.pdf)

The reader can explore anywhere in Seattle. Use **Pioneer Square and the waterfront** as the first guided close-up and **East Howe Street** as a second stop centered on the stairs. Choose each final camera extent after checking for actual feature overlap. The city documents raised crossings, planted areas, and curbless blocks at the waterfront, and the Howe Street Hillclimb connects Eastlake and Capitol Hill. [Pioneer Square improvements](https://waterfrontseattle.org/waterfront-projects/pioneer-square) · [Howe Street Hillclimb](https://www.seattle.gov/dpd/AppDocs/GroupMeetings/DCPresentation1E-Howe-Street-vacationAgendaID4805.pdf)

## Map behavior

| View | What appears |
| --- | --- |
| City, roughly 1:100,000 to 1:30,000 | A quiet shoreline and street network, park shapes, broad contours where available, and a single accent for stairways. |
| Neighborhood, roughly 1:30,000 to 1:6,000 | Buildings, landmarks, retaining walls, sidewalks, streetcar routes and stops, bike routes, and the small spaces where public streets end at water. |
| Block, roughly 1:6,000 to 1:1,500 | Painted markings, curb spaces, curb ramps, trees, street signs, bike racks, benches, fountains, public art, planters, drainage features, and recorded pavement issues. |
| Full detail, roughly 1:1,500 and closer | **Show everything** enables all available groups in the current close-up, including overlapping labels from source attributes. Render areaways with a dashed outline so their position beneath the sidewalk stays legible. |

- Provide **City**, **Pioneer Square**, and **East Howe Street** bookmarks, ordinary pan and zoom, a scale bar, and shortcuts to enable or disable each layer group. Treat the scale bands as starting points to tune against actual data density and service limits.
- Keep ordinary labels legible in the default view. In **Show everything**, let selected labels overlap using actual recorded values such as stairway riser count, sign wording, tree species, or defect type. Keep controls, attribution, and source links clear.
- At overlapping locations, let the reader choose from the nearby records and see the asset type, department, source, and a few pertinent fields. An unreported attribute should display as unknown.
- Provide an **Aerial basemap** toggle that preserves framing, layer selections, and feature inspection. The preview uses King County’s 2025 imagery because the city’s 2023 endpoint did not load during testing. The footer shows the source and capture year where known. Imagery and inventory records can come from different years. [King County 2025 aerial imagery](https://www5.kingcounty.gov/sdc?Layer=IMAGE_Ortho2025KCNAT)
- Use a compact layer drawer, visible keyboard focus, and controls that work by touch. Respect reduced-motion preferences on bookmark changes.

## Seattle GeoData service catalog

The [Seattle GeoData search](https://data-seattlecitygis.opendata.arcgis.com/search) showed **396 results on November 14, 2026**, including **388** labeled Feature Service, five Vector Tile Service, and one each labeled Group Layer, Map Package, and Map Service. These are catalog entries. A feature service can contain several renderable layers or tables. This draft draws from a review of the first 120 GeoData result cards, targeted searches in the Seattle ArcGIS Online gallery, and the city’s published service metadata. The links below identify candidate sources. The source audit will resolve the drawable sublayers, anonymous access, and local coverage.

### Proposed map layers

| Layer | Role in the map | Source |
| --- | --- | --- |
| Seattle city limits | City extent and overview boundary | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::seattle-city-limits) |
| Seattle Streets | General street network and labels | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/f91318f1cc43489fb0e7aca2fde22899) |
| Building Outlines 2023 | Building outlines at neighborhood and block scale | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::building-outlines-2023) |
| Contours | Terrain context. The city catalog describes two-foot source intervals | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/SeattleCityGIS::contours) |
| Park Boundaries | Public green space context | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/9baab63b52df417a9b2a168e3f288b1b) |
| Legal Right of Way | Faint outlines in the full stack | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/521efe8da1fe4dbc925b4c2e04a2d8d0) |
| Landmarks | Names of designated landmarks | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/462a18bf1f9f459eb7fd8ea08c843880) |
| Addresses (MAF) | House numbers at block scale, using address fields only | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/5ef414c3cf73436a84bff413129e67e7) |
| Stairways | Citywide thread. Show riser and landing counts when available | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/5dcd34dcd042430f9b134b8e2854d149) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=dd8665cf56954b9aa8466fb0ea8cbf89) |
| Sidewalks | Inventory linework along the street | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/20abc2269f6f4283a53cf31b93de718f) |
| Curb Ramps | Individual points at corners | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/cf8dd00e1ffa41afb3c6b71a9a978330) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=28b3f55be93645888724bf61cd5e6ae8) |
| Marked Crosswalks | Crossing inventory outlines or symbols according to source geometry | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/53635945962e42b9a1f4473557176861) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=25e1ac4c629040849d623523e1fedc8e) |
| Retaining Walls | Structures along hillsides and stairs | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/7fcb3523d3354306b5528972d9e96764) |
| Guardrails | Fine linear street detail | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/162b1afc0bdc446abcd2530f8de4a1d5) |
| Shoreline Street Ends | Ends of the street grid at the water | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/41887d99ce4b47908aaacefb4d8d2732) |
| Streetcar Lines | Route linework through downtown | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/3f53447de4e049d18ecf82cfc175dc87) |
| Streetcar Stations | Individual stops | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/b2b4e354334d4dbe8f7925a6fb7e8ec0) |
| Existing Bike Facilities | Bike lanes and other mapped bikeways | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::existing-bike-facilities-2) |
| Traffic Signal Assemblies | Intersection hardware | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/81c053c144b448049a062f4ac54b49b7) |
| Beacon Assemblies | Separate crossing or warning hardware from the city inventory | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/a99074bd88b946c990f3e0154b93ef51) |
| Traffic Circles | Residential intersection detail | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/a87c5bd45d124f98ba2ad0c90d7808bc) |
| Speed Humps | Traffic-calming detail | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/655cec32130f4bc0859857b0f5107fda) |
| Channelization, longitudinal markings | Paint along the direction of travel | [Service, layer 4](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/4) |
| Channelization, transverse markings | Paint across the direction of travel | [Service, layer 5](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/5) |
| Channelization, legend and symbols | Roadway symbols and legends where recorded | [Service, layer 6](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/6) |
| Paid Area Curb Spaces | Curb space geometry where inventoried | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/69af206729884701b32f5a810a1c6405) |
| SDOT Pay Stations | Individual parking payment machines | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/a628092ecd4741e6a11877ce7211795b) |
| SDOT Street Signs | Sign points and recorded wording where available | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/f4ba1c9fd5ac43edadf6565835269b51) |
| Street Furnishings | Inventory for items such as benches, tables, clocks, and rails | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/3499ddebec09456382e142358d8808c1) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=18cc4853a44a4a438cd16e58a8867919) |
| Bicycle Racks | Individual rack records | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/e82f927b630f4fb8b4551baffa437370) |
| SDOT Trees | Street tree points and recorded species and diameter | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/db783659194f47ef8fbd8e010c102809) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=2af217e7c29b4f0298df2119a418d59e) |
| Parklets | Small public spaces in the street | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/6fb431057aa64f78805c32c1b4b1e7cf) |
| Park Bench | Parks inventory, including named benches when recorded | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::park-bench) |
| Drinking Fountain | Parks fountain points | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/703a15f2fd924cb4beab92b0c28d7c07) |
| Play Equipment | Small parks assets | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/72e2330a983e4c2dbb0f294abf33e250) |
| Park Signs | Signs maintained through the parks inventory | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/5e208690eeae4cf6a98bcdfc4c7f0d10) |
| Public Art Installations | Named artworks | [ArcGIS Online](https://seattlecitygis.maps.arcgis.com/home/item.html?id=8d0ddb56f318457ba84cbc3330bb5386) |
| Seattle Waterfront Planters View | Waterfront planter project records. Check the geometry and status before styling | [ArcGIS Online](https://seattlecitygis.maps.arcgis.com/home/item.html?id=5261f018000e426bafcbd4f47201202c) |
| Public Litter and Recycling Cans | Individual cans in the SPU inventory | [Service, layer 6](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Active_Public_Litter_and_Recycling_Cans/FeatureServer/6) |
| Catch Basins and Inlets | Use the Inlets sublayer for grate and inlet records | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::inlets) |
| Surface Drainage Curb and Gutter | Drainage structures along the edge of the road, subject to coverage | [ArcGIS Online](https://seattlecitygis.maps.arcgis.com/home/item.html?id=eebbc3c225f0419a87dc64cadb2bbc08) |
| Sidewalk Observation | Individual records of cracking, uplift, or obstruction. Draw observation points at their recorded positions | [Service, layer 0](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Sidewalk_Observation/FeatureServer/0) · [SDOT guide](https://seattle.gov/transportation/projects-and-programs/programs/pedestrian-program/sidewalk-accessibility-guide) |
| Areaways | Underground spaces adjoining sidewalks. Use an outline and retain the source feature shape | [GeoData](https://data-seattlecitygis.opendata.arcgis.com/maps/81e44e131b0140b79ee18f96d2463925) · [Active view](https://seattlecitygis.maps.arcgis.com/home/item.html?id=47979b6bf5c54709b5b387c96a6205d4) |

### More layers for Show everything

The published stack adds the services below plus the 1993 and 2015 building outlines at the full-detail scale. The other building vintages remain candidates for a future time comparison.

At the closest scale, let each layer ask the reader to pay attention to a different detail in the same space. Draw parcel outlines over roofs, then show the measured lane widths, barrier types, curb schedules, pothole work orders, and drainage structures. Let labels overlap in **Show everything**. Keep the close-up framed as the labels accumulate so the reader can compare the increasingly crowded map with the same aerial image.

The counts below come from anonymous spatial queries on November 14, 2026. They count records intersecting test rectangles around the bookmarks. Pioneer Square spans `-122.3385, 47.5997, -122.3315, 47.6034` and East Howe Street spans `-122.3247, 47.6341, -122.3177, 47.6378` in longitude and latitude. The rectangles approximate the guided views. The counts may change as services update, and several records may refer to a single physical object. [Seattle GeoData](https://data-seattlecitygis.opendata.arcgis.com/search)

| Additional layer | Pioneer Square | East Howe | What it adds |
| --- | ---: | ---: | --- |
| [Vertical Elements](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/0) | 1,076 | 221 | Draw detailed curb and barrier linework. Label the asset type and curb profile where recorded. Many records have no type. |
| [Lane Width](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/1) | 374 | 78 | Put each recorded measurement back on the road. Skip blank values and dashes. Confirm units before adding a suffix. |
| [Panel Markings](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Channelization_view/FeatureServer/3) | 117 | 0 | Add another class of painted detail alongside the existing longitudinal, transverse, and symbol layers. |
| [Pothole Status](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Pothole_Status/FeatureServer/0) | 445 | 411 | Put pothole work orders beside sidewalk observations. Show recorded status and dates where available. |
| [Parcel Boundary](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Parcel_Boundary/FeatureServer/0) | 117 | 281 | Draw a fine boundary around each tax parcel and show the parcel number on inspection. |
| [2021 Tree Crowns](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/TreeCrowns_2021_Seattle/FeatureServer/0) | 329 | 1,336 | Trace individual crown extents over the tree points. Keep the capture year in the legend. |
| [Seattle City Light Poles](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Seattle_City_Light_Poles_PROD/FeatureServer/1) | 289 | 127 | Label individual poles and indicate whether each record shows a streetlight. |
| [Blockface](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Blockface/FeatureServer/1) | 126 | 98 | Label the width or weekday restriction times of a single side of a block. |
| [Curb Space Categories](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Curb_Space_Categories/FeatureServer/6) | 1,059 | 0 | Label loading, clearance, and tow-away zones. Filter categories already in the paid parking layer. |
| [Catch Basins](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/SPU_DWW_Catch_Basins_Inlets_Junction_Boxes_Sandboxes_and_Trash_Racks/FeatureServer/2) | 46 | 36 | Add the structures associated with existing inlet points. Distinguish the two asset types in the legend. |
| [Landscape Complexes](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Landscape_Complexes_CDL/FeatureServer/0) | 92 | 1 | Outline managed planted areas among the tree and planter records. |
| [One-Way Streets](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/One_Way_Streets_CDL/FeatureServer/0) | 37 | 7 | Put directional arrows on street segments once the service’s direction encoding is confirmed. |
| [Water Quality Structure Polygons](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SPU_DWW_Water_Quality_Structures/FeatureServer/2) | 16 | 0 | Draw the city’s recorded structure outlines in the drainage group. |
| [Irrigation Systems](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Irrigation_Systems_CDL/FeatureServer/0) | 3 | 0 | Label the category of individual irrigation inventory points. |
| [Miscellaneous Structures](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Miscellaneous_Structures/FeatureServer/0) | 2 | 0 | Show the category, material, or height of individual objects where recorded. |
| [Traffic Detectors](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Traffic_Detectors_CDL/FeatureServer/0) | 0 | 2 | Add individual detection devices to the citywide inventory. |
| [Channelization General Background](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/SDOT_Channelization_view/FeatureServer/2) | 357 | 99 | Source linework for road drawings. Check where it repeats another channelization layer. |
| [Pavement Moratorium](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/DotMaps_Pavement_Moratorium/FeatureServer/0) | 10 | 0 | Draw the area of documented pavement work restrictions and identify their status. |
| [Streetlight Repair Status](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Streetlight_Repair_Status/FeatureServer/0) | 0 | 5 | Show individual repair tasks alongside the pole inventory. |
| [Residential Building Permits](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Residential_Building_Permits_Issued_not_yet_complete/FeatureServer/0) | 1 | 3 | Show the recorded construction action and permit status. |
| [Curbspace Transit Layover](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Curbspace_Transit_Layover/FeatureServer/0) | 1 | 0 | Add the size and hours of a specific curb reservation where available. |
| [Green Stormwater Infrastructure BMP records](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Seattle_Green_Stormwater_Infrastructure/FeatureServer/1) | 108 | 220 | Some points stand for a project or a group of installations. Preserve the reported count and identify grouped records in labels. |
| [Temporary No Parking archive](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Temporary_No_Parking_1/FeatureServer/2) | 2,678 | 0 | Optional time overlay. Draw repeated reservations on the same curb and label the reservation dates. The [current view](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Temporary_No_Parking_1/FeatureServer/0) returned 2 and 0 records, respectively. |

Start with the first eight layers. The existing Sidewalk Observations and Areaways layers returned 143 and 120 records in the Pioneer Square rectangle. A point-in-polygon check found **53 observations inside mapped areaway outlines**, including 39 surface condition observations, 12 height differences, and two obstructions. East Howe returned 175 sidewalk observations and zero areaways. These overlaps use the published geometry and its recorded precision. [Sidewalk Observations](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Sidewalk_Observation/FeatureServer/0) · [Active Areaways](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/Areaways_(Active)/FeatureServer/0)

The Park Restrooms and Docks, Piers, and Floats layers returned zero in both rectangles. Consider them for a wider park or waterfront view. [Park Restrooms](https://data-seattlecitygis.opendata.arcgis.com/maps/e3304497b6844247a3159b454c3875bf) · [Docks, Piers, and Floats](https://data-seattlecitygis.opendata.arcgis.com/maps/a2cc825ea7d547be908c52c1a1f6e7fa)

For a second kind of overlap, trace the same blocks from multiple inventories. Combine the existing 2023 footprints with the catalog’s older outlines and identify each source vintage in the legend. Capture and mapping methods can differ across years. [1993](https://data-seattlecitygis.opendata.arcgis.com/maps/aaf16e2e4c6d4bb78720e6b8eabfa3dd) · [1999](https://data-seattlecitygis.opendata.arcgis.com/maps/8d61b277b68947da99327497dfc655fb) · [2005](https://data-seattlecitygis.opendata.arcgis.com/maps/5f9f75d0ae144b74b494b5e9f3b9e2ec) · [2009](https://data-seattlecitygis.opendata.arcgis.com/maps/dece72fab0b9416e8ba649256a2b766e) · [2012](https://data-seattlecitygis.opendata.arcgis.com/maps/c9391055bd134d35a4da225830fe3408) · [2015](https://data-seattlecitygis.opendata.arcgis.com/maps/c7265e8e78f14970bf375d9b2259e82a)

## Source audit and delivery

1. For each layer, record the publisher, item ID or service URL, numeric sublayer ID when applicable, geometry type, display scales, relevant fields, terms, attribution, and date checked. Test unauthenticated access to both the service metadata and a small data request. Confirm spatial records and status filters. Use one authoritative view per inventory and treat the crosswalk inventory and road paint as distinct only where the geometry supports it.
2. Query feature counts against the same small bounding extents for Pioneer Square, the waterfront, and East Howe Street. Choose the close-up with the richest verified overlap. Check that the inventory points, linework, and current or historical imagery agree as far as their dates and accuracy allow. The layer count measures the map stack, and the mapped geometry retains the precision of its source.
3. Use the existing static GitHub Pages route at `day14/`. The suggested renderer is a 2D ArcGIS Maps SDK for JavaScript map using public read-only ArcGIS Online resources and a basemap that works anonymously. Resolve feature layers by portal item and explicit sublayer ID or by the exact service URL. Use the appropriate layer type for tiles and imagery. [FeatureLayer](https://developers.arcgis.com/javascript/latest/references/core/layers/FeatureLayer/) · [VectorTileLayer](https://developers.arcgis.com/javascript/latest/references/core/layers/VectorTileLayer/) · [MapImageLayer](https://developers.arcgis.com/javascript/latest/references/core/layers/MapImageLayer/)
4. Keep the catalog in one manifest. Load the overview first, add other groups when the current scale or user action needs them, and use viewport queries where required. If requests for dense layers make the block view sluggish, test a clipped or tiled representation under the applicable source terms. Expose unavailable layers in the drawer and let the rest of the map continue.

## Acceptance criteria

- The public page opens signed out and pans across Seattle. Both bookmarks work and the stairways remain visible during the progression into local detail.
- The layer drawer lists each audited source and separates available, loading, and unavailable states. The 43 candidates give the first build a broad scope. Report how many approved layers actually render and how many intersect the chosen close-up.
- **Show everything** makes all eligible layer groups visible at close scale and shows a visibly denser map. Desktop and mobile readers can return to the readable view in one action.
- At least one audited close-up shows data from several departments and resolves an identifiable asset or observation through its source record. If no crack and areaway intersect at one location, show both within the same verified extent and describe their actual positions.
- Switching basemaps preserves framing, layer selections, and feature inspection. Attribution and source links remain available in both views. Test one unavailable service and verify that the rest of the map remains usable.

### ArcGIS requirements handoff summary

- **Work Target:** New Day 14 map in the existing challenge site.
- **Project Folder:** `day14/`
- **ArcGIS Product Context:** ArcGIS Online as the source of public Seattle GeoData items.
- **Target Platform:** Responsive web on the existing GitHub Pages route.
- **Delivery Scope:** This draft specifies the map and its sources. The first build includes citywide navigation, the audited layer stack, and the two guided stops.
- **Identity & Access Model:** Public audience, anonymous read access to verified sources.
- **Core Features and Operations:** 2D map, read-only feature and imagery display, scale-dependent visibility, and feature inspection.

#### Remaining assumptions

1. ArcGIS Maps SDK for JavaScript is the proposed renderer. The imagery service, exact close-up bounds, and locally useful layers depend on the source audit.

#### Next agent actions

- [ ] Audit anonymous access and count features in the candidate close-ups.
- [ ] Apply the `build-with-arcgis-maps-sdk-for-javascript` skill when implementing the page.
