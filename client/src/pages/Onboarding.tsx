import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, ChevronLeft, CircleUserRound, Code2, KeyRound, Link2, LockKeyhole, Plus, Sparkles, WandSparkles } from "lucide-react";

const officialPortrait = "/manus-storage/aab95790-b2a4-11f1-a3f1-ad16c1ab91b7_3b5f6e8a.png";

type Agent = { id: string; name: string; role: string; description: string; access: "free" | "paid"; image?: string };
const agents: Agent[] = [
  { id: "manika", name: "مانیکا", role: "خلاق و کارگردان", description: "ایده‌پردازی، تصویر، استایل، محتوا و گفت‌وگوی خلاقانه.", access: "free", image: officialPortrait },
  { id: "agent-2", name: "ایجنت دوم", role: "جایگاه آماده", description: "برای تعریف شخصیت، مدل و قابلیت‌های اختصاصی شما آماده است.", access: "free" },
  { id: "agent-3", name: "ایجنت سوم", role: "جایگاه آماده", description: "این جایگاه بعداً به ایجنت پولی منتخب شما اختصاص می‌یابد.", access: "paid" },
  { id: "agent-4", name: "ایجنت چهارم", role: "جایگاه آماده", description: "این جایگاه بعداً به ایجنت پولی منتخب شما اختصاص می‌یابد.", access: "paid" },
  { id: "agent-5", name: "ایجنت پنجم", role: "جایگاه آماده", description: "این جایگاه بعداً به ایجنت پولی منتخب شما اختصاص می‌یابد.", access: "paid" },
];

