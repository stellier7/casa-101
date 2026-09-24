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
  top: "items-start justify-center pt-14 sm:pt-20 px-5 sm:px-8 text-center",
  bottom: "items-end justify-center pb-12 sm:pb-20 px-5 sm:px-8 text-center",
  left: "items-center justify-start pl-5 sm:pl-12 pr-16 sm:pr-24 text-left",
  right: "items-center justify-end pr-5 sm:pr-12 pl-16 sm:pl-24 text-right",
  "top-left":
    "items-start justify-start pt-12 sm:pt-20 pl-5 sm:pl-12 pr-12 sm:pr-20 text-left",
  "top-right":
    "items-start justify-end pt-12 sm:pt-20 pr-5 sm:pr-12 pl-12 sm:pl-20 text-right",
  "bottom-left":
    "items-end justify-start pb-12 sm:pb-20 pl-5 sm:pl-12 pr-12 sm:pr-20 text-left",
  "bottom-right":
    "items-end justify-end pb-12 sm:pb-20 pr-5 sm:pr-12 pl-12 sm:pl-20 text-right",
};

