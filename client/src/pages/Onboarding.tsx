import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, ChevronLeft, CircleUserRound, Code2, KeyRound, Link2, LockKeyhole, Plus, Search, Sparkles, WandSparkles } from "lucide-react";
import { freeConnectorCategories, freeConnectors } from "@/lib/freeConnectors";
import { agentProfiles, type UIAgent } from "../../../shared/agentProfiles";

const officialPortrait = "/manus-storage/aab95790-b2a4-11f1-a3f1-ad16c1ab91b7_3b5f6e8a.png";

type Agent = UIAgent;
const agents = agentProfiles;

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
  const [freeConnectorSearch, setFreeConnectorSearch] = useState("");
  const [freeConnectorCategory, setFreeConnectorCategory] = useState("همه");
  const [agentConnectorMap, setAgentConnectorMap] = useState<Record<string, string[]>>(() => JSON.parse(localStorage.getItem("fezi-agent-connectors") ?? "{}") as Record<string, string[]>);
  const [error, setError] = useState("");
  const selected = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);
  const capabilityBindings = trpc.manika.capabilityBindings.useQuery({ agentId: selected.id });
  const bindingStatus = useMemo(() => new Map((capabilityBindings.data ?? []).map((binding) => [binding.capability.id, binding.status])), [capabilityBindings.data]);

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

  function toggleFreeConnector(id: string) {
    const current = agentConnectorMap[selected.id] ?? [];
    const nextAgent = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    const nextMap = { ...agentConnectorMap, [selected.id]: nextAgent };
    setAgentConnectorMap(nextMap);
    localStorage.setItem("fezi-agent-connectors", JSON.stringify(nextMap));
  }

  function enableAllFreeConnectors() {
    const nextMap = { ...agentConnectorMap, [selected.id]: freeConnectors.map((item) => item.id) };
    setAgentConnectorMap(nextMap);
    localStorage.setItem("fezi-agent-connectors", JSON.stringify(nextMap));
  }

  const visibleFreeConnectors = freeConnectors.filter((item) => (freeConnectorCategory === "همه" || item.category === freeConnectorCategory) && `${item.name} ${item.detail}`.toLowerCase().includes(freeConnectorSearch.toLowerCase()));

  return <main className="min-h-screen bg-[#f6f6f4] text-[#111]" dir="rtl">
    <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[minmax(0,1fr)_470px]">
      <section className="order-2 p-5 md:p-10 lg:order-1">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">Persian Dark Horse</p><h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">فضای شخصی FEZI AI</h1></div><Link href="/legal" className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-xs">قوانین و معرفی</Link></div>
          <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#ddd] pb-2"><button onClick={() => setActiveTab("agents")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "agents" ? "bg-black text-white" : "bg-white text-[#666]"}`}>انتخاب ایجنت</button><button onClick={() => setActiveTab("connectors")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "connectors" ? "bg-black text-white" : "bg-white text-[#666]"}`}>اتصال‌ها</button><button onClick={() => setActiveTab("skills")} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm ${activeTab === "skills" ? "bg-black text-white" : "bg-white text-[#666]"}`}>مهارت‌ها</button></div>
          {activeTab === "agents" && <><div className="mt-6 flex items-end justify-between"><div><h2 className="text-xl font-semibold">پنج ایجنت تخصصی FEZI</h2><p className="mt-1 text-sm text-[#777]">هر کارت را انتخاب کنید تا اخلاقیات، شخصیت و حوزهٔ دانش آن را ببینید.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs text-[#666]">{selected.name} · {selected.nameEn}</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{agents.map((agent) => <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`flex gap-4 rounded-3xl border p-4 text-right transition ${selectedAgent === agent.id ? "border-black bg-white shadow-lg" : "border-[#e1e1df] bg-[#fbfbfa] hover:bg-white"}`} aria-pressed={selectedAgent === agent.id}><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#191919]">{agent.image ? <img src={agent.image} alt={`تصویر ${agent.name}`} className="h-full w-full object-cover object-top" /> : <div className="flex h-full items-center justify-center text-[#aaa]"><CircleUserRound size={28} /></div>}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{agent.name}</span><span className={`rounded-full px-2 py-1 text-[10px] ${agent.access === "free" ? "bg-[#ededeb] text-[#333]" : "bg-black text-white"}`}>{agent.access === "free" ? "رایگان" : "پولی"}</span></div><p className="mt-1 text-xs text-[#777]">توانایی‌های اصلی</p><div className="mt-2 flex flex-wrap gap-1.5">{agent.capabilities.slice(0, 4).map((capability) => <span key={capability.id} className="rounded-full bg-[#f1f1ef] px-2 py-1 text-[10px] text-[#444]">{capability.fa}</span>)}</div><p className="mt-2 text-[10px] leading-5 text-[#777]">می‌تواند در {agent.capabilities.slice(0, 3).map((capability) => capability.fa).join("، ")} به شما کمک کند.</p></div>{selectedAgent === agent.id && <Check size={17} className="mt-1" />}</button>)}</div><section className="mt-5 rounded-3xl border border-[#ddd] bg-white p-5" aria-labelledby="agent-details-title"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#999]">پروفایل تخصصی ایجنت</p><h3 id="agent-details-title" className="mt-1 text-lg font-semibold">{selected.name} <span className="text-sm font-normal text-[#999]">({selected.nameEn})</span></h3><p className="mt-1 text-sm text-[#666]">توانایی‌ها و کارهایی که این Agent می‌تواند برای شما انجام دهد.</p></div><span className="rounded-full bg-[#f1f1ef] px-3 py-1 text-[10px]">{selected.role}</span></div><div className="mt-5 grid gap-5 md:grid-cols-2"><div><h4 className="text-xs font-semibold">توانایی‌های کلیدی</h4><div className="mt-2 flex flex-wrap gap-2">{selected.capabilities.slice(0, 8).map((capability) => <span key={capability.id} className="rounded-full bg-[#f5f5f3] px-3 py-1.5 text-[11px] text-[#555]">{capability.fa}</span>)}</div></div><div><h4 className="text-xs font-semibold">کارهایی که انجام می‌دهد</h4><ul className="mt-2 space-y-2 text-[11px] leading-5 text-[#666]">{selected.capabilities.slice(0, 5).map((capability) => <li key={capability.id} className="flex gap-2"><span aria-hidden="true">•</span><span>{capability.description}</span></li>)}</ul></div></div><div className="mt-6 border-t border-[#eee] pt-5"><div className="flex items-center justify-between gap-3"><h4 className="text-xs font-semibold">کاتالوگ قابلیت‌های واقعی {selected.name}</h4><span className="text-[10px] text-[#999]">{selected.capabilities.length} قابلیت</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{selected.capabilities.map((capability) => <div key={capability.id} className="rounded-2xl bg-[#f8f8f6] p-3"><div className="flex items-start justify-between gap-2"><span className="text-xs font-semibold">{capability.fa}</span><span className={`rounded-full px-2 py-1 text-[9px] ${bindingStatus.get(capability.id) === "connected" ? "bg-[#e8f4e8] text-[#246b2a]" : bindingStatus.get(capability.id) === "available" ? "bg-[#fff4d8] text-[#8a6500]" : "bg-white text-[#777]"}`}>{bindingStatus.get(capability.id) === "connected" ? "متصل" : bindingStatus.get(capability.id) === "available" ? "آماده اتصال" : "در انتظار ابزار"}</span></div><p className="mt-1 text-[10px] leading-5 text-[#666]">{capability.description}</p><p className="mt-1 text-[9px] text-[#aaa]" dir="ltr">{capability.id}</p></div>)}</div></div></section></>}
          {activeTab !== "agents" && <div className="mt-8"><h2 className="text-xl font-semibold">{activeTab === "connectors" ? "اتصال سرویس‌ها و APIهای عمومی" : "مهارت‌ها و APIهای قابل تخصیص"}</h2><p className="mt-2 text-sm leading-7 text-[#777]">{activeTab === "connectors" ? "APIهای عمومی بدون ثبت‌نام و بدون API Key را انتخاب کنید. این انتخاب برای ایجنت فعال ذخیره می‌شود و هر زمان قابل تغییر است." : `تنظیمات شخصیت فعال: ${selected.name}. APIهای عمومی انتخاب‌شده در ابزارها و پاسخ‌های این ایجنت قابل استفاده خواهند بود.`}</p><div className="mt-4 rounded-2xl border border-[#d9d9d6] bg-[#fffdf5] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">دسترسی مدیر</p><p className="mt-1 text-[10px] leading-5 text-[#777]">در محیط مدیریت، همهٔ APIهای بدون کلید برای بررسی و تخصیص به ایجنت‌ها قابل مشاهده‌اند.</p></div><span className="rounded-full bg-black px-2.5 py-1 text-[10px] text-white">بدون API Key</span></div></div><div className="mt-5 flex flex-col gap-2 md:flex-row"><label className="relative flex-1"><Search size={15} className="absolute right-3 top-3 text-[#999]" /><input value={freeConnectorSearch} onChange={(event) => setFreeConnectorSearch(event.target.value)} placeholder="جست‌وجوی API یا کاربرد..." className="h-10 w-full rounded-xl border border-[#ddd] bg-white pr-9 pl-3 text-xs outline-none focus:border-black" /></label><select value={freeConnectorCategory} onChange={(event) => setFreeConnectorCategory(event.target.value)} className="h-10 rounded-xl border border-[#ddd] bg-white px-3 text-xs"><option>همه</option>{freeConnectorCategories.map((category) => <option key={category}>{category}</option>)}</select><button onClick={enableAllFreeConnectors} className="rounded-xl bg-black px-4 py-2 text-xs text-white hover:bg-[#222]">فعال‌سازی همه برای {selected.name}</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleFreeConnectors.map((item) => { const enabled = (agentConnectorMap[selected.id] ?? []).includes(item.id); return <div key={item.id} className={`rounded-2xl border p-4 transition ${enabled ? "border-black bg-white shadow-sm" : "border-[#ddd] bg-[#fbfbfa]"}`}><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-[#888]">{item.category}</p></div><span className="rounded-full bg-[#ededeb] px-2 py-1 text-[9px] text-[#555]">بدون کلید</span></div><p className="mt-3 min-h-10 text-xs leading-5 text-[#666]">{item.detail}</p><p className="mt-2 truncate text-[9px] text-[#aaa]" dir="ltr">{item.endpoint}</p><button onClick={() => toggleFreeConnector(item.id)} aria-pressed={enabled} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs ${enabled ? "bg-black text-white" : "border border-[#ddd] bg-white hover:bg-[#f5f5f5]"}`}>{enabled ? `فعال برای ${selected.name}` : "استفاده از این API"}</button></div>; })}</div><p className="mt-4 text-[10px] text-[#999]">نمایش {visibleFreeConnectors.length} مورد از {freeConnectors.length} API عمومی. اتصال‌های پولی و کلیددار همچنان از بخش اتصال‌های امن مدیریت می‌شوند.</p></div>}
        </div>
      </section>
      <aside className="order-1 border-b border-[#ddd] bg-white p-5 md:p-10 lg:order-2 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white"><Sparkles size={19} /></div><div><p className="font-serif text-lg font-semibold">FEZI AI</p><p className="text-[11px] text-[#777]">شروع امن و شخصی شما</p></div></div>
        <div className="mt-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">Persian Dark Horse</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{loginMode ? "خوش آمدید" : "حساب خودت را بساز"}</h2><p className="mt-3 text-sm leading-7 text-[#666]">{loginMode ? "ایمیل و رمز عبورت را وارد کن تا وارد حساب FEZI AI شوی." : "برای شروع گفتگو، ایجنت موردنظر و تنظیمات شخصی‌ات را ذخیره کن."}</p></div>
        <form onSubmit={createAccount} className="mt-8 space-y-4">{!loginMode && <label className="block text-sm font-medium">نام نمایشی<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="فضی" /></label>}<label className="block text-sm font-medium">نام کاربری / ایمیل<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="you@example.com" dir="ltr" /></label><label className="block text-sm font-medium">رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd] bg-[#fafafa] px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10" placeholder="حداقل ۸ کاراکتر" dir="ltr" /></label><label className="flex items-center gap-2 text-xs text-[#666]"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> مرا به خاطر بسپار</label>{!loginMode && <label className="flex items-start gap-2 text-[10px] leading-5 text-[#888]"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />با ساخت حساب، قوانین استفاده و معرفی FEZI AI را می‌پذیرم.</label>}{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-semibold text-white hover:bg-[#222]"><KeyRound size={16} /> {loginMode ? "ورود به حساب" : "ساخت حساب و ورود"}</button><button type="button" onClick={() => { setLoginMode((value) => !value); setError(""); }} className="w-full rounded-xl py-2 text-xs text-[#666] underline">{loginMode ? "حساب ندارید؟ کلیک کنید و ثبت‌نام کنید" : "قبلاً حساب ساخته‌اید؟ ورود"}</button></form>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] text-[#777]"><span className="rounded-xl bg-[#f6f6f4] p-3"><LockKeyhole className="mx-auto mb-1" size={15} />حریم خصوصی</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Code2 className="mx-auto mb-1" size={15} />API امن</span><span className="rounded-xl bg-[#f6f6f4] p-3"><Plus className="mx-auto mb-1" size={15} />قابل توسعه</span></div>
      </aside>
    </div>
  </main>;
}
