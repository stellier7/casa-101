"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useQuietView } from "@/components/QuietView";

/**
 * Astra / cinematic-scroll pattern: Lenis smooth scroll for the immersive mode.
 * Disabled in quiet view and for prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { quiet } = useQuietView();

  useEffect(() => {
    if (quiet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.1,
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
