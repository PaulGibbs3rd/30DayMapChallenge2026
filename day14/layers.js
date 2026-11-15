export const imagerySources = [
  { url: "https://gismaps.kingcounty.gov/arcgis/rest/services/BaseMaps/KingCo_Aerial_2025/MapServer", title: "King County aerial imagery · 2025", type: "map-image" },
  { url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", title: "Esri World Imagery · capture dates vary", type: "tile" },
];
export const baseUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer";

const cityServices = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/ArcGIS/rest/services/";
const feature = (name, layerId) => `${cityServices}${name}/FeatureServer/${layerId}`;

export const groups = [
  { id: "ground", title: "City and terrain", color: "#666353", scale: 0 },
  { id: "buildings", title: "Building footprints", color: "#42677b", aerialColor: "#b1e7ec", scale: 24000 },
  { id: "roads", title: "Road centerlines", color: "#876743", aerialColor: "#fff0c6", scale: 30000 },
  { id: "stairs", title: "Stairways and hillsides", color: "#9d392d", scale: 0 },
  { id: "routes", title: "Walking and transport", color: "#2d6974", scale: 30000 },
  { id: "paint", title: "Road paint and curbs", color: "#8a4d1e", scale: 6800 },
  { id: "objects", title: "Street fixtures", color: "#624a7d", scale: 6800 },
  { id: "parks", title: "Trees and public spaces", color: "#37694a", scale: 10000 },
  { id: "water", title: "Drainage and areaways", color: "#285a86", scale: 5500 },
  { id: "records", title: "Sidewalk and repair records", color: "#a12d51", scale: 4200 },
  { id: "history", title: "Historical outlines and curb records", color: "#784d82", scale: 2300 },
];

const rows = [
  ["city-limits", "Seattle city limits", "ground", "c5f3575dd7d545ada27064c74ac74f52"],
  ["contours", "Contours", "ground", "42f59a16f8cd4c27b48698083de9e32b", { type: "vector-tile", scale: 25000 }],
  ["park-boundaries", "Park Boundaries", "ground", "9baab63b52df417a9b2a168e3f288b1b", { scale: 65000 }],
  ["right-of-way", "Legal Right of Way", "ground", "521efe8da1fe4dbc925b4c2e04a2d8d0", { scale: 4200 }],
  ["landmarks", "Landmarks", "ground", "462a18bf1f9f459eb7fd8ea08c843880", { scale: 11000, fields: ["NAME", "COMMON_NAME", "LANDMARKNAME"] }],
  ["addresses", "Addresses (MAF)", "ground", "5ef414c3cf73436a84bff413129e67e7", { scale: 2400, fields: ["ADDR_HN", "ADDR_FULL", "FULLADDR", "ADDRESS"] }],
  ["buildings", "Building Outlines 2023", "buildings", feature("Building_Outlines_2023", 0), { fields: ["OUTLINE_ID", "PIN"] }],
  ["streets", "Seattle Streets", "roads", feature("Seattle_Streets_1", 0), { fields: ["STNAME_ORD", "ARTDESCRIPT"] }],
  ["stairways", "Stairways", "stairs", "dd8665cf56954b9aa8466fb0ea8cbf89", { fields: ["NBR_STAIRRISER", "NBR_STAIRLANDING", "STAIRWAYTYPE", "STAIRWAYWIDTH", "UNITID"] }],
  ["walls", "Retaining Walls", "stairs", "65242bda6fa645d4b2cc9dde30be856d", { scale: 18000, fields: ["WALLTYPE", "UNITID"] }],
  ["rails", "Guardrails", "stairs", "162b1afc0bdc446abcd2530f8de4a1d5", { scale: 6800, inService: true }],
  ["street-ends", "Shoreline Street Ends", "routes", "41887d99ce4b47908aaacefb4d8d2732"],
  ["sidewalks", "Sidewalks", "routes", "20abc2269f6f4283a53cf31b93de718f", { scale: 12500, inService: true }],
  ["ramps", "Curb Ramps", "routes", "28b3f55be93645888724bf61cd5e6ae8", { scale: 7000 }],
  ["crosswalks", "Marked Crosswalks", "routes", "25e1ac4c629040849d623523e1fedc8e", { scale: 10000 }],
  ["streetcar", "Streetcar Lines", "routes", "3f53447de4e049d18ecf82cfc175dc87"],
  ["streetcar-stops", "Streetcar Stations", "routes", "b2b4e354334d4dbe8f7925a6fb7e8ec0", { scale: 16000 }],
  ["bike-routes", "Existing Bike Facilities", "routes", feature("SDOT_Bike_Facilities", 2)],
  ["signals", "Traffic Signal Assemblies", "paint", "81c053c144b448049a062f4ac54b49b7", { inService: true }],
  ["beacons", "Beacon Assemblies", "paint", "a99074bd88b946c990f3e0154b93ef51", { inService: true }],
  ["circles", "Traffic Circles", "paint", "a87c5bd45d124f98ba2ad0c90d7808bc", { inService: true }],
  ["humps", "Speed Humps", "paint", "655cec32130f4bc0859857b0f5107fda", { inService: true }],
  ["paint-long", "Longitudinal Road Markings", "paint", feature("SDOT_Channelization_view", 4)],
  ["paint-across", "Transverse Road Markings", "paint", feature("SDOT_Channelization_view", 5)],
  ["paint-symbols", "Road Legends and Symbols", "paint", feature("SDOT_Channelization_view", 6)],
  ["curb-space", "Paid Area Curb Spaces", "paint", "69af206729884701b32f5a810a1c6405"],
  ["pay", "Pay Stations", "objects", "a628092ecd4741e6a11877ce7211795b", { inService: true }],
  ["signs", "Street Signs", "objects", feature("SDOT_Street_Signs", 1), { inService: true, fields: ["SIGNTEXT", "SIGN_TEXT", "SIGNLEGEND", "LEGEND", "SIGNTYPE", "UNITID"] }],
  ["furnishings", "Street Furnishings", "objects", "18cc4853a44a4a438cd16e58a8867919", { fields: ["CATEGORY", "UNITID"] }],
  ["racks", "Bicycle Racks", "objects", "a7f7c15a5fee435aa2a3aed7cbac86be"],
  ["litter", "Public Litter and Recycling Cans", "objects", feature("Active_Public_Litter_and_Recycling_Cans", 6)],
  ["art", "Public Art Installations", "objects", "8d0ddb56f318457ba84cbc3330bb5386", { fields: ["TITLE", "ARTIST", "NAME"] }],
  ["trees", "SDOT Trees", "parks", "2af217e7c29b4f0298df2119a418d59e", { fields: ["COMMON_NAME", "COMMONNAME", "SCIENTIFIC_NAME", "BOTANICAL_NAME", "DIAMETER", "DBH"] }],
  ["parklets", "Parklets", "parks", "6fb431057aa64f78805c32c1b4b1e7cf", { inService: true }],
  ["benches", "Park Benches", "parks", "5ac4bb77ca6c44028dd2891209ac1509", { fields: ["BENCH_NAME", "BENCH_MATERIAL", "LIFECYCLESTATUSTXT"] }],
  ["fountains", "Drinking Fountains", "parks", "703a15f2fd924cb4beab92b0c28d7c07", { fields: ["DRINK_FTN_MATERIAL", "SDQL"] }],
  ["play", "Play Equipment", "parks", "72e2330a983e4c2dbb0f294abf33e250"],
  ["park-signs", "Park Signs", "parks", "5e208690eeae4cf6a98bcdfc4c7f0d10"],
  ["planters", "Seattle Waterfront Planters", "parks", "5261f018000e426bafcbd4f47201202c"],
  ["inlets", "Drain Inlets", "water", feature("SPU_DWW_Catch_Basins_Inlets_Junction_Boxes_Sandboxes_and_Trash_Racks", 3)],
  ["gutters", "Surface Drainage Curb and Gutter", "water", "eebbc3c225f0419a87dc64cadb2bbc08"],
  ["areaways", "Areaways", "water", "47979b6bf5c54709b5b387c96a6205d4", { fields: ["UNITID", "UNITDESC", "UNITDESC_ASSET"] }],
  ["observations", "Sidewalk Observations", "records", feature("Sidewalk_Observation", 0), { fields: ["OBSERVATION_TYPE", "OBSTYPE", "OBS_TYPE", "OBSERVATION", "SIDEWALK_UNITID"] }],
];

const detailRows = [
  ["parcels", "Tax Parcel Boundaries", "ground", feature("Parcel_Boundary", 0), { fields: ["PIN"] }],
  ["tree-crowns", "2021 Tree Crowns", "parks", feature("TreeCrowns_2021_Seattle", 0), { color: "#5e8d3d", fields: ["TYPE"] }],
  ["landscapes", "Landscape Complexes", "parks", feature("Landscape_Complexes_CDL", 0), { inService: true, fields: ["UNITDESC", "UNITTYPE"] }],
  ["vertical-elements", "Curbs and Barriers", "paint", feature("SDOT_Channelization_view", 0), { color: "#b6923e", fields: ["TYPE", "CURBPROFILE", "HEIGHT"] }],
  ["lane-width", "Recorded Lane Widths", "paint", feature("SDOT_Channelization_view", 1), { color: "#99722e", fields: ["LANEWIDTH"], where: "LaneWidth IS NOT NULL AND LaneWidth NOT IN ('', '-')" }],
  ["road-design", "Channelization Background Lines", "paint", feature("SDOT_Channelization_view", 2), { fields: ["USEDESIGNATION", "DATACONFIDENCE"] }],
  ["panel-markings", "Road Panel Markings", "paint", feature("SDOT_Channelization_view", 3), { fields: ["TYPE", "MATERIAL"] }],
  ["curb-categories", "Loading, Clearance and Other Curb Uses", "paint", feature("Curb_Space_Categories", 6), { fields: ["SPACETYPEDESC", "SPACELENGTH", "SIDE"], where: "UPPER(SPACETYPEDESC) IN ('CLEARANCE', 'NO PARKING', 'DRIVEWAY', 'TOW AWAY ZONE', 'ALLEY', 'COMMERCIAL VEHICLE LOAD ZONE', 'PASSENGER LOAD ZONE')" }],
  ["blockface", "Blockface Parking Records", "paint", feature("Blockface", 1), { fields: ["PARKING_CATEGORY", "BLOCKFACE_LENGTH", "PAID_SPACES", "START_TIME_WKD", "END_TIME_WKD"] }],
  ["one-way", "One-Way Street Records", "routes", feature("One_Way_Streets_CDL", 0), { fields: ["STNAME"] }],
  ["layovers", "Curbspace Transit Layovers", "routes", feature("Curbspace_Transit_Layover", 0), { fields: ["STOPTYPE", "STOPID", "STARTTIME1", "ENDTIME1"] }],
  ["poles", "Seattle City Light Poles", "objects", feature("Seattle_City_Light_Poles_PROD", 1), { color: "#775897", fields: ["ASSET_ID", "FACILITYTYPE", "HAS_STREETLIGHT"] }],
  ["detectors", "Traffic Detectors", "objects", feature("Traffic_Detectors_CDL", 0), { inService: true, fields: ["UNITID", "UNITTYPE"] }],
  ["other-structures", "Miscellaneous Structures", "objects", feature("Miscellaneous_Structures", 0), { inService: true, fields: ["CATEGORY", "MATERIAL", "ASSET_HEIGHT"] }],
  ["irrigation", "Irrigation Systems", "water", feature("Irrigation_Systems_CDL", 0), { inService: true, fields: ["CATEGORY", "UNITID"] }],
  ["basins", "Catch Basins", "water", feature("SPU_DWW_Catch_Basins_Inlets_Junction_Boxes_Sandboxes_and_Trash_Racks", 2), { fields: ["CB_FEATYPE_TEXT", "CB_ROLE_TYPE"] }],
  ["water-quality", "Water Quality Structure Outlines", "water", feature("SPU_DWW_Water_Quality_Structures", 2)],
  ["green-stormwater", "Green Stormwater Records", "water", feature("Seattle_Green_Stormwater_Infrastructure", 1)],
  ["potholes", "Pothole Work Orders", "records", feature("Pothole_Status", 0), { fields: ["WO_STATUS", "RESULTDESC", "LAST90DAYRPRD"] }],
  ["pavement-restrictions", "Pavement Moratoriums", "records", feature("DotMaps_Pavement_Moratorium", 0), { fields: ["MORA_STATUS"] }],
  ["streetlight-repairs", "Streetlight Repair Tasks", "records", feature("Streetlight_Repair_Status", 0), { fields: ["TASK_STATUS", "STREET_ADDRESS"] }],
  ["residential-permits", "Residential Permit Records", "records", feature("Residential_Building_Permits_Issued_not_yet_complete", 0), { fields: ["CONSTRUCTION_ACTION_TYPE", "APTYPE"] }],
  ["buildings-1993", "Building Outlines 1993", "history", feature("Building_Outline_1993", 0), { color: "#be657d" }],
  ["buildings-2015", "Building Outlines 2015", "history", feature("Building_Outline_2015", 0), { color: "#ae8af0" }],
  ["parking-archive", "Temporary No Parking Archive", "history", feature("Temporary_No_Parking_1", 2), { fields: ["START_DATE_TIME", "END_DATE_TIME"] }],
];

export const layers = [...rows, ...detailRows].map(([id, title, groupId, source, options = {}], index) => {
  const group = groups.find(({ id: candidate }) => candidate === groupId);
  const isService = source.startsWith("https://");
  return {
    id, title, group,
    scale: group.scale,
    type: "feature",
    detailOnly: index >= rows.length,
    fields: [],
    ...options,
    ...(isService ? { url: source } : { portalItem: { id: source } }),
    source: isService ? source : `https://seattlecitygis.maps.arcgis.com/home/item.html?id=${source}`,
  };
});
