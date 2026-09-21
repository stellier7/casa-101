/** Shared cinematic types — safe for Server and Client Components */

/** How the even photo covers the fixed odd photo */
export type CoverEffect =
  | "zoomOut" // tight → open from center
  | "slideUp" // rises from bottom
  | "slideLeft" // enters from the right
  | "slideRight" // enters from the left
  | "parallaxZoom" // scale + vertical parallax settle
  | "wipeUp" // clipped wipe from bottom
  | "driftIn"; // soft horizontal drift + scale

/** One distinct cover effect per odd/even pair (photos 1–2, 3–4, …) */
export const COVER_EFFECTS: CoverEffect[] = [
  "zoomOut",
  "slideUp",
  "slideLeft",
  "slideRight",
  "parallaxZoom",
  "wipeUp",
  "driftIn",
];

export function chunkPhotoPairs<T>(photos: readonly T[]): [T, T | undefined][] {
  const pairs: [T, T | undefined][] = [];
  for (let i = 0; i < photos.length; i += 2) {
    pairs.push([photos[i], photos[i + 1]]);
  }
  return pairs;
}
