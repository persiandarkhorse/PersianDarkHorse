import { describe, expect, it } from "vitest";

describe("Emergency OpenRouter API secret", () => {
  it("authenticates the emergency key without sending a paid chat", async () => {
    const apiKey = process.env.OPENROUTER_EMERGENCY_API_KEY;
    expect(apiKey, "OPENROUTER_EMERGENCY_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { data?: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  }, 15_000);
});
