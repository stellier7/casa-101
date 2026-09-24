import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PROPERTY } from "./property.ts";

describe("photo story", () => {
  it("keeps sala copy off the bright French doors", () => {
    const sala = PROPERTY.photos.find((photo) =>
      photo.src.endsWith("12-sala.jpg"),
    );
    assert.ok(sala);
    assert.equal(sala.infoPlace, "bottom-left");
  });

  it("ends the walk on the dusk pool", () => {
    const last = PROPERTY.photos[PROPERTY.photos.length - 1];
    assert.equal(last.src, "/photos/09-piscina-atardecer.jpg");
  });
});
