# Claude Fable 5.1 connection research

## Sources
- https://openrouter.ai/anthropic — OpenRouter provider page; lists the OpenAI-compatible base URL `https://openrouter.ai/api/v1` and model slug `anthropic/claude-fable-5.1`.
- https://openrouter.ai/anthropic/claude-fable-5 — OpenRouter model page.
- https://platform.claude.com/docs/en/models/fable-5-1/overview — Anthropic model overview.
- https://www.anthropic.com/claude/fable — official product page.

## Integration decision
The supplied key uses the OpenRouter `sk-or-v1-` format. Store it only as a server-side secret named `FABLE_51_OPENROUTER_API_KEY`; call the OpenRouter-compatible endpoint with model `anthropic/claude-fable-5.1`. Do not expose the key in client code or the API catalog.

## Important status
The OpenRouter connector exists in session configuration but is disabled. The project can validate the key against the lightweight OpenRouter models endpoint without sending a billable chat request. Actual Fable generation should be tested only after the secret is stored and the endpoint responds successfully.
