import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const EARTH_RADIUS = 6_371_000;
const RELIEF_SCALE = 40 / EARTH_RADIUS;
const DEG = Math.PI / 180;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const viewports = {
  pacific: { longitude: -166, latitude: 12, distance: 3.45 },
  hawaii: { longitude: -164, latitude: 26, distance: 1.77 },
  mariana: { longitude: 144, latitude: 14, distance: 1.57 },
};

const viewport = document.querySelector('#viewport');
const message = document.querySelector('#scene-message');
const status = document.querySelector('#terrain-status');
const flipButton = document.querySelector('#flip');
const flipLabel = document.querySelector('#flip-label');
const gridOption = document.querySelector('#sea-level');
const exampleElevation = document.querySelector('#example-elevation');
const exampleDescription = document.querySelector('#example-description');
const mapLabels = document.querySelector('.map-labels');
const viewButtons = [...document.querySelectorAll('[data-view]')];

function coordinates(longitude, latitude, radius = 1) {
  const lon = longitude * DEG;
  const lat = latitude * DEG;
  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
  );
}

async function loadTerrain() {
  const response = await fetch(new URL('./data/terrain.json', import.meta.url));
  if (!response.ok) throw new Error(`Terrain request returned ${response.status}`);
  const { width, height, samples } = await response.json();
  const bytes = Uint8Array.fromBase64 ? Uint8Array.fromBase64(samples) : Uint8Array.from(atob(samples), (byte) => byte.charCodeAt(0));
  if (width < 2 || height < 2 || bytes.byteLength !== width * height * 2) {
    throw new Error('Invalid elevation grid dimensions');
  }
  const packed = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ocean = new Float32Array(width * height);
  const land = new Float32Array(width * height);
  for (let i = 0; i < ocean.length; i += 1) {
    const sample = packed.getUint16(i * 2, true);
    const elevation = (sample & 0x7fff) - 16384;
    (sample & 0x8000 ? ocean : land)[i] = elevation;
  }
  return { width, height, ocean, land };
}

function interpolate(values, index, width, dx, dy) {
  const south = THREE.MathUtils.lerp(values[index], values[index + 1], dx);
  const north = THREE.MathUtils.lerp(values[index + width], values[index + width + 1], dx);
  return THREE.MathUtils.lerp(south, north, dy);
}

function sampleHeight({ width, height, ocean, land }, u, v) {
  const x = THREE.MathUtils.clamp(u, 0, 1) * (width - 1);
  const y = v * (height - 1);
  const col = Math.min(Math.floor(x), width - 2);
  const row = Math.min(Math.floor(y), height - 2);
  const index = row * width + col;
  const depth = interpolate(ocean, index, width, x - col, y - row);
  const altitude = interpolate(land, index, width, x - col, y - row) + depth;
  return { altitude, isOcean: depth < 0 && altitude < 0 };
}

