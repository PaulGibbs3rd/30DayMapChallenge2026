// Keep the shoreline and street hierarchy. The 3D city supplies the building geometry.
const source = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer";

export default {
  version: 8,
  sources: { esri: { type: "vector", url: source } },
  layers: [
    { id: "Bay", type: "background", paint: { "background-color": "#060606" } },
    {
      id: "Land", type: "fill", source: "esri", "source-layer": "Land",
      paint: { "fill-color": "#686868" },
    },
    {
      id: "Parks", type: "fill", source: "esri", "source-layer": "Park or farming", minzoom: 11,
      paint: { "fill-color": "#525252" },
    },
    {
      id: "Water", type: "fill", source: "esri", "source-layer": "Water area",
      filter: ["==", "_symbol", 7], paint: { "fill-color": "#060606" },
    },
    {
      id: "Project streets", type: "line", source: "esri", "source-layer": "Road",
      filter: ["all", ["in", "_symbol", 5, 6, 7, 8, 9], ["!in", "Viz", 3]], minzoom: 12,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#828282", "line-width": { stops: [[12, 0.45], [16, 2.7], [19, 10]] } },
    },
    {
      id: "Arterials", type: "line", source: "esri", "source-layer": "Road",
      filter: ["all", ["in", "_symbol", 0, 1, 2, 3, 4], ["!in", "Viz", 3]], minzoom: 11,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#8b8b8b", "line-width": { stops: [[11, 0.55], [16, 3.9], [19, 14]] } },
    },
  ],
};
