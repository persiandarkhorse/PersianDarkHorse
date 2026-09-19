export type ModelCategory = "chat" | "reasoning" | "image" | "video" | "openai" | "cloud" | "wan";
export type ModelAccess = "free" | "free-tier" | "paid" | "key-required" | "connected";

export type FEZIModel = {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  access: ModelAccess;
  modelId?: string;
  description: string;
  sourceUrl: string;
  agents: Array<"manika" | "fezi" | "arvin" | "arta" | "negar">;
  supportsChat: boolean;
  supportsCreation: boolean;
};

const allAgents = ["manika", "fezi", "arvin", "arta", "negar"] as const;
const creative = ["manika", "fezi", "arta"] as const;
const technical = ["fezi", "negar"] as const;
const business = ["fezi", "arvin", "negar"] as const;

export const MODEL_CATALOG: FEZIModel[] = [
  { id: "fezi-core", name: "FEZI AI Core", provider: "FEZI AI", category: "chat", access: "connected", modelId: "fezi-core", description: "موتور ترکیبی اصلی FEZI با شخصیت Agent فعال و fallback هوشمند.", sourceUrl: "https://manus.im", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "routeway-deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "Routeway", category: "reasoning", access: "free", modelId: "deepseek-v4-flash:free", description: "مدل رایگان reasoning از مسیر Routeway؛ دارای سقف استفاده Provider.", sourceUrl: "https://routeway.ai", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "routeway-minimax-m27", name: "MiniMax M2.7", provider: "Routeway", category: "chat", access: "free", modelId: "minimax-m2.7:free", description: "مدل رایگان مکالمه و تولید متن در Routeway.", sourceUrl: "https://routeway.ai", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "routeway-glimmer-30b", name: "Glimmer 30B", provider: "Routeway", category: "reasoning", access: "free", modelId: "muse-glimmer-30b:free", description: "مدل رایگان Routeway برای تحلیل و ایده‌پردازی.", sourceUrl: "https://routeway.ai", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral AI", category: "chat", access: "connected", modelId: "mistral-large-latest", description: "مدل متنی Mistral برای تحلیل، نگارش و کدنویسی.", sourceUrl: "https://docs.mistral.ai/getting-started/models/models_overview/", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek / OpenRouter", category: "reasoning", access: "key-required", modelId: "deepseek/deepseek-r1", description: "مدل reasoning؛ فعال‌سازی به Provider و کلید معتبر وابسته است.", sourceUrl: "https://api-docs.deepseek.com/", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "qwen3", name: "Qwen3", provider: "Alibaba Cloud", category: "chat", access: "key-required", modelId: "qwen3.7-plus", description: "مدل چندزبانه و reasoning از Model Studio.", sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "llama-4", name: "Llama 4", provider: "Meta / Ollama", category: "chat", access: "free-tier", modelId: "llama4", description: "مدل متن‌باز؛ دسترسی به Provider یا اجرای محلی نیاز دارد.", sourceUrl: "https://www.llama.com/llama4/", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", category: "openai", access: "paid", modelId: "gpt-4o", description: "مدل چندرسانه‌ای OpenAI؛ هزینه و دسترسی طبق حساب OpenAI.", sourceUrl: "https://platform.openai.com/docs/models", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", category: "openai", access: "paid", modelId: "gpt-5", description: "مدل پیشرفته OpenAI؛ نیازمند دسترسی رسمی و billing فعال.", sourceUrl: "https://platform.openai.com/docs/models", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic", category: "chat", access: "key-required", modelId: "claude-sonnet", description: "مدل متنی Anthropic برای تحلیل، نوشتن و کدنویسی.", sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/models", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "gemini-3-flash", name: "Gemini Flash", provider: "Google", category: "cloud", access: "free-tier", modelId: "gemini-3-flash", description: "مدل سریع Google؛ free tier محدود و وابسته به حساب دارد.", sourceUrl: "https://ai.google.dev/gemini-api/docs/models", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "nano-banana-2", name: "Nano Banana 2", provider: "Google Gemini", category: "image", access: "free-tier", modelId: "gemini-3.1-flash-image", description: "مدل تصویری Gemini برای تولید و ویرایش تصویر؛ سهمیه حساب Google اعمال می‌شود.", sourceUrl: "https://ai.google.dev/gemini-api/docs/image-generation", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "nano-banana-pro", name: "Nano Banana Pro", provider: "Google Gemini", category: "image", access: "paid", modelId: "gemini-3-pro-image", description: "مدل تصویری حرفه‌ای Gemini برای کنترل خلاقانه و برند.", sourceUrl: "https://ai.google.dev/gemini-api/docs/image-generation", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "fezi-image-core", name: "FEZI Image Core", provider: "FEZI AI", category: "image", access: "connected", modelId: "MODEL_GPT_IMAGE_2", description: "مسیر فعلی متصل تولید تصویر در FEZI.", sourceUrl: "https://manus.im", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "gpt-image", name: "GPT Image", provider: "OpenAI", category: "image", access: "paid", modelId: "gpt-image-1", description: "تولید و ویرایش تصویر OpenAI؛ هزینه طبق API حساب می‌شود.", sourceUrl: "https://developers.openai.com/api/docs/guides/image-generation", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "flux", name: "FLUX", provider: "Black Forest Labs", category: "image", access: "paid", modelId: "flux", description: "خانواده مدل‌های تصویر؛ دسترسی از API یا Provider مربوط.", sourceUrl: "https://docs.bfl.ai/", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "veo", name: "Veo", provider: "Google Gemini", category: "video", access: "free-tier", modelId: "veo", description: "تولید ویدیو با free tier یا اعتبار محدود حساب Google.", sourceUrl: "https://ai.google.dev/gemini-api/docs/video", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "gemini-omni-video", name: "Gemini Omni Flash Video", provider: "Google Gemini", category: "video", access: "free-tier", modelId: "gemini-omni-flash", description: "تولید و ویرایش ویدیوی چندوجهی؛ دسترسی طبق حساب Google.", sourceUrl: "https://ai.google.dev/gemini-api/docs/video", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "runway", name: "Runway", provider: "Runway", category: "video", access: "key-required", modelId: "runway", description: "تولید ویدیوی سینمایی؛ کلید اختصاصی کاربر لازم است.", sourceUrl: "https://docs.dev.runwayml.com/", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "seedance", name: "Seedance 2.0", provider: "Seedance", category: "video", access: "key-required", modelId: "seedance", description: "تولید ویدیوی تبلیغاتی و کوتاه؛ کلید یا Gateway معتبر لازم است.", sourceUrl: "https://www.volcengine.com/product/see-1", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "wan-2-1", name: "Wan 2.1", provider: "Alibaba / Wan", category: "wan", access: "free-tier", modelId: "Wan-AI/Wan2.1-T2V-1.3B", description: "مدل متن‌باز تولید ویدیو؛ اجرای محلی یا Provider میزبان لازم است.", sourceUrl: "https://github.com/Wan-Video/Wan2.1", agents: [...creative, "negar"], supportsChat: false, supportsCreation: true },
  { id: "wan-2-2", name: "Wan 2.2", provider: "Alibaba / Wan", category: "wan", access: "free-tier", modelId: "Wan-AI/Wan2.2", description: "خانواده متن‌باز Wan برای تولید ویدیو و تصویر؛ هزینه زیرساخت جداست.", sourceUrl: "https://github.com/Wan-Video/Wan2.2", agents: [...creative, "negar"], supportsChat: false, supportsCreation: true },
  { id: "kling", name: "Kling AI", provider: "Kuaishou", category: "video", access: "key-required", modelId: "kling", description: "تولید ویدیوی واقع‌گرایانه؛ کلید Provider لازم است.", sourceUrl: "https://app.klingai.com/global/dev", agents: [...creative], supportsChat: false, supportsCreation: true },
  { id: "qwen-image", name: "Qwen Image", provider: "Alibaba Cloud", category: "image", access: "key-required", modelId: "qwen-image", description: "مدل تصویری Qwen؛ فعال‌سازی از Model Studio.", sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/", agents: [...creative, "negar"], supportsChat: false, supportsCreation: true },
  { id: "mistral-pixtral", name: "Pixtral", provider: "Mistral AI", category: "image", access: "connected", modelId: "pixtral-large-latest", description: "مدل بینایی Mistral برای متن و تصویر؛ وضعیت API حساب تعیین‌کننده است.", sourceUrl: "https://docs.mistral.ai/capabilities/vision/", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "grok", name: "Grok", provider: "xAI", category: "chat", access: "key-required", modelId: "grok-4", description: "مدل مکالمه xAI؛ نیازمند کلید xAI.", sourceUrl: "https://docs.x.ai/docs/models", agents: [...allAgents], supportsChat: true, supportsCreation: false },
  { id: "devstral", name: "Devstral 2", provider: "Mistral / Ollama", category: "reasoning", access: "free-tier", modelId: "devstral-2", description: "مدل Agent مهندسی نرم‌افزار؛ اجرای محلی یا Provider لازم است.", sourceUrl: "https://ollama.com/library/devstral-2", agents: [...technical], supportsChat: true, supportsCreation: false },
  { id: "qwen-coder", name: "Qwen3 Coder", provider: "Alibaba / Ollama", category: "reasoning", access: "free-tier", modelId: "qwen3-coder", description: "مدل کدنویسی و Agent نرم‌افزاری؛ دسترسی به Provider لازم است.", sourceUrl: "https://ollama.com/library/qwen3-coder", agents: [...technical], supportsChat: true, supportsCreation: false },
  { id: "perplexity-sonar", name: "Perplexity Sonar", provider: "Perplexity", category: "cloud", access: "key-required", modelId: "sonar-pro", description: "مدل جست‌وجومحور؛ نیازمند کلید Perplexity.", sourceUrl: "https://docs.perplexity.ai/", agents: [...business, "manika"], supportsChat: true, supportsCreation: false },
];

export const MODEL_CATEGORIES: Array<{ id: ModelCategory; label: string }> = [
  { id: "chat", label: "مدل‌های چت" }, { id: "reasoning", label: "استدلالی" }, { id: "image", label: "تولید تصویر" }, { id: "video", label: "تولید ویدیو" }, { id: "openai", label: "OpenAI / ChatGPT" }, { id: "cloud", label: "Cloud" }, { id: "wan", label: "Wan" },
];

export const AGENT_MODEL_DEFAULTS: Record<string, string[]> = {
  manika: ["fezi-core", "nano-banana-2", "gpt-image", "veo", "routeway-minimax-m27"],
  fezi: ["fezi-core", "routeway-deepseek-v4-flash", "gpt-5", "gemini-3-flash", "qwen3"],
  arvin: ["fezi-core", "gpt-4o", "perplexity-sonar", "mistral-large", "routeway-minimax-m27"],
  arta: ["fezi-core", "gpt-4o", "veo", "kling", "routeway-glimmer-30b"],
  negar: ["fezi-core", "devstral", "qwen-coder", "llama-4", "gpt-5"],
};

export const modelAccessLabel: Record<ModelAccess, string> = { free: "رایگان", "free-tier": "رایگان مشروط", paid: "پولی", "key-required": "نیازمند کلید", connected: "متصل" };
