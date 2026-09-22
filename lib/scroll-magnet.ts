/** Mobile Show-mode rest stops — progress within a sticky pair section */

export const MAGNET_BASE_PROGRESS = 0.22;
export const MAGNET_COVER_PROGRESS = 0.85;

export function sectionMagnetYs(section: HTMLElement, viewportH: number): number[] {
  const top = section.offsetTop;
  const height = section.offsetHeight;
  const travel = Math.max(height - viewportH, 0);
  const hasCover = section.dataset.coverEffect !== "solo";
  const ys = [top + MAGNET_BASE_PROGRESS * travel];
  if (hasCover) {
    ys.push(top + MAGNET_COVER_PROGRESS * travel);
  }
  return ys;
}

export function collectMagnetYs(viewportH = window.innerHeight): number[] {
  const sections = document.querySelectorAll<HTMLElement>("[data-cover-effect]");
  const ys: number[] = [];
  sections.forEach((section) => {
    ys.push(...sectionMagnetYs(section, viewportH));
  });
  // Brochure / page top as a soft landing when above the story
  if (ys.length && ys[0] > 0) ys.unshift(0);
  return ys;
}

/** Always snap to the nearest rest stop (mandatory magnet feel) */
export function nearestMagnet(scrollY: number, magnets: number[]): number | null {
  if (!magnets.length) return null;
  let best = magnets[0];
  let bestDist = Math.abs(best - scrollY);
  for (let i = 1; i < magnets.length; i++) {
    const d = Math.abs(magnets[i] - scrollY);
    if (d < bestDist) {
      bestDist = d;
      best = magnets[i];
    }
  }
  return best;
}

export function animateScrollTo(y: number, durationMs = 420) {
  const start = window.scrollY;
  const delta = y - start;
  if (Math.abs(delta) < 1) return;

  const startTime = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const tick = (now: number) => {
    const t = Math.min(1, (now - startTime) / durationMs);
    window.scrollTo(0, start + delta * ease(t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
