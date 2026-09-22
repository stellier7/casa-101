/** Mobile Show-mode rest stops — progress within a sticky pair section */

export const MAGNET_BASE_PROGRESS = 0.22;
export const MAGNET_COVER_PROGRESS = 0.85;

/** Soft settle — long enough to keep reading the scrub */
export const MAGNET_SNAP_MS = 980;

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

function closestIndex(scrollY: number, magnets: number[]): number {
  let best = 0;
  let bestDist = Math.abs(magnets[0] - scrollY);
  for (let i = 1; i < magnets.length; i++) {
    const d = Math.abs(magnets[i] - scrollY);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

/**
 * Soft magnet: only advance/retreat by one rest stop per gesture.
 * Direction comes from where the finger started vs where it ended.
 */
export function adjacentMagnet(
  scrollY: number,
  magnets: number[],
  gestureStartY: number,
): number | null {
  if (!magnets.length) return null;

  const startIdx = closestIndex(gestureStartY, magnets);
  const delta = scrollY - gestureStartY;

  // Tiny nudge — stay on (or ease back to) the stop you left
  if (Math.abs(delta) < 28) {
    return magnets[startIdx];
  }

  if (delta > 0) {
    // Scrolling down: at most the next stop
    const next = Math.min(startIdx + 1, magnets.length - 1);
    return magnets[next];
  }

  // Scrolling up: at most the previous stop
  const prev = Math.max(startIdx - 1, 0);
  return magnets[prev];
}

export function animateScrollTo(y: number, durationMs = MAGNET_SNAP_MS) {
  const start = window.scrollY;
  const delta = y - start;
  if (Math.abs(delta) < 1) return;

  const startTime = performance.now();
  // Ease-in-out so the scrub is readable for longer mid-settle
  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const tick = (now: number) => {
    const t = Math.min(1, (now - startTime) / durationMs);
    window.scrollTo(0, start + delta * ease(t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
