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
import type { CoverEffect } from "@/lib/cinematic";
import {
  INFO_PLACE_CLASS,
  infoMotionFrom,
  type InfoPlace,
} from "@/lib/photo-info";

export type PhotoChapter = {
  src: string;
  alt: string;
  info?: string | null;
  infoPlace?: InfoPlace;
};

type CinematicPairProps = {
  /** Odd photo — stays fixed until covered */
  base: PhotoChapter;
  /** Even photo — covers base with a unique effect */
  cover?: PhotoChapter;
  coverEffect: CoverEffect;
  priority?: boolean;
  /** Hero / brand overlay on the base (first pair) */
  overlay?: ReactNode;
  scrollVh?: number;
};

/**
 * Astra-style pair: odd photo holds with parallax; even photo covers it
 * with a distinct entrance (zoom, slide, wipe, drift…).
 */
export function CinematicPair({
  base,
  cover,
  coverEffect,
  priority = false,
  overlay,
  scrollVh = 280,
}: CinematicPairProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // —— Base (odd): pinned + slow parallax ——
  const baseScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const baseY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const baseParallaxX = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);

  // Base info / hero visible early, fade before cover lands
  const baseCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.26, 0.36],
    [0.45, 1, 1, 0],
  );

  // Cover phase ~0.32 → 0.78
  const coverOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.42, 0.85, 0.98],
    [0, 1, 1, 1],
  );
  const coverCopyOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.66, 0.9, 0.99],
    [0, 1, 1, 0.9],
  );

  const basePlace = base.infoPlace ?? "bottom";
  const baseFrom = infoMotionFrom(basePlace);
  const baseInfoX = useTransform(scrollYProgress, [0, 0.15, 0.32, 0.42], [
    baseFrom.x[0],
    baseFrom.x[1],
    baseFrom.x[1],
    baseFrom.x[0],
  ]);
  const baseInfoY = useTransform(scrollYProgress, [0, 0.15, 0.32, 0.42], [
    baseFrom.y[0],
    baseFrom.y[1],
    baseFrom.y[1],
    baseFrom.y[0],
  ]);

  const coverPlace = cover?.infoPlace ?? "bottom";
  const coverFrom = infoMotionFrom(coverPlace);
  const coverInfoX = useTransform(scrollYProgress, [0.5, 0.62, 0.88, 0.98], [
    coverFrom.x[0],
    coverFrom.x[1],
    coverFrom.x[1],
    coverFrom.x[0],
  ]);
  const coverInfoY = useTransform(scrollYProgress, [0.5, 0.62, 0.88, 0.98], [
    coverFrom.y[0],
    coverFrom.y[1],
    coverFrom.y[1],
    coverFrom.y[0],
  ]);

  return (
    <section
      ref={ref}
      className="relative w-full"
      data-cover-effect={cover ? coverEffect : "solo"}
      style={{ height: reduceMotion ? (cover ? "200svh" : "100svh") : `${scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        {/* —— Fixed odd photo (parallax) —— */}
        {reduceMotion ? (
          <div className="absolute inset-0">
            <Image
              src={base.src}
              alt={base.alt}
              fill
              sizes="100vw"
              priority={priority}
              className="object-cover object-center"
            />
          </div>
        ) : (
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale: baseScale, y: baseY, x: baseParallaxX }}
          >
            <div className="absolute inset-[-16%]">
              <Image
                src={base.src}
                alt={base.alt}
                fill
                sizes="100vw"
                priority={priority}
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        )}

        {/* —— Even photo covers with unique effect —— */}
        {cover && !reduceMotion ? (
          <CoverLayer
            effect={coverEffect}
            progress={scrollYProgress}
            opacity={coverOpacity}
            src={cover.src}
            alt={cover.alt}
            priority={priority}
          />
        ) : null}
        {cover && reduceMotion ? (
          <motion.div
            className="absolute inset-0"
            style={{ opacity: coverOpacity }}
          >
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.32)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
          aria-hidden="true"
        />

        {/* Base / hero copy */}
        {overlay ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-end justify-center"
            style={reduceMotion ? undefined : { opacity: baseCopyOpacity }}
          >
            {overlay}
          </motion.div>
        ) : base.info ? (
          <InfoCopy
            alt={base.alt}
            info={base.info}
            place={basePlace}
            opacity={baseCopyOpacity}
            x={baseInfoX}
            y={baseInfoY}
            reduceMotion={!!reduceMotion}
          />
        ) : null}

        {/* Cover copy — after it lands */}
        {cover?.info ? (
          <InfoCopy
            alt={cover.alt}
            info={cover.info}
            place={coverPlace}
            opacity={coverCopyOpacity}
            x={coverInfoX}
            y={coverInfoY}
            reduceMotion={!!reduceMotion}
          />
        ) : null}
      </div>
    </section>
  );
}

function InfoCopy({
  alt,
  info,
  place,
  opacity,
  x,
  y,
  reduceMotion,
}: {
  alt: string;
  info: string;
  place: InfoPlace;
  opacity: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[place]}`}
      style={reduceMotion ? undefined : { opacity, x, y }}
    >
      <div className="max-w-md">
        <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/65 sm:text-xs">
          {alt}
        </p>
        <p className="mt-2 text-base font-light leading-snug tracking-wide text-white sm:text-lg md:text-xl">
          {info}
        </p>
      </div>
    </motion.div>
  );
}

