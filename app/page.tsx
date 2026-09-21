import Image from "next/image";
import type { ReactNode } from "react";
import { PhotoReveal } from "@/components/PhotoReveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  PROPERTY,
  getMapsEmbedUrl,
  getMapsUrl,
} from "@/lib/property";

type RevealDirection = "left" | "right" | "bottom";

const REVEAL_PATTERN: RevealDirection[] = ["bottom", "left", "right"];

export default function Home() {
  const hero = PROPERTY.photos[0];

  return (
    <main className="w-full">
      {/* —— Hero —— */}
      <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full px-6 pb-16 pt-32 sm:px-10 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-5xl font-light tracking-[0.04em] sm:text-6xl md:text-7xl">
              {PROPERTY.name}
            </h1>
            <p className="mt-4 text-base font-light tracking-[0.18em] uppercase text-white/85 sm:text-lg">
              {PROPERTY.location}
            </p>
            <p className="mt-8 text-2xl font-medium tracking-wide sm:text-3xl">
              {PROPERTY.price}
            </p>
          </div>
        </div>
      </section>

      {/* —— Photo sequence —— */}
      <div className="pt-4 sm:pt-8">
        {PROPERTY.photos.map((photo, index) => (
          <PhotoReveal
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            direction={REVEAL_PATTERN[index % REVEAL_PATTERN.length]}
            priority={index < 2}
          />
        ))}
      </div>

      {/* —— Key facts —— */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-8">
          <FactItem
            icon={<BedIcon />}
            value={PROPERTY.facts.bedrooms}
            label="Habitaciones"
          />
          <FactItem
            icon={<BathIcon />}
            value={PROPERTY.facts.bathrooms}
            label="Baños"
          />
          <FactItem
            icon={<AreaIcon />}
            value={`${PROPERTY.facts.areaM2}`}
            label="m²"
          />
          <FactItem
            icon={<ParkingIcon />}
            value={PROPERTY.facts.parking}
            label="Estacionamientos"
          />
        </ul>
      </section>

      {/* —— Availability & includes —— */}
      <section className="mx-auto max-w-xl px-6 pb-16 text-center sm:pb-20">
        <div className="space-y-6 border-y border-[var(--line)] py-10">
          <p className="flex flex-col items-center gap-2 text-base text-[var(--foreground)] sm:text-lg">
            <CalendarIcon />
            <span>{PROPERTY.availability}</span>
          </p>
          <p className="flex flex-col items-center gap-2 text-base text-[var(--muted)] sm:text-lg">
            <LeafIcon />
            <span>{PROPERTY.includes}</span>
          </p>
        </div>
      </section>

      {/* —— Location —— */}
      <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Ubicación
          </p>
          <h2 className="mt-2 text-2xl font-light tracking-wide sm:text-3xl">
            {PROPERTY.location}
          </h2>
          <a
            href={getMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Abrir en Google Maps
          </a>
        </div>
        <div className="mt-8 overflow-hidden border border-[var(--line)]">
          <iframe
            title={`Mapa de ${PROPERTY.map.label}`}
            src={getMapsEmbedUrl()}
            className="h-56 w-full border-0 sm:h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      {/* —— Visits + Contact —— */}
      <section className="mx-auto max-w-xl px-6 pb-24 pt-4 text-center sm:pb-32">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Visitas
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground)] sm:text-lg">
          {PROPERTY.visits}
        </p>
        <div className="mt-10 flex justify-center">
          <WhatsAppButton property={PROPERTY} />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          {PROPERTY.whatsappDisplay}
        </p>
      </section>
    </main>
  );
}

function FactItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <li className="flex flex-col items-center gap-2 text-center">
      <span className="text-[var(--accent)]" aria-hidden="true">
        {icon}
      </span>
      <span className="text-2xl font-medium tracking-tight sm:text-3xl">
        {value}
      </span>
      <span className="text-xs tracking-[0.12em] uppercase text-[var(--muted)]">
        {label}
      </span>
    </li>
  );
}

function BedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 18V9a1 1 0 0 1 1-1h4a3 3 0 0 1 3 3v1h7a2 2 0 0 1 2 2v4" />
      <path d="M3 14h18M7 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2Z" />
      <path d="M6 12V7a2 2 0 0 1 2-2h1" />
      <path d="M6 18v1M18 18v1" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 10h16M10 4v16" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M9 15V9h3.5a2.5 2.5 0 0 1 0 5H9" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
      <path d="M5 19c8-1 12-6 14-14-7 1-12 5-14 14Z" />
      <path d="M5 19c2-4 6-7 11-8" />
    </svg>
  );
}
