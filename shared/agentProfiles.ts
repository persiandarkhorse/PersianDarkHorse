import { AGENTS, SHARED_RULES, type AgentId, type Capability } from "./agentSpec";

export type UIAgent = {
  id: "manika" | "fezi" | "arvin" | "arta" | "negar";
  sourceId: AgentId;
  name: string;
  nameEn: string;
  role: string;
  description: string;
  personality: string;
  knowledge: string[];
  rules: string[];
  access: "free" | "paid";
  image?: string;
  capabilities: Capability[];
  modes: string[];
};

const images = {
  manika: "/manus-storage/aab95790-b2a4-11f1-a3f1-ad16c1ab91b7_3b5f6e8a.png",
  fezi: "/manus-storage/fezi-reference_142ab3b4.png",
  arvin: "/manus-storage/arvin-reference_a9e918b0.png",
  arta: "/manus-storage/arta-reference_b28c18c8.png",
  negar: "/manus-storage/negar-reference_6025582a.png",
};

const roleMap = {
  fezi: "رهبر، مربی و هماهنگ‌کنندهٔ ارشد",
  monicah: "هنرمند خلاق و متخصص جهت‌دهی بصری",
  arvin: "استراتژیست کسب‌وکار و اپراتور رشد",
  arta: "متخصص سرگرمی و داستان‌پرداز تعاملی",
  negar: "مهندس نرم‌افزار و سازندهٔ محصول",
} as const;

const uiNames = {
  fezi: ["فضی", "Fezi"],
  monicah: ["مانیکا", "Manika"],
  arvin: ["آروین", "Arvin"],
  arta: ["آرتا", "Arta"],
  negar: ["نگار", "Negar"],
} as const;

const modeMap: Record<UIAgent["id"], string[]> = {
  fezi: ["گفت‌وگوی عمومی", "تحقیق عمیق", "تحلیل تصمیم", "اجرا و ساخت", "هماهنگی ایجنت‌ها"],
  manika: ["ساخت تصویر", "عکاسی و کارگردانی", "فشن و استایل", "ویدیوی کوتاه", "برندینگ بصری"],
  arvin: ["استراتژی کسب‌وکار", "قیمت‌گذاری و درآمد", "تحقیق بازار", "قیف فروش", "تحلیل KPI"],
  arta: ["کوئیز و بازی", "معما و پازل", "داستان تعاملی", "رول‌پلی", "طراحی بازی"],
  negar: ["Python و کدنویسی", "React و Frontend", "Backend و API", "دیتابیس و SQL", "تست و امنیت"],
};

const translatedRules = [
  "اطلاعات محرمانه، رمزها، API Key و توکن‌ها را افشا نمی‌کند.",
  "منبع، جست‌وجو، اتصال، تولید یا اجرای موفق را بدون شواهد واقعی ادعا نمی‌کند.",
  "حریم خصوصی و کنترل‌های ذخیره‌سازی کاربر را رعایت می‌کند.",
  "درخواست‌های آسیب‌زا یا غیرقانونی را رد یا به مسیر امن هدایت می‌کند.",
  "اصلاحات کاربر را بررسی و فقط پس از راستی‌آزمایی به دانش پایدار اضافه می‌کند.",
];

function sourceToUi(id: UIAgent["id"], sourceId: AgentId, capabilities: Capability[]): UIAgent {
  const source = AGENTS[sourceId];
  const [name, nameEn] = uiNames[sourceId];
  const personality = source.personality;
  const focus = capabilities.slice(0, 5).map((item) => item.fa);
  return {
    id,
    sourceId,
    name,
    nameEn,
    role: roleMap[sourceId],
    description: personality.philosophy_fa,
    personality: `${personality.keywords.join("، ")}؛ ${personality.relationship_fa.join("، ")}؛ اولویت‌ها: ${personality.decision_priorities.join("، ")}.`,
    knowledge: focus,
    rules: [...translatedRules, ...SHARED_RULES.dangerous_requests.slice(0, 1).map(() => "مرز واقعیت و نقش‌آفرینی را شفاف نگه می‌دارد.")],
    access: "free",
    image: images[id],
    capabilities,
    modes: modeMap[id],
  };
}

export const agentProfiles: UIAgent[] = [
  sourceToUi("manika", "monicah", AGENTS.monicah.capabilities),
  sourceToUi("fezi", "fezi", AGENTS.fezi.capabilities),
  sourceToUi("arvin", "arvin", AGENTS.arvin.capabilities),
  sourceToUi("arta", "arta", AGENTS.arta.capabilities),
  sourceToUi("negar", "negar", AGENTS.negar.capabilities),
];

export const agentProfileById = Object.fromEntries(agentProfiles.map((agent) => [agent.id, agent])) as Record<UIAgent["id"], UIAgent>;
