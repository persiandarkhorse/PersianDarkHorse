# Ollama research

## Sources
- https://ollama.com/library/devstral-2/tags
- https://ollama.com/library

## Devstral 2
The official tag page lists five tags: `devstral-2:latest`, `devstral-2:123b`, `devstral-2:123b-instruct-2512-q4_K_M`, `devstral-2:123b-instruct-2512-q8_0`, and `devstral-2:123b-instruct-2512-fp16`. It is a 123B model focused on tools, codebase exploration, multi-file editing, and software-engineering agents. All listed tags are text-input models with a 256K context window. Listed sizes are 75GB for latest/123b/q4_K_M, 133GB for q8_0, and 250GB for fp16.

## Ollama library highlights
The official library page lists popular/new models including llama3.1, deepseek-r1, nomic-embed-text, llama3.2, gemma3, qwen2.5, qwen3, mistral, gemma2, gemma4, qwen2.5-coder, qwen3.5, phi3, llava, gpt-oss, qwen3-coder, phi4, glm-ocr, bge-m3, qwen3.6, codellama, qwen3-vl, mistral-nemo, llama3.2-vision, qwen2.5vl, deepseek-coder, kimi-k3, granite4.2, north-mini-code-1.0, glm-5.3, minicpm-v4.6, minicpm-v4.5, laguna-xs.2, deepseek-v4.1-flash, and granite4.1-guardian. The page reports capabilities such as tools, thinking, vision, audio, cloud, and embeddings depending on model.

## Project verification
The supplied Ollama Cloud key was registered as `OLLAMA_API_KEY` server-side and authenticated successfully against `https://ollama.com/api/tags`; the returned accessible model list included `gemma4:31b`, `qwen3.5:397b`, `mistral-large-3:675b`, `nemotron-3-super`, `deepseek-v4.1-flash`, `gpt-oss:120b`, `glm-5.3`, `kimi-k3`, and others.
