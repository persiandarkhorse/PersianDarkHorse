import { Link } from "wouter";
import { ArrowRight, BrainCircuit, Code2, Globe2, Image, Mic2, ShieldCheck, Volume2, Workflow } from "lucide-react";

const services = [
  ["FEZI Core", "موتور مکالمه و شخصیت‌های تخصصی با پشتیبانی فارسی و انگلیسی.", BrainCircuit],
  ["پاسخ‌گویی چندمدلی", "مسیریابی داخلی بین مدل‌های متنی، پشتیبان و سرویس‌های تخصصی.", Workflow],
  ["تفکر عمیق", "حالت تحلیل دقیق‌تر برای پروژه‌های پیچیده؛ بدون نمایش زنجیرهٔ فکر خصوصی.", BrainCircuit],
  ["جست‌وجوی اینترنت", "افزودن زمینهٔ زندهٔ وب به پاسخ‌ها با اعلام شفاف منبع و محدودیت.", Globe2],
  ["تولید تصویر", "ساخت تصویر عمومی و تولید/ویرایش تصویر مانیکا با قفل هویت بصری.", Image],
  ["گفت‌وگوی صوتی", "تبدیل ویس فارسی یا انگلیسی به متن و تولید پاسخ صوتی قابل پخش و دانلود.", Mic2],
  ["صدا و گویندگی", "تولید صوت پاسخ‌ها با سرویس صوتی متصل به FEZI AI.", Volume2],
  ["فایل و سند", "ارسال تصویر، PDF، متن و فایل‌های کاری در چت با ذخیره‌سازی امن.", ShieldCheck],
];

export default function API() {
  return <main className="min-h-screen bg-white px-5 py-10 text-[#111] md:px-12">
    <div className="mx-auto max-w-5xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-black"><ArrowRight size={16} /> بازگشت به گفت‌وگو</Link>
      <header className="mt-14 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#777]">Persian Dark Horse · FEZI AI</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-6xl">APIهای ما</h1>
        <p className="mt-5 text-base leading-8 text-[#555]">تمام قابلیت‌ها از یک درگاه یکپارچهٔ FEZI AI ارائه می‌شوند. سرویس‌های فنی در پشت صحنه مدیریت می‌شوند تا تجربهٔ کاربر ساده، سریع و یکدست بماند.</p>
      </header>
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(([title, description, Icon]) => <article key={title as string} className="rounded-3xl border border-[#e5e5e5] bg-[#fafafa] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white"><Icon size={19} /></span>
          <h2 className="mt-5 text-base font-semibold">{title as string}</h2>
          <p className="mt-2 text-sm leading-6 text-[#666]">{description as string}</p>
        </article>)}
      </section>
      <section className="mt-12 rounded-3xl bg-black p-7 text-white md:p-10">
        <div className="flex items-center gap-3"><Code2 size={20} /><h2 className="text-xl font-semibold">برای توسعه‌دهندگان</h2></div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cfcfcf]">API عمومی و کلیدهای دسترسی در حال آماده‌سازی مرحلهٔ بعدی هستند. کلیدهای providerها هرگز در مرورگر قرار نمی‌گیرند و از طریق سرور و مدیریت امن secrets مصرف می‌شوند.</p>
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 font-mono text-xs leading-7 text-[#ddd]">POST /api/fezi/chat<br />POST /api/fezi/transcribe<br />POST /api/fezi/image<br />POST /api/fezi/speech</div>
      </section>
      <section className="mt-6 rounded-3xl border border-[#e5e5e5] bg-[#fafafa] p-7 md:p-10">
        <h2 className="text-xl font-semibold">زیرساخت‌های متصل</h2>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#555]">
          {["Manus Forge", "OpenRouter", "GapGPT", "xAI / Grok", "Puter", "Speechify", "CoinGecko", "Apify MCP", "Whisper STT"].map((provider) => <span key={provider} className="rounded-full border border-[#ddd] bg-white px-3 py-2">{provider}</span>)}
        </div>
        <p className="mt-5 text-sm leading-7 text-[#666]">این نام‌ها برای شفافیت فنی معرفی شده‌اند؛ کاربر در چت فقط با FEZI AI کار می‌کند و کلیدهای سرویس‌ها در سمت سرور نگهداری می‌شوند.</p>
      </section>
    </div>
  </main>;
}
