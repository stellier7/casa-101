"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type QuietContextValue = {
  quiet: boolean;
  toggle: () => void;
  setQuiet: (v: boolean) => void;
};

const QuietContext = createContext<QuietContextValue | null>(null);

export function QuietViewProvider({ children }: { children: ReactNode }) {
  const [quiet, setQuiet] = useState(false);

  // Prefer quiet on coarse pointers (phones) for first paint — user can turn show on
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setQuiet(true);
    else if (coarse) setQuiet(true);
  }, []);

  const toggle = useCallback(() => setQuiet((q) => !q), []);

  const value = useMemo(
    () => ({ quiet, toggle, setQuiet }),
    [quiet, toggle],
  );

  return (
    <QuietContext.Provider value={value}>{children}</QuietContext.Provider>
  );
}

export function useQuietView() {
  const ctx = useContext(QuietContext);
  if (!ctx) {
    return { quiet: false, toggle: () => {}, setQuiet: () => {} };
  }
  return ctx;
}

/** Astra-style escape hatch — bottom-left floating control */
export function QuietViewToggle() {
  const { quiet, toggle } = useQuietView();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-5 left-5 z-50 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-[0.65rem] tracking-[0.18em] uppercase text-white/90 backdrop-blur-md transition hover:bg-black/75 sm:bottom-8 sm:left-8"
      aria-pressed={quiet}
    >
      {quiet ? "Show mode" : "Quiet view"}
    </button>
  );
}
