import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("favicon", () => {
  it("marks the tab with a 101 on the dark title-card ground", () => {
    const svg = readFileSync(new URL("../app/icon.svg", import.meta.url), "utf8");
    assert.match(svg, /<svg[\s>]/);
    assert.match(svg, />101</);
    assert.match(svg, /Casa 101/);
    assert.match(svg, /#070604/);
    assert.match(svg, /#f7f5f2/);
  });

  it("replaces the default Next.js favicon.ico", () => {
    const ico = readFileSync(new URL("../app/favicon.ico", import.meta.url));
    assert.equal(ico.readUInt16LE(2), 1);
    assert.ok(ico.byteLength > 400);
  });
});
