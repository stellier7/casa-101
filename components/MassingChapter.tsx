"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useQuietView } from "@/components/QuietView";
import { useMediaQuery } from "@/lib/media";
import { PROPERTY } from "@/lib/property";
import { registerMotion, ScrollTrigger } from "@/lib/motion";
import { photoOverlayOpacity } from "@/lib/massing";

const HouseCanvas = dynamic(() => import("@/components/HouseCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#070604]" aria-hidden="true" />,
});

function MassingPoster() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-[#f4efe6] px-5 py-10 sm:px-10">
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
  );
}

class WebGlGate extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function MassingChapter() {
  const { quiet } = useQuietView();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const still = quiet || reduce;

  useEffect(() => {
    if (still) return;
    registerMotion();
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.55,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        invalidateRef.current?.();
        const overlay = photoOverlayOpacity(self.progress);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String(overlay);
        }
        if (copyRef.current) {
          const copyFade = 1 - Math.min(1, Math.max(0, (self.progress - 0.28) / 0.35));
          copyRef.current.style.opacity = String(copyFade);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [still]);

  if (still) {
    return (
      <section
        id="planta"
        className="relative min-h-[100svh] w-full"
        aria-label="Planta arquitectónica"
      >
        <MassingPoster />
      </section>
    );
  }

  return (
    <section
      id="planta"
      ref={sectionRef}
      className="relative w-full bg-[#070604]"
      style={{ height: mobile ? "190vh" : "260vh" }}
      aria-label="De la planta al volumen"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#070604]">
        <WebGlGate fallback={<MassingPoster />}>
          <div className="absolute inset-0">
            <HouseCanvas
              progressRef={progressRef}
              invalidateRef={invalidateRef}
            />
          </div>
        </WebGlGate>

        <div
          ref={copyRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-20 text-center text-white sm:px-10 sm:pt-24"
        >
          <p className="text-[0.65rem] tracking-[0.32em] uppercase text-white/65">
            Del plano al volumen
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight sm:text-6xl md:text-7xl">
            El lote se vuelve casa
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light tracking-wide text-white/75 sm:text-base">
            {PROPERTY.specs[0].value} de terreno. La cámara baja del plano a la
            piscina.
          </p>
        </div>

        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-20 opacity-0"
        >
          <Image
            src="/photos/04-piscina-fachada.jpg"
            alt="Piscina y fachada de Casa 101"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
            aria-hidden="true"
          />
          <p className="absolute bottom-10 left-0 right-0 text-center text-sm tracking-[0.2em] uppercase text-white/80">
            Piscina 32 m² · jardines en tres costados
          </p>
        </div>
      </div>
    </section>
  );
}
