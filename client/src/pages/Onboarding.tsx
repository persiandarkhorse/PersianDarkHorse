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

const connectorTemplates = ["OpenRouter", "GapGPT", "xAI / Grok", "Puter", "Speechify", "Apify MCP"];
const skillTemplates = ["گفت‌وگوی فارسی و انگلیسی", "تفکر عمیق", "جست‌وجوی وب", "تولید تصویر", "تبدیل ویس به متن", "مدیریت محتوا"];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("manika");
  const [activeTab, setActiveTab] = useState<"agents" | "connectors" | "skills">("agents");
  const [error, setError] = useState("");
  const selected = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);

  function createAccount(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 8) {
      setError("نام، ایمیل معتبر و رمز عبور حداقل ۸ کاراکتری وارد کنید.");
      return;
    }
    localStorage.setItem("fezi-account", JSON.stringify({ name: name.trim(), email: email.trim(), selectedAgent: selected.id, createdAt: Date.now() }));
    navigate("/");
  }

  return <main className="min-h-screen bg-[#f6f6f4] text-[#111]" dir="rtl">
    <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[minmax(0,1fr)_470px]">
      <section className="order-2 p-5 md:p-10 lg:order-1">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">Persian Dark Horse</p><h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">فضای شخصی FEZI AI</h1></div><Link href="/api" className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-xs">APIهای ما</Link></div>
          <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#ddd] pb-2"><button onClick={() => setActiveTab("agents")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "agents" ? "bg-black text-white" : "bg-white text-[#666]"}`}>انتخاب ایجنت</button><button onClick={() => setActiveTab("connectors")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "connectors" ? "bg-black text-white" : "bg-white text-[#666]"}`}>Connectors</button><button onClick={() => setActiveTab("skills")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "skills" ? "bg-black text-white" : "bg-white text-[#666]"}`}>Skills</button></div>
          {activeTab === "agents" && <><div className="mt-6 flex items-end justify-between"><div><h2 className="text-xl font-semibold">ایجنت موردنظر را انتخاب کنید</h2><p className="mt-1 text-sm text-[#777]">دو ایجنت رایگان هستند؛ سه جایگاه پولی بعداً با نام و تصویر نهایی شما تکمیل می‌شوند.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs text-[#666]">{selected.name}</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{agents.map((agent) => <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`flex gap-4 rounded-3xl border p-4 text-right transition ${selectedAgent === agent.id ? "border-black bg-white shadow-lg" : "border-[#e1e1df] bg-[#fbfbfa] hover:bg-white"}`} aria-pressed={selectedAgent === agent.id}><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#191919]">{agent.image ? <img src={agent.image} alt={`تصویر ${agent.name}`} className="h-full w-full object-cover object-top" /> : <div className="flex h-full items-center justify-center text-[#aaa]"><CircleUserRound size={28} /></div>}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{agent.name}</span><span className={`rounded-full px-2 py-1 text-[10px] ${agent.access === "free" ? "bg-[#ededeb] text-[#333]" : "bg-black text-white"}`}>{agent.access === "free" ? "رایگان" : "پولی"}</span></div><p className="mt-1 text-xs text-[#777]">{agent.role}</p><p className="mt-2 text-xs leading-5 text-[#555]">{agent.description}</p></div>{selectedAgent === agent.id && <Check size={17} className="mt-1" />}</button>)}</div></>}
          {activeTab !== "agents" && <div className="mt-8"><h2 className="text-xl font-semibold">{activeTab === "connectors" ? "اتصال سرویس‌ها" : "مهارت‌های قابل تخصیص"}</h2><p className="mt-2 text-sm leading-7 text-[#777]">این بخش برای شخصی‌سازی هر ایجنت طراحی شده است. در مرحلهٔ بعد، مدیر می‌تواند این موارد را به ایجنت‌ها وصل، فعال یا محدود کند.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{(activeTab === "connectors" ? connectorTemplates : skillTemplates).map((item) => <div key={item} className="flex items-center justify-between rounded-2xl border border-[#ddd] bg-white p-4"><span className="flex items-center gap-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f1ef]">{activeTab === "connectors" ? <Link2 size={16} /> : <WandSparkles size={16} />}</span>{item}</span><span className="text-[10px] text-[#999]">برای تنظیم</span></div>)}</div></div>}
        </div>
      </section>
      <aside className="order-1 border-b border-[#ddd] bg-white p-5 md:p-10 lg:order-2 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white"><Sparkles size={19} /></div><div><p className="font-serif text-lg font-semibold">FEZI AI</p><p className="text-[11px] text-[#777]">شروع امن و شخصی شما</p></div></div>
        <div className="mt-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">مرحلهٔ ۱ از ۱</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">حساب خودت را بساز</h2><p className="mt-3 text-sm leading-7 text-[#666]">برای شروع گفتگو، ایجنت موردنظر و تنظیمات شخصی‌ات را ذخیره کن.</p></div>
        <form onSubmit={createAccount} className="mt-8 space-y-4"><label className="block text-sm font-medium">نام نمایشی<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="مثلاً فازی" /></label><label className="block text-sm font-medium">ایمیل<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="you@example.com" dir="ltr" /></label><label className="block text-sm font-medium">رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="حداقل ۸ کاراکتر" dir="ltr" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-semibold text-white hover:bg-[#222]"><KeyRound size={16} /> ساخت حساب و ورود</button></form>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] text-[#777]"><span className="rounded-xl bg-[#f6f6f4] p-3"><LockKeyhole className="mx-auto mb-1" size={15} />حریم خصوصی</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Code2 className="mx-auto mb-1" size={15} />API امن</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Plus className="mx-auto mb-1" size={15} />قابل توسعه</span></div>
      </aside>
    </div>
  </main>;
}
