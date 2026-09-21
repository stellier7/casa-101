/** Photo aspect for responsive framing / pan behavior */
export type PhotoOrientation = "landscape" | "portrait" | "square";

/** Horizontal pan direction while scrolling a landscape frame on a tall phone */
export type PanDirection = "ltr" | "rtl";

export function panDirectionForIndex(index: number): PanDirection {
  // Photo 1 (index 0) pans right → left; photo 2 left → right; then alternate
  return index % 2 === 0 ? "rtl" : "ltr";
}
