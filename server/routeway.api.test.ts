import { describe, expect, it } from "vitest";

describe("Routeway API credential", () => {
  it("authenticates against the lightweight models endpoint", async () => {
    const apiKey = process.env.ROUTEWAY_API_KEY;
    expect(apiKey, "ROUTEWAY_API_KEY should be configured").toBeTruthy();
    const response = await fetch("https://api.routeway.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const body = await response.text();
    expect(response.status, body.slice(0, 300)).not.toBe(401);
    expect(response.status, body.slice(0, 300)).not.toBe(403);
    expect(response.ok, body.slice(0, 300)).toBe(true);
  }, 20_000);
});
