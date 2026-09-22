import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CAMERA_KEYFRAMES,
  LOT,
  buildMassing,
  extrudeScale,
  lerpCamera,
  photoOverlayOpacity,
  volumeFootprint,
} from "./massing.ts";

describe("Casa 101 massing", () => {
  it("keeps the lot at 1,320.50 m² as an elongated residential bar", () => {
    assert.equal(Number((LOT.width * LOT.depth).toFixed(2)), 1320.5);
    assert.ok(LOT.depth > LOT.width * 2);
  });

  it("gives the pool a 32 m² water sheet", () => {
    const pool = buildMassing().find((v) => v.role === "pool");
    assert.ok(pool);
    assert.equal(volumeFootprint(pool), 32);
  });

  it("covers a two-storey house whose closed footprint is about half of 452.30 m²", () => {
    const volumes = buildMassing();
    const lower = volumes.find((v) => v.id === "main-lower");
    const upper = volumes.find((v) => v.id === "main-upper");
    const garage = volumes.find((v) => v.role === "garage");
    assert.ok(lower && upper && garage);
    assert.ok(Math.abs(volumeFootprint(lower) - 452.3 / 2) < 30);
    assert.ok(upper.size[1] > 2.8);
    assert.ok(volumeFootprint(garage) >= 75);
  });

  it("places the pool at the far end of the lot, opposite the garage", () => {
    const volumes = buildMassing();
    const pool = volumes.find((v) => v.role === "pool")!;
    const garage = volumes.find((v) => v.role === "garage")!;
    assert.ok(pool.position[2] > garage.position[2] + 20);
  });

  it("starts as a flat plan and finishes fully extruded", () => {
    assert.ok(extrudeScale(0) < 0.08);
    assert.equal(extrudeScale(1), 1);
    assert.ok(extrudeScale(0.25) > extrudeScale(0));
  });

  it("holds the photo overlay until the camera has arrived at the pool", () => {
    assert.equal(photoOverlayOpacity(0), 0);
    assert.equal(photoOverlayOpacity(0.7), 0);
    assert.ok(photoOverlayOpacity(0.88) > 0.7);
    assert.equal(photoOverlayOpacity(1), 1);
  });

  it("dollies the camera from plan view down to eye level at the pool", () => {
    assert.ok(CAMERA_KEYFRAMES.length >= 3);
    const start = lerpCamera(0);
    const end = lerpCamera(1);
    assert.ok(start.position[1] > 50, "plan camera is high");
    assert.ok(end.position[1] < 8, "final camera is near eye height");
    assert.ok(end.lookAt[2] > start.lookAt[2] * 0.8);
  });
});
