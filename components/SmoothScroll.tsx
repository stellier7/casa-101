"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useQuietView } from "@/components/QuietView";
import {
  animateScrollTo,
  collectMagnetYs,
  nearestMagnet,
} from "@/lib/scroll-magnet";

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Desktop Show mode: Lenis smooth wheel.
 * Mobile Show mode: native scroll + magnets to photo rest stops.
 * Quiet / reduced-motion: no Lenis, no magnets.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { quiet } = useQuietView();

  useEffect(() => {
    if (quiet || prefersReducedMotion()) return;

    // —— Mobile: native scroll + magnets ——
    if (isMobileViewport()) {
      let magnets = collectMagnetYs();
      let snapping = false;
      let touchActive = false;
      let settleTimer = 0;

      const refresh = () => {
        magnets = collectMagnetYs();
      };

      const snapIfNeeded = () => {
        if (snapping || touchActive) return;
        refresh();
        // Don't magnetize once the visitor has left the immersive story
        const storyEnd = magnets.length
          ? magnets[magnets.length - 1] + window.innerHeight
          : 0;
        if (window.scrollY > storyEnd) return;
        const target = nearestMagnet(window.scrollY, magnets);
        if (target == null || Math.abs(target - window.scrollY) < 2) return;
        snapping = true;
        animateScrollTo(target, 380);
        window.setTimeout(() => {
          snapping = false;
        }, 420);
      };

      const scheduleSnap = () => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(snapIfNeeded, 120);
      };

      const onTouchStart = () => {
        touchActive = true;
        window.clearTimeout(settleTimer);
      };
      const onTouchEnd = () => {
        touchActive = false;
        scheduleSnap();
      };
      const onScrollEnd = () => {
        if (!touchActive) snapIfNeeded();
      };
      const onScroll = () => {
        if (!touchActive) scheduleSnap();
      };

      refresh();
      // Recollect after layout settles (pair heights / fonts / images)
      const bootRefresh = window.setTimeout(refresh, 100);
      const bootRefresh2 = window.setTimeout(refresh, 500);

      const ro = new ResizeObserver(refresh);
      document
        .querySelectorAll("[data-cover-effect]")
        .forEach((el) => ro.observe(el));

      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("scrollend", onScrollEnd as EventListener);

      return () => {
        window.clearTimeout(settleTimer);
        window.clearTimeout(bootRefresh);
        window.clearTimeout(bootRefresh2);
        ro.disconnect();
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scrollend", onScrollEnd as EventListener);
      };
    }

    // —— Desktop: Lenis only ——
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      touchMultiplier: 1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [quiet]);

  return <>{children}</>;
}