function globeGeometry(grid) {
  const segments = matchMedia('(pointer: coarse)').matches ? 480 : 640;
  const sphere = new THREE.SphereGeometry(1, segments, segments / 2);
  const uv = sphere.getAttribute('uv');
  const vertices = Array.from(sphere.getAttribute('position').array);
  const elevations = [];
  const shoreHeights = new Float32Array(uv.count);
  for (let i = 0; i < uv.count; i += 1) {
    const { altitude, isOcean } = sampleHeight(grid, uv.getX(i), uv.getY(i));
    shoreHeights[i] = isOcean ? altitude : Math.abs(altitude);
    elevations.push(isOcean ? 0 : altitude, isOcean ? altitude : 0);
  }

  // Split coastal faces at the original zero contour. Shared shoreline vertices
  // stay at radius 1 throughout the flip, including while ocean relief is flat.
  const coastVertices = new Map();
  const point = new THREE.Vector3();
  const otherPoint = new THREE.Vector3();
  function coastBetween(a, b) {
    if (shoreHeights[a] === 0) return a;
    if (shoreHeights[b] === 0) return b;
    const key = Math.min(a, b) * uv.count + Math.max(a, b);
    if (!coastVertices.has(key)) {
      const ratio = shoreHeights[a] / (shoreHeights[a] - shoreHeights[b]);
      point.fromArray(vertices, a * 3).lerp(otherPoint.fromArray(vertices, b * 3), ratio).normalize();
      coastVertices.set(key, vertices.length / 3);
      vertices.push(point.x, point.y, point.z);
      elevations.push(0, 0);
    }
    return coastVertices.get(key);
  }

  const triangles = [];
  const indexes = sphere.index.array;
  for (let i = 0; i < indexes.length; i += 3) {
    let a = indexes[i];
    let b = indexes[i + 1];
    let c = indexes[i + 2];
    const aOcean = shoreHeights[a] < 0;
    const bOcean = shoreHeights[b] < 0;
    const cOcean = shoreHeights[c] < 0;
    if (aOcean === bOcean && aOcean === cOcean) {
      triangles.push(a, b, c);
      continue;
    }
    // Rotate the triangle so its lone land or ocean corner is first.
    if (aOcean === bOcean) [a, b, c] = [c, a, b];
    else if (aOcean === cOcean) [a, b, c] = [b, c, a];
    const ab = coastBetween(a, b);
    const ac = coastBetween(a, c);
    triangles.push(a, ab, ac, ab, b, c, ab, c, ac);
  }
  sphere.dispose();

  const globe = new THREE.BufferGeometry();
  const positions = new THREE.Float32BufferAttribute(vertices, 3);
  globe.setIndex(triangles);
  for (const [name, factor] of [['measuredNormal', 1], ['invertedNormal', -1]]) {
    const displaced = positions.clone();
    for (let i = 0; i < positions.count; i += 1) {
      const radius = 1 + (elevations[2 * i] + factor * elevations[2 * i + 1]) * RELIEF_SCALE;
      displaced.setXYZ(i, positions.getX(i) * radius, positions.getY(i) * radius, positions.getZ(i) * radius);
    }
    globe.setAttribute('position', displaced);
    globe.computeVertexNormals();
    globe.setAttribute(name, globe.getAttribute('normal'));
    globe.deleteAttribute('normal');
  }
  globe.setAttribute('position', positions);
  globe.setAttribute('elevations', new THREE.Float32BufferAttribute(elevations, 2));
  // Displacement occurs in the shader. Include its maximum extent in CPU culling.
  globe.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.08);
  return globe;
}

function terrainMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uFlip: { value: 1 }, uScale: { value: RELIEF_SCALE } },
    vertexShader: `
      attribute vec2 elevations;
      attribute vec3 measuredNormal;
      attribute vec3 invertedNormal;
      uniform float uFlip;
      uniform float uScale;
      varying vec2 vElevations;
      varying vec3 vPoint;
      varying vec3 vNormal;
      void main() {
        vElevations = elevations;
        float height = elevations.x + elevations.y * uFlip;
        vNormal = normalize(mix(measuredNormal, invertedNormal, (1.0 - uFlip) * 0.5));
        vPoint = position * (1.0 + height * uScale);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPoint, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uFlip;
      varying vec2 vElevations;
      varying vec3 vPoint;
      varying vec3 vNormal;
      void main() {
        vec3 radial = normalize(vPoint);

        float land = vElevations.x;
        float depth = -vElevations.y;
        float ocean = smoothstep(0.0, 95.0, depth);
        float seaValue = clamp(depth / 8200.0, 0.0, 1.0);
        vec3 marine = mix(vec3(0.032, 0.27, 0.34), vec3(0.009, 0.037, 0.094), pow(seaValue, 0.57));
        vec3 raised = mix(vec3(0.12, 0.053, 0.025), vec3(0.88, 0.45, 0.155), pow(seaValue, 0.71));
        vec3 level = vec3(0.071, 0.148, 0.174);
        vec3 sea = mix(level, marine, max(uFlip, 0.0));
        sea = mix(sea, raised, max(-uFlip, 0.0));
        vec3 dry = mix(vec3(0.095, 0.123, 0.138), vec3(0.26, 0.295, 0.287), clamp(land / 4800.0, 0.0, 1.0));
        dry = mix(dry, vec3(0.32, 0.38, 0.40), smoothstep(0.73, 0.96, abs(radial.y)) * 0.8);

        float contour = abs(fract(depth / 1000.0 + 0.5) - 0.5);
        float line = 1.0 - smoothstep(0.0, max(0.013, fwidth(depth / 1000.0) * 0.77), contour);
        sea += vec3(0.036) * line * smoothstep(90.0, 650.0, depth) * abs(uFlip);

        vec3 normal = normalize(mix(vNormal, radial, mix(0.30, 0.12, ocean)));
        vec3 sight = normalize(cameraPosition - vPoint);
        vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), sight));
        vec3 light = normalize(sight * 0.75 + vec3(0.0, 0.56, 0.0) - east * 0.43);
        float brightness = 0.42 + 0.66 * max(0.0, dot(normal, light));
        float edge = pow(1.0 - max(0.0, dot(radial, sight)), 3.6);
        vec3 color = mix(dry, sea, ocean) * brightness + vec3(0.027, 0.046, 0.055) * edge;
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

function seaLevelReference() {
  const radius = 1.00055;
  const reference = new THREE.Group();
  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 160, 80),
    new THREE.MeshBasicMaterial({ color: 0x99dfeb, opacity: 0.035, transparent: true, depthWrite: false }),
  );
  reference.add(surface);

  const vertices = [];
  function addSegment(from, to) {
    vertices.push(...from.toArray(), ...to.toArray());
  }
  for (let longitude = -180; longitude < 180; longitude += 30) {
    for (let latitude = -90; latitude < 90; latitude += 2) {
      addSegment(coordinates(longitude, latitude, radius), coordinates(longitude, latitude + 2, radius));
    }
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    for (let longitude = -180; longitude < 180; longitude += 2) {
      addSegment(coordinates(longitude, latitude, radius), coordinates(longitude + 2, latitude, radius));
    }
  }
  const grid = new THREE.BufferGeometry();
  grid.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const lines = new THREE.LineSegments(grid, new THREE.LineBasicMaterial({
    color: 0xabd6e1, transparent: true, opacity: 0.26, depthWrite: false,
  }));
  lines.renderOrder = 1;
  reference.add(lines);
  return reference;
}

function showRelief(amount) {
  const elevation = Math.round(-8 * amount * 10) / 10;
  const prefix = elevation === 0 ? '' : elevation < 0 ? '−' : '+';
  exampleElevation.textContent = `${prefix}${Math.abs(elevation)} km`;
  if (elevation < 0) exampleDescription.textContent = `${Math.abs(elevation)} km below sea level`;
  else if (elevation > 0) exampleDescription.textContent = `${elevation} km above sea level`;
  else exampleDescription.textContent = 'At sea level';
}

function attachGlobe(renderer, globe, material, grid) {
  const scene = new THREE.Scene();
  const terrain = new THREE.Mesh(globe, material);
  const reference = seaLevelReference();
  scene.add(terrain, reference);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 14);
  camera.position.copy(coordinates(viewports.pacific.longitude, viewports.pacific.latitude, viewports.pacific.distance));
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Interactive 3D relief globe');
  canvas.setAttribute('aria-describedby', 'keyboard-navigation');
  viewport.prepend(canvas);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = 1.24;
  controls.maxDistance = 7;
  controls.rotateSpeed = 0.56;
  controls.zoomSpeed = 0.85;
  controls.update();

  const labels = [
    { id: 'hawaii', longitude: -155.65, latitude: 19.56 },
    { id: 'mariana', longitude: 142.2, latitude: 11.34 },
  ].map(({ id, longitude, latitude }) => ({
    element: document.querySelector(`#label-${id}`),
    radial: coordinates(longitude, latitude),
    ...sampleHeight(grid, (longitude + 180) / 360, (latitude + 90) / 180),
  }));
  const projected = new THREE.Vector3();
  let activeView = 'pacific';
  let inverted = false;
  let transition = null;
  let cameraMove = null;
  let frame = 0;

  function setActiveView(view) {
    activeView = view;
    for (const button of viewButtons) button.setAttribute('aria-pressed', String(button.dataset.view === view));
  }

  function viewPosition(view) {
    const { longitude, latitude, distance } = viewports[view];
    const fitted = view === 'pacific' ? distance / Math.min(1, camera.aspect) : distance;
    return coordinates(longitude, latitude, Math.min(controls.maxDistance, fitted));
  }

  function updateLabels() {
    const { width, height } = canvas.getBoundingClientRect();
    for (const { element, radial, altitude, isOcean } of labels) {
      const heightOnGlobe = isOcean ? altitude * material.uniforms.uFlip.value : altitude;
      projected.copy(radial).multiplyScalar(1.007 + RELIEF_SCALE * heightOnGlobe).project(camera);
      const visible = radial.dot(camera.position) > 1.10 && Math.abs(projected.x) < 0.92 && Math.abs(projected.y) < 0.90;
      element.hidden = !visible;
      if (visible) {
        element.style.left = `${(projected.x + 1) * width / 2}px`;
        element.style.top = `${(1 - projected.y) * height / 2}px`;
        element.classList.toggle('left', projected.x > 0.54);
      }
    }
  }

  function queueDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function ease(amount) {
    return amount * amount * (3 - 2 * amount);
  }

  function draw(now) {
    frame = 0;
    if (transition) {
      const progress = Math.min(1, (now - transition.start) / 1000);
      const amount = THREE.MathUtils.lerp(transition.from, transition.to, ease(progress));
      material.uniforms.uFlip.value = amount;
      showRelief(amount);
      if (progress === 1) {
        transition = null;
        status.textContent = inverted ? 'Inverted relief' : 'Measured relief';
      }
    }
    if (cameraMove) {
      const progress = Math.min(1, (now - cameraMove.start) / 750);
      const fraction = ease(progress);
      camera.position.copy(cameraMove.direction).applyQuaternion(
        new THREE.Quaternion().slerp(cameraMove.rotation, fraction),
      ).multiplyScalar(THREE.MathUtils.lerp(cameraMove.fromDistance, cameraMove.toDistance, fraction));
      if (progress === 1) cameraMove = null;
      controls.update();
    }
    renderer.render(scene, camera);
    updateLabels();
    if (transition || cameraMove) queueDraw();
  }

  function goTo(view) {
    const next = viewPosition(view);
    setActiveView(view);
    if (reducedMotion.matches) {
      camera.position.copy(next);
      controls.update();
    } else {
      const direction = camera.position.clone().normalize();
      cameraMove = {
        start: performance.now(), direction,
        rotation: new THREE.Quaternion().setFromUnitVectors(direction, next.clone().normalize()),
        fromDistance: camera.position.length(), toDistance: next.length(),
      };
    }
    queueDraw();
  }

  function resize() {
    const { width, height } = viewport.getBoundingClientRect();
    if (!width || !height) return;
    const aspectChanged = camera.aspect !== width / height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (activeView && aspectChanged) {
      cameraMove = null;
      camera.position.copy(viewPosition(activeView));
      controls.update();
    }
    // Keep high-DPI screens sharp without driving the terrain at full device resolution.
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setSize(width, height, false);
    queueDraw();
  }

  controls.addEventListener('start', () => {
    cameraMove = null;
    setActiveView(null);
  });
  controls.addEventListener('change', queueDraw);
  for (const button of viewButtons) button.addEventListener('click', () => goTo(button.dataset.view));
  gridOption.addEventListener('change', () => {
    reference.visible = gridOption.checked;
    queueDraw();
  });
  reference.visible = gridOption.checked;

  flipButton.addEventListener('click', () => {
    inverted = !inverted;
    flipButton.setAttribute('aria-pressed', String(inverted));
    flipLabel.textContent = inverted ? 'Restore seafloor' : 'Turn inside out';
    document.body.classList.toggle('inverted', inverted);
    const target = inverted ? -1 : 1;
    if (reducedMotion.matches) {
      material.uniforms.uFlip.value = target;
      transition = null;
      showRelief(target);
      status.textContent = inverted ? 'Inverted relief' : 'Measured relief';
    } else {
      transition = { start: performance.now(), from: material.uniforms.uFlip.value, to: target };
      status.textContent = inverted ? 'Inverting relief…' : 'Restoring relief…';
    }
    queueDraw();
  });

  canvas.addEventListener('keydown', (event) => {
    const moves = { ArrowLeft: [-0.10, 0], ArrowRight: [0.10, 0], ArrowUp: [0, -0.10], ArrowDown: [0, 0.10] };
    if (event.key === 'Home') {
      event.preventDefault();
      goTo('pacific');
    } else if (Object.hasOwn(moves, event.key) || ['+', '=', '-'].includes(event.key)) {
      event.preventDefault();
      cameraMove = null;
      setActiveView(null);
      const orbit = new THREE.Spherical().setFromVector3(camera.position);
      if (Object.hasOwn(moves, event.key)) {
        const [longitude, latitude] = moves[event.key];
        orbit.theta += longitude;
        orbit.phi += latitude;
        orbit.makeSafe();
      } else {
        orbit.radius = THREE.MathUtils.clamp(orbit.radius * (event.key === '-' ? 1.12 : 0.89), controls.minDistance, controls.maxDistance);
      }
      camera.position.setFromSpherical(orbit);
      controls.update();
    }
  });

  new ResizeObserver(resize).observe(viewport);
  resize();
  mapLabels.hidden = false;
  message.hidden = true;
  status.textContent = 'Measured relief';
  for (const control of [flipButton, gridOption, ...viewButtons]) control.disabled = false;
}

async function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (error) {
    status.textContent = '3D unavailable';
    message.textContent = 'This browser could not start WebGL 2. Open the map in a browser with hardware acceleration enabled.';
    console.error(error);
    return;
  }
  try {
    const grid = await loadTerrain();
    attachGlobe(renderer, globeGeometry(grid), terrainMaterial(), grid);
  } catch (error) {
    renderer.dispose();
    status.textContent = 'Terrain unavailable';
    message.textContent = 'The elevation grid could not be loaded. Reload the map to try again.';
    console.error(error);
  }
}

start();
