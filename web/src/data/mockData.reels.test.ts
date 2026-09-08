import { describe, expect, it } from "vitest";
import { reels } from "./mockData";

describe("reel data privacy", () => {
  it("uses bundled media and campus sound labels without outbound URLs", () => {
    expect(reels.length).toBeGreaterThan(5);
    for (const reel of reels) {
      expect(reel.image).toMatch(/^\//);
      expect(reel.avatar).toMatch(/^\//);
      expect(reel.audio.trim()).not.toBe("");
      expect(JSON.stringify(reel)).not.toMatch(/youtube|youtu\.be|https?:\/\//i);
    }
  });
});
