/**
 * Schematic Casa 101 massing in meters.
 * Lot, pool, and closed-construction numbers come from the listing PDF.
 * The layout follows the elongated first-floor plan: garage/rotonda south,
 * social volumes in the middle, pool garden north.
 */

export type Vec3 = [number, number, number];

export type MassingRole =
  | "lot"
  | "drive"
  | "garage"
  | "main"
  | "upper"
  | "colonnade"
  | "pool"
  | "deck"
  | "pavilion"
  | "sauna"
  | "hedge";

export type MassingVolume = {
  id: string;
  role: MassingRole;
  /** Center of the box in meters. Y is vertical. */
  position: Vec3;
  /** width (X), height (Y), depth (Z) */
  size: Vec3;
  color: string;
};

export const MASSING_COLORS = {
  night: "#070604",
  stucco: "#f1ebe3",
  roof: "#7a3a28",
  wood: "#3d2b1f",
  pool: "#1c6a88",
  grass: "#3d4a34",
  terracotta: "#b25a38",
  cobble: "#8a7a6a",
  hedge: "#2f3d28",
} as const;

/** 1,320.50 m² elongated like the architectural plan */
export const LOT = {
  areaM2: 1320.5,
  width: 18,
  depth: 1320.5 / 18,
} as const;

export type CameraKeyframe = {
  t: number;
  position: Vec3;
  lookAt: Vec3;
};

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { t: 0, position: [0, 88, 22], lookAt: [0, 0, 34] },
  { t: 0.38, position: [4, 62, 12], lookAt: [0, 1.4, 38] },
  { t: 0.68, position: [28, 18, 6], lookAt: [0, 3.2, 42] },
  { t: 1, position: [7.5, 3.4, 64], lookAt: [0, 2.1, 50] },
];

export function volumeFootprint(volume: MassingVolume): number {
  return volume.size[0] * volume.size[2];
}

export function buildMassing(): MassingVolume[] {
  const { width, depth } = LOT;
  const zGarage = 9;
  const zMain = 28;
  const zPool = 50;

  return [
    {
      id: "lot",
      role: "lot",
      position: [0, -0.04, depth / 2],
      size: [width + 6, 0.08, depth + 6],
      color: MASSING_COLORS.grass,
    },
    {
      id: "drive",
      role: "drive",
      position: [0, 0.03, zGarage],
      size: [14, 0.06, 16],
      color: MASSING_COLORS.cobble,
    },
    {
      id: "garage",
      role: "garage",
      position: [0, 1.6, zGarage],
      size: [12, 3.2, 10],
      color: MASSING_COLORS.stucco,
    },
    {
      id: "main-lower",
      role: "main",
      position: [0, 1.8, zMain],
      size: [13, 3.6, 18],
      color: MASSING_COLORS.stucco,
    },
    {
      id: "main-upper",
      role: "upper",
      position: [0.4, 5.2, zMain + 1],
      size: [11, 3.2, 12],
      color: MASSING_COLORS.stucco,
    },
    {
      id: "colonnade",
      role: "colonnade",
      position: [0, 1.6, zMain + 11],
      size: [10, 3.2, 2.4],
      color: MASSING_COLORS.wood,
    },
    {
      id: "deck",
      role: "deck",
      position: [0, 0.06, zPool],
      size: [12, 0.12, 10],
      color: MASSING_COLORS.terracotta,
    },
    {
      id: "pool",
      role: "pool",
      position: [0, 0.12, zPool],
      size: [8, 0.22, 4],
      color: MASSING_COLORS.pool,
    },
    {
      id: "pavilion",
      role: "pavilion",
      position: [-4.2, 1.5, zPool + 9],
      size: [7, 3, 5],
      color: MASSING_COLORS.wood,
    },
    {
      id: "sauna",
      role: "sauna",
      position: [5.2, 1.4, zPool + 9],
      size: [3.5, 2.8, 3.5],
      color: MASSING_COLORS.stucco,
    },
    {
      id: "hedge-w",
      role: "hedge",
      position: [-6.2, 0.7, zPool],
      size: [0.5, 1.4, 9],
      color: MASSING_COLORS.hedge,
    },
    {
      id: "hedge-e",
      role: "hedge",
      position: [6.2, 0.7, zPool],
      size: [0.5, 1.4, 9],
      color: MASSING_COLORS.hedge,
    },
  ];
}

export function extrudeScale(progress: number): number {
  const t = clamp01(progress);
  if (t < 0.12) return 0.03;
  if (t < 0.42) return lerp(0.03, 1, (t - 0.12) / 0.3);
  return 1;
}

export function lerpCamera(progress: number): {
  position: Vec3;
  lookAt: Vec3;
} {
  const t = clamp01(progress);
  const frames = CAMERA_KEYFRAMES;
  if (t <= frames[0].t) {
    return { position: frames[0].position, lookAt: frames[0].lookAt };
  }
  const last = frames[frames.length - 1];
  if (t >= last.t) {
    return { position: last.position, lookAt: last.lookAt };
  }

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].t < t) i += 1;
  const a = frames[i];
  const b = frames[i + 1];
  const local = (t - a.t) / (b.t - a.t);
  const eased = local * local * (3 - 2 * local);
  return {
    position: lerpVec(a.position, b.position, eased),
    lookAt: lerpVec(a.lookAt, b.lookAt, eased),
  };
}

export function photoOverlayOpacity(progress: number): number {
  return clamp01((progress - 0.82) / 0.14);
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
