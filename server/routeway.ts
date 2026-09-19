import type { Message } from "./_core/llm";
import { getApiCredentialSecret } from "./db";

export const ROUTEWAY_BASE_URL = "https://api.routeway.ai/v1";
export const ROUTEWAY_DEEPSEEK_MODEL = "deepseek-v4-flash:free";
export const ROUTEWAY_FREE_MODELS = [
  { id: "deepseek-v4-flash:free", name: "DeepSeek V4 Flash", provider: "DeepSeek", capabilities: ["reasoning", "function_call"] },
  { id: "minimax-m2.7:free", name: "MiniMax M2.7", provider: "MiniMax", capabilities: ["reasoning", "function_call"] },
  { id: "muse-glimmer-30b:free", name: "Glimmer 30B", provider: "Meta", capabilities: ["vision", "reasoning", "function_call"] },
] as const;

export async function invokeRouteway(messages: Message[], options?: { model?: string; reasoning?: boolean }) {
  const apiKey = await getApiCredentialSecret("Routeway") ?? process.env.ROUTEWAY_API_KEY;
  if (!apiKey) throw new Error("Routeway is not configured.");
  const model = options?.model ?? ROUTEWAY_DEEPSEEK_MODEL;
  if (!ROUTEWAY_FREE_MODELS.some((item) => item.id === model)) throw new Error("مدل رایگان Routeway در فهرست مجاز نیست.");
  const response = await fetch(`${ROUTEWAY_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      ...(options?.reasoning ? { max_completion_tokens: 4096 } : {}),
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Routeway request failed (${response.status}): ${body.slice(0, 300)}`);
  return JSON.parse(body) as { choices?: Array<{ message?: { content?: unknown } }> };
}
