export const MAX_ZOOM = 8;
export const ZOOM_STEP = 1.6;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function imageNavigation(surface, image, onChange) {
  let frame = { x: 0.5, y: 0.5, zoom: 1 };
  let drag;
  surface.tabIndex = 0;

  function move(x, y, zoom) {
    const edge = 0.5 / zoom;
    frame = { x: clamp(x, edge, 1 - edge), y: clamp(y, edge, 1 - edge), zoom };
    const left = (0.5 - frame.x) * zoom * 100;
    const top = (0.5 - frame.y) * zoom * 100;
    image.style.transform = `translate(${left}%, ${top}%) scale(${zoom})`;
    surface.classList.toggle("can-pan", zoom > 1);
    onChange();
  }

  function zoomBy(factor) {
    move(frame.x, frame.y, clamp(frame.zoom * factor, 1, MAX_ZOOM));
  }

  function reset() {
    move(0.5, 0.5, 1);
  }

  surface.addEventListener("pointerdown", (event) => {
    if (frame.zoom === 1 || !event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    surface.setPointerCapture(event.pointerId);
  });
  surface.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    const dx = (event.clientX - drag.x) / (surface.clientWidth * frame.zoom);
    const dy = (event.clientY - drag.y) / (surface.clientHeight * frame.zoom);
    drag = { ...drag, x: event.clientX, y: event.clientY };
    move(frame.x - dx, frame.y - dy, frame.zoom);
  });
  surface.addEventListener("lostpointercapture", () => { drag = undefined; });

  const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  surface.addEventListener("keydown", (event) => {
    const direction = directions[event.key];
    if (direction && frame.zoom > 1) {
      move(frame.x + direction[0] * .15 / frame.zoom, frame.y + direction[1] * .15 / frame.zoom, frame.zoom);
    } else if (event.key === "+" || event.key === "=") zoomBy(ZOOM_STEP);
    else if (event.key === "-") zoomBy(1 / ZOOM_STEP);
    else if (event.key === "Home") reset();
    else return;
    event.preventDefault();
  });

  return { get frame() { return frame; }, zoomBy, reset };
}
