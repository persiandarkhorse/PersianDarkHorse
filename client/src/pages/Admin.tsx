import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, ArrowRight, CheckCircle2, Crown, KeyRound, LockKeyhole, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { PLANS, type PlanId } from "../../../shared/plans";

const providers = ["OpenRouter", "Routeway", "OpenAI", "Mistral", "Speechify", "xAI / Grok", "Ollama Cloud", "GapGPT", "Apify MCP", "سرویس سفارشی"];

type CredentialDraft = { id?: number; provider: string; label: string; secret: string };

function AdminCredentialsPage() {
  const utils = trpc.useUtils();
  const credentials = trpc.admin.credentials.useQuery(undefined, { retry: false });
  const saveCredential = trpc.admin.saveCredential.useMutation({
    onSuccess: async () => {
      setDraft({ provider: "OpenRouter", label: "", secret: "" });
      setFeedback({ kind: "success", text: "کلید با موفقیت به‌صورت رمزگذاری‌شده ذخیره شد. مقدار خام دوباره نمایش داده نمی‌شود." });
      await utils.admin.credentials.invalidate();
    },
    onError: (error) => setFeedback({ kind: "error", text: error.message || "ذخیرهٔ کلید انجام نشد." }),
  });
  const setSubscription = trpc.admin.setSubscription.useMutation({
    onSuccess: () => setFeedback({ kind: "success", text: "اشتراک کاربر در backend فعال شد." }),
    onError: (error) => setFeedback({ kind: "error", text: error.message || "فعال‌سازی اشتراک انجام نشد." }),
  });
  const deleteCredential = trpc.admin.deleteCredential.useMutation({
    onSuccess: async () => {
      setFeedback({ kind: "success", text: "کلید از خزانهٔ امن حذف شد." });
      await utils.admin.credentials.invalidate();
    },
    onError: (error) => setFeedback({ kind: "error", text: error.message || "حذف کلید انجام نشد." }),
  });
  const [draft, setDraft] = useState<CredentialDraft>({ provider: "OpenRouter", label: "", secret: "" });
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [subscriberOpenId, setSubscriberOpenId] = useState("");
  const [subscriptionPlanId, setSubscriptionPlanId] = useState<PlanId>("swift_rider");
  const [subscriptionLifetime, setSubscriptionLifetime] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFeedback(null);
    saveCredential.mutate({
      ...(draft.id ? { id: draft.id } : {}),
      provider: draft.provider,
      label: draft.label,
      secret: draft.secret,
    });
  }

  function selectForReplacement(item: { id: number; provider: string; label: string }) {
    setDraft({ id: item.id, provider: item.provider, label: item.label, secret: "" });
    setFeedback({ kind: "success", text: "برای جایگزینی این کلید، مقدار جدید را وارد کنید. کلید قبلی نمایش داده نمی‌شود." });
  }

  return <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8" dir="rtl">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dededb] pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#777] hover:text-black"><ArrowRight size={14} /> بازگشت به FEZI AI</Link>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">Persian Dark Horse · Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">خزانهٔ امن API</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666]">کلیدها را برای استفادهٔ server-side مدیریت کنید؛ مقدار خام هیچ‌وقت در رابط کاربری، پاسخ API یا repository نمایش داده نمی‌شود.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#cfe5d1] bg-[#f1fbf2] px-4 py-3 text-xs text-[#256b2c]"><ShieldCheck size={17} /> فقط مدیران مجاز</div>
      </header>

      <section className="mt-7 rounded-3xl border border-[#dededb] bg-white p-5 shadow-sm md:p-7" aria-labelledby="subscription-admin-title"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white"><Crown size={18} /></div><div><h2 id="subscription-admin-title" className="text-lg font-semibold">فعال‌سازی اشتراک کاربر</h2><p className="mt-1 text-xs text-[#888]">پس از بررسی TXID، entitlement را از اینجا فعال کنید. این عملیات فقط Admin است.</p></div></div><form onSubmit={(event) => { event.preventDefault(); if (!subscriberOpenId.trim()) return; setSubscription.mutate({ userOpenId: subscriberOpenId.trim(), planId: subscriptionPlanId, isLifetime: subscriptionLifetime, expiresAt: subscriptionLifetime ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }); }} className="mt-5 grid gap-3 md:grid-cols-[1.3fr_1fr_auto_auto]"><input value={subscriberOpenId} onChange={(event) => setSubscriberOpenId(event.target.value)} placeholder="شناسهٔ کاربر openId" required className="h-11 rounded-xl border border-[#ddd] px-3 text-sm outline-none focus:border-black" dir="ltr" /><select value={subscriptionPlanId} onChange={(event) => setSubscriptionPlanId(event.target.value as PlanId)} className="h-11 rounded-xl border border-[#ddd] bg-white px-3 text-sm">{PLANS.filter((plan) => plan.id !== "horse_rider").map((plan) => <option key={plan.id} value={plan.id}>{plan.nameFa} · {plan.price}</option>)}</select><label className="flex h-11 items-center gap-2 rounded-xl border border-[#ddd] px-3 text-xs"><input type="checkbox" checked={subscriptionLifetime} onChange={(event) => setSubscriptionLifetime(event.target.checked)} /> مادام‌العمر</label><button disabled={setSubscription.isPending} className="h-11 rounded-xl bg-black px-5 text-xs font-semibold text-white disabled:opacity-50">{setSubscription.isPending ? "در حال ذخیره..." : "فعال‌سازی"}</button></form></section>
      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-3xl border border-[#dededb] bg-white p-5 shadow-sm md:p-7" aria-labelledby="credential-list-title">
          <div className="flex items-center justify-between gap-3"><div><h2 id="credential-list-title" className="text-lg font-semibold">کلیدهای ثبت‌شده</h2><p className="mt-1 text-xs text-[#888]">فقط نام، سرویس، چهار رقم آخر و زمان تغییر قابل مشاهده است.</p></div><button onClick={() => credentials.refetch()} className="rounded-xl border border-[#ddd] p-2.5 text-[#555] hover:bg-[#f5f5f3]" aria-label="به‌روزرسانی فهرست"><RefreshCw size={16} /></button></div>
          {credentials.isLoading && <div className="mt-8 rounded-2xl bg-[#f8f8f6] p-5 text-center text-xs text-[#777]">در حال خواندن فهرست امن...</div>}
          {credentials.isError && <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#f0caca] bg-[#fff4f4] p-4 text-xs leading-6 text-[#8a2c2c]"><AlertTriangle size={17} className="mt-0.5 shrink-0" /><span>دسترسی رد شد یا نشست مدیر معتبر نیست. مقدار هیچ کلیدی از backend برگردانده نشده است.</span></div>}
          {!credentials.isLoading && !credentials.isError && (credentials.data?.length ?? 0) === 0 && <div className="mt-8 rounded-2xl border border-dashed border-[#d8d8d5] p-7 text-center"><KeyRound className="mx-auto text-[#999]" size={24} /><p className="mt-3 text-sm font-medium">هنوز کلیدی ثبت نشده است</p><p className="mt-1 text-xs text-[#888]">از فرم کنار صفحه یک اتصال server-side اضافه کنید.</p></div>}
          <div className="mt-5 space-y-3">{credentials.data?.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e4e4e1] bg-[#fbfbfa] p-4"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white"><LockKeyhole size={17} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.label}</p><p className="mt-1 text-[11px] text-[#777]">{item.provider} · •••• {item.lastFour}</p><p className="mt-1 text-[10px] text-[#aaa]">آخرین تغییر: {new Date(item.updatedAt).toLocaleString("fa-IR")}</p></div></div><div className="flex items-center gap-2"><button onClick={() => selectForReplacement(item)} className="rounded-xl border border-[#d9d9d6] bg-white px-3 py-2 text-[11px] hover:bg-[#f3f3f1]">جایگزینی</button><button onClick={() => { if (window.confirm("این کلید از خزانهٔ امن حذف شود؟")) deleteCredential.mutate({ id: item.id }); }} className="rounded-xl border border-[#f0caca] px-3 py-2 text-[11px] text-[#a33] hover:bg-[#fff3f3]" aria-label={`حذف ${item.label}`}><Trash2 size={14} /></button></div></div>)}</div>
        </section>

        <section className="h-fit rounded-3xl border border-[#dededb] bg-white p-5 shadow-sm md:p-7" aria-labelledby="credential-form-title">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white"><Plus size={18} /></div><div><h2 id="credential-form-title" className="text-lg font-semibold">{draft.id ? "جایگزینی کلید" : "افزودن کلید"}</h2><p className="mt-1 text-xs text-[#888]">ورودی فقط به backend امن ارسال می‌شود.</p></div></div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-medium">سرویس‌دهنده</span><select value={draft.provider} onChange={(event) => setDraft((current) => ({ ...current, provider: event.target.value }))} className="h-11 w-full rounded-xl border border-[#ddd] bg-white px-3 text-sm outline-none focus:border-black">{providers.map((provider) => <option key={provider}>{provider}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-xs font-medium">نام نمایشی</span><input value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} placeholder="مثلاً کلید اصلی Routeway" required minLength={2} maxLength={120} className="h-11 w-full rounded-xl border border-[#ddd] bg-white px-3 text-sm outline-none focus:border-black" /></label>
            <label className="block"><span className="mb-2 block text-xs font-medium">API Key</span><input value={draft.secret} onChange={(event) => setDraft((current) => ({ ...current, secret: event.target.value }))} type="password" autoComplete="new-password" placeholder="کلید را وارد کنید؛ پس از ذخیره قابل مشاهده نیست" required minLength={8} maxLength={4000} className="h-11 w-full rounded-xl border border-[#ddd] bg-white px-3 text-left text-sm outline-none focus:border-black" dir="ltr" /></label>
            <button type="submit" disabled={saveCredential.isPending} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"><LockKeyhole size={15} />{saveCredential.isPending ? "در حال رمزگذاری و ذخیره..." : "ذخیرهٔ امن"}</button>
            {draft.id && <button type="button" onClick={() => setDraft({ provider: "OpenRouter", label: "", secret: "" })} className="w-full rounded-xl border border-[#ddd] px-3 py-2 text-xs text-[#666] hover:bg-[#f5f5f3]">لغو جایگزینی</button>}
          </form>
          <div className="mt-5 rounded-2xl border border-[#e5dfc4] bg-[#fffbed] p-4 text-[11px] leading-6 text-[#695d2d]"><CheckCircle2 size={15} className="mb-1" /><strong>حفاظت فعال:</strong> کلید با AES-256-GCM رمزگذاری می‌شود. برای ذخیره‌سازی باید متغیر `ADMIN_SECRETS_ENCRYPTION_KEY` در Secrets هاست تنظیم شده باشد.</div>
        </section>
      </div>
    </div>
  </div>;
}

export default function Admin() {
  return <DashboardLayout><AdminCredentialsPage /></DashboardLayout>;
}
