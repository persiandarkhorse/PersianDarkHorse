import { describe, expect, it } from "vitest";

describe("Ollama API credential", () => {
  it("authenticates against the lightweight Ollama tags endpoint", async () => {
    const apiKey = process.env.OLLAMA_API_KEY;
    expect(apiKey, "OLLAMA_API_KEY must be configured").toBeTruthy();
    const response = await fetch("https://ollama.com/api/tags", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(response.status, await response.text()).toBeLessThan(500);
    expect([200, 401, 403]).toContain(response.status);
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Ollama rejected the supplied key with ${response.status}.`);
    }
  }, 20000);
});
