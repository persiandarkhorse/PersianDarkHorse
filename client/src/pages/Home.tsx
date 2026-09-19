import { useEffect, useMemo, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { agentProfiles } from "../../../shared/agentProfiles";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Coins,
  Copy,
  Download,
  Globe2,
  BrainCircuit,
  Languages,
  Code2,
  Instagram,
  Mail,
  Image as ImageIcon,
  LayoutDashboard,
  LogIn,
  LogOut,
  BookOpen,
  SlidersHorizontal,
  Users,
  Menu,
  Mic,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  FileText,
  Plus,
  Sparkles,
  Send,
  Volume2,
  WandSparkles,
  PlugZap,
  Settings2,
  UserCircle,
  X,
} from "lucide-react";

const officialPortrait = "/manus-storage/aab95790-b2a4-11f1-a3f1-ad16c1ab91b7_3b5f6e8a.png";
const homeAgents = agentProfiles.map((agent) => ({
  ...agent,
  detail: agent.description,
  menuHint: agent.description,
  skills: agent.knowledge,
  greeting: agent.personality,
}));

type Role = "user" | "assistant";
type Attachment = { fileName: string; contentType: string; size: number; url: string };
type ChatMessage = { id: string; role: Role; content: string; createdAt: number; imageUrl?: string; audioUrl?: string; attachment?: Attachment };

type Mode = {
  label: string;
  description: string;
  icon: typeof Sparkles;
};

const modes: Mode[] = [
  { label: "گفت‌وگوی آزاد", description: "همراه خلاق و صمیمی", icon: Sparkles },
  { label: "کارگردان تصویر", description: "ایده، صحنه و پرامپت", icon: Camera },
  { label: "مدیر محتوا", description: "اینستاگرام و برند شخصی", icon: WandSparkles },
  { label: "دستیار فنی", description: "وب، کد و ایده‌های محصول", icon: Sparkles },
];

const agentModes: Record<string, Mode[]> = Object.fromEntries(agentProfiles.map((agent) => [agent.id, agent.modes.map((label, index) => ({
  label,
  description: agent.capabilities[index]?.description ?? agent.description,
  icon: [Sparkles, Camera, WandSparkles, BrainCircuit, Settings2][index % 5],
}))]));

const agentStarters: Record<string, string[]> = {
  manika: ["برای امروز یک ایدهٔ محتوایی خلاقانه پیشنهاد بده.", "یک ایدهٔ پرترهٔ سینمایی برای مانیکا بساز.", "برای یک برند عطر، سناریوی ریلز کوتاه بنویس."],
  fezi: ["برای یک ایدهٔ خام، نقشهٔ اجرای عملی طراحی کن.", "این مسئله را تحلیل کن و بهترین راه‌حل را پیشنهاد بده.", "برای ساخت یک محصول جدید، برنامهٔ مرحله‌به‌مرحله بنویس."],
  arvin: ["برای کسب‌وکار من یک مدل درآمدی پیشنهاد بده.", "یک قیف فروش و برنامهٔ مارکتینگ طراحی کن.", "رقبا و فرصت‌های رشد این ایده را تحلیل کن."],
  arta: ["یک معمای جذاب و مرموز برایم طراحی کن.", "یک داستان تعاملی بساز و انتخاب اول را به من بده.", "یک بازی کوتاه حدس شخصیت شروع کنیم."],
  negar: ["این ایده را به یک محصول قابل ساخت تبدیل کن.", "برای این پروژه معماری فنی و stack مناسب پیشنهاد بده.", "یک نمونهٔ اولیهٔ React برای این قابلیت طراحی کن."],
};

function loadAgentChats(): Record<string, ChatMessage[]> {
  try { return JSON.parse(localStorage.getItem("fezi-agent-chats") ?? "{}") as Record<string, ChatMessage[]>; } catch { return {}; }
}

function initialAgentMessages(agentId: string): ChatMessage[] {
  const saved = loadAgentChats()[agentId];
  if (saved?.length) return saved;
  if (agentId === "manika") {
    try { const legacy = localStorage.getItem("manika-chat-history"); if (legacy) return JSON.parse(legacy) as ChatMessage[]; } catch { /* use welcome */ }
  }
  const agent = homeAgents.find((item) => item.id === agentId) ?? homeAgents[0];
  return agentWelcome(agent);
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function agentWelcome(agent: (typeof homeAgents)[number]): ChatMessage[] {
  return [{ id: `welcome-${agent.id}`, role: "assistant", content: `${agent.personality}\n\nسلام، من ${agent.name} هستم. آماده‌ام در حوزهٔ ${agent.role} کنارتان باشم.`, createdAt: Date.now() }];
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: "welcome",
      role: "assistant",
      content:
        "سلام، من مانیکا هستم.\n\nبرای یک ایدهٔ تازه، پرترهٔ جدید، محتوای اینستاگرام، استایل، پرامپت یا حتی یک گفت‌وگوی خودمونی کنارتم. امروز روی چی کار کنیم؟",
      createdAt: Date.now(),
    },
  ];
}

