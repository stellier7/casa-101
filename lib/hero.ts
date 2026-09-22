/** Depth planes for the Casa 101 title card — real photographs, not generated art. */

export const HERO_PLANES = [
  {
    id: "far",
    src: "/photos/09-piscina-atardecer.jpg",
    alt: "Piscina al anochecer",
    speed: 0.14,
    scale: 1.2,
    opacity: 0.55,
  },
  {
    id: "mid",
    src: "/photos/06-jardin-terraza.jpg",
    alt: "Jardín y terraza",
    speed: 0.32,
    scale: 1.12,
    opacity: 0.42,
  },
  {
    id: "subject",
    src: "/photos/01-fachada.jpg",
    alt: "Fachada principal de Casa 101",
    speed: 0.58,
    scale: 1.06,
    opacity: 1,
  },
] as const;

export type HeroPlane = (typeof HERO_PLANES)[number];
