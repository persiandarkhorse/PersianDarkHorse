export type MediaKind = "image" | "video";
export type ProviderAccess = "connected" | "free-tier" | "key-required" | "fallback";

export type MediaProvider = {
  id: string;
  label: string;
  kinds: MediaKind[];
  access: ProviderAccess;
  requiresKey: boolean;
  description: string;
  note: string;
  setupHref?: string;
};

/**
 * This catalog deliberately separates a free tier from a guaranteed free API.
 * Quotas and eligibility belong to the provider account and can change.
 */
export const MEDIA_PROVIDERS: MediaProvider[] = [
  {
    id: "FEZI Image Core",
    label: "FEZI Image Core",
    kinds: ["image"],
    access: "connected",
    requiresKey: false,
    description: "مسیر فعلی تولید تصویر FEZI",
    note: "از مسیر تصویر متصل به FEZI استفاده می‌کند؛ هزینه و سهمیه تابع تنظیمات سرویس است.",
  },
  {
    id: "Hugging Face Inference",
    label: "Hugging Face · Free tier",
    kinds: ["image", "video"],
    access: "free-tier",
    requiresKey: true,
    description: "یک درگاه برای مدل‌های متن‌باز تصویر و ویدیو",
    note: "اعتبار رایگان محدود دارد و به توکن Hugging Face و مدل/Provider انتخابی وابسته است؛ رایگان نامحدود نیست.",
    setupHref: "/account",
  },
  {
    id: "Google Gemini / Veo",
    label: "Gemini / Veo",
    kinds: ["image", "video"],
    access: "free-tier",
    requiresKey: true,
    description: "Nano Banana برای تصویر و Veo برای ویدیو",
    note: "Google برای برخی حساب‌ها free tier یا اعتبار آزمایشی دارد؛ سهمیه و دسترسی باید با کلید خودتان بررسی شود.",
    setupHref: "/account",
  },
  {
    id: "Runway",
    label: "Runway",
    kinds: ["video"],
    access: "key-required",
    requiresKey: true,
    description: "تولید ویدیو با کنترل‌های سینمایی",
    note: "کلید Runway را در پنل حساب وارد کنید؛ هزینه و محدودیت بر عهده حساب Provider است.",
    setupHref: "/account",
  },
  {
    id: "Seedance 2.0",
    label: "Seedance 2.0",
    kinds: ["video"],
    access: "key-required",
    requiresKey: true,
    description: "تولید ویدیوی کوتاه و تبلیغاتی",
    note: "برای تولید واقعی به کلید Seedance یا Gateway سازگار نیاز دارد.",
    setupHref: "/account",
  },
  {
    id: "GapGPT fallback",
    label: "GapGPT · Fallback",
    kinds: ["image", "video"],
    access: "fallback",
    requiresKey: true,
    description: "مسیر پشتیبان در صورت فعال‌شدن API معتبر",
    note: "در حال حاضر endpoint و کلید معتبر GapGPT در پروژه ثبت نشده است؛ تا آن زمان فقط به‌عنوان fallback نمایش داده می‌شود.",
    setupHref: "/account",
  },
  {
    id: "Routeway Free",
    label: "Routeway · Free models",
    kinds: [],
    access: "connected",
    requiresKey: false,
    description: "مدل‌های رایگان گفت‌وگو و reasoning",
    note: "Routeway فعلاً برای پاسخ متنی FEZI فعال است، نه تولید مستقیم تصویر یا ویدیو.",
  },
];

export function mediaProvidersFor(kind: MediaKind) {
  return MEDIA_PROVIDERS.filter((provider) => provider.kinds.includes(kind));
}

export function mediaProviderStatus(provider: MediaProvider, hasUserKey: boolean) {
  if (provider.access === "connected") return { label: "متصل", tone: "connected" as const };
  if (provider.requiresKey && hasUserKey) return { label: "کلید متصل", tone: "connected" as const };
  if (provider.access === "free-tier") return { label: "رایگان مشروط", tone: "free-tier" as const };
  if (provider.access === "fallback") return { label: "پشتیبان / نیازمند اتصال", tone: "fallback" as const };
  return { label: "نیازمند کلید", tone: "key-required" as const };
}