export default function Home() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const storedIndex = Number(localStorage.getItem("fezi-agent-index") ?? 0);
    const agent = homeAgents[storedIndex] ?? homeAgents[0];
    return initialAgentMessages(agent.id);
  });
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [deepThinking, setDeepThinking] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [recording, setRecording] = useState(false);
  const [language] = useState<"fa">("fa");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [agentDrawerOpen, setAgentDrawerOpen] = useState(false);
  const [agentIndex, setAgentIndex] = useState(() => Number(localStorage.getItem("fezi-agent-index") ?? 0));
  const activeAgent = homeAgents[agentIndex] ?? homeAgents[0];
  const activeModes = agentModes[activeAgent.id] ?? modes;
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imagePanelOpen, setImagePanelOpen] = useState(false);
  const [imageMode, setImageMode] = useState<"generate" | "edit">("generate");
  const [imageType, setImageType] = useState<"general" | "manika">("manika");
  const [imageEngine, setImageEngine] = useState("FEZI Image Core");
  const [imagePrompt, setImagePrompt] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);

  function switchAgent(index: number) {
    const next = (index + homeAgents.length) % homeAgents.length;
    const chats = loadAgentChats();
    chats[activeAgent.id] = messages;
    localStorage.setItem("fezi-agent-chats", JSON.stringify(chats));
    setAgentIndex(next);
    localStorage.setItem("fezi-agent-index", String(next));
    setActiveMode((agentModes[homeAgents[next].id] ?? modes)[0]);
    setMessages(initialAgentMessages(homeAgents[next].id));
    setInput("");
    setAttachment(null);
    setUploadError(null);
    setAgentDrawerOpen(false);
  }
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatMutation = trpc.manika.chat.useMutation();
  const imageMutation = trpc.manika.image.useMutation();
  const uploadMutation = trpc.manika.uploadFile.useMutation();
  const speechMutation = trpc.manika.speech.useMutation();
  const transcribeMutation = trpc.manika.transcribe.useMutation();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const chats = loadAgentChats();
    chats[activeAgent.id] = messages;
    localStorage.setItem("fezi-agent-chats", JSON.stringify(chats));
    if (activeAgent.id === "manika") localStorage.setItem("manika-chat-history", JSON.stringify(messages));
  }, [messages, activeAgent.id]);

  useEffect(() => {
    document.documentElement.lang = "fa";
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const canSend = (input.trim().length > 0 || Boolean(attachment)) && !chatMutation.isPending && !uploadMutation.isPending;
  const canGenerateImage = imagePrompt.trim().length > 2 && !imageMutation.isPending;
  const messageCount = useMemo(() => messages.filter((item) => item.role === "user").length, [messages]);

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setUploadError("مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) recordingChunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const dataBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = reject; reader.readAsDataURL(blob); });
        try {
          const uploaded = await uploadMutation.mutateAsync({ fileName: `voice-${Date.now()}.webm`, contentType: blob.type, dataBase64 });
          const result = await transcribeMutation.mutateAsync({ audioUrl: new URL(uploaded.url, window.location.origin).toString() });
          setInput((current) => current ? `${current} ${result.text}` : result.text);
        } catch { setUploadError("تبدیل ویس به متن انجام نشد. لطفاً دوباره امتحان کنید."); }
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch { setUploadError("دسترسی به میکروفن داده نشد."); }
  }

  async function uploadFile(file: File) {
    setUploadError(null);
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("حجم فایل باید حداکثر ۱۵ مگابایت باشد.");
      return;
    }
    if (!file.type || (!file.type.startsWith("image/") && !file.type.startsWith("application/") && !file.type.startsWith("text/"))) {
      setUploadError("این نوع فایل پشتیبانی نمی‌شود.");
      return;
    }
    const dataBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود."));
      reader.readAsDataURL(file);
    });
    try {
      const result = await uploadMutation.mutateAsync({ fileName: file.name, contentType: file.type, dataBase64 });
      setAttachment(result);
    } catch {
      setUploadError("آپلود فایل انجام نشد. لطفاً دوباره امتحان کنید.");
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void uploadFile(file);
  }

  async function sendMessage(value = input) {
    const text = value.trim();
    if ((!text && !attachment) || chatMutation.isPending) return;
    const promptText = attachment ? `${text || "این فایل را بررسی کن."}\n\nفایل پیوست‌شده: ${attachment.fileName}\nلینک فایل: ${window.location.origin}${attachment.url}` : text;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: promptText,
      attachment: attachment ?? undefined,
      createdAt: Date.now(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setAttachment(null);

    try {
      let responseContent: string;
      let enabledConnectorIds: string[] = [];
      try {
        const connectorMap = JSON.parse(localStorage.getItem("fezi-agent-connectors") ?? "{}") as Record<string, string[]>;
        enabledConnectorIds = connectorMap[activeAgent.id] ?? [];
      } catch {
        enabledConnectorIds = [];
      }
      const result = await chatMutation.mutateAsync({
        agentId: activeAgent.id,
        capabilityIds: activeAgent.capabilities.map((capability) => capability.id),
        enabledConnectorIds,
        mode: `${activeAgent.name} · ${activeMode.label}`,
        messages: nextMessages.slice(-12).map(({ role, content }) => ({ role, content })),
        deepThinking,
        webSearch,
      });
      responseContent = result.content;
      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", content: responseContent, createdAt: Date.now() },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: "متأسفانه در حال حاضر نمی‌توانم کمکتان کنم.",
          createdAt: Date.now(),
        },
      ]);
    }
  }

  async function generateManikaImage() {
    const prompt = imagePrompt.trim();
    if (!prompt || imageMutation.isPending) return;
    try {
      const result = await imageMutation.mutateAsync({
        mode: imageMode,
        imageType,
        engine: imageEngine,
        prompt,
        ...(imageType === "manika" ? { originalImageUrl: new URL(officialPortrait, window.location.origin).toString() } : {}),
      });
      setMessages((current) => [...current, {
        id: makeId(),
        role: "assistant",
        content: imageType === "general" ? `تصویر عمومی با موتور ${result.engine} آماده شد.` : imageMode === "edit" ? `تصویرت با موتور ${result.engine} و حفظ هویت مانیکا ویرایش شد.` : `تصویر جدید مانیکا با موتور ${result.engine} آماده شد.`,
        imageUrl: result.imageUrl,
        createdAt: Date.now(),
      }]);
      setImagePrompt("");
      setImagePanelOpen(false);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "تولید تصویر موقتاً با مشکل روبه‌رو شد.";
      setMessages((current) => [...current, { id: makeId(), role: "assistant", content: `نتونستم تصویر را آماده کنم.\n\nجزئیات: ${detail}`, createdAt: Date.now() }]);
    }
  }

  function clearChat() {
    setMessages(initialMessages());
    localStorage.removeItem("manika-chat-history");
  }

  async function copyMessage(message: ChatMessage) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  async function generateAudio(message: ChatMessage) {
    if (audioLoadingId) return;
    setAudioLoadingId(message.id);
    try {
      const result = await speechMutation.mutateAsync({ text: message.content, voiceId: "sabrina", model: "simba-3.2" });
      const binary = Uint8Array.from(atob(result.audioBase64), (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([binary], { type: result.contentType }));
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, audioUrl: url } : item));
    } catch {
      setUploadError("تولید صوت انجام نشد. لطفاً دوباره امتحان کنید.");
    } finally {
      setAudioLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] selection:bg-[#e5e5e5]/50">
      <div className="mx-auto flex min-h-screen max-w-[1560px] overflow-hidden bg-[#ffffff] shadow-[0_20px_80px_rgba(65,45,35,0.08)] lg:min-h-[calc(100vh-32px)] lg:my-4 lg:rounded-[30px]">
        {leftNavOpen && <button className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={() => setLeftNavOpen(false)} aria-label="بستن منوی اصلی" />}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[292px] border-r border-[#e5e5e5] bg-[#fafaf8] p-5 shadow-2xl transition-transform duration-200 ${leftNavOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="منوی اصلی FEZI AI">
          <div className="flex items-center justify-between border-b border-[#e8e8e5] pb-5"><div><p className="font-serif text-lg font-semibold">FEZI AI</p><p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#888]">Persian Dark Horse</p></div><button onClick={() => setLeftNavOpen(false)} className="rounded-xl p-2 text-[#777] hover:bg-white" aria-label="بستن منو"><X size={17} /></button></div>
          <div className="mt-5 rounded-2xl bg-white p-3 shadow-sm"><div className="flex items-center gap-3"><img src={activeAgent.image} alt={`تصویر ${activeAgent.name}`} className="h-10 w-10 rounded-xl object-cover" /><div><p className="text-xs font-semibold">{activeAgent.name}</p><p className="mt-1 text-[10px] text-[#888]">ایجنت فعال</p></div></div></div>
          <nav className="mt-5 space-y-1.5">
            <Link href="/" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl bg-black px-3 py-3 text-sm font-medium text-white"><LayoutDashboard size={17} /> داشبورد</Link>
            <Link href="/welcome" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#333] hover:bg-white"><Users size={17} /> ایجنت‌ها</Link>
            <Link href="/welcome?tab=skills" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#333] hover:bg-white"><Settings2 size={17} /> تنظیمات</Link>
            <Link href="/welcome?tab=agents" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#333] hover:bg-white"><SlidersHorizontal size={17} /> شخصی‌سازی</Link>
            <Link href="/api/free" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#333] hover:bg-white"><BookOpen size={17} /> پایگاه دانش</Link>
            <Link href="/welcome?tab=connectors" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#333] hover:bg-white"><PlugZap size={17} /> Connectors</Link>
          </nav>
          <div className="mt-6 border-t border-[#e5e5e5] pt-5"><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#999]">حساب کاربری</p><Link href="/welcome" onClick={() => setLeftNavOpen(false)} className="flex items-center gap-3 rounded-xl bg-[#edf7ee] px-3 py-3 text-sm font-medium text-[#286b35] hover:bg-[#e3f2e5]"><LogIn size={17} /> ورود به حساب</Link><button onClick={() => { localStorage.removeItem("fezi-account"); localStorage.removeItem("fezi-remember"); navigate("/welcome"); setLeftNavOpen(false); }} className="mt-2 flex w-full items-center gap-3 rounded-xl bg-[#fff0f0] px-3 py-3 text-right text-sm font-medium text-[#a62f2f] hover:bg-[#ffe5e5]"><LogOut size={17} /> خروج از حساب</button></div>
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[#e3e3df] bg-white p-3 text-[10px] leading-5 text-[#888]">تنظیمات و انتخاب‌های شما برای ایجنت فعال ذخیره می‌شود.</div>
        </aside>
        <aside className={`fixed inset-y-0 right-0 z-30 w-[290px] border-l border-[#e5e5e5] bg-[#f7f7f7] p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-[#000000] ring-4 ring-white">
                <img src={activeAgent.image} alt={`پرتره ${activeAgent.name}`} className="h-full w-full object-cover object-top" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold tracking-tight">Persian Dark Horse</p>
                <p className="text-[11px] text-[#666666]">FEZI AI · {activeAgent.name}</p>
                <p className="mt-0.5 text-[10px] text-[#999999]">{activeAgent.role}</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 text-[#666666] hover:bg-white lg:hidden" aria-label="بستن منو"><X size={18} /></button>
          </div>

          <Button onClick={() => { setMessages(agentWelcome(activeAgent)); setInput(""); }} className="mt-8 h-12 w-full justify-between rounded-2xl bg-[#000000] px-4 text-sm font-medium text-white shadow-lg shadow-[#000000]/10 hover:bg-[#222222]">
            <span className="flex items-center gap-2"><Plus size={17} /> گفت‌وگوی تازه</span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">⌘ K</span>
          </Button>

          <div className="mt-4 rounded-2xl border border-[#dddddd] bg-white p-3">
            <div className="flex items-center justify-between"><span className="text-[11px] font-semibold">فضای کاری {activeAgent.name}</span><span className="text-[10px] text-[#888888]">رایگان</span></div>
            <p className="mt-2 text-[10px] leading-5 text-[#666666]">{activeAgent.menuHint}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{activeAgent.skills.map((skill) => <span key={skill} className="rounded-full bg-[#f2f2f0] px-2 py-1 text-[9px] text-[#666]">{skill}</span>)}</div>
          </div>

          <div className="mt-9">
            <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666666]">حالت‌های کاری</p>
            <div className="space-y-1.5">
              {activeModes.map((mode) => {
                const Icon = mode.icon;
                const active = activeMode.label === mode.label;
                return <button key={mode.label} onClick={() => { setActiveMode(mode); setMobileMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-right transition ${active ? "bg-white shadow-sm ring-1 ring-[#dddddd]" : "hover:bg-white/70"}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-[#e5e5e5] text-[#111111]" : "bg-[#f0f0f0] text-[#666666]"}`}><Icon size={17} /></span>
                  <span className="min-w-0"><span className="block text-sm font-medium">{mode.label}</span><span className="mt-0.5 block truncate text-[11px] text-[#777777]">{mode.description}</span></span>
                </button>;
              })}
            </div>
          </div>

          <Link href="/subscription" className="mt-5 flex items-center justify-between rounded-2xl border border-[#d9c0ae] bg-[#ffffff] px-4 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"><span className="flex items-center gap-2"><Coins size={16} /> خرید اشتراک</span><span className="text-[10px] font-normal text-[#666666]">پرداخت فعال</span></Link>

          <div className="mt-4 rounded-2xl border border-[#dddddd] bg-white p-4">
            <p className="text-xs font-semibold">ارتباط با ما</p>
            <div className="mt-3 space-y-2 text-[11px] text-[#666666]">
              <a className="flex items-center gap-2 hover:text-black" href="https://Instagram.com/Pdh.ir" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a>
              <a className="flex items-center gap-2 hover:text-black" href="https://t.me/persiandarkhorse" target="_blank" rel="noreferrer"><Send size={14} /> Telegram</a>
              <a className="flex items-center gap-2 hover:text-black" href="mailto:Persiandarkhorsesup@gmail.com"><Mail size={14} /> Email</a>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#dddddd] bg-white/70 p-4">
            <div className="flex items-center gap-2 text-[#333333]"><Sparkles size={15} /><span className="text-xs font-semibold">هویت مانیکا فعال است</span></div>
            <p className="mt-2 text-[11px] leading-5 text-[#9c8980]">چهره، لحن و نگاه خلاقانهٔ مانیکا در این فضا حفظ می‌شود.</p>
          </div>
        </aside>

        {mobileMenuOpen && <button className="fixed inset-0 z-20 bg-[#000000]/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="بستن منو" />}

        <main className="flex min-h-screen min-w-0 flex-1 flex-col lg:min-h-0">
          <header className="relative flex h-[78px] items-center justify-between border-b border-[#eeeeee] px-5 md:px-9">
            <div className="flex items-center gap-3">
              <button onClick={() => setLeftNavOpen(true)} className="rounded-xl p-2 text-[#666666] hover:bg-[#f5f5f5]" aria-label="باز کردن منوی اصلی"><Menu size={19} /></button>
              <div><p className="font-serif text-[19px] font-semibold">Persian Dark Horse</p><p className="mt-0.5 text-[11px] text-[#666666]">FEZI AI · {activeAgent.name} · {language === "fa" ? activeMode.label : "Private conversation"}</p></div>
            </div>
            <div className="flex items-center gap-1 text-[#666666]"><button onClick={() => setAgentDrawerOpen((value) => !value)} className="rounded-xl px-3 py-2 text-[11px] hover:bg-[#f5f5f5]" aria-expanded={agentDrawerOpen}>{language === "fa" ? "Agentها" : "Agents"}</button><button onClick={() => setMoreMenuOpen((value) => !value)} className="rounded-xl p-2.5 hover:bg-[#f5f5f5]" title="منوی بیشتر" aria-label="باز کردن منوی بیشتر" aria-expanded={moreMenuOpen}><MoreHorizontal size={19} /></button></div>
            {agentDrawerOpen && <div className="absolute right-5 top-[64px] z-40 w-[350px] rounded-3xl border border-[#ddd] bg-white p-4 shadow-2xl" role="dialog" aria-label="انتخاب ایجنت"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">انتخاب ایجنت</p><p className="mt-1 text-[10px] text-[#888]">ایجنت فعال را همین‌جا تغییر دهید</p></div><Link href="/welcome" className="text-[10px] underline">مشاهدهٔ پروفایل‌ها</Link></div><div className="mt-4 flex items-center gap-2"><button onClick={() => { const next = (agentIndex + homeAgents.length - 1) % homeAgents.length; switchAgent(next); }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ddd] hover:bg-[#f5f5f5]" aria-label="ایجنت قبلی"><ArrowRight size={17} /></button><button onClick={() => { setAgentDrawerOpen(false); }} className="min-w-0 flex-1 rounded-2xl bg-[#f7f7f5] p-3 text-center hover:bg-[#efefed]" aria-label={`انتخاب ${activeAgent.name}`}><img src={activeAgent.image} alt={`تصویر ${activeAgent.name}`} className="mx-auto h-14 w-14 rounded-2xl object-cover" /><p className="mt-2 text-sm font-semibold">{activeAgent.name}</p><p className="mt-1 text-[10px] text-[#888]">رایگان · {activeAgent.role}</p></button><button onClick={() => { const next = (agentIndex + 1) % homeAgents.length; switchAgent(next); }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ddd] hover:bg-[#f5f5f5]" aria-label="ایجنت بعدی"><ArrowLeft size={17} /></button></div><div className="mt-3 grid grid-cols-5 gap-1.5">{homeAgents.map((agent, index) => <button key={agent.id} onClick={() => { switchAgent(index); }} className={`rounded-xl p-1.5 text-center ${index === agentIndex ? "bg-black text-white" : "bg-[#f5f5f3] hover:bg-[#e9e9e7]"}`} aria-label={`انتخاب ${agent.name}`} aria-pressed={index === agentIndex}><img src={agent.image} alt="" className="mx-auto h-8 w-8 rounded-lg object-cover" /><span className="mt-1 block truncate text-[9px]">{agent.name}</span></button>)}</div><div className="mt-4 border-t border-[#e7e7e5] pt-3"><p className="text-[10px] font-semibold text-[#666]">تاریخچهٔ جداگانهٔ گفتگوها</p><div className="mt-2 space-y-1.5">{homeAgents.map((agent, index) => { const count = loadAgentChats()[agent.id]?.filter((message) => message.role === "user").length ?? 0; return <button key={`history-${agent.id}`} onClick={() => switchAgent(index)} className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-right text-[10px] hover:bg-[#f4f4f2] ${index === agentIndex ? "bg-[#f4f4f2]" : ""}`}><span className="flex items-center gap-2"><img src={agent.image} alt="" className="h-6 w-6 rounded-lg object-cover" />{agent.name}</span><span className="text-[#999]">{count} پیام</span></button>; })}</div></div></div>}
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-8 md:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 flex items-center gap-4 border-b border-[#eeeeee] pb-8">
                <div className="relative h-16 w-16 overflow-hidden rounded-[22px] bg-[#000000] shadow-md shadow-[#8f6f5c]/15"><img src={activeAgent.image} alt={`پرترهٔ ${activeAgent.name}`} className="h-full w-full object-cover object-top" /></div>
                <div><p className="font-serif text-2xl font-semibold tracking-tight">سلام، من {activeAgent.name} هستم.</p><p className="mt-1 text-sm text-[#666666]">{activeAgent.detail}</p></div>
              </div>

              <div className="space-y-7">
                {messages.map((message) => <div key={message.id} className={`group flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" ? <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e5e5e5] text-[#222222]"><img src={activeAgent.image} alt={`تصویر ${activeAgent.name}`} className="h-full w-full object-cover" /></div> : <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#39312e] text-[11px] font-semibold text-white">شما</div>}
                  <div className={`min-w-0 max-w-[85%] ${message.role === "user" ? "text-left" : ""}`}>
                    {message.role === "assistant" && <p className="mb-1 px-1 text-[11px] font-semibold text-[#555]">{activeAgent.name}</p>}
                    <div className={`rounded-[20px] px-4 py-3.5 text-[14px] leading-7 ${message.role === "user" ? "rounded-tr-md bg-[#39312e] text-white" : "rounded-tl-md bg-[#f3f3f3] text-[#222222]"}`} dir="auto">
                      {message.role === "assistant" ? <Streamdown>{message.content}</Streamdown> : <p className="whitespace-pre-wrap">{message.content.replace(/\n\nفایل پیوست‌شده:[\s\S]*$/, "")}</p>}
                    </div>
                    {message.attachment && <a href={message.attachment.url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 rounded-2xl border border-[#e4e4e4] bg-white px-3 py-2 text-xs text-[#333333] hover:border-[#999999]"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f1f1f1]">{message.attachment.contentType.startsWith("image/") ? <img src={message.attachment.url} alt="" className="h-8 w-8 rounded-xl object-cover" /> : <FileText size={16} />}</span><span className="min-w-0 truncate">{message.attachment.fileName}</span></a>}
                    {message.imageUrl && <div className="mt-3 overflow-hidden rounded-[20px] border border-[#e7d9d0] bg-white shadow-sm"><img src={message.imageUrl} alt="تصویر تولیدشده از مانیکا" className="max-h-[560px] w-full object-cover" /><div className="flex items-center justify-between px-3 py-2 text-[11px] text-[#666666]"><span>تصویر تولیدشده با هویت بصری مانیکا</span><a href={message.imageUrl} target="_blank" rel="noreferrer" className="font-medium text-[#222222] hover:underline">باز کردن تصویر</a></div></div>}
                    {message.role === "assistant" && message.id !== "welcome" && <div className="mt-2 flex flex-wrap items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"><button onClick={() => copyMessage(message)} className="rounded-lg p-1.5 text-[#777777] hover:bg-[#f2f2f2]" title="کپی"><span className="sr-only">کپی</span>{copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}</button>{message.audioUrl ? <><audio controls src={message.audioUrl} className="h-8 max-w-[220px]" aria-label="پخش پاسخ صوتی" /><a href={message.audioUrl} download={`manika-${message.id}.mp3`} className="rounded-lg p-1.5 text-[#777777] hover:bg-[#f2f2f2]" title="دانلود صوت" aria-label="دانلود پاسخ صوتی"><Download size={14} /></a></> : <button onClick={() => generateAudio(message)} disabled={audioLoadingId !== null} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-[#777777] hover:bg-[#f2f2f2] disabled:opacity-50" title="تولید و پخش صوت"><Volume2 size={14} />{audioLoadingId === message.id ? "در حال ساخت..." : "پخش صوت"}</button>}</div>}
                  </div>
                </div>)}
                {chatMutation.isPending && <div className="flex gap-3"><div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#e5e5e5] text-[#222222]"><Sparkles size={15} className="animate-pulse" /></div><div className="rounded-[20px] rounded-tl-md bg-[#f3f3f3] px-5 py-4"><div className="flex gap-1.5"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#777777] [animation-delay:-0.2s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#777777] [animation-delay:-0.1s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#777777]" /></div></div></div>}
              </div>

              {messages.length === 1 && <div className="mt-10 grid gap-2.5 sm:grid-cols-3">{(agentStarters[activeAgent.id] ?? agentStarters.manika).map((starter) => <button key={starter} onClick={() => sendMessage(starter)} className="rounded-2xl border border-[#e9dfd8] bg-white px-4 py-3 text-right text-xs leading-5 text-[#776960] transition hover:-translate-y-0.5 hover:border-[#bbbbbb] hover:shadow-md">{starter}</button>)}</div>}
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 md:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              {imagePanelOpen && <div className="mb-3 rounded-[22px] border border-[#e5e5e5] bg-[#fffdfb] p-4 shadow-[0_8px_24px_rgba(91,62,46,0.06)]"><label className="mb-3 block text-[11px] font-semibold">موتور تولید تصویر<select value={imageEngine} onChange={(event) => setImageEngine(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#e5e5e5] bg-white px-3 text-xs"><option>FEZI Image Core</option><option>Seedance 2</option><option>Kling AI</option><option>ChatGPT Image</option><option>Claude Fable Visual</option><option>GapGPT Image</option></select></label><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#4a3b34]">استودیوی تصویر</p><p className="mt-1 text-[11px] text-[#777777]">حالت ساخت را انتخاب کنید و توصیف صحنه را بنویسید.</p></div><button onClick={() => setImagePanelOpen(false)} className="rounded-xl p-2 text-[#666666] hover:bg-[#f5f5f5]" aria-label="بستن استودیو"><X size={16} /></button></div><div className="mb-3 grid grid-cols-2 gap-2"><button onClick={() => { setImageType("general"); setImageMode("generate"); }} className={`rounded-xl px-3 py-2 text-xs ${imageType === "general" ? "bg-[#000000] text-white" : "bg-[#f1f1f1] text-[#555555]"}`}>ساخت تصویر کلی</button><button onClick={() => setImageType("manika")} className={`rounded-xl px-3 py-2 text-xs ${imageType === "manika" ? "bg-[#000000] text-white" : "bg-[#f1f1f1] text-[#555555]"}`}>ساخت مخصوص مانیکا</button></div>{imageType === "manika" && <div className="mb-3 flex gap-2"><button onClick={() => setImageMode("generate")} className={`rounded-xl px-3 py-2 text-xs ${imageMode === "generate" ? "bg-[#e5e5e5] text-[#111111]" : "bg-[#f1f1f1] text-[#666666]"}`}>تولید تصویر مانیکا</button><button onClick={() => setImageMode("edit")} className={`rounded-xl px-3 py-2 text-xs ${imageMode === "edit" ? "bg-[#e5e5e5] text-[#111111]" : "bg-[#f1f1f1] text-[#666666]"}`}>ویرایش پرتره رسمی</button></div>}<Textarea value={imagePrompt} onChange={(event) => setImagePrompt(event.target.value)} placeholder={imageType === "general" ? "مثلاً: یک منظرهٔ سینمایی از تهران در شب..." : imageMode === "edit" ? "مثلاً: پس‌زمینه را به یک کافهٔ پاریسی در ساعت طلایی تبدیل کن..." : "مثلاً: مانیکا در یک گالری هنری مدرن، کت مشکی و نور پنجره..."} className="min-h-[82px] resize-none rounded-2xl border-[#e5e5e5] bg-white text-sm leading-6" dir="rtl" /><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-[#777777]">تولید تصویر ممکن است چند ثانیه زمان ببرد.</span><Button onClick={generateManikaImage} disabled={!canGenerateImage} className="rounded-xl bg-[#000000] text-white hover:bg-[#222222] disabled:bg-[#e5e5e5]"><Sparkles size={15} className="ml-2" />{imageMutation.isPending ? "در حال ساخت..." : imageType === "general" ? "ساخت تصویر کلی" : imageMode === "edit" ? "ویرایش تصویر مانیکا" : "ساخت تصویر مانیکا"}</Button></div></div>}
              {uploadError && <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{uploadError}</div>}
              {attachment && <div className="mb-2 flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2"><FileText size={15} /><span className="truncate">{attachment.fileName}</span></span><button onClick={() => setAttachment(null)} className="rounded-lg p-1 text-[#777777] hover:bg-[#f2f2f2]" aria-label="حذف فایل پیوست"><X size={15} /></button></div>}
              <div onDragOver={(event) => { event.preventDefault(); setIsDraggingFile(true); }} onDragLeave={() => setIsDraggingFile(false)} onDrop={(event) => { event.preventDefault(); setIsDraggingFile(false); handleFiles(event.dataTransfer.files); }} className={`rounded-[24px] border bg-white p-2 shadow-[0_10px_35px_rgba(91,62,46,0.08)] transition focus-within:ring-4 focus-within:ring-[#dddddd]/40 ${isDraggingFile ? "border-[#111111] bg-[#fafafa] ring-4 ring-[#dddddd]" : "border-[#e5e5e5] focus-within:border-[#888888]"}`}>
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder={`پیامت را برای ${activeAgent.name} بنویس...`} className="min-h-[54px] resize-none border-0 bg-transparent px-3 py-2.5 text-sm leading-6 shadow-none focus-visible:ring-0" dir="auto" />
                <div className="relative flex items-center justify-between px-1.5 pb-0.5"><div className="flex items-center gap-1 text-[#777777]"><Button onClick={() => sendMessage()} disabled={!canSend} size="icon" className="h-9 w-9 rounded-xl bg-[#39312e] text-white hover:bg-[#594a43] disabled:bg-[#eeeeee] disabled:text-[#999999]" aria-label="ارسال پیام"><ArrowUp size={17} /></Button><span className="hidden text-[10px] text-[#999999] sm:block">{messageCount} پیام</span></div><div className="flex items-center gap-1"><input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={(event) => { handleFiles(event.target.files); event.currentTarget.value = ""; }} /><button onClick={() => fileInputRef.current?.click()} className="rounded-xl p-2 text-[#777] hover:bg-[#f5efeb]" title="گالری" aria-label="انتخاب تصویر از گالری"><ImageIcon size={18} /></button><button onClick={() => setSkillsOpen((value) => !value)} className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${skillsOpen ? "bg-black text-white" : "text-[#777] hover:bg-[#f5efeb]"}`} title="مهارت‌ها و کارها" aria-label="باز کردن مهارت‌ها و کارها" aria-expanded={skillsOpen}>+</button><button onClick={() => void toggleRecording()} className={`rounded-xl p-2 hover:bg-[#f5efeb] ${recording ? "bg-[#111111] text-white" : ""}`} title={recording ? "توقف ضبط ویس" : "ضبط و ارسال ویس"} aria-label={recording ? "توقف ضبط ویس" : "ضبط و ارسال ویس"}><Mic size={18} /></button></div>{skillsOpen && <div className="absolute bottom-12 right-1 z-30 w-64 rounded-2xl border border-[#ddd] bg-white p-3 shadow-xl"><p className="text-xs font-semibold">مهارت‌ها و کارها</p><div className="mt-2 grid grid-cols-2 gap-2">{["تفکر عمیق", "جست‌وجوی وب", "تولید تصویر", "مدیریت محتوا"].map((skill) => <button key={skill} onClick={() => { if (skill === "تفکر عمیق") setDeepThinking((value) => !value); if (skill === "جست‌وجوی وب") setWebSearch((value) => !value); setSkillsOpen(false); }} className="rounded-xl bg-[#f5f5f3] px-2 py-2 text-[10px] hover:bg-[#e9e9e7]">{skill}</button>)}</div></div>}</div>
              </div>
              <p className="mt-3 text-center text-[10px] text-[#999999]">مانیکا ممکن است اشتباه کند؛ برای تصمیم‌های مهم، اطلاعات را بررسی کن.</p>
              <p className="mt-2 text-center text-[10px] text-[#b0b0b0]">FEZI AI · Persian Dark Horse</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
