import '@arcgis/map-components/components/arcgis-scene';
import '@arcgis/map-components/components/arcgis-compass';
import '@arcgis/map-components/components/arcgis-zoom';
import Camera from '@arcgis/core/Camera.js';
import Basemap from '@arcgis/core/Basemap.js';
import Ground from '@arcgis/core/Ground.js';
import WebScene from '@arcgis/core/WebScene.js';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer.js';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer.js';
import Point from '@arcgis/core/geometry/Point.js';
import SpatialReference from '@arcgis/core/geometry/SpatialReference.js';
import SolidEdges3D from '@arcgis/core/symbols/edges/SolidEdges3D.js';
import buildingsUrl from '../data/portland-buildings.geojson?url';
import './scene-fpv-drone';
import './style.css';

const scene = document.querySelector('arcgis-scene')!;
scene.map = new WebScene({
  basemap: new Basemap({ baseLayers: [new TileLayer({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
  })] }),
  ground: new Ground({ layers: [new ElevationLayer({
    url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
  })] }),
  layers: [new GeoJSONLayer({
    title: 'Portland buildings', url: new URL(buildingsUrl, document.baseURI).href,
    copyright: 'City of Portland, Bureau of Planning and Sustainability',
    popupEnabled: false, elevationInfo: { mode: 'on-the-ground' },
    renderer: {
      type: 'simple',
      symbol: { type: 'polygon-3d', symbolLayers: [{ type: 'extrude', material: { color: '#b7c9c6' }, edges: new SolidEdges3D({ color: [44, 62, 65, .35], size: .55 }) }] },
      visualVariables: [{ type: 'size', field: 'heightM', valueUnit: 'meters' }],
    },
  })],
});
void scene.viewOnReady().then(() => {
  scene.view.camera = new Camera({
    position: new Point({ longitude: -122.67560, latitude: 45.51280, z: 360, spatialReference: SpatialReference.WGS84 }),
    heading: 22,
    tilt: 57,
  });
}).catch(() => { /* The drone panel reports scene initialization failures. */ });
