(() => {
  const section = document.querySelector('#model-viewer');
  const viewport = section.querySelector('.viewport');
  const canvas = viewport.querySelector('canvas');
  const status = viewport.querySelector('.viewer-status');
  const viewControls = section.querySelector('.view-controls');
  const modelButtons = [...section.querySelectorAll('[data-model]')];
  const modelData = new Map();
  let activeButton;
  let selection = 0;
  let viewer;

  function setStatus(state, message) {
    const ready = state === 'ready';
    viewport.dataset.state = state;
    canvas.tabIndex = ready ? 0 : -1;
    canvas.setAttribute('aria-hidden', String(!ready));
    viewControls.disabled = !ready;
    status.textContent = message;
  }

  function loadPayload(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => {
        script.remove();
        reject(new Error('The preview data did not load.'));
      };
      script.onload = () => {
        const payload = script.day25Mesh;
        if (!payload) return fail();
        script.remove();
        resolve(payload);
      };
      script.onerror = fail;
      script.src = src;
      document.head.append(script);
    });
  }

  async function decodeModel(src) {
    const payload = await loadPayload(src);
    const binary = atob(payload);
    const compressed = new Uint8Array(binary.length);
    for (let i = 0; i < compressed.length; i++) compressed[i] = binary.charCodeAt(i);
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const buffer = await new Response(stream).arrayBuffer();

    // The generated preview preserves the STL's float32 positions and triangle order.
    const vertexCount = new DataView(buffer).getUint32(0, true);
    const positions = new Float32Array(buffer, 4, vertexCount * 3);
    const indices = new Uint32Array(buffer, 4 + positions.byteLength);
    const deltas = new Int32Array(buffer, indices.byteOffset);
    let index = 0;
    for (let i = 0; i < indices.length; i++) {
      index += deltas[i];
      indices[i] = index;
    }
    return { positions, indices };
  }

  async function showModel(button) {
    if (activeButton === button && ['loading', 'ready'].includes(viewport.dataset.state)) return;
    const name = button.textContent.trim();
    const request = ++selection;
    activeButton = button;
    for (const option of modelButtons) option.setAttribute('aria-pressed', String(option === button));
    setStatus('loading', `Loading ${name}…`);

    try {
      viewer ??= createViewer();
    } catch (error) {
      setStatus('error', 'The 3D viewer needs WebGL 2. The photos and STL downloads are available above.');
      console.warn('Could not start the Day 25 viewer.', error);
      return;
    }

    const { modelSrc } = button.dataset;
    if (!modelData.has(modelSrc)) {
      modelData.set(modelSrc, decodeModel(modelSrc).catch(error => {
        modelData.delete(modelSrc);
        throw error;
      }));
    }

    try {
      const data = await modelData.get(modelSrc);
      if (request !== selection) return;
      viewer.setModel(data);
      canvas.setAttribute('aria-label', `Interactive 3D model of ${name}`);
      setStatus('ready', `${name} is ready.`);
    } catch (error) {
      if (request !== selection) return;
      setStatus('error', `Could not load ${name}. Select the model again to retry.`);
      console.warn(`Could not load the ${name} preview.`, error);
    }
  }

  function createViewer() {
    const {
      BufferAttribute, BufferGeometry, Color, DirectionalLight, GridHelper, HemisphereLight,
      Mesh, MeshStandardMaterial, NeutralToneMapping, OrbitControls, OrthographicCamera,
      Scene, Spherical, Vector3, WebGLRenderer,
    } = Day25Three;
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = NeutralToneMapping;

    const scene = new Scene();
    scene.background = new Color(0x253238);
    scene.add(new HemisphereLight(0xfcf5e9, 0x818c98, 1.85));
    const key = new DirectionalLight(0xfff0d9, 2.25);
    key.position.set(-3, 5, 2);
    scene.add(key);

    const grid = new GridHelper(5.6, 28, 0x5a696f, 0x435258);
    scene.add(grid);

    const material = new MeshStandardMaterial({ color: 0xf4e9d8, roughness: 0.85, flatShading: true });
    const mesh = new Mesh(new BufferGeometry(), material);
    const scale = 0.02;
    mesh.scale.setScalar(scale);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.05, 30);
    camera.position.set(3, 2.6, 4);
    const orbit = new OrbitControls(camera, canvas);
    orbit.minZoom = 0.7;
    orbit.maxZoom = 7;
    orbit.enablePan = false;
    orbit.cursorStyle = 'grab';
    const render = () => {
      grid.visible = camera.position.y > grid.position.y;
      renderer.render(scene, camera);
    };
    orbit.addEventListener('change', render);
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = viewport;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const halfHeight = Math.max(1.07, 1.28 / aspect);
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.updateProjectionMatrix();
      render();
    };
    new ResizeObserver(resize).observe(viewport);
    canvas.addEventListener('webglcontextrestored', render);

    function setView(x, y, z) {
      camera.position.set(x, y, z);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      orbit.update();
      render();
    }

    const reset = () => setView(3, 2.6, 4);
    return {
      setModel({ positions, indices }) {
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(positions, 3));
        geometry.setIndex(new BufferAttribute(indices, 1));
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new Vector3());
        mesh.position.set(-center.x, -center.z, center.y).multiplyScalar(scale);
        grid.position.y = (geometry.boundingBox.min.z - center.z) * scale - 0.015;
        mesh.geometry.dispose();
        mesh.geometry = geometry;
        reset();
      },
      reset,
      top: () => setView(0, 5, 0.001),
      zoom(factor) {
        camera.zoom = Math.max(orbit.minZoom, Math.min(orbit.maxZoom, camera.zoom * factor));
        camera.updateProjectionMatrix();
        orbit.update();
        render();
      },
      rotate(azimuth, elevation) {
        const spherical = new Spherical().setFromVector3(camera.position);
        spherical.theta += azimuth;
        spherical.phi += elevation;
        camera.position.setFromSpherical(spherical.makeSafe());
        orbit.update();
      },
    };
  }

  const actions = {
    in: () => viewer.zoom(1.2),
    out: () => viewer.zoom(1 / 1.2),
    reset: () => viewer.reset(),
    top: () => viewer.top(),
  };
  const keys = new Map([
    ['ArrowLeft', () => viewer.rotate(-0.14, 0)],
    ['ArrowRight', () => viewer.rotate(0.14, 0)],
    ['ArrowUp', () => viewer.rotate(0, -0.14)],
    ['ArrowDown', () => viewer.rotate(0, 0.14)],
    ['+', actions.in], ['=', actions.in], ['-', actions.out], ['Home', actions.reset],
  ]);
  canvas.addEventListener('keydown', event => {
    const action = keys.get(event.key);
    if (!action || viewControls.disabled || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    action();
  });
  for (const button of viewControls.querySelectorAll('[data-action]')) {
    button.addEventListener('click', actions[button.dataset.action]);
  }
  for (const button of modelButtons) {
    button.addEventListener('click', () => showModel(button));
  }
  for (const link of document.querySelectorAll('[data-view-model]')) {
    const button = modelButtons.find(option => option.dataset.model === link.dataset.viewModel);
    link.addEventListener('click', () => showModel(button));
  }

  setStatus('idle', 'Select a print to load the model.');
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    if (!activeButton) showModel(modelButtons[0]);
  }, { rootMargin: '160px 0px' });
  observer.observe(viewport);
})();
