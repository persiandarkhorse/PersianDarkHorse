import { describe, expect, it } from "vitest";

describe("Claude Fable 5.1 OpenRouter credential", () => {
  it("authenticates against the lightweight models endpoint", async () => {
    const key = process.env.FABLE_51_OPENROUTER_API_KEY;
    expect(key).toMatch(/^sk-or-v1-/);

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const body = await response.text();
    expect(response.status, body.slice(0, 240)).toBe(200);

    const models = JSON.parse(body) as { data?: Array<{ id?: string }> };
    expect(models.data?.some((model) => model.id === "anthropic/claude-fable-5.1")).toBe(true);
  }, 30_000);
});
