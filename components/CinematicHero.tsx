import Image from "next/image";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HERO_PLANES } from "@/lib/hero";
import { PROPERTY } from "@/lib/property";

export function CinematicHero() {
  return (
    <section
      className="relative isolate h-[100svh] w-full overflow-hidden bg-[#070604] text-white"
      aria-label="Casa 101"
    >
      {HERO_PLANES.map((plane) => (
        <div
          key={plane.id}
          className={`hero-plane hero-plane-${plane.id} absolute inset-0`}
          style={{
            transform: `scale(${plane.scale})`,
            opacity: plane.opacity,
            zIndex: plane.id === "subject" ? 3 : plane.id === "mid" ? 2 : 1,
          }}
        >
          <Image
            src={plane.src}
            alt={plane.id === "subject" ? plane.alt : ""}
            fill
            priority={plane.id === "subject"}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-t from-black/75 via-black/15 to-black/35"
        aria-hidden="true"
      />
      <div className="film-grain z-[5]" aria-hidden="true" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-5 pb-16 text-center sm:px-10 sm:pb-20">
        <p className="text-[0.7rem] tracking-[0.34em] uppercase text-white/75 sm:text-xs">
          {PROPERTY.location}
        </p>
        <h1 className="font-display mt-4 text-6xl leading-[0.9] sm:text-8xl md:text-9xl">
          {PROPERTY.name}
        </h1>
        <p className="mt-5 text-lg font-light tracking-[0.18em] text-white/95 sm:text-2xl">
          {PROPERTY.price}
        </p>
        <p className="mt-2 text-xs tracking-wide text-white/70 sm:text-sm">
          {PROPERTY.locationCity}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
          <WhatsAppButton property={PROPERTY} variant="ghost" />
          <a
            href="#recorrido"
            className="text-xs tracking-[0.22em] uppercase text-white/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Recorrer la casa
          </a>
        </div>
      </div>
    </section>
  );
}