function CoverLayer({
  effect,
  progress,
  opacity,
  src,
  alt,
  priority,
}: {
  effect: CoverEffect;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  src: string;
  alt: string;
  priority: boolean;
}) {
  // Shared settle window for cover entrance
  const t0 = 0.3;
  const t1 = 0.72;

  const zoomOutScale = useTransform(progress, [t0, t1], [1.9, 1]);
  const zoomOutY = useTransform(progress, [t0, t1], ["4%", "0%"]);

  const slideUpY = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideUpScale = useTransform(progress, [t0, t1], [1.12, 1]);

  const slideLeftX = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideLeftScale = useTransform(progress, [t0, t1], [1.1, 1]);
  const slideLeftParallax = useTransform(progress, [t0, 1], ["0%", "-4%"]);

  const slideRightX = useTransform(progress, [t0, t1], ["-100%", "0%"]);
  const slideRightScale = useTransform(progress, [t0, t1], [1.1, 1]);
  const slideRightParallax = useTransform(progress, [t0, 1], ["0%", "4%"]);

  const parallaxScale = useTransform(progress, [t0, t1, 1], [1.45, 1.08, 1.12]);
  const parallaxY = useTransform(progress, [t0, t1, 1], ["28%", "0%", "-6%"]);

  const wipeClip = useTransform(
    progress,
    [t0, t1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const wipeScale = useTransform(progress, [t0, 1], [1.15, 1.06]);
  const wipeY = useTransform(progress, [t0, 1], ["0%", "-5%"]);

  const driftX = useTransform(progress, [t0, t1, 1], ["32%", "0%", "-3%"]);
  const driftScale = useTransform(progress, [t0, t1, 1], [1.35, 1.05, 1.1]);
  const driftY = useTransform(progress, [t0, 1], ["6%", "-4%"]);

  const style =
    effect === "zoomOut"
      ? { opacity, scale: zoomOutScale, y: zoomOutY }
      : effect === "slideUp"
        ? { opacity, y: slideUpY, scale: slideUpScale }
        : effect === "slideLeft"
          ? { opacity, x: slideLeftX, scale: slideLeftScale, y: slideLeftParallax }
          : effect === "slideRight"
            ? {
                opacity,
                x: slideRightX,
                scale: slideRightScale,
                y: slideRightParallax,
              }
            : effect === "parallaxZoom"
              ? { opacity, scale: parallaxScale, y: parallaxY }
              : effect === "wipeUp"
                ? { opacity, clipPath: wipeClip, scale: wipeScale, y: wipeY }
                : { opacity, x: driftX, scale: driftScale, y: driftY };

  return (
    <motion.div
      className="absolute inset-0 z-[2] will-change-transform"
      style={style}
    >
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
