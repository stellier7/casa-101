/** Placement for short info lines on cinematic photos — keep off the subject. */
export type InfoPlace =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export const INFO_PLACE_CLASS: Record<InfoPlace, string> = {
  top: "items-start justify-center pt-16 sm:pt-20 px-8 text-center",
  bottom: "items-end justify-center pb-16 sm:pb-20 px-8 text-center",
  left: "items-center justify-start pl-6 sm:pl-12 pr-24 text-left",
  right: "items-center justify-end pr-6 sm:pr-12 pl-24 text-right",
  "top-left": "items-start justify-start pt-14 sm:pt-20 pl-6 sm:pl-12 pr-20 text-left",
  "top-right": "items-start justify-end pt-14 sm:pt-20 pr-6 sm:pr-12 pl-20 text-right",
  "bottom-left": "items-end justify-start pb-14 sm:pb-20 pl-6 sm:pl-12 pr-20 text-left",
  "bottom-right": "items-end justify-end pb-14 sm:pb-20 pr-6 sm:pr-12 pl-20 text-right",
};

/** Slide-in axis tied to placement */
export function infoMotionFrom(place: InfoPlace): {
  x: [string, string];
  y: [string, string];
} {
  switch (place) {
    case "top":
      return { x: ["0%", "0%"], y: ["-28%", "0%"] };
    case "bottom":
      return { x: ["0%", "0%"], y: ["28%", "0%"] };
    case "left":
    case "top-left":
    case "bottom-left":
      return { x: ["-18%", "0%"], y: ["0%", "0%"] };
    case "right":
    case "top-right":
    case "bottom-right":
      return { x: ["18%", "0%"], y: ["0%", "0%"] };
  }
}
