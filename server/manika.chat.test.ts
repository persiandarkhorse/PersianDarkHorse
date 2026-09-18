import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeLLMMock, generateImageMock, storagePutMock, transcribeAudioMock } = vi.hoisted(() => ({
  invokeLLMMock: vi.fn(),
  generateImageMock: vi.fn(),
  storagePutMock: vi.fn(),
  transcribeAudioMock: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: invokeLLMMock,
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: generateImageMock,
}));

vi.mock("./storage", () => ({
  storagePut: storagePutMock,
}));

vi.mock("./_core/voiceTranscription", () => ({
  transcribeAudio: transcribeAudioMock,
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
    storagePutMock.mockReset();
    transcribeAudioMock.mockReset();
    invokeLLMMock.mockResolvedValue({
      choices: [{ message: { content: "سلام، من مانیکا هستم." } }],
    });
    generateImageMock.mockResolvedValue({ url: "/manus-storage/generated.png" });
    storagePutMock.mockResolvedValue({ key: "chat-uploads/file.txt", url: "/manus-storage/chat-uploads/file.txt" });
    transcribeAudioMock.mockResolvedValue({ text: "متن ویس", language: "fa", task: "transcribe", duration: 1, segments: [] });
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

  it("uploads a chat file to project storage", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.manika.uploadFile({
      fileName: "notes.txt",
      contentType: "text/plain",
      dataBase64: Buffer.from("hello").toString("base64"),
    });

    expect(result).toMatchObject({ fileName: "notes.txt", contentType: "text/plain", size: 5 });
    expect(storagePutMock).toHaveBeenCalledOnce();
  });

  it("generates audio through Speechify without exposing the provider key", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ audio_data: "YXVkaW8=", audio_format: "mp3" }), { status: 200 })));
    const caller = appRouter.createCaller(createContext());
    const result = await caller.manika.speech({ text: "سلام مانیکا", voiceId: "sabrina", model: "simba-3.2" });

    expect(result).toEqual({ audioBase64: "YXVkaW8=", contentType: "audio/mpeg" });
    expect(fetch).toHaveBeenCalledWith("https://api.speechify.ai/v1/audio/speech", expect.objectContaining({ method: "POST" }));
    vi.unstubAllGlobals();
  });

  it("passes deep-thinking controls to the unified FEZI model route", async () => {
    const caller = appRouter.createCaller(createContext());
    await caller.manika.chat({ mode: "دستیار فنی", deepThinking: true, webSearch: false, messages: [{ role: "user", content: "یک معماری امن پیشنهاد بده" }] });

    expect(invokeLLMMock.mock.calls[0]?.[0]).toMatchObject({ reasoning: { effort: "medium" } });
    expect(invokeLLMMock.mock.calls[0]?.[0].messages[0].content).toContain("private chain-of-thought");
  });

  it("transcribes an uploaded voice URL through the server-side transcription service", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.manika.transcribe({ audioUrl: "https://example.com/voice.webm", language: "fa" });

    expect(result).toEqual({ text: "متن ویس", language: "fa" });
    expect(transcribeAudioMock).toHaveBeenCalledWith(expect.objectContaining({ audioUrl: "https://example.com/voice.webm", language: "fa" }));
  });
});
