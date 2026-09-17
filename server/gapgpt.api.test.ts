import { describe, expect, it } from "vitest";

describe("GapGPT API secret", () => {
  it("authenticates against the lightweight models endpoint without sending a paid chat", async () => {
    const apiKey = process.env.GAPGPT_API_KEY;
    expect(apiKey, "GAPGPT_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.gapgpt.app/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { data?: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  }, 15_000);
});
