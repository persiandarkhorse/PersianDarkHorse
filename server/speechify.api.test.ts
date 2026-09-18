import { describe, expect, it } from "vitest";

describe("Speechify API secret", () => {
  it("authenticates against the voices endpoint without generating audio", async () => {
    const apiKey = process.env.SPEECHIFY_API_KEY;
    expect(apiKey, "SPEECHIFY_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.speechify.ai/v1/voices?type=shared&locale=en&model=simba-3.2", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { voices?: unknown[]; data?: unknown[] };
    expect(Array.isArray(body.voices) || Array.isArray(body.data)).toBe(true);
  }, 15_000);
});
