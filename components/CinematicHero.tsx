"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { useLenisScroll } from "@/components/SmoothScroll";
import { useQuietView } from "@/components/QuietView";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HERO_PLANES } from "@/lib/hero";
import { gsap, registerMotion, SplitText } from "@/lib/motion";
import { PROPERTY } from "@/lib/property";

export function CinematicHero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { quiet } = useQuietView();
  const scroll = useLenisScroll();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced =
      quiet || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const setPointer = (x: number, y: number) => {
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
    };
    setPointer(0, 0);

    if (reduced || coarse) return;

    const onMove = (e: MouseEvent) => {
      setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [quiet]);

  useEffect(() => {
    if (quiet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const title = titleRef.current;
    if (!title) return;

    registerMotion();
    const split = SplitText.create(title, {
      type: "words",
      mask: "words",
      aria: "none",
    });
    const tl = gsap.timeline();
    tl.from(
      split.words,
      {
        yPercent: 70,
        opacity: 0,
        stagger: 0.1,
        duration: 1.05,
        ease: "power3.out",
      },
      0.15,
    );
    tl.from(
      ".hero-plane-subject",
      { scale: 1.12, duration: 1.5, ease: "power2.out" },
      0,
    );
    tl.from(
      ".hero-kicker, .hero-price",
      { opacity: 0, y: 12, duration: 0.7, stagger: 0.08, ease: "power2.out" },
      0.45,
    );

    return () => {
      tl.kill();
      split.revert();
    };
  }, [quiet]);

  const goTour = () => {
    const target = document.getElementById("recorrido");
    if (!target) return;
    if (scroll) scroll.scrollTo(target);
    else target.scrollIntoView({ behavior: "auto" });
  };

  return (
    <section
      ref={rootRef}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-[#070604] text-white"
      aria-label="Casa 101"
      style={{ "--px": "0", "--py": "0" } as CSSProperties}
    >
      {HERO_PLANES.map((plane) => (
        <div
          key={plane.id}
          className={`hero-plane hero-plane-${plane.id} absolute inset-0`}
          style={{
            transform: `translate3d(calc(var(--px) * ${plane.speed} * 90px), calc(var(--py) * ${plane.speed} * 60px), 0) scale(${plane.scale})`,
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

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-5 pb-24 text-center sm:px-10 sm:pb-20">
        <p className="hero-kicker text-[0.7rem] tracking-[0.34em] uppercase text-white/75 sm:text-xs">
          {PROPERTY.location}
        </p>
        <h1 className="font-display mt-4 text-6xl leading-[0.9] sm:text-8xl md:text-9xl">
          <span className="sr-only">{PROPERTY.name}</span>
          <span
            ref={titleRef}
            className="hero-title-split block"
            aria-hidden="true"
          >
            {PROPERTY.name}
          </span>
        </h1>
        <p className="hero-price mt-5 text-lg font-light tracking-[0.18em] text-white/95 sm:text-2xl">
          {PROPERTY.price}
        </p>
        <p className="hero-kicker mt-2 text-xs tracking-wide text-white/70 sm:text-sm">
          {PROPERTY.locationCity}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
          <WhatsAppButton property={PROPERTY} variant="ghost" />
          <button
            type="button"
            onClick={goTour}
            className="text-xs tracking-[0.22em] uppercase text-white/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Recorrer la casa
          </button>
        </div>
      </div>
    </section>
  );
}
