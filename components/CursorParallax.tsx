"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Desktop-only: subtle cursor parallax on the hero photo (Astra Roam pattern).
 * Does nothing on touch / reduced motion.
 */
export function CursorParallax({
  children,
  strength = 18,
  enabled = true,
}: {
  children: ReactNode;
  strength?: number;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      targetX = ((e.clientX / w) - 0.5) * strength;
      targetY = ((e.clientY / h) - 0.5) * strength;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.06)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [enabled, strength]);

  return (
    <div
      ref={ref}
      className="absolute inset-[-6%]"
      style={enabled ? { willChange: "transform" } : undefined}
    >
      {children}
    </div>
  );
}
