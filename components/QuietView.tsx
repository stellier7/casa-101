"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/lib/media";

type QuietContextValue = {
  quiet: boolean;
  toggle: () => void;
  setQuiet: (v: boolean) => void;
};

const QuietContext = createContext<QuietContextValue | null>(null);

export function QuietViewProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [override, setOverride] = useState<boolean | null>(null);
  const quiet = override ?? prefersReduced;

  const toggle = useCallback(() => {
    setOverride((current) => !(current ?? prefersReduced));
  }, [prefersReduced]);

  const setQuiet = useCallback((v: boolean) => {
    setOverride(v);
  }, []);

  const value = useMemo(
    () => ({ quiet, toggle, setQuiet }),
    [quiet, toggle, setQuiet],
  );

  return <QuietContext.Provider value={value}>{children}</QuietContext.Provider>;
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
