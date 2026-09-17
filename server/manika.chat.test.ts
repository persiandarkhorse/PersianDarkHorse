import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeLLMMock, generateImageMock } = vi.hoisted(() => ({
  invokeLLMMock: vi.fn(),
  generateImageMock: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: invokeLLMMock,
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: generateImageMock,
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
    generateImageMock.mockReset();
    invokeLLMMock.mockResolvedValue({
      choices: [{ message: { content: "سلام، من مانیکا هستم." } }],
    });
    generateImageMock.mockResolvedValue({ url: "/manus-storage/generated.png" });
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

  it("generates an image through the server-side image service", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.manika.image({
      mode: "generate",
      prompt: "مانیکا در یک گالری هنری با نور پنجره",
      originalImageUrl: "https://example.com/manika-reference.png",
    });

    expect(result).toEqual({ imageUrl: "/manus-storage/generated.png" });
    expect(generateImageMock).toHaveBeenCalledOnce();
    expect(generateImageMock.mock.calls[0]?.[0].prompt).toContain("مانیکا");
    expect(generateImageMock.mock.calls[0]?.[0].originalImages).toEqual([{
      url: "https://example.com/manika-reference.png",
      mimeType: "image/png",
    }]);
  });

  it("generates a general image without attaching Manika identity", async () => {
    const caller = appRouter.createCaller(createContext());
    await caller.manika.image({
      mode: "generate",
      imageType: "general",
      prompt: "یک منظرهٔ کوهستانی سینمایی در طلوع آفتاب",
    });

    expect(generateImageMock.mock.calls[0]?.[0].originalImages).toBeUndefined();
    expect(generateImageMock.mock.calls[0]?.[0].prompt).not.toContain("Manika's exact established face");
  });
});
