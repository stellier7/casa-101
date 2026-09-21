"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

/** true below Tailwind `md` (768px) — letterbox full photos on phones */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

/**
 * Astra-style pair: odd photo holds with parallax; even photo covers it.
 * Mobile: letterboxed object-contain so the whole image is visible.
 * Desktop: immersive object-cover fullscreen.
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
  const isMobile = useIsMobile();
  // Contain on phone = show entire photo; cover on desktop = fill viewport
  const fitClass = isMobile ? "object-contain object-center" : "object-cover object-center";
  const bleedClass = isMobile ? "absolute inset-0" : "absolute inset-[-16%]";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Parallax: gentler on mobile so letterboxed images don’t feel jittery
  const baseScale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [1, 1.04] : [1.04, 1.14],
  );
  const baseY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "-3%"] : ["0%", "-8%"],
  );
  const baseParallaxX = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "0%"] : ["0%", "-2%"],
  );

  const baseCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.26, 0.36],
    [0.45, 1, 1, 0],
  );

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

  // Shorter scrub on mobile — less thumb fatigue
  const sectionVh = isMobile
    ? cover
      ? 220
      : 140
    : scrollVh;

  return (
    <section
      ref={ref}
      className="relative w-full"
      data-cover-effect={cover ? coverEffect : "solo"}
      data-fit={isMobile ? "contain" : "cover"}
      style={{
        height: reduceMotion
          ? cover
            ? "200svh"
            : "100svh"
          : `${sectionVh}vh`,
      }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
        {/*
          Mobile: centered 4:3 cinema band — full photo visible, intentional letterbox.
          Desktop: stage fills the viewport (immersive cover).
        */}
        <div
          className={
            isMobile
              ? "relative aspect-[4/3] w-full max-h-[72svh] max-w-[min(100%,calc(72svh*4/3))] overflow-hidden"
              : "relative h-full w-full"
          }
        >
          {reduceMotion ? (
            <div className="absolute inset-0">
              <Image
                src={base.src}
                alt={base.alt}
                fill
                sizes="100vw"
                priority={priority}
                className={fitClass}
              />
            </div>
          ) : (
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ scale: baseScale, y: baseY, x: baseParallaxX }}
            >
              <div className={bleedClass}>
                <Image
                  src={base.src}
                  alt={base.alt}
                  fill
                  sizes="100vw"
                  priority={priority}
                  className={fitClass}
                />
              </div>
            </motion.div>
          )}

          {cover && !reduceMotion ? (
            <CoverLayer
              effect={coverEffect}
              progress={scrollYProgress}
              opacity={coverOpacity}
              src={cover.src}
              alt={cover.alt}
              priority={priority}
              fitClass={fitClass}
              bleedClass={bleedClass}
              isMobile={isMobile}
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
                className={fitClass}
              />
            </motion.div>
          ) : null}

          <div
            className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
            aria-hidden="true"
          />

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
              isMobile={isMobile}
            />
          ) : null}

          {cover?.info ? (
            <InfoCopy
              alt={cover.alt}
              info={cover.info}
              place={coverPlace}
              opacity={coverCopyOpacity}
              x={coverInfoX}
              y={coverInfoY}
              reduceMotion={!!reduceMotion}
              isMobile={isMobile}
            />
          ) : null}
        </div>
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
  isMobile,
}: {
  alt: string;
  info: string;
  place: InfoPlace;
  opacity: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
  reduceMotion: boolean;
  isMobile: boolean;
}) {
  // On phones, park side placements along the bottom so they sit in the letterbox band
  const resolvedPlace: InfoPlace = isMobile
    ? place === "left" || place === "top-left"
      ? "bottom-left"
      : place === "right" || place === "top-right"
        ? "bottom-right"
        : place === "top"
          ? "bottom"
          : place
    : place;

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[resolvedPlace]}`}
      style={reduceMotion ? undefined : { opacity, x, y }}
    >
      <div className="max-w-[min(100%,22rem)] rounded-sm bg-black/25 px-3 py-2 backdrop-blur-[2px] sm:max-w-md sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-white/70 sm:text-xs sm:tracking-[0.28em] sm:text-white/65">
          {alt}
        </p>
        <p className="mt-1.5 text-[0.95rem] font-light leading-snug tracking-wide text-white sm:mt-2 sm:text-lg md:text-xl">
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
  fitClass,
  bleedClass,
  isMobile,
}: {
  effect: CoverEffect;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  src: string;
  alt: string;
  priority: boolean;
  fitClass: string;
  bleedClass: string;
  isMobile: boolean;
}) {
  const t0 = 0.3;
  const t1 = 0.72;

  const zoomOutScale = useTransform(
    progress,
    [t0, t1],
    isMobile ? [1.35, 1] : [1.9, 1],
  );
  const zoomOutY = useTransform(progress, [t0, t1], ["4%", "0%"]);

  const slideUpY = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideUpScale = useTransform(progress, [t0, t1], [1.08, 1]);

  const slideLeftX = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideLeftScale = useTransform(progress, [t0, t1], [1.06, 1]);
  const slideLeftParallax = useTransform(
    progress,
    [t0, 1],
    isMobile ? ["0%", "-2%"] : ["0%", "-4%"],
  );

  const slideRightX = useTransform(progress, [t0, t1], ["-100%", "0%"]);
  const slideRightScale = useTransform(progress, [t0, t1], [1.06, 1]);
  const slideRightParallax = useTransform(
    progress,
    [t0, 1],
    isMobile ? ["0%", "2%"] : ["0%", "4%"],
  );

  const parallaxScale = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? [1.2, 1.04, 1.06] : [1.45, 1.08, 1.12],
  );
  const parallaxY = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? ["18%", "0%", "-3%"] : ["28%", "0%", "-6%"],
  );

  const wipeClip = useTransform(
    progress,
    [t0, t1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const wipeScale = useTransform(progress, [t0, 1], [1.08, 1.03]);
  const wipeY = useTransform(progress, [t0, 1], ["0%", "-3%"]);

  const driftX = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? ["18%", "0%", "-2%"] : ["32%", "0%", "-3%"],
  );
  const driftScale = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? [1.15, 1.03, 1.05] : [1.35, 1.05, 1.1],
  );
  const driftY = useTransform(progress, [t0, 1], ["4%", "-2%"]);

  const style =
    effect === "zoomOut"
      ? { opacity, scale: zoomOutScale, y: zoomOutY }
      : effect === "slideUp"
        ? { opacity, y: slideUpY, scale: slideUpScale }
        : effect === "slideLeft"
          ? {
              opacity,
              x: slideLeftX,
              scale: slideLeftScale,
              y: slideLeftParallax,
            }
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
      <div className={bleedClass}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={priority}
          className={fitClass}
        />
      </div>
    </motion.div>
  );
}
