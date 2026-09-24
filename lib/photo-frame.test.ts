import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { panDirectionForIndex } from "./photo-frame.ts";

describe("photo framing", () => {
  it("alternates landscape pan so neighboring frames move opposite ways", () => {
    assert.equal(panDirectionForIndex(0), "rtl");
    assert.equal(panDirectionForIndex(1), "ltr");
    assert.equal(panDirectionForIndex(2), "rtl");
  });
});
