import { describe, expect, it } from "vitest";

describe("xAI API secret", () => {
  it("authenticates against the models endpoint without sending a paid chat", async () => {
    const apiKey = process.env.XAI_API_KEY;
    expect(apiKey, "XAI_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.x.ai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const body = (await response.json()) as { data?: unknown[]; error?: string };
    const authenticated = response.status === 200 && Array.isArray(body.data);
    const billingLimited = response.status === 403 && body.error?.includes("monthly spending limit");
    expect(authenticated || billingLimited).toBe(true);
  }, 15_000);
});
