import { describe, expect, it } from "vitest";
import { buildAgentRuntimePrompt, getCapabilityBindings, resolveAgentId } from "./capabilityRouter";

describe("capability runtime routing", () => {
  it("maps the UI Manika id to the Master Spec Monicah identity", () => {
    expect(resolveAgentId("manika")).toBe("monicah");
  });

  it("marks image generation and web research as connected runtime capabilities", () => {
    const bindings = getCapabilityBindings("manika");
    expect(bindings.find((item) => item.capability.id === "monicah.image.create")?.status).toBe("connected");
    expect(bindings.find((item) => item.capability.id === "monicah.video.short")?.status).toBe("pending");
  });

  it("builds a runtime prompt with the selected agent and connector guardrails", () => {
    const prompt = buildAgentRuntimePrompt("negar", "کدنویسی", ["negar.react"], ["github"]);
    expect(prompt).toContain("ACTIVE AGENT: Negar");
    expect(prompt).toContain("github");
    expect(prompt).toContain("never claim");
  });
});
