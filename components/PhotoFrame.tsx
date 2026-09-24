import Image from "next/image";
import {
  panDirectionForIndex,
  type PhotoOrientation,
} from "@/lib/photo-frame";
import { INFO_PLACE_CLASS, type InfoPlace } from "@/lib/photo-info";

export type PhotoChapter = {
  src: string;
  alt: string;
  info?: string | null;
  infoPlace?: InfoPlace;
  orientation?: PhotoOrientation;
};

function needsWidePan(orientation?: PhotoOrientation) {
  return orientation === "landscape" || orientation === "square";
}

export function PhotoFrame({
  photo,
  priority = false,
  photoIndex,
}: {
  photo: PhotoChapter;
  priority?: boolean;
  photoIndex: number;
}) {
  const pan = needsWidePan(photo.orientation);
  const direction = panDirectionForIndex(photoIndex);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {pan ? (
        <div
          className={`absolute top-0 h-full w-[155%] ${
            direction === "ltr" ? "animate-pan-ltr" : "animate-pan-rtl"
          }`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="200vw"
            priority={priority}
            className="object-cover object-center"
          />
        </div>
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/15"
        aria-hidden="true"
      />
      {photo.info ? (
        <div
          className={`absolute inset-0 z-10 flex ${INFO_PLACE_CLASS[photo.infoPlace ?? "bottom"]}`}
        >
          <div className="max-w-md px-1">
            <p className="text-[0.65rem] tracking-[0.28em] uppercase text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {photo.alt}
            </p>
            <p className="mt-2 text-xl font-light leading-snug text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] sm:text-2xl">
              {photo.info}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
