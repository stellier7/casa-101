import Image from "next/image";
import { PROPERTY } from "@/lib/property";

export function MassingChapter() {
  return (
    <section
      id="planta"
      className="relative min-h-[100svh] w-full bg-[#f4efe6]"
      aria-label="Planta arquitectónica"
    >
      <div className="flex min-h-[100svh] w-full flex-col justify-center px-5 py-16 sm:px-10">
        <p className="text-center text-[0.65rem] tracking-[0.28em] uppercase text-[#6b635b]">
          Planta arquitectónica
        </p>
        <h2 className="font-display mt-2 text-center text-3xl text-[#1c1917] sm:text-5xl">
          El lote se vuelve casa
        </h2>
        <div className="mx-auto mt-8 grid w-full max-w-4xl gap-6 sm:grid-cols-2">
          {PROPERTY.floorPlans.map((plan) => (
            <figure key={plan.src} className="bg-white/70">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={plan.src}
                  alt={plan.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="py-2 text-center text-xs tracking-[0.16em] uppercase text-[#6b635b]">
                {plan.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
