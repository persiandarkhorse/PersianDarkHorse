import { describe, expect, it } from "vitest";

describe("Mistral AI credential", () => {
  it("authenticates against the lightweight models endpoint", async () => {
    const key = process.env.MISTRAL_API_KEY;
    expect(key).toBeTruthy();

    const response = await fetch("https://api.mistral.ai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const body = await response.text();
    expect(response.status, body.slice(0, 240)).toBe(200);

    const models = JSON.parse(body) as { data?: Array<{ id?: string }> };
    expect(Array.isArray(models.data)).toBe(true);
    expect(models.data?.length).toBeGreaterThan(0);
  }, 30_000);
});
