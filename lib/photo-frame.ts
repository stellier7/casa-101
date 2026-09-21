/** Photo aspect for responsive framing / pan behavior */
export type PhotoOrientation = "landscape" | "portrait" | "square";

/** Horizontal pan direction while scrolling a landscape frame on a tall phone */
export type PanDirection = "ltr" | "rtl";

export function panDirectionForIndex(index: number): PanDirection {
  return index % 2 === 0 ? "ltr" : "rtl";
}
