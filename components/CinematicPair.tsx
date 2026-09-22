"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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
import {
  MAGNET_BASE_PROGRESS,
  MAGNET_COVER_PROGRESS,
} from "@/lib/scroll-magnet";

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
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
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
      className="absolute top-0 h-full w-[155%]"
      style={{ x, willChange: "transform" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="155vw"
        priority={priority}
        className="object-cover object-center"
      />
    </motion.div>
  );
}

function QuietFrame({
  photo,
  overlay,
  priority,
}: {
  photo: PhotoChapter;
  overlay?: ReactNode;
  priority?: boolean;
}) {
  // Quiet / reduced-motion: static full-bleed frames only — no ken-burns pan
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover object-center"
      />
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
            <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/85">
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
        <QuietFrame photo={base} overlay={overlay} priority={priority} />
        {cover ? <QuietFrame photo={cover} /> : null}
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
      scrollVh={isMobile ? (cover ? 220 : 160) : scrollVh}
      isHero={isHero}
      isMobile={isMobile}
    />
  );
}

/**
 * Reversible hysteresis: cover “owns” the frame after settle to absorb sticky
 * unpin jitter, but releases when the user scrolls back into the base band.
 */
function useCoverOwns(
  progress: MotionValue<number>,
  enabled: boolean,
  ownAt: number,
  releaseAt: number,
) {
  const [owns, setOwns] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    if (!enabled) return;
    if (v >= ownAt) setOwns(true);
    else if (v <= releaseAt) setOwns(false);
  });
  return owns;
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

  const isSlideUp = coverEffect === "slideUp";
  const ownAt = isSlideUp ? 0.78 : 0.72;
  const releaseAt = 0.38;
  const coverOwns = useCoverOwns(scrollYProgress, Boolean(cover), ownAt, releaseAt);

  const basePan = isMobile && needsWidePan(base.orientation);
  const baseDir = panDirectionForIndex(baseIndex);

  // Finish the wide-photo pan during the hold beat, before the cover arrives
  const basePanProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  /**
   * Slide-up: keep the back photo almost fixed (tiny parallax) so the
   * incoming frame feels like it’s rising over a locked background.
   * Other effects: normal Ken Burns.
   */
  const baseScale = useTransform(
    scrollYProgress,
    [0, 0.34, 0.72, 1],
    isSlideUp
      ? [1.03, 1.04, 1.05, 1.05]
      : basePan
        ? [1, 1, 1, 1]
        : isMobile
          ? [1.08, 1.1, 1.14, 1.16]
          : [1.05, 1.08, 1.14, 1.18],
  );
  const baseY = useTransform(
    scrollYProgress,
    [0, 0.34, 0.72, 1],
    isSlideUp
      ? ["0%", "0%", "-1.5%", "-2%"]
      : basePan
        ? ["0%", "0%", "0%", "0%"]
        : isMobile
          ? ["0%", "-1%", "-3%", "-5%"]
          : ["0%", "-2%", "-6%", "-9%"],
  );

  /**
   * Overlapping crossfade — cover reaches full opacity before base is gone
   * so sticky jitter never flashes black between layers.
   */
  const baseLayerOpacity = useTransform(
    scrollYProgress,
    isSlideUp ? [0.5, 0.72] : [0.4, 0.55],
    [1, 0],
  );
  const coverOpacity = useTransform(
    scrollYProgress,
    isSlideUp ? [0.34, 0.55] : [0.32, 0.48],
    [0, 1],
  );

  const baseCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.22, 0.32],
    [0.5, 1, 1, 0],
  );
  const coverCopyOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.66, 0.9, 1],
    [0, 1, 1, 1],
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

  const parallaxActive = isHero && !isMobile && !coverOwns;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black touch-pan-y"
      data-cover-effect={cover ? coverEffect : "solo"}
      data-pan={basePan ? baseDir : undefined}
      data-magnet-base={MAGNET_BASE_PROGRESS}
      data-magnet-cover={cover ? MAGNET_COVER_PROGRESS : undefined}
      style={{ height: `${scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full touch-pan-y overflow-hidden bg-black">
        <motion.div
          className="absolute inset-0"
          style={{
            scale: baseScale,
            y: baseY,
            opacity: coverOwns ? 0 : baseLayerOpacity,
            pointerEvents: coverOwns ? "none" : undefined,
            willChange: "transform",
          }}
          aria-hidden={coverOwns}
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
            <CursorParallax enabled={parallaxActive} strength={22}>
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
            opacity={coverOwns ? undefined : coverOpacity}
            forceOpaque={coverOwns}
            src={cover.src}
            alt={cover.alt}
            priority={false}
            isMobile={isMobile}
            orientation={cover.orientation}
            photoIndex={baseIndex + 1}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/60 via-transparent to-black/15"
          aria-hidden="true"
        />

        {!coverOwns && overlay ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-end justify-center"
            style={{ opacity: baseCopyOpacity }}
          >
            {overlay}
          </motion.div>
        ) : null}
        {!coverOwns && !overlay && base.info ? (
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
            opacity={coverOwns ? undefined : coverCopyOpacity}
            forceVisible={coverOwns}
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
  forceVisible,
  x,
  y,
}: {
  alt: string;
  info: string;
  place: InfoPlace;
  opacity?: MotionValue<number>;
  forceVisible?: boolean;
  x: MotionValue<string>;
  y: MotionValue<string>;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[place]}`}
      style={forceVisible ? { opacity: 1 } : { opacity, x, y }}
    >
      <div className="max-w-[min(100%,24rem)]">
        <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/85 sm:text-xs">
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
  forceOpaque,
  src,
  alt,
  priority,
  isMobile,
  orientation,
  photoIndex,
}: {
  effect: CoverEffect;
  progress: MotionValue<number>;
  opacity?: MotionValue<number>;
  forceOpaque: boolean;
  src: string;
  alt: string;
  priority: boolean;
  isMobile: boolean;
  orientation?: PhotoOrientation;
  photoIndex: number;
}) {
  const t0 = 0.34;
  const t1 = 0.78;
  const pan = isMobile && needsWidePan(orientation);
  const dir = panDirectionForIndex(photoIndex);

  const zoomOutScale = useTransform(
    progress,
    [t0, t1],
    isMobile ? [1.5, 1] : [1.85, 1],
  );

  const slideUpY = useTransform(progress, [t0, t1], ["105%", "0%"]);
  const slideLeftX = useTransform(progress, [t0, t1], ["105%", "0%"]);
  const slideRightX = useTransform(progress, [t0, t1], ["-105%", "0%"]);

  const slideFade = useTransform(
    progress,
    [t0, t0 + 0.12, t1 - 0.06, t1],
    [0, 0.45, 0.92, 1],
  );

  const parallaxScale = useTransform(
    progress,
    [t0, t1],
    isMobile ? [1.25, 1.06] : [1.4, 1.08],
  );
  const parallaxY = useTransform(
    progress,
    [t0, t1],
    isMobile ? ["18%", "0%"] : ["26%", "0%"],
  );
  const wipeClip = useTransform(
    progress,
    [t0, t1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const driftX = useTransform(
    progress,
    [t0, t1],
    isMobile ? ["18%", "0%"] : ["28%", "0%"],
  );
  const driftScale = useTransform(
    progress,
    [t0, t1],
    isMobile ? [1.2, 1.05] : [1.32, 1.06],
  );
  const driftFade = useTransform(
    progress,
    [t0, t0 + 0.1, t1],
    [0, 0.55, 1],
  );

  const coverPanProgress = useTransform(progress, [0.5, 1], [0, 1]);

  const media = pan ? (
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
  );

  // Single motion tree for the whole pair life — no remount on settle
  const motionStyle =
    effect === "zoomOut"
      ? {
          opacity: forceOpaque ? 1 : opacity,
          scale: forceOpaque ? 1 : zoomOutScale,
        }
      : effect === "slideUp"
        ? {
            opacity: forceOpaque ? 1 : slideFade,
            y: forceOpaque ? "0%" : slideUpY,
          }
        : effect === "slideLeft"
          ? {
              opacity: forceOpaque ? 1 : slideFade,
              x: forceOpaque ? "0%" : slideLeftX,
            }
          : effect === "slideRight"
            ? {
                opacity: forceOpaque ? 1 : slideFade,
                x: forceOpaque ? "0%" : slideRightX,
              }
            : effect === "parallaxZoom"
              ? {
                  opacity: forceOpaque ? 1 : opacity,
                  scale: forceOpaque ? 1.08 : parallaxScale,
                  y: forceOpaque ? "0%" : parallaxY,
                }
              : effect === "wipeUp"
                ? {
                    opacity: forceOpaque ? 1 : opacity,
                    clipPath: forceOpaque
                      ? "inset(0% 0% 0% 0%)"
                      : wipeClip,
                  }
                : {
                    opacity: forceOpaque ? 1 : driftFade,
                    x: forceOpaque ? "0%" : driftX,
                    scale: forceOpaque ? 1.06 : driftScale,
                  };

  return (
    <motion.div
      className="absolute inset-0 z-[2] overflow-hidden bg-black"
      style={{ ...motionStyle, willChange: "transform" }}
    >
      {media}
    </motion.div>
  );
}
