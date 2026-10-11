/** Supply scroll distance only when the browser cannot drive the CSS timeline. */
export function installPreviewScrollFallback(): void {
  if (CSS.supports("animation-timeline", "scroll(root)")) return;
  const layout = document.querySelector<HTMLElement>(".broadcaster-layout");
  const reserve = layout?.querySelector<HTMLElement>(".preview-reserve");
  if (!layout || !reserve) return;
  layout.classList.add("preview-scroll-fallback");
  let start = 0;
  let pending = false;
  const update = () => {
    pending = false;
    layout.style.setProperty("--preview-scroll", `${Math.max(0, window.scrollY - start)}px`);
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };
  const measure = () => {
    start = reserve.getBoundingClientRect().top + window.scrollY;
    schedule();
  };
  // The reserve keeps its original height, so observing it cannot feed back
  // into the animation. No element measurements are made during scrolling.
  new ResizeObserver(measure).observe(reserve);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", schedule, { passive: true });
  measure();
}
