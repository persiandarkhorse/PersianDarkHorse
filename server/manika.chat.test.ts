import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeLLMMock } = vi.hoisted(() => ({ invokeLLMMock: vi.fn() }));

vi.mock("./_core/llm", () => ({
  invokeLLM: invokeLLMMock,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("manika.chat", () => {
  beforeEach(() => {
    invokeLLMMock.mockReset();
    invokeLLMMock.mockResolvedValue({
      choices: [{ message: { content: "سلام، من مانیکا هستم." } }],
    });
  });

  it("returns the model response for a valid conversation", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.manika.chat({
      mode: "گفت‌وگوی آزاد",
      messages: [{ role: "user", content: "خودت را معرفی کن" }],
    });

    expect(result).toEqual({ content: "سلام، من مانیکا هستم." });
    expect(invokeLLMMock).toHaveBeenCalledOnce();
    expect(invokeLLMMock.mock.calls[0]?.[0].messages[1]).toEqual({
      role: "user",
      content: "خودت را معرفی کن",
    });
  });

  it("rejects an empty message before calling the model", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.manika.chat({
      mode: "گفت‌وگوی آزاد",
      messages: [{ role: "user", content: "" }],
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(invokeLLMMock).not.toHaveBeenCalled();
  });
});
