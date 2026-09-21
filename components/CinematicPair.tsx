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
import { CursorParallax } from "@/components/CursorParallax";
import { useQuietView } from "@/components/QuietView";
import type { CoverEffect } from "@/lib/cinematic";
import {
  panDirectionForIndex,
  type PanDirection,
  type PhotoOrientation,
} from "@/lib/photo-frame";
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
  orientation?: PhotoOrientation;
};

type CinematicPairProps = {
  base: PhotoChapter;
  cover?: PhotoChapter;
  coverEffect: CoverEffect;
  /** Global photo index for base (0, 2, 4…) — drives LTR / RTL pan */
  baseIndex: number;
  priority?: boolean;
  overlay?: ReactNode;
  scrollVh?: number;
  isHero?: boolean;
};

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

function needsWidePan(orientation?: PhotoOrientation) {
  return orientation === "landscape" || orientation === "square";
}

/**
 * Landscape on a tall phone: image is wider than the viewport.
 * We fill height and pan horizontally so you see the whole frame.
 */
function LandscapePanScrub({
  src,
  alt,
  priority,
  direction,
  progress,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  direction: PanDirection;
  progress: MotionValue<number>;
}) {
  const x = useTransform(
    progress,
    [0, 1],
    direction === "ltr" ? ["0%", "-36%"] : ["-36%", "0%"],
  );

  return (
    <motion.div
      className="absolute top-0 h-full w-[155%] will-change-transform"
      style={{ x }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="200vw"
        priority={priority}
        className="object-cover object-center"
      />
    </motion.div>
  );
}

function LandscapePanLoop({
  src,
  alt,
  priority,
  direction,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  direction: PanDirection;
}) {
  return (
    <div
      className={`absolute top-0 h-full w-[155%] will-change-transform ${
        direction === "ltr" ? "animate-pan-ltr" : "animate-pan-rtl"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="200vw"
        priority={priority}
        className="object-cover object-center"
      />
    </div>
  );
}

function QuietFrame({
  photo,
  overlay,
  priority,
  photoIndex,
}: {
  photo: PhotoChapter;
  overlay?: ReactNode;
  priority?: boolean;
  photoIndex: number;
}) {
  const pan = needsWidePan(photo.orientation);
  const direction = panDirectionForIndex(photoIndex);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {pan ? (
        <LandscapePanLoop
          src={photo.src}
          alt={photo.alt}
          priority={priority}
          direction={direction}
        />
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover object-center"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
        aria-hidden="true"
      />
      {overlay ? (
        <div className="absolute inset-0 z-10 flex items-end justify-center">
          {overlay}
        </div>
      ) : photo.info ? (
        <div
          className={`absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[photo.infoPlace ?? "bottom"]}`}
        >
          <div className="max-w-md px-1">
            <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/70">
              {photo.alt}
            </p>
            <p className="mt-2 text-xl font-light leading-snug text-white sm:text-2xl">
              {photo.info}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function CinematicPair({
  base,
  cover,
  coverEffect,
  baseIndex,
  priority = false,
  overlay,
  scrollVh = 280,
  isHero = false,
}: CinematicPairProps) {
  const { quiet } = useQuietView();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);

  if (quiet || reduceMotion) {
    return (
      <>
        <QuietFrame
          photo={base}
          overlay={overlay}
          priority={priority}
          photoIndex={baseIndex}
        />
        {cover ? (
          <QuietFrame photo={cover} photoIndex={baseIndex + 1} />
        ) : null}
      </>
    );
  }

  return (
    <ImmersivePair
      sectionRef={ref}
      base={base}
      cover={cover}
      coverEffect={coverEffect}
      baseIndex={baseIndex}
      priority={priority}
      overlay={overlay}
      scrollVh={isMobile ? (cover ? 260 : 180) : scrollVh}
      isHero={isHero}
      isMobile={isMobile}
    />
  );
}

function ImmersivePair({
  sectionRef,
  base,
  cover,
  coverEffect,
  baseIndex,
  priority,
  overlay,
  scrollVh,
  isHero,
  isMobile,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  base: PhotoChapter;
  cover?: PhotoChapter;
  coverEffect: CoverEffect;
  baseIndex: number;
  priority: boolean;
  overlay?: ReactNode;
  scrollVh: number;
  isHero: boolean;
  isMobile: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const basePan = isMobile && needsWidePan(base.orientation);
  const baseDir = panDirectionForIndex(baseIndex);

  // Finish the wide-photo pan during the hold beat, before the cover arrives
  const basePanProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Portrait / desktop: classic Ken Burns scale. Landscape mobile: horizontal reveal pan.
  const baseScale = useTransform(
    scrollYProgress,
    [0, 1],
    basePan ? [1, 1] : isMobile ? [1.08, 1.16] : [1.05, 1.18],
  );
  const baseY = useTransform(
    scrollYProgress,
    [0, 1],
    basePan ? ["0%", "0%"] : isMobile ? ["0%", "-5%"] : ["0%", "-9%"],
  );

  const baseCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.22, 0.32],
    [0.5, 1, 1, 0],
  );
  const coverOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.48, 0.85, 0.98],
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

  const resolvedBasePlace: InfoPlace = isMobile
    ? remapPlace(basePlace)
    : basePlace;
  const resolvedCoverPlace: InfoPlace = isMobile
    ? remapPlace(coverPlace)
    : coverPlace;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      data-cover-effect={cover ? coverEffect : "solo"}
      data-pan={basePan ? baseDir : undefined}
      style={{ height: `${scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: baseScale, y: baseY }}
        >
          {basePan ? (
            <LandscapePanScrub
              src={base.src}
              alt={base.alt}
              priority={priority}
              direction={baseDir}
              progress={basePanProgress}
            />
          ) : isHero ? (
            <CursorParallax enabled={!isMobile} strength={22}>
              <Image
                src={base.src}
                alt={base.alt}
                fill
                sizes="100vw"
                priority={priority}
                className="object-cover object-center"
              />
            </CursorParallax>
          ) : (
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
          )}
        </motion.div>

        {cover ? (
          <CoverLayer
            effect={coverEffect}
            progress={scrollYProgress}
            opacity={coverOpacity}
            src={cover.src}
            alt={cover.alt}
            priority={priority}
            isMobile={isMobile}
            orientation={cover.orientation}
            photoIndex={baseIndex + 1}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/60 via-transparent to-black/15"
          aria-hidden="true"
        />

        {overlay ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-end justify-center"
            style={{ opacity: baseCopyOpacity }}
          >
            {overlay}
          </motion.div>
        ) : base.info ? (
          <InfoCopy
            alt={base.alt}
            info={base.info}
            place={resolvedBasePlace}
            opacity={baseCopyOpacity}
            x={baseInfoX}
            y={baseInfoY}
          />
        ) : null}

        {cover?.info ? (
          <InfoCopy
            alt={cover.alt}
            info={cover.info}
            place={resolvedCoverPlace}
            opacity={coverCopyOpacity}
            x={coverInfoX}
            y={coverInfoY}
          />
        ) : null}
      </div>
    </section>
  );
}

function remapPlace(place: InfoPlace): InfoPlace {
  if (place === "left" || place === "top-left") return "bottom-left";
  if (place === "right" || place === "top-right") return "bottom-right";
  if (place === "top") return "bottom";
  return place;
}

function InfoCopy({
  alt,
  info,
  place,
  opacity,
  x,
  y,
}: {
  alt: string;
  info: string;
  place: InfoPlace;
  opacity: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[place]}`}
      style={{ opacity, x, y }}
    >
      <div className="max-w-[min(100%,24rem)]">
        <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/70 sm:text-xs">
          {alt}
        </p>
        <p className="mt-2 text-2xl font-light leading-tight tracking-wide text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl">
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
  isMobile,
  orientation,
  photoIndex,
}: {
  effect: CoverEffect;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  src: string;
  alt: string;
  priority: boolean;
  isMobile: boolean;
  orientation?: PhotoOrientation;
  photoIndex: number;
}) {
  const t0 = 0.34;
  const t1 = 0.72;
  const pan = isMobile && needsWidePan(orientation);
  const dir = panDirectionForIndex(photoIndex);

  const zoomOutScale = useTransform(
    progress,
    [t0, t1],
    isMobile ? [1.5, 1] : [1.85, 1],
  );
  const slideUpY = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideLeftX = useTransform(progress, [t0, t1], ["100%", "0%"]);
  const slideRightX = useTransform(progress, [t0, t1], ["-100%", "0%"]);
  const parallaxScale = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? [1.25, 1.06, 1.1] : [1.4, 1.08, 1.14],
  );
  const parallaxY = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? ["18%", "0%", "-4%"] : ["26%", "0%", "-6%"],
  );
  const wipeClip = useTransform(
    progress,
    [t0, t1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const driftX = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? ["18%", "0%", "-2%"] : ["28%", "0%", "-3%"],
  );
  const driftScale = useTransform(
    progress,
    [t0, t1, 1],
    isMobile ? [1.2, 1.05, 1.08] : [1.32, 1.06, 1.1],
  );

  // Cover entrance still uses pair effect; once settled, landscape keeps panning
  const coverPanProgress = useTransform(progress, [0.48, 1], [0, 1]);

  const style =
    effect === "zoomOut"
      ? { opacity, scale: zoomOutScale }
      : effect === "slideUp"
        ? { opacity, y: slideUpY }
        : effect === "slideLeft"
          ? { opacity, x: slideLeftX }
          : effect === "slideRight"
            ? { opacity, x: slideRightX }
            : effect === "parallaxZoom"
              ? { opacity, scale: parallaxScale, y: parallaxY }
              : effect === "wipeUp"
                ? { opacity, clipPath: wipeClip }
                : { opacity, x: driftX, scale: driftScale };

  return (
    <motion.div
      className="absolute inset-0 z-[2] overflow-hidden bg-black will-change-transform"
      style={style}
    >
      {pan ? (
        <LandscapePanScrub
          src={src}
          alt={alt}
          priority={priority}
          direction={dir}
          progress={coverPanProgress}
        />
      ) : (
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
      )}
    </motion.div>
  );
}
