"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type QuietContextValue = {
  quiet: boolean;
  toggle: () => void;
  setQuiet: (v: boolean) => void;
};

const QuietContext = createContext<QuietContextValue | null>(null);

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function QuietViewProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  /** null = follow system PRM; boolean = user override */
  const [userQuiet, setUserQuiet] = useState<boolean | null>(null);

  const quiet = userQuiet ?? prefersReduced;

  const toggle = useCallback(() => {
    setUserQuiet((prev) => !(prev ?? prefersReduced));
  }, [prefersReduced]);

  const setQuiet = useCallback((v: boolean) => {
    setUserQuiet(v);
  }, []);

  const value = useMemo(
    () => ({ quiet, toggle, setQuiet }),
    [quiet, toggle, setQuiet],
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

/** Escape hatch — bottom-left floating control */
export function QuietViewToggle() {
  const { quiet, toggle } = useQuietView();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={quiet}
      aria-label={
        quiet
          ? "Activar modo show con animaciones"
          : "Activar vista quieta sin animaciones"
      }
      className="fixed bottom-5 left-5 z-50 min-h-11 min-w-[7.5rem] rounded-full border border-white/30 bg-black/60 px-4 py-2.5 text-[0.65rem] tracking-[0.18em] uppercase text-white backdrop-blur-md transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-8 sm:left-8"
    >
      {quiet ? "Modo show" : "Vista quieta"}
    </button>
  );
}
