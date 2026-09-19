export type PlanId = "horse_rider" | "rider" | "swift_rider" | "horse_runner" | "lone_rider" | "sovereign";

export type Plan = {
  id: PlanId;
  nameFa: string;
  nameEn: string;
  price: string;
  billing: "free" | "monthly" | "lifetime";
  badge?: string;
  summary: string;
  agents: string[];
  features: string[];
  videoQuota: string;
};

export const PLANS: Plan[] = [
  { id: "horse_rider", nameFa: "اسب‌سوار", nameEn: "Horse Rider", price: "$0", billing: "free", summary: "شروع رایگان با دسترسی پایه", agents: ["manika", "arta"], features: ["گفت‌وگوی پایه", "ایده‌پردازی", "بازی و داستان", "پرامپت‌نویسی"], videoQuota: "بدون سهمیه ویدیوی ابری" },
  { id: "rider", nameFa: "سوارکار", nameEn: "Rider", price: "$9.99", billing: "monthly", summary: "برای کارهای حرفه‌ای روزمره", agents: ["manika", "arta", "arvin", "negar", "fezi"], features: ["تمام Agentهای پایه", "تحلیل کسب‌وکار", "کدنویسی", "FEZI Basic"], videoQuota: "سهمیه پایه؛ Provider با کلید کاربر" },
  { id: "swift_rider", nameFa: "چابک‌سوار", nameEn: "Swift Rider", price: "$19.99", billing: "monthly", badge: "محبوب‌ترین", summary: "تیم کامل برای پروژه‌های جدی", agents: ["manika", "arta", "arvin", "negar", "fezi"], features: ["دسترسی کامل Agentها", "FEZI Advanced", "پروژه‌های چندمرحله‌ای", "هماهنگی Agentها"], videoQuota: "سهمیه پیشرفته؛ Provider با کلید کاربر" },
  { id: "horse_runner", nameFa: "اسب‌تاز", nameEn: "Horse Runner", price: "$39.99", billing: "monthly", summary: "برای پروژه‌های حرفه‌ای و سنگین", agents: ["manika", "arta", "arvin", "negar", "fezi"], features: ["Research", "Deep Research", "Multi-Agent Tasks", "Priority Processing"], videoQuota: "اولویت پردازش؛ هزینه Provider جداست" },
  { id: "lone_rider", nameFa: "تک‌سوار", nameEn: "Lone Rider", price: "$79.99", billing: "monthly", summary: "برای استفادهٔ حرفه‌ای و مداوم", agents: ["manika", "arta", "arvin", "negar", "fezi"], features: ["FEZI Master", "هماهنگی چند Agent", "کدنویسی پیشرفته", "تحلیل پیچیده"], videoQuota: "سهمیه حرفه‌ای؛ هزینه Provider جداست" },
  { id: "sovereign", nameFa: "فرمانروا", nameEn: "Sovereign", price: "$4,300", billing: "lifetime", badge: "یک‌بار پرداخت", summary: "مالکیت دسترسی حرفه‌ای مادام‌العمر", agents: ["manika", "arta", "arvin", "negar", "fezi"], features: ["Lifetime Access", "FEZI Master", "Multi-Agent", "به‌روزرسانی‌های اصلی"], videoQuota: "دسترسی دائمی به قابلیت؛ هزینه Provider جداست" },
];

export const FREE_PLAN_ID: PlanId = "horse_rider";
export const ADMIN_PLAN_ID: PlanId = "sovereign";
/** Public free access stays off while FEZI is in private build/test mode. */
export const PUBLIC_FREE_ACCESS = false;

export function getPlan(planId?: string | null) {
  return PLANS.find((plan) => plan.id === planId) ?? PLANS[0];
}
