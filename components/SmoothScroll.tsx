"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useQuietView } from "@/components/QuietView";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

type ScrollApi = {
  scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void;
};

const nativeScroll: ScrollApi = {
  scrollTo: (target, options) => {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!(el instanceof HTMLElement)) return;
    const top =
      el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
    window.scrollTo({ top, behavior: "auto" });
  },
};

const LenisContext = createContext<ScrollApi>(nativeScroll);

export function useLenisScroll() {
  return useContext(LenisContext);
}

/**
 * Lenis is the only smooth-scroll engine. GSAP ticker drives it so
 * ScrollTrigger scrub stays in lockstep with the scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { quiet } = useQuietView();
  const apiRef = useRef<ScrollApi>(nativeScroll);

  useEffect(() => {
    registerMotion();
    apiRef.current = nativeScroll;

    if (quiet || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    apiRef.current = {
      scrollTo: (target, options) => {
        lenis.scrollTo(target, { offset: options?.offset ?? 0 });
      },
    };

    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      apiRef.current = nativeScroll;
    };
  }, [quiet]);

  const value = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, options) => apiRef.current.scrollTo(target, options),
    }),
    [],
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
