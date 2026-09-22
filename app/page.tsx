import type { ReactNode } from "react";
import { ImmersiveStory } from "@/components/ImmersiveStory";
import { PhotoReveal } from "@/components/PhotoReveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  PROPERTY,
  getMapsEmbedUrl,
  getMapsUrl,
} from "@/lib/property";

export default function Home() {
  return (
    <main className="w-full bg-black">
      <a href="#brochure" className="skip-link">
        Saltar al catálogo
      </a>
      <ImmersiveStory />

      {/* —— Brochure details on light field —— */}
      <div
        id="brochure"
        tabIndex={-1}
        className="bg-[var(--background)] text-[var(--foreground)] outline-none"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, #fffdf9 0%, transparent 55%), linear-gradient(180deg, var(--background) 0%, var(--background-soft) 100%)",
        }}
      >
        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-8">
            <FactItem
              icon={<BedIcon />}
              value={PROPERTY.facts.bedrooms}
              label="Dormitorios"
            />
            <FactItem
              icon={<BathIcon />}
              value={PROPERTY.facts.bathrooms}
              label="Baños"
            />
            <FactItem
              icon={<AreaIcon />}
              value={PROPERTY.facts.areaM2}
              label="m² construcción"
            />
            <FactItem
              icon={<ParkingIcon />}
              value={PROPERTY.facts.parking}
              label="Estacionamientos"
            />
          </ul>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Especificaciones
          </p>
          <h2 className="mt-2 text-center text-2xl font-light tracking-wide sm:text-3xl">
            En resumen
          </h2>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {PROPERTY.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3"
              >
                <dt className="text-xs tracking-[0.12em] uppercase text-[var(--muted)]">
                  {spec.label}
                </dt>
                <dd className="text-right text-base font-medium tracking-tight">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {PROPERTY.highlight}
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-16 sm:pb-20">
          <div className="space-y-12">
            {PROPERTY.levels.map((level) => (
              <div key={level.title} className="text-center">
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
                  {level.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-light tracking-wide sm:text-3xl">
                  {level.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                  {level.detail}
                </p>
                {"tags" in level && level.tags ? (
                  <p className="mt-4 text-sm tracking-wide text-[var(--foreground)]">
                    {level.tags.join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
          <p className="mb-2 text-center text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Plantas
          </p>
          <h2 className="mb-6 text-center text-2xl font-light tracking-wide sm:text-3xl">
            Planta arquitectónica
          </h2>
          {PROPERTY.floorPlans.map((plan, index) => (
            <PhotoReveal
              key={plan.src}
              src={plan.src}
              alt={plan.alt}
              caption={plan.label}
              direction={index % 2 === 0 ? "left" : "right"}
              fit="contain"
              aspectClassName="aspect-[16/10] bg-[var(--background-soft)]"
            />
          ))}
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Respaldo
          </p>
          <h2 className="mt-2 text-center text-2xl font-light tracking-wide sm:text-3xl">
            Respaldo y seguridad
          </h2>
          <dl className="mt-10 space-y-5">
            {PROPERTY.security.map((item) => (
              <div
                key={item.label}
                className="border-b border-[var(--line)] pb-4 text-center sm:flex sm:items-baseline sm:justify-between sm:gap-6 sm:text-left"
              >
                <dt className="text-xs tracking-[0.12em] uppercase text-[var(--muted)]">
                  {item.label}
                </dt>
                <dd className="mt-1 text-base sm:mt-0 sm:text-right">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

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
            <p className="text-sm tracking-wide text-[var(--muted)]">
              {PROPERTY.managedBy}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
          <div className="text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
              Ubicación
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-wide sm:text-3xl">
              {PROPERTY.location}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {PROPERTY.locationCity}
            </p>
            <a
              href={getMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
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

        <section
          id="contacto"
          className="mx-auto max-w-xl px-6 pb-24 pt-4 text-center sm:pb-32"
          aria-labelledby="visitas-heading"
        >
          <h2
            id="visitas-heading"
            className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]"
          >
            Visitas
          </h2>
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
      </div>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]" aria-hidden="true">
      <path d="M5 19c8-1 12-6 14-14-7 1-12 5-14 14Z" />
      <path d="M5 19c2-4 6-7 11-8" />
    </svg>
  );
}
