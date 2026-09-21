"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

/** Cinematic scroll effects — Astra-style fullscreen chapters */
export type CinematicEffect =
  | "hold" // pinned / fixed feel, subtle drift
  | "zoomOut" // starts tight, zooms out from center
  | "zoomIn" // ken burns deeper into the frame
  | "rise" // lifts up while settling scale
  | "reveal" // soft fade + scale from center
  | "drift"; // slow horizontal pan while scaling

export const CINEMATIC_EFFECTS: CinematicEffect[] = [
  "hold",
  "zoomOut",
  "zoomIn",
  "rise",
  "reveal",
  "drift",
];

type CinematicPhotoProps = {
  src: string;
  alt: string;
  effect: CinematicEffect;
  priority?: boolean;
  caption?: string;
  /** Optional overlay content (e.g. hero title) */
  overlay?: ReactNode;
  /** Taller scroll distance for stronger scrub (default 200) */
  scrollVh?: number;
};

export function CinematicPhoto({
  src,
  alt,
  effect,
  priority = false,
  caption,
  overlay,
  scrollVh = 200,
}: CinematicPhotoProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const captionOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.72, 0.92],
    [0, 1, 1, 0],
  );
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.55, 0.85],
    [0.35, 1, 1, 0],
  );

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: reduceMotion ? "100svh" : `${scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        {reduceMotion ? (
          <div className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              priority={priority}
              className="object-cover object-center"
            />
          </div>
        ) : (
          <EffectLayer
            effect={effect}
            progress={scrollYProgress}
            src={src}
            alt={alt}
            priority={priority}
          />
        )}

        {/* Edge vignette for cinematic depth */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.45)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          aria-hidden="true"
        />

        {overlay ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-end justify-center"
            style={reduceMotion ? undefined : { opacity: overlayOpacity }}
          >
            {overlay}
          </motion.div>
        ) : null}

        {caption ? (
          <motion.p
            className="absolute bottom-8 left-0 right-0 z-10 px-6 text-center text-sm tracking-[0.22em] uppercase text-white/90 sm:bottom-12 sm:text-base"
            style={reduceMotion ? undefined : { opacity: captionOpacity }}
          >
            {caption}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}

function EffectLayer({
  effect,
  progress,
  src,
  alt,
  priority,
}: {
  effect: CinematicEffect;
  progress: MotionValue<number>;
  src: string;
  alt: string;
  priority: boolean;
}) {
  // Hold: image stays fixed in frame with barely-there Ken Burns
  const holdScale = useTransform(progress, [0, 1], [1.02, 1.1]);
  const holdY = useTransform(progress, [0, 1], ["0%", "4%"]);

  // Zoom out from center — starts cropped tight, opens to full scene
  const zoomOutScale = useTransform(progress, [0, 0.7, 1], [1.72, 1.05, 1]);
  const zoomOutOpacity = useTransform(progress, [0, 0.12], [0.25, 1]);

  const zoomInScale = useTransform(progress, [0, 1], [1.05, 1.38]);
  const zoomInOpacity = useTransform(progress, [0, 0.1], [0.4, 1]);

  const riseY = useTransform(progress, [0, 0.65, 1], ["22%", "0%", "-5%"]);
  const riseScale = useTransform(progress, [0, 0.65, 1], [1.28, 1.04, 1]);
  const riseOpacity = useTransform(progress, [0, 0.18], [0, 1]);

  const revealScale = useTransform(progress, [0, 0.5, 1], [1.45, 1.08, 1]);
  const revealOpacity = useTransform(progress, [0, 0.22], [0, 1]);
  const revealBlur = useTransform(progress, [0, 0.35, 0.65], [14, 3, 0]);

  const driftX = useTransform(progress, [0, 1], ["8%", "-8%"]);
  const driftScale = useTransform(progress, [0, 1], [1.28, 1.06]);
  const driftOpacity = useTransform(progress, [0, 0.1], [0.35, 1]);

  const filterBlur = useTransform(revealBlur, (b) => `blur(${b}px)`);

  const style =
    effect === "hold"
      ? { scale: holdScale, y: holdY }
      : effect === "zoomOut"
        ? { scale: zoomOutScale, opacity: zoomOutOpacity }
        : effect === "zoomIn"
          ? { scale: zoomInScale, opacity: zoomInOpacity }
          : effect === "rise"
            ? { y: riseY, scale: riseScale, opacity: riseOpacity }
            : effect === "reveal"
              ? { scale: revealScale, opacity: revealOpacity, filter: filterBlur }
              : { x: driftX, scale: driftScale, opacity: driftOpacity };

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={style}
    >
      {/* Oversized so scale/pan never shows edges */}
      <div className="absolute inset-[-12%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover object-center"
        />
      </div>
    </motion.div>
  );
}
