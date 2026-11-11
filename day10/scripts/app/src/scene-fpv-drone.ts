import '@arcgis/core/assets/esri/themes/light/main.css';
import '@esri/calcite-components/main.css';
import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-notice';
import Camera from '@arcgis/core/Camera.js';
import Graphic from '@arcgis/core/Graphic.js';
import Extent from '@arcgis/core/geometry/Extent.js';
import Point from '@arcgis/core/geometry/Point.js';
import SpatialReference from '@arcgis/core/geometry/SpatialReference.js';
import ObjectSymbol3DLayer from '@arcgis/core/symbols/ObjectSymbol3DLayer.js';
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D.js';
import SceneView from '@arcgis/core/views/SceneView.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import type ArcGISMap from '@arcgis/core/Map.js';
import type ElevationSampler from '@arcgis/core/layers/support/ElevationSampler.js';
import { fly, initialPose, launchFrame, LIMITS, parseLaunch, STEP, stop } from './flight';
import type { FlightInput, Pose } from './flight';
import css from './drone.css?inline';

export type DroneState = 'loading' | 'ready' | 'starting' | 'flying' | 'paused' | 'error';
type Action = 'takeoff' | 'pause' | 'resume' | 'reset' | 'end' | 'retry' | 'follow';
type Handle = { remove(): void };
type Frame = ReturnType<typeof launchFrame>;
type FlightPosition = Pick<Pose, 'east' | 'north' | 'z'>;
const owners = new WeakMap<HTMLArcgisSceneElement, SceneFpvDrone>();
const TAG = 'scene-fpv-drone';
const NO_DATA = -999999;
const MAPPED = new Set(['w', 's', 'a', 'd', 'q', 'e', 'c', 'arrowup', 'arrowdown', ' ', 'escape']);
const FOLLOW_HEIGHT = 165;
const FOLLOW_DISTANCE = 140;
const FOLLOW_TILT = Math.atan2(FOLLOW_DISTANCE, FOLLOW_HEIGHT) * 180 / Math.PI;
const displayNames: Record<DroneState, string> = {
  loading: 'Connecting', ready: 'Standby', starting: 'Starting', flying: 'Flying', paused: 'Paused', error: 'Unavailable',
};

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>
  <section class="console calcite-mode-dark" aria-labelledby="fpv-title">
    <header class="header"><h2 id="fpv-title">FPV drone</h2><span class="phase" role="status"></span></header>
    <div class="screen" tabindex="0" role="group" aria-label="FPV flight controls" aria-describedby="fpv-keys" hidden>
      <slot name="fpv-feed"></slot><span class="view-label">SIMULATED FPV</span><span class="aim" aria-hidden="true">+</span>
    </div>
    <dl class="telemetry" hidden>
      <div><dt>Heading</dt><dd data-reading="heading">—</dd></div>
      <div><dt>Height AGL</dt><dd data-reading="height">—</dd></div>
      <div><dt>Speed</dt><dd data-reading="speed">—</dd></div>
    </dl>
    <div class="deck">
      <p class="message"></p>
      <calcite-notice kind="warning" scale="s" hidden><span slot="message" class="error-message"></span></calcite-notice>
      <div class="actions">
        <calcite-button data-action="takeoff" scale="s" icon-start="play" hidden>Take off</calcite-button>
        <calcite-button data-action="pause" scale="s" icon-start="pause" hidden>Pause</calcite-button>
        <calcite-button data-action="resume" scale="s" icon-start="play" hidden>Resume</calcite-button>
        <calcite-button data-action="follow" scale="s" appearance="outline" hidden>Follow drone</calcite-button>
        <calcite-button data-action="reset" scale="s" appearance="outline" hidden>Reset to launch</calcite-button>
        <calcite-button data-action="end" scale="s" appearance="transparent" hidden>End flight</calcite-button>
        <calcite-button data-action="retry" scale="s" hidden>Retry</calcite-button>
      </div>
      <details class="controls"><summary>Keyboard controls</summary>
        <ul id="fpv-keys"><li><kbd>W</kbd>/<kbd>S</kbd> forward/back · <kbd>A</kbd>/<kbd>D</kbd> strafe</li>
        <li><kbd>Space</kbd> throttle · hold to climb, release to descend</li>
        <li><kbd>Q</kbd>/<kbd>E</kbd> turn · <kbd>↑</kbd>/<kbd>↓</kbd> FPV tilt</li>
        <li><kbd>C</kbd> toggle map follow · <kbd>Esc</kbd> pause</li></ul>
      </details>
    </div>
  </section>`;

function deadline<T>(promise: Promise<T>, signal: AbortSignal, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => finish(() => reject(signal.reason));
    const finish = (callback: () => void) => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      callback();
    };
    const timer = setTimeout(() => finish(() => reject(new Error(message))), ms);
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
    promise.then((value) => finish(() => resolve(value)), (error: unknown) => finish(() => reject(error)));
  });
}

function aircraft() {
  const body = new ObjectSymbol3DLayer({ resource: { primitive: 'cube' }, width: 3, depth: 5.4, height: 1.3, material: { color: '#073946' }, anchor: 'center' });
  const cross = new ObjectSymbol3DLayer({ resource: { primitive: 'cube' }, width: 8.5, depth: 1.1, height: .6, material: { color: '#183b48' }, anchor: 'center' });
  const nose = new ObjectSymbol3DLayer({
    resource: { primitive: 'cube' }, width: 2.6, depth: 6.4, height: 1.2,
    material: { color: '#ffba5b', emissive: { source: 'color', strength: .6 } },
    anchor: 'relative', anchorPosition: { x: 0, y: -.85, z: 0 },
  });
  const rotors = [-1, 1].map((side) => new ObjectSymbol3DLayer({
    resource: { primitive: 'cylinder' }, width: 3, depth: 3, height: .35, material: { color: '#64efd0' },
    anchor: 'relative', anchorPosition: { x: side * 1.35, y: 0, z: -1.6 },
  }));
  const layers = [body, cross, nose, ...rotors];
  return new Graphic({ symbol: new PointSymbol3D({ symbolLayers: layers }) });
}

export class SceneFpvDrone extends HTMLElement {
  static observedAttributes = ['follow-drone'];
  #state: DroneState = 'loading';
  #ui = this.attachShadow({ mode: 'open' });
  #screen: HTMLElement;
  #telemetry: HTMLElement;
  #phase: HTMLElement;
  #message: HTMLElement;
  #notice: HTMLCalciteNoticeElement;
  #buttons: Record<Action, HTMLCalciteButtonElement>;
  #readings: Record<'heading' | 'height' | 'speed', HTMLElement>;
  #keys = new Set<string>();
  #connection: AbortController | null = null;
  #binding: AbortController | null = null;
  #operation: AbortController | null = null;
  #host: HTMLArcgisSceneElement | null = null;
  #view: SceneView | null = null;
  #map: ArcGISMap | null = null;
  #hostWatch: Handle | null = null;
  #fatalWatch: Handle | null = null;
  #feedWatch: Handle | null = null;
  #feed: SceneView | null = null;
  #inset: HTMLDivElement | null = null;
  #sampler: ElevationSampler | null = null;
  #frame: Frame | null = null;
  #pose: Pose | null = null;
  #spawn: Pose | null = null;
  #aircraft: ReturnType<typeof aircraft> | null = null;
  #drawn: Pose | null = null;
  #followTarget: (FlightPosition & { heading: number }) | null = null;
  #frameId = 0;
  #lastFrame = 0;
  #accumulated = 0;
  #lastTelemetry = 0;
  #retry: 'bind' | 'launch' | 'feed' | null = null;
  #mounted = false;

  get state(): DroneState { return this.#state; }

  constructor() {
    super();
    this.#ui.append(template.content.cloneNode(true));
    const find = <T extends HTMLElement>(selector: string) => this.#ui.querySelector<T>(selector)!;
    this.#screen = find('.screen'); this.#telemetry = find('.telemetry'); this.#phase = find('.phase');
    this.#message = find('.message'); this.#notice = find<HTMLCalciteNoticeElement>('calcite-notice');
    this.#readings = { heading: find('[data-reading="heading"]'), height: find('[data-reading="height"]'), speed: find('[data-reading="speed"]') };
    const actions = ['takeoff', 'pause', 'resume', 'reset', 'end', 'retry', 'follow'] as const;
    this.#buttons = Object.fromEntries(actions.map((action) => [action, find<HTMLCalciteButtonElement>(`[data-action="${action}"]`)])) as Record<Action, HTMLCalciteButtonElement>;
    for (const action of actions) this.#buttons[action].addEventListener('click', () => this.#act(action));
    this.#screen.addEventListener('keydown', (event) => this.#onKey(event));
    this.#screen.addEventListener('keyup', (event) => this.#onKey(event));
    this.#screen.addEventListener('blur', (event) => {
      this.#pause('focus-lost', 'Flight paused. Select Resume to fly.');
      if (event.relatedTarget === this.#buttons.pause && this.#state === 'paused') this.#focus('resume');
    });
  }

  attributeChangedCallback() {
    this.#followTarget = null;
    const enabled = this.hasAttribute('follow-drone');
    this.#buttons.follow.textContent = enabled ? 'Stop following' : 'Follow drone';
    if (enabled && (this.#state === 'flying' || this.#state === 'paused')) this.#updateObserver(0);
  }

  connectedCallback() {
    const connection = new AbortController();
    this.#connection = connection;
    const { signal } = connection;
    const blur = () => this.#pause('focus-lost', 'Flight paused. Select Resume to fly.');
    window.addEventListener('blur', blur, { signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) blur(); }, { signal });
    void this.#connect(signal);
  }

  disconnectedCallback() {
    this.#connection?.abort(); this.#connection = null;
    this.#binding?.abort(); this.#binding = null;
    this.#hostWatch?.remove(); this.#hostWatch = null;
    this.#fatalWatch?.remove(); this.#fatalWatch = null;
    this.#end();
    if (this.#host && owners.get(this.#host) === this) owners.delete(this.#host);
    this.#host = null; this.#view = null; this.#map = null;
    this.#mounted = false;
  }

  async #connect(signal: AbortSignal) {
    this.#retry = null;
    this.#status('loading', 'connecting', 'Connecting to the 3D scene…');
    if (this.parentElement?.localName !== 'arcgis-scene') {
      this.#status('error', 'missing-scene', 'Place the drone directly inside an ArcGIS Scene component.', true);
      return;
    }
    try {
      await deadline(customElements.whenDefined('arcgis-scene'), signal, 15000, 'The ArcGIS Scene component was not loaded.');
      if (signal.aborted) return;
      const host = this.parentElement as HTMLArcgisSceneElement;
      if (owners.has(host) && owners.get(host) !== this) {
        this.#status('error', 'duplicate-drone', 'This scene already has a drone component.', true);
        return;
      }
      owners.set(host, this);
      this.#host = host;
      const sizePanel = (width: number) => {
        if (width > 0) this.style.setProperty('--drone-scene-width', `${Math.max(1, width - (width < 480 ? 76 : 32))}px`);
      };
      sizePanel(host.clientWidth);
      const resize = new ResizeObserver(([entry]) => sizePanel(entry.contentRect.width));
      resize.observe(host);
      signal.addEventListener('abort', () => resize.disconnect(), { once: true });
      this.#hostWatch?.remove();
      const rebindIfChanged = () => {
        const view = host.view;
        if (!this.#mounted || (view === this.#view && view?.map === this.#map && view?.ready)) return;
        if (!this.#view && this.#binding) return;
        void this.#bind('scene-replaced');
      };
      this.#hostWatch = reactiveUtils.watch(() => [host.view, host.view?.map, host.view?.ready] as const, rebindIfChanged);
      host.addEventListener('arcgisViewReadyChange', rebindIfChanged, { signal });
      await this.#bind('connecting');
    } catch (error) {
      if (!signal.aborted) {
        this.#retry = 'bind';
        this.#status('error', 'scene-load-failed', this.#explain(error, 'Unable to connect to the 3D scene.'), true);
      }
    }
  }

  async #bind(reason: string) {
    const host = this.#host;
    if (!host) return;
    this.#binding?.abort();
    const binding = new AbortController();
    this.#binding = binding;
    this.#mounted = true;
    const shouldFocus = this.#ui.activeElement === this.#screen;
    this.#end();
    this.#fatalWatch?.remove(); this.#fatalWatch = null;
    this.#view = null; this.#map = null;
    this.#status('loading', reason, reason === 'scene-replaced' ? 'The scene changed. Reconnecting…' : 'Connecting to the 3D scene…');
    try {
      await deadline(host.viewOnReady(), binding.signal, 30000, 'The 3D scene did not become ready. Check your connection and graphics support.');
      if (binding.signal.aborted) return;
      const view = host.view;
      const map = view?.map;
      if (!view || !map || !view.ready) throw new Error('The 3D scene is not ready.');
      this.#view = view;
      this.#map = map;
      if (view.viewingMode !== 'global' || !(view.spatialReference.isWebMercator || view.spatialReference.isWGS84)) {
        this.#status('error', 'unsupported-scene', 'Flight needs a global Earth scene in Web Mercator or WGS84.', true);
        return;
      }
      this.#fatalWatch = reactiveUtils.watch(() => view.fatalError, (error) => {
        if (!error || this.#view !== view) return;
        this.#end(); this.#retry = 'bind';
        this.#status('error', 'scene-render-failed', 'The main scene lost its graphics connection. Recover the scene and retry.', true);
      });
      this.#status('ready', 'scene-ready', 'Take off to open the simulated camera. A keyboard is required.');
      if (shouldFocus) this.#focus('takeoff');
    } catch (error) {
      if (!binding.signal.aborted) {
        this.#retry = 'bind';
        this.#status('error', 'scene-load-failed', this.#explain(error, 'Unable to load the 3D scene.'), true);
      }
    } finally {
      if (this.#binding === binding) this.#binding = null;
    }
  }

  #act(action: Action) {
    if (action === 'takeoff' && this.#state === 'ready') void this.#start(false);
    else if (action === 'pause' && this.#state === 'flying') { this.#pause('user-pause', 'Flight paused. Select Resume to fly.'); this.#focus('resume'); }
    else if (action === 'resume' && this.#state === 'paused' && this.#feed?.ready && !this.#feed.fatalError) this.#fly();
    else if (action === 'follow') this.toggleAttribute('follow-drone');
    else if (action === 'reset' && this.#spawn && this.#feed?.ready && !this.#feed.fatalError) {
      this.#pose = { ...this.#spawn };
      this.#renderPose();
      this.#followTarget = null;
      this.#updateObserver(0);
      if (this.#state === 'flying') this.#pause('reset', 'Reset to launch. Select Resume to fly.');
      else { this.#status('paused', 'reset', 'Reset to launch. Select Resume to fly.'); this.#publish(); }
      this.#focus('resume');
    } else if (action === 'end' && ['starting', 'flying', 'paused'].includes(this.#state)) {
      this.#end(); this.#status('ready', 'flight-ended', 'Flight ended. Ready for another takeoff.'); this.#focus('takeoff');
    } else if (action === 'retry') {
      if (this.#retry === 'feed') void this.#start(true);
      if (this.#retry === 'launch') void this.#start(false);
      if (this.#retry === 'bind' && this.#connection) {
        if (this.#host) void this.#bind('retry');
        else void this.#connect(this.#connection.signal);
      }
    }
  }

  async #start(recovering: boolean) {
    const view = this.#view, map = this.#map;
    if (!view?.ready || !map || view.map !== map || this.#operation) return;
    const operation = new AbortController();
    this.#operation = operation;
    const { signal } = operation;
    this.#retry = null;
    this.#status('starting', 'initializing-feed', recovering ? 'Reconnecting the FPV camera…' : 'Loading terrain and the FPV camera…');
    this.#screen.focus({ preventScroll: true });
    try {
      if (!recovering) {
        const launch = this.getAttribute('launch-position');
        const center = view.center;
        const [lon, lat] = launch === null ? [center?.longitude, center?.latitude] : parseLaunch(launch);
        if (typeof lon !== 'number' || typeof lat !== 'number') throw new Error('Center the main scene over ground or set a launch position.');
        if (!map.ground || !map.ground.layers.length) throw new Error('The host scene needs an elevation layer for terrain clearance.');
        const frame = launchFrame(lon, lat);
        const [x, y] = frame.mercator(0, 0), r = frame.radius;
        const extent = new Extent({ xmin: x-r, ymin: y-r, xmax: x+r, ymax: y+r, spatialReference: SpatialReference.WebMercator });
        const sampler = await deadline(map.ground.createElevationSampler(extent, { noDataValue: NO_DATA, signal }), signal, 25000, 'Terrain did not load. Check your connection and retry.');
        if (signal.aborted) return;
        this.#frame = frame;
        this.#sampler = sampler;
        const ground = this.#groundAt(0, 0);
        if (ground === null) throw new Error('There is no usable terrain at the launch point.');
        this.#spawn = initialPose(ground, view.camera.heading);
        this.#pose = { ...this.#spawn };
      }
      await this.#openFeed(view, map, signal);
      if (signal.aborted) return;
      if (!this.#aircraft) {
        this.#aircraft = aircraft();
        this.#aircraft.geometry = this.#point();
        view.graphics.add(this.#aircraft);
      }
      this.#drawn = null;
      this.#renderPose();
      if (!recovering && !document.hidden && document.hasFocus() && this.#ui.activeElement === this.#screen) this.#fly();
      else {
        const hadFocus = this.#ui.activeElement === this.#screen;
        this.#status('paused', recovering ? 'feed-recovered' : 'focus-lost', 'Camera ready. Select Resume to fly.');
        this.#publish();
        if (hadFocus) this.#focus('resume');
      }
    } catch (error) {
      if (signal.aborted) return;
      const hadFocus = this.#ui.activeElement === this.#screen;
      this.#closeFeed();
      const message = this.#explain(error, 'The FPV camera could not start.');
      if (!recovering) {
        this.#end(); this.#retry = 'launch';
        this.#status('error', 'launch-failed', message, true);
      } else {
        this.#retry = 'feed';
        this.#status('paused', 'feed-unavailable', message, true);
      }
      if (hadFocus) this.#focus('retry');
    } finally {
      operation.abort();
      if (this.#operation === operation) this.#operation = null;
    }
  }

  async #openFeed(view: SceneView, map: ArcGISMap, signal: AbortSignal) {
    this.#closeFeed();
    const inset = document.createElement('div');
    inset.slot = 'fpv-feed';
    // Keep the view in light DOM so the SDK's global styles also reach its internal controls.
    inset.inert = true;
    this.append(inset);
    this.#inset = inset;
    const feed = new SceneView({
      container: inset, map, viewingMode: 'global', spatialReference: view.spatialReference,
      camera: this.#camera(), qualityProfile: 'low', popupEnabled: false,
      ui: { components: [] },
      constraints: { tilt: { max: LIMITS.maxTilt } },
    });
    this.#feed = feed;
    await deadline(feed.when(), signal, 25000, 'The FPV view could not load. The browser may be unable to render two 3D views.');
    if (signal.aborted) return;
    if (feed.fatalError) throw feed.fatalError;
    this.#feedWatch = reactiveUtils.watch(() => feed.fatalError, (error) => {
      if (!error || feed !== this.#feed) return;
      const hadFocus = this.#ui.activeElement === this.#screen || this.#ui.activeElement === this.#buttons.resume;
      this.#stopLoop(); this.#closeFeed(); this.#retry = 'feed';
      this.#status('paused', 'feed-unavailable', 'The camera connection was lost. Retry to restore the last flight pose.', true);
      this.#publish();
      if (hadFocus) this.#focus('retry');
    });
  }

  #groundAt(east: number, north: number) {
    if (!this.#sampler || !this.#frame) return null;
    const [x, y] = this.#sampler.spatialReference.isWGS84 ? this.#frame.lonLat(east, north) : this.#frame.mercator(east, north);
    if (!(this.#sampler.spatialReference.isWGS84 || this.#sampler.spatialReference.isWebMercator)) return null;
    const z = this.#sampler.elevationAt(x, y);
    return Number.isFinite(z) && z !== NO_DATA && z !== this.#sampler.noDataValue ? z : null;
  }

  #point({ east, north, z }: FlightPosition = this.#pose!) {
    const frame = this.#frame!, spatialReference = this.#view!.spatialReference;
    const [x, y] = spatialReference.isWGS84 ? frame.lonLat(east, north) : frame.mercator(east, north);
    return new Point({ x, y, z, spatialReference });
  }

  #camera() {
    const { heading, tilt } = this.#pose!;
    return new Camera({ position: this.#point(), heading, tilt, fov: 85 });
  }

  #renderPose() {
    const pose = this.#pose;
    if (!pose) return;
    const prior = this.#drawn;
    const moved = !prior || prior.east !== pose.east || prior.north !== pose.north || prior.z !== pose.z;
    const rotated = !prior || prior.heading !== pose.heading || prior.tilt !== pose.tilt;
    if (this.#feed && (moved || rotated)) this.#feed.camera = this.#camera();
    if (this.#aircraft && moved) this.#aircraft.geometry = this.#point();
    if (this.#aircraft && rotated) {
      const symbol = (this.#aircraft.symbol as PointSymbol3D).clone();
      for (const layer of symbol.symbolLayers) {
        if (!(layer instanceof ObjectSymbol3DLayer)) continue;
        layer.heading = pose.heading;
        // Camera tilt is measured from nadir. The model measures pitch from level.
        layer.tilt = pose.tilt - 90;
      }
      this.#aircraft.symbol = symbol;
    }
    this.#drawn = pose;
  }

  #updateObserver(elapsedSeconds: number) {
    const view = this.#view, pose = this.#pose;
    if (!view?.ready || !pose || !this.#feed || !this.hasAttribute('follow-drone')) return;

    const previous = this.#followTarget;
    let { east, north, z } = pose;
    const heading = previous?.heading ?? view.camera.heading;
    if (previous) {
      const distance = Math.hypot(east - previous.east, north - previous.north, z - previous.z);
      if (distance === 0 || elapsedSeconds === 0) return;
      if (distance > .05) {
        const blend = 1 - Math.exp(-elapsedSeconds / .15);
        east = previous.east + (east - previous.east) * blend;
        north = previous.north + (north - previous.north) * blend;
        z = previous.z + (z - previous.z) * blend;
      }
    }

    this.#followTarget = { east, north, z, heading };
    const angle = heading * Math.PI / 180;
    view.camera = new Camera({
      heading, tilt: FOLLOW_TILT,
      position: this.#point({
        east: east - FOLLOW_DISTANCE * Math.sin(angle),
        north: north - FOLLOW_DISTANCE * Math.cos(angle),
        z: z + FOLLOW_HEIGHT,
      }),
    });
  }

  #fly() {
    if (!this.#pose || !this.#feed) return;
    this.#keys.clear(); this.#lastFrame = 0; this.#accumulated = 0;
    this.#status('flying', 'pilot-active', 'Fly with WASD. Hold Space to climb and release it to descend.');
    this.#screen.focus({ preventScroll: true });
    if (this.#ui.activeElement !== this.#screen || document.hidden || !document.hasFocus()) {
      this.#pause('focus-lost', 'Flight paused. Select Resume to fly.');
      return;
    }
    this.#followTarget = null;
    this.#updateObserver(0);
    this.#publish();
    this.#frameId = requestAnimationFrame(this.#tick);
  }

  #tick = (now: number) => {
    if (this.#state !== 'flying' || !this.#pose) return;
    if (this.#view?.map !== this.#map) { void this.#bind('scene-replaced'); return; }
    const elapsedSeconds = this.#lastFrame ? Math.min(.1, (now - this.#lastFrame) / 1000) : 0;
    this.#accumulated += elapsedSeconds;
    this.#lastFrame = now;
    const axis = (a: string, b: string) => Number(this.#keys.has(a)) - Number(this.#keys.has(b));
    const input: FlightInput = {
      forward: axis('w', 's'), right: axis('d', 'a'), yaw: axis('e', 'q'),
      look: axis('arrowup', 'arrowdown'), throttle: this.#keys.has(' '),
    };
    while (this.#accumulated >= STEP) {
      const next = fly(this.#pose, input, (e, n) => this.#groundAt(e, n));
      if (!next) {
        this.#pause('terrain-unavailable', 'Terrain ahead is unavailable. Resume to turn or retreat.', true);
        this.#focus('resume'); return;
      }
      this.#pose = next;
      this.#accumulated -= STEP;
    }
    this.#renderPose();
    this.#updateObserver(elapsedSeconds);
    if (now - this.#lastTelemetry >= 250) this.#publish();
    if (this.#state === 'flying') this.#frameId = requestAnimationFrame(this.#tick);
  };

  #onKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (event.type === 'keyup') this.#keys.delete(key);
    if (this.#state !== 'flying' || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || !MAPPED.has(key)) return;
    event.preventDefault(); event.stopPropagation();
    if (event.type === 'keyup') return;
    if (key === 'escape') {
      this.#pause('user-pause', 'Flight paused. Select Resume to fly.'); this.#focus('resume');
    } else if (key === 'c') {
      if (!event.repeat) this.toggleAttribute('follow-drone');
    } else this.#keys.add(key);
  }

  #stopLoop() {
    cancelAnimationFrame(this.#frameId); this.#frameId = 0; this.#keys.clear();
    if (this.#pose) this.#pose = stop(this.#pose);
  }

  #pause(reason: string, message: string, warning = false) {
    if (this.#state !== 'flying') return;
    this.#stopLoop(); this.#renderPose(); this.#status('paused', reason, message, warning); this.#publish();
  }

  #publish() {
    if (!this.#pose || !this.#frame) return;
    const pose = this.#pose;
    const [longitude, latitude] = this.#frame.lonLat(pose.east, pose.north);
    const heightAboveGroundM = pose.z - pose.ground, groundSpeedMps = Math.hypot(pose.ve, pose.vn);
    this.#readings.heading.textContent = `${String(Math.round(pose.heading) % 360).padStart(3, '0')}°`;
    this.#readings.height.textContent = `${heightAboveGroundM.toFixed(1)} m`;
    this.#readings.speed.textContent = `${groundSpeedMps.toFixed(1)} m/s`;
    this.#lastTelemetry = performance.now();
    this.dispatchEvent(new CustomEvent('drone-telemetry', { bubbles: true, composed: true, detail: { longitude, latitude, heightAboveGroundM, headingDeg: pose.heading, groundSpeedMps } }));
  }

  #end() {
    this.#operation?.abort(); this.#operation = null;
    this.#stopLoop(); this.#closeFeed();
    if (this.#aircraft) this.#view?.graphics?.remove(this.#aircraft);
    this.#aircraft = null; this.#sampler = null; this.#frame = null;
    this.#pose = null; this.#spawn = null; this.#drawn = null; this.#followTarget = null; this.#retry = null;
    for (const reading of Object.values(this.#readings)) reading.textContent = '—';
  }

  #closeFeed() {
    this.#feedWatch?.remove(); this.#feedWatch = null;
    if (this.#feed) {
      this.#feed.map = null; // ArcGIS destroys an attached map when the view is destroyed.
      this.#feed.destroy(); this.#feed = null;
    }
    this.#inset?.remove(); this.#inset = null;
  }

  #status(state: DroneState, reason: string, message: string, warning = false) {
    const changed = this.#state !== state;
    this.#state = state;
    this.dataset.state = state;
    this.#phase.textContent = displayNames[state];
    this.#message.textContent = warning ? '' : message;
    this.#message.hidden = warning;
    this.#notice.querySelector('.error-message')!.textContent = warning ? message : '';
    this.#notice.open = warning; this.#notice.hidden = !warning;
    this.#screen.hidden = state !== 'starting' && !this.#feed;
    this.#screen.tabIndex = state === 'flying' ? 0 : -1;
    this.#telemetry.hidden = !this.#pose || !this.#feed;
    this.#buttons.takeoff.hidden = state !== 'ready';
    this.#buttons.pause.hidden = state !== 'flying';
    this.#buttons.resume.hidden = state !== 'paused' || !this.#feed;
    this.#buttons.follow.hidden = !this.#pose || !this.#feed || (state !== 'flying' && state !== 'paused');
    this.#buttons.reset.hidden = !this.#pose || !this.#feed || (state !== 'flying' && state !== 'paused');
    this.#buttons.end.hidden = state !== 'flying' && state !== 'paused' && state !== 'starting';
    this.#buttons.retry.hidden = !this.#retry;
    this.#buttons.retry.textContent = this.#retry === 'feed' ? 'Retry camera' : 'Retry';
    if (changed) this.dispatchEvent(new CustomEvent('drone-state-change', { bubbles: true, composed: true, detail: { state, reason } }));
  }

  #focus(action: Action) {
    const button = this.#buttons[action];
    void button.setFocus().catch(() => {});
  }

  #explain(error: unknown, fallback: string) {
    // Do not surface raw ArcGIS service errors: they may include request URLs.
    return error instanceof Error && !('details' in error) && !/https?:\/\//i.test(error.message) ? error.message : fallback;
  }
}

declare global { interface HTMLElementTagNameMap { 'scene-fpv-drone': SceneFpvDrone } }
if (!customElements.get(TAG)) customElements.define(TAG, SceneFpvDrone);
