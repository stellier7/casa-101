"use client";

import { CinematicPair } from "@/components/CinematicPair";
import { COVER_EFFECTS, chunkPhotoPairs } from "@/lib/cinematic";
import { PROPERTY } from "@/lib/property";

/** Immersive photo walk — Lenis / quiet view live on the page shell. */
export function ImmersiveStory() {
  const pairs = chunkPhotoPairs(PROPERTY.photos);

  return (
    <div id="recorrido" className="w-full bg-black">
      {pairs.map(([base, cover], pairIndex) => {
        const coverEffect = COVER_EFFECTS[pairIndex % COVER_EFFECTS.length];
        const isHero = pairIndex === 0;

        return (
          <CinematicPair
            key={base.src}
            base={base}
            cover={cover}
            coverEffect={coverEffect}
            baseIndex={pairIndex * 2}
            priority={pairIndex === 0}
            isHero={isHero}
            scrollVh={cover ? 300 : 200}
          />
        );
      })}
    </div>
  );
}