const connectorTemplates = [
  { name: "Manus", detail: "موتور داخلی و workspace فعلی", status: "connected" },
  { name: "ChatGPT / OpenAI", detail: "اتصال با API key امن سمت سرور", status: "available" },
  { name: "OpenRouter", detail: "دسترسی به مدل‌های متنوع متنی و تصویری", status: "connected" },
  { name: "GapGPT", detail: "مدل و اپلیکیشن چندمنظوره", status: "connected" },
  { name: "xAI / Grok", detail: "مدل مکالمه و تحلیل زنده", status: "connected" },
  { name: "Puter", detail: "فضای فایل، KV و provider پشتیبان", status: "available" },
  { name: "Speechify", detail: "تولید صوت پاسخ‌ها", status: "connected" },
  { name: "Apify MCP", detail: "ابزارهای استخراج داده و وب", status: "connected" },
];
const skillTemplates = ["گفت‌وگوی فارسی و انگلیسی", "تفکر عمیق", "جست‌وجوی وب", "تولید تصویر", "تبدیل ویس به متن", "مدیریت محتوا"];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("فضی");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("manika");
  const [activeTab, setActiveTab] = useState<"agents" | "connectors" | "skills">(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    return tab === "connectors" || tab === "skills" ? tab : "agents";
  });
  const [loginMode, setLoginMode] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [connected, setConnected] = useState<string[]>(() => JSON.parse(localStorage.getItem("fezi-connectors") ?? "[]") as string[]);
  const [error, setError] = useState("");
  const selected = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);

  function createAccount(event: React.FormEvent) {
    event.preventDefault();
    if ((!loginMode && !name.trim()) || !email.includes("@") || password.length < 8 || (!loginMode && !acceptedTerms)) {
      setError(loginMode ? "ایمیل و رمز عبور حداقل ۸ کاراکتری وارد کنید." : "نام، ایمیل، رمز عبور و پذیرش شرایط را کامل کنید.");
      return;
    }
    const account = { name: name.trim() || email.split("@")[0], email: email.trim(), selectedAgent: selected.id, createdAt: Date.now(), rememberMe };
    localStorage.setItem("fezi-account", JSON.stringify(account));
    if (rememberMe) localStorage.setItem("fezi-remember", "true"); else localStorage.removeItem("fezi-remember");
    navigate("/");
  }

  function toggleConnector(name: string, status: string) {
    if (status === "connected") return;
    const next = connected.includes(name) ? connected.filter((item) => item !== name) : [...connected, name];
    setConnected(next);
    localStorage.setItem("fezi-connectors", JSON.stringify(next));
  }

  return <main className="min-h-screen bg-[#f6f6f4] text-[#111]" dir="rtl">
    <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[minmax(0,1fr)_470px]">
      <section className="order-2 p-5 md:p-10 lg:order-1">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">Persian Dark Horse</p><h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">فضای شخصی FEZI AI</h1></div><Link href="/legal" className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-xs">قوانین و معرفی</Link></div>
          <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#ddd] pb-2"><button onClick={() => setActiveTab("agents")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "agents" ? "bg-black text-white" : "bg-white text-[#666]"}`}>انتخاب ایجنت</button><button onClick={() => setActiveTab("connectors")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "connectors" ? "bg-black text-white" : "bg-white text-[#666]"}`}>Connectors</button><button onClick={() => setActiveTab("skills")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "skills" ? "bg-black text-white" : "bg-white text-[#666]"}`}>Skills</button></div>
          {activeTab === "agents" && <><div className="mt-6 flex items-end justify-between"><div><h2 className="text-xl font-semibold">ایجنت موردنظر را انتخاب کنید</h2><p className="mt-1 text-sm text-[#777]">دو ایجنت رایگان هستند؛ سه جایگاه پولی بعداً با نام و تصویر نهایی شما تکمیل می‌شوند.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs text-[#666]">{selected.name}</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{agents.map((agent) => <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`flex gap-4 rounded-3xl border p-4 text-right transition ${selectedAgent === agent.id ? "border-black bg-white shadow-lg" : "border-[#e1e1df] bg-[#fbfbfa] hover:bg-white"}`} aria-pressed={selectedAgent === agent.id}><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#191919]">{agent.image ? <img src={agent.image} alt={`تصویر ${agent.name}`} className="h-full w-full object-cover object-top" /> : <div className="flex h-full items-center justify-center text-[#aaa]"><CircleUserRound size={28} /></div>}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{agent.name}</span><span className={`rounded-full px-2 py-1 text-[10px] ${agent.access === "free" ? "bg-[#ededeb] text-[#333]" : "bg-black text-white"}`}>{agent.access === "free" ? "رایگان" : "پولی"}</span></div><p className="mt-1 text-xs text-[#777]">{agent.role}</p><p className="mt-2 text-xs leading-5 text-[#555]">{agent.description}</p></div>{selectedAgent === agent.id && <Check size={17} className="mt-1" />}</button>)}</div></>}
          {activeTab !== "agents" && <div className="mt-8"><h2 className="text-xl font-semibold">{activeTab === "connectors" ? "اتصال سرویس‌ها" : "مهارت‌های قابل تخصیص"}</h2><p className="mt-2 text-sm leading-7 text-[#777]">{activeTab === "connectors" ? "سرویس‌ها از یک لایهٔ امن به FEZI AI وصل می‌شوند. کلیدها در مرورگر ذخیره نمی‌شوند و هر اتصال بعداً از پنل مدیر قابل محدودسازی است." : "مهارت‌ها قابلیت‌های قابل تخصیص به هر ایجنت هستند و در پنل مدیر prompt، مدل و سطح دسترسی آن‌ها تنظیم می‌شود."}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{activeTab === "connectors" ? connectorTemplates.map((item) => { const isConnected = item.status === "connected" || connected.includes(item.name); return <div key={item.name} className="rounded-2xl border border-[#ddd] bg-white p-4"><div className="flex items-start justify-between gap-3"><span className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f1ef]"><Link2 size={16} /></span>{item.name}</span><span className={`rounded-full px-2 py-1 text-[10px] ${isConnected ? "bg-[#e8f4e8] text-[#246b2a]" : "bg-[#f1f1f1] text-[#777]"}`}>{isConnected ? "متصل" : "آماده اتصال"}</span></div><p className="mt-3 text-xs leading-5 text-[#777]">{item.detail}</p><button onClick={() => toggleConnector(item.name, item.status)} className="mt-3 w-full rounded-xl border border-[#ddd] px-3 py-2 text-xs hover:bg-[#f5f5f5]">{item.status === "connected" ? "مدیریت اتصال" : isConnected ? "قطع اتصال نمایشی" : "اتصال امن"}</button></div>; }) : skillTemplates.map((item) => <div key={item} className="flex items-center justify-between rounded-2xl border border-[#ddd] bg-white p-4"><span className="flex items-center gap-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f1ef]"><WandSparkles size={16} /></span>{item}</span><span className="text-[10px] text-[#999]">قابل تخصیص</span></div>)}</div></div>}
        </div>
      </section>
      <aside className="order-1 border-b border-[#ddd] bg-white p-5 md:p-10 lg:order-2 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white"><Sparkles size={19} /></div><div><p className="font-serif text-lg font-semibold">FEZI AI</p><p className="text-[11px] text-[#777]">شروع امن و شخصی شما</p></div></div>
        <div className="mt-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">Persian Dark Horse</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{loginMode ? "خوش آمدید" : "حساب خودت را بساز"}</h2><p className="mt-3 text-sm leading-7 text-[#666]">{loginMode ? "ایمیل و رمز عبورت را وارد کن تا وارد حساب FEZI AI شوی." : "برای شروع گفتگو، ایجنت موردنظر و تنظیمات شخصی‌ات را ذخیره کن."}</p></div>
        <form onSubmit={createAccount} className="mt-8 space-y-4">{!loginMode && <label className="block text-sm font-medium">نام نمایشی<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="فضی" /></label>}<label className="block text-sm font-medium">Username / ایمیل<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="you@example.com" dir="ltr" /></label><label className="block text-sm font-medium">Password / رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="حداقل ۸ کاراکتر" dir="ltr" /></label><label className="flex items-center gap-2 text-xs text-[#666]"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> مرا به خاطر بسپار</label>{!loginMode && <label className="flex items-start gap-2 text-[10px] leading-5 text-[#888]"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />با ساخت حساب، قوانین استفاده و معرفی FEZI AI را می‌پذیرم.</label>}{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-semibold text-white hover:bg-[#222]"><KeyRound size={16} /> {loginMode ? "ورود به حساب" : "ساخت حساب و ورود"}</button><button type="button" onClick={() => { setLoginMode((value) => !value); setError(""); }} className="w-full rounded-xl py-2 text-xs text-[#666] underline">{loginMode ? "حساب ندارید؟ کلیک کنید و ثبت‌نام کنید" : "قبلاً حساب ساخته‌اید؟ ورود"}</button></form>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] text-[#777]"><span className="rounded-xl bg-[#f6f6f4] p-3"><LockKeyhole className="mx-auto mb-1" size={15} />حریم خصوصی</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Code2 className="mx-auto mb-1" size={15} />API امن</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Plus className="mx-auto mb-1" size={15} />قابل توسعه</span></div>
      </aside>
    </div>
  </main>;
}
