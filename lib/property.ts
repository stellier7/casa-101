/**
 * ============================================================
 * EDIT PROPERTY INFO HERE
 * Reuse this file as a template for future rental listings.
 * Swap photos in /public/photos and update the fields below.
 * ============================================================
 */

export const PROPERTY = {
  name: "Casa 101",
  location: "Residencial San Ignacio",
  price: "US$5,000/mes",
  availability: "Disponible a partir del 1 de enero de 2027",
  includes: "Mantenimiento de la casa, patio y jardinería incluidos",
  visits:
    "Visitas coordinadas de lunes a viernes, 10:00 a 16:00, con aviso previo",

  /** Digits only — used for wa.me links */
  whatsappNumber: "50496784674",
  whatsappDisplay: "+504 9678-4674",

  /**
   * PLACEHOLDERS — replace with real values from the listing PDF.
   */
  facts: {
    bedrooms: 4,
    bathrooms: 3.5,
    areaM2: 350,
    parking: 3,
  },

  /**
   * PLACEHOLDERS — set lat/lng for Residencial San Ignacio.
   */
  map: {
    lat: 15.5045,
    lng: -88.025,
    label: "Residencial San Ignacio",
  },

  /** Hero uses the first photo; sequence renders all 14. */
  photos: [
    {
      src: "/photos/01-fachada.jpg",
      alt: "Fachada principal",
    },
    {
      src: "/photos/02-entrada.jpg",
      alt: "Entrada principal",
    },
    {
      src: "/photos/03-exterior-frontal.jpg",
      alt: "Vista exterior frontal",
    },
    {
      src: "/photos/04-piscina-fachada.jpg",
      alt: "Piscina y fachada",
    },
    {
      src: "/photos/05-sauna.jpg",
      alt: "Sauna",
    },
    {
      src: "/photos/06-jardin-terraza.jpg",
      alt: "Jardín y terraza",
    },
    {
      src: "/photos/07-patio.jpg",
      alt: "Patio exterior",
    },
    {
      src: "/photos/08-piscina-jardin.jpg",
      alt: "Piscina y jardín",
    },
    {
      src: "/photos/09-piscina-atardecer.jpg",
      alt: "Piscina al atardecer",
    },
    {
      src: "/photos/10-comedor.jpg",
      alt: "Comedor",
    },
    {
      src: "/photos/11-estacionamiento.jpg",
      alt: "Estacionamiento",
    },
    {
      src: "/photos/12-sala.jpg",
      alt: "Sala principal",
    },
    {
      src: "/photos/13-cocina.jpg",
      alt: "Cocina",
    },
    {
      src: "/photos/14-chimenea.jpg",
      alt: "Chimenea",
    },
  ],
} as const;

export type Property = typeof PROPERTY;

/** Builds WhatsApp deep link; message name tracks PROPERTY.name. */
export function getWhatsAppUrl(property: Property = PROPERTY): string {
  const message = `Hola, estoy interesado en alquilar la ${property.name}`;
  return `https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getMapsUrl(property: Property = PROPERTY): string {
  const { lat, lng } = property.map;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getMapsEmbedUrl(property: Property = PROPERTY): string {
  const { lat, lng } = property.map;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}
