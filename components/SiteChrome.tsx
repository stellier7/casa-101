import { getWhatsAppUrl } from "@/lib/property";

export function SiteChrome() {
  return (
    <>
      <a
        href="#recorrido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Saltar al recorrido
      </a>
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-5 right-5 z-50 border border-white/35 bg-black/45 px-3 py-1.5 text-[0.65rem] tracking-[0.2em] uppercase text-white/95 backdrop-blur-md transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-8 sm:right-8"
      >
        WhatsApp
      </a>
    </>
  );
}
