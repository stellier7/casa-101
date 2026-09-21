"use client";

import { CinematicPair } from "@/components/CinematicPair";
import {
  QuietViewProvider,
  QuietViewToggle,
} from "@/components/QuietView";
import { SmoothScroll } from "@/components/SmoothScroll";
import { COVER_EFFECTS, chunkPhotoPairs } from "@/lib/cinematic";
import { PROPERTY } from "@/lib/property";

/** Client island: Lenis + quiet view + immersive photo story */
export function ImmersiveStory() {
  const pairs = chunkPhotoPairs(PROPERTY.photos);

  return (
    <QuietViewProvider>
      <SmoothScroll>
        <div className="w-full bg-black">
          {pairs.map(([base, cover], pairIndex) => {
            const coverEffect =
              COVER_EFFECTS[pairIndex % COVER_EFFECTS.length];
            const isHero = pairIndex === 0;

            return (
              <CinematicPair
                key={base.src}
                base={base}
                cover={cover}
                coverEffect={coverEffect}
                priority={pairIndex === 0}
                isHero={isHero}
                scrollVh={cover ? 300 : 200}
                overlay={
                  isHero ? (
                    <div className="w-full px-5 pb-16 pt-24 text-center text-white sm:px-10 sm:pb-24 sm:pt-28">
                      <h1 className="text-5xl font-light tracking-[0.06em] sm:text-7xl md:text-8xl">
                        {PROPERTY.name}
                      </h1>
                      <p className="mt-4 text-xs font-light tracking-[0.28em] uppercase text-white/80 sm:mt-5 sm:text-base">
                        {PROPERTY.location}
                      </p>
                      <p className="mt-6 text-lg font-light tracking-wide text-white/95 sm:mt-8 sm:text-2xl">
                        {PROPERTY.price}
                      </p>
                    </div>
                  ) : undefined
                }
              />
            );
          })}
        </div>
        <QuietViewToggle />
      </SmoothScroll>
    </QuietViewProvider>
  );
}
