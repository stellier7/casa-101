/**
 * ============================================================
 * EDIT PROPERTY INFO HERE
 * Reuse this file as a template for future rental listings.
 * Swap photos in /public/photos and update the fields below.
 * Data sourced from the Casa 101 / Delfín listing PDF.
 * ============================================================
 */

export const PROPERTY = {
  name: "Casa 101",
  /** Short location line for hero */
  location: "Residencial San Ignacio",
  locationCity: "Tegucigalpa, Honduras",
  price: "US$5,000/mes",
  availability: "Disponible a partir del 1 de enero de 2027",
  includes: "Mantenimiento integral incluido",
  visits:
    "Visitas coordinadas de lunes a viernes, 10:00 a 16:00, con aviso previo",
  managedBy: "Administrado por Delfín",

  /** Digits only — used for wa.me links */
  whatsappNumber: "50496784674",
  whatsappDisplay: "+504 9678-4674",

  /** Key facts bar (icon + number) */
  facts: {
    bedrooms: 4,
    bathrooms: 7,
    areaM2: "452.30",
    parking: 5,
  },

  /** Full specs summary from the PDF */
  specs: [
    { label: "Lote", value: "1,320.50 m²" },
    { label: "Construcción cerrada", value: "452.30 m²" },
    { label: "Áreas techadas", value: "281.12 m²" },
    { label: "Dormitorios", value: "4" },
    { label: "Baños completos", value: "7" },
    { label: "Garaje", value: "5 vehículos" },
    { label: "Piscina", value: "32 m² · 42 m³" },
    { label: "Cisterna", value: "6,000 galones" },
  ],

  highlight:
    "Portón automático, patio empedrado con rotonda, garaje techado y acceso con columnata.",

  levels: [
    {
      eyebrow: "Primer nivel",
      title: "Áreas sociales",
      detail:
        "Vestíbulo de doble altura, sala social, comedor, estudio y cocina con desayunador y alacena.",
    },
    {
      eyebrow: "Áreas privadas",
      title: "Segundo nivel",
      detail:
        "Tres dormitorios en suite con walk-in closet; el principal con chimenea y terraza.",
    },
    {
      eyebrow: "Exteriores",
      title: "Jardines, piscina y terrazas",
      detail:
        "Piscina de 32 m², barbacoa techada con horno de leña, sauna y jardines en tres costados.",
      tags: ["Dos terrazas", "Barbacoa", "Sauna", "Pasillos jardinados"],
    },
  ],

  security: [
    { label: "Planta eléctrica", value: "Generador diésel para toda la casa" },
    { label: "Cisterna", value: "6,000 galones con hidroneumático" },
    { label: "Caseta de seguridad", value: "Equipada, con baño independiente" },
    { label: "Perímetro", value: "Cerco eléctrico y portón automático" },
    { label: "Bodega", value: "Amplia, en el área del garaje" },
    { label: "Garaje", value: "Cinco vehículos techados y rotonda" },
  ],

  floorPlans: [
    {
      src: "/photos/15-planta-primer.jpg",
      alt: "Planta arquitectónica — primer nivel",
      label: "Primer nivel",
    },
    {
      src: "/photos/16-planta-segundo.jpg",
      alt: "Planta arquitectónica — segundo nivel",
      label: "Segundo nivel",
    },
  ],

  /**
   * Residencial San Ignacio, Tegucigalpa — adjust if you have exact pin.
   */
  map: {
    lat: 14.07931,
    lng: -87.17423,
    label: "Residencial San Ignacio, Tegucigalpa",
    query: "Residencial San Ignacio, Tegucigalpa, Honduras",
  },

  /**
   * Hero uses the façade as the title card; the walk renders every listing photo.
   * `info` = 1–2 lines on the photo; `orientation` drives mobile pan for landscape.
   * The dusk pool closes the sequence.
   */
  photos: [
    {
      src: "/photos/01-fachada.jpg",
      alt: "Fachada principal",
      info: null,
      infoPlace: "bottom",
      orientation: "landscape",
    },
    {
      src: "/photos/02-entrada.jpg",
      alt: "Entrada principal",
      info: "Portón automático y acceso con columnata",
      infoPlace: "bottom-left",
      orientation: "landscape",
    },
    {
      src: "/photos/03-exterior-frontal.jpg",
      alt: "Vista exterior frontal",
      info: "Lote 1,320.50 m² · Construcción 452.30 m²",
      infoPlace: "top-right",
      orientation: "landscape",
    },
    {
      src: "/photos/04-piscina-fachada.jpg",
      alt: "Piscina y fachada",
      info: "Piscina 32 m² · 42 m³",
      infoPlace: "bottom-right",
      orientation: "landscape",
    },
    {
      src: "/photos/05-sauna.jpg",
      alt: "Sauna",
      info: "Sauna privada junto a las áreas exteriores",
      infoPlace: "left",
      orientation: "portrait",
    },
    {
      src: "/photos/06-jardin-terraza.jpg",
      alt: "Jardín y terraza",
      info: "Jardines en tres costados · dos terrazas",
      infoPlace: "bottom-left",
      orientation: "landscape",
    },
    {
      src: "/photos/07-patio.jpg",
      alt: "Patio exterior",
      info: "Patio empedrado con rotonda",
      infoPlace: "top-left",
      orientation: "landscape",
    },
    {
      src: "/photos/08-piscina-jardin.jpg",
      alt: "Piscina y jardín",
      info: "Barbacoa techada con horno de leña",
      infoPlace: "right",
      orientation: "square",
    },
    {
      src: "/photos/10-comedor.jpg",
      alt: "Comedor",
      info: "Primer nivel · comedor y sala social",
      infoPlace: "top-right",
      orientation: "landscape",
    },
    {
      src: "/photos/11-estacionamiento.jpg",
      alt: "Estacionamiento",
      info: "Garaje techado para 5 vehículos",
      infoPlace: "bottom-left",
      orientation: "landscape",
    },
    {
      src: "/photos/12-sala.jpg",
      alt: "Sala principal",
      info: "Vestíbulo de doble altura · sala social",
      infoPlace: "bottom-left",
      orientation: "portrait",
    },
    {
      src: "/photos/13-cocina.jpg",
      alt: "Cocina",
      info: "Cocina con desayunador y alacena",
      infoPlace: "bottom-right",
      orientation: "portrait",
    },
    {
      src: "/photos/14-chimenea.jpg",
      alt: "Chimenea",
      info: "Suite principal · chimenea y terraza",
      infoPlace: "top-left",
      orientation: "portrait",
    },
    {
      src: "/photos/09-piscina-atardecer.jpg",
      alt: "Piscina al atardecer",
      info: "Disponible a partir del 1 de enero de 2027",
      infoPlace: "bottom",
      orientation: "landscape",
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
  const q = property.map.query ?? `${property.map.lat},${property.map.lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
}

export function getMapsEmbedUrl(property: Property = PROPERTY): string {
  const q = property.map.query ?? `${property.map.lat},${property.map.lng}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
}
