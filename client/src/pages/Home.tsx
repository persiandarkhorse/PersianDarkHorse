import { useEffect, useMemo, useState } from "react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  Camera,
  Check,
  ChevronDown,
  Copy,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

const officialPortrait = "/manus-storage/manika_official_portrait_0a335a23.png";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; content: string; createdAt: number };

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

const starters = [
  "مانیکا، امروز چه محتوایی برای اینستاگرامم بسازم؟",
  "یک ایدهٔ پرترهٔ سینمایی برای مانیکا پیشنهاد بده.",
  "برای یک برند عطر، یک سناریوی ریلز کوتاه بنویس.",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem("manika-chat-history");
      return stored ? JSON.parse(stored) : initialMessages();
    } catch {
      return initialMessages();
    }
  });
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatMutation = trpc.manika.chat.useMutation();

  useEffect(() => {
    localStorage.setItem("manika-chat-history", JSON.stringify(messages));
  }, [messages]);

  const canSend = input.trim().length > 0 && !chatMutation.isPending;
  const messageCount = useMemo(() => messages.filter((item) => item.role === "user").length, [messages]);

  async function sendMessage(value = input) {
    const text = value.trim();
    if (!text || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        mode: activeMode.label,
        messages: nextMessages.slice(-12).map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", content: result.content, createdAt: Date.now() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "پاسخ‌گویی موقتاً با مشکل روبه‌رو شد.";
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: `متأسفم، فعلاً نتونستم پاسخ بدم.\n\nجزئیات: ${message}`,
          createdAt: Date.now(),
        },
      ]);
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

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#272321] selection:bg-[#dcbfa9]/50">
      <div className="mx-auto flex min-h-screen max-w-[1560px] overflow-hidden bg-[#fbfaf8] shadow-[0_20px_80px_rgba(65,45,35,0.08)] lg:min-h-[calc(100vh-32px)] lg:my-4 lg:rounded-[30px]">
        <aside className={`fixed inset-y-0 right-0 z-30 w-[290px] border-l border-[#e9e1db] bg-[#f5f0eb] p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-[#2f2927] ring-4 ring-white">
                <img src={officialPortrait} alt="پرتره مانیکا" className="h-full w-full object-cover object-top" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold tracking-tight">مانیکا</p>
                <p className="text-[11px] text-[#9a8980]">Manika AI companion</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 text-[#8f7d73] hover:bg-white lg:hidden" aria-label="بستن منو"><X size={18} /></button>
          </div>

          <Button onClick={() => { setMessages(initialMessages()); setInput(""); }} className="mt-8 h-12 w-full justify-between rounded-2xl bg-[#2f2927] px-4 text-sm font-medium text-white shadow-lg shadow-[#2f2927]/10 hover:bg-[#413734]">
            <span className="flex items-center gap-2"><Plus size={17} /> گفت‌وگوی تازه</span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">⌘ K</span>
          </Button>

          <div className="mt-9">
            <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#aa968b]">حالت‌های کاری</p>
            <div className="space-y-1.5">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const active = activeMode.label === mode.label;
                return <button key={mode.label} onClick={() => { setActiveMode(mode); setMobileMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-right transition ${active ? "bg-white shadow-sm ring-1 ring-[#e6dbd3]" : "hover:bg-white/70"}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-[#ead6c7] text-[#6d4c3b]" : "bg-[#ebe3dd] text-[#9b8274]"}`}><Icon size={17} /></span>
                  <span className="min-w-0"><span className="block text-sm font-medium">{mode.label}</span><span className="mt-0.5 block truncate text-[11px] text-[#a18f86]">{mode.description}</span></span>
                </button>;
              })}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[#e7dcd4] bg-white/70 p-4">
            <div className="flex items-center gap-2 text-[#886d5c]"><Sparkles size={15} /><span className="text-xs font-semibold">هویت مانیکا فعال است</span></div>
            <p className="mt-2 text-[11px] leading-5 text-[#9c8980]">چهره، لحن و نگاه خلاقانهٔ مانیکا در این فضا حفظ می‌شود.</p>
          </div>
        </aside>

        {mobileMenuOpen && <button className="fixed inset-0 z-20 bg-[#2f2927]/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="بستن منو" />}

        <main className="flex min-h-screen min-w-0 flex-1 flex-col lg:min-h-0">
          <header className="flex h-[78px] items-center justify-between border-b border-[#eee8e3] px-5 md:px-9">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(true)} className="rounded-xl p-2 text-[#806f66] hover:bg-[#f3ede8] lg:hidden" aria-label="باز کردن منو"><Menu size={19} /></button>
              <div><p className="font-serif text-[19px] font-semibold">فضای خلاق مانیکا</p><p className="mt-0.5 text-[11px] text-[#a28e83]">{activeMode.label} <span className="mx-1 text-[#d3c3bb]">·</span> گفت‌وگوی خصوصی</p></div>
            </div>
            <div className="flex items-center gap-1 text-[#9b8980]"><button onClick={clearChat} className="rounded-xl p-2.5 hover:bg-[#f3ede8]" title="پاک‌کردن گفت‌وگو"><MoreHorizontal size={19} /></button></div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-8 md:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 flex items-center gap-4 border-b border-[#eee8e3] pb-8">
                <div className="relative h-16 w-16 overflow-hidden rounded-[22px] bg-[#2f2927] shadow-md shadow-[#8f6f5c]/15"><img src={officialPortrait} alt="مانیکا" className="h-full w-full object-cover object-top" /></div>
                <div><p className="font-serif text-2xl font-semibold tracking-tight">سلام، من مانیکا هستم.</p><p className="mt-1 text-sm text-[#9b8980]">ایده‌هایت را با هم به چیزی ماندگار تبدیل کنیم.</p></div>
              </div>

              <div className="space-y-7">
                {messages.map((message) => <div key={message.id} className={`group flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" ? <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ead6c7] text-[#775541]"><Sparkles size={15} /></div> : <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#39312e] text-[11px] font-semibold text-white">شما</div>}
                  <div className={`min-w-0 max-w-[85%] ${message.role === "user" ? "text-left" : ""}`}>
                    <div className={`rounded-[20px] px-4 py-3.5 text-[14px] leading-7 ${message.role === "user" ? "rounded-tr-md bg-[#39312e] text-white" : "rounded-tl-md bg-[#f4efeb] text-[#453b37]"}`} dir="auto">
                      {message.role === "assistant" ? <Streamdown>{message.content}</Streamdown> : <p className="whitespace-pre-wrap">{message.content}</p>}
                    </div>
                    {message.role === "assistant" && message.id !== "welcome" && <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100"><button onClick={() => copyMessage(message)} className="rounded-lg p-1.5 text-[#a69288] hover:bg-[#f2eae4]" title="کپی"><span className="sr-only">کپی</span>{copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}</button></div>}
                  </div>
                </div>)}
                {chatMutation.isPending && <div className="flex gap-3"><div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#ead6c7] text-[#775541]"><Sparkles size={15} className="animate-pulse" /></div><div className="rounded-[20px] rounded-tl-md bg-[#f4efeb] px-5 py-4"><div className="flex gap-1.5"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a99081] [animation-delay:-0.2s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a99081] [animation-delay:-0.1s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a99081]" /></div></div></div>}
              </div>

              {messages.length === 1 && <div className="mt-10 grid gap-2.5 sm:grid-cols-3">{starters.map((starter) => <button key={starter} onClick={() => sendMessage(starter)} className="rounded-2xl border border-[#e9dfd8] bg-white px-4 py-3 text-right text-xs leading-5 text-[#776960] transition hover:-translate-y-0.5 hover:border-[#d8c2b3] hover:shadow-md">{starter}</button>)}</div>}
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 md:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-[24px] border border-[#dfd3ca] bg-white p-2 shadow-[0_10px_35px_rgba(91,62,46,0.08)] focus-within:border-[#c9a991] focus-within:ring-4 focus-within:ring-[#e8d4c4]/40">
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="پیامت را برای مانیکا بنویس..." className="min-h-[54px] resize-none border-0 bg-transparent px-3 py-2.5 text-sm leading-6 shadow-none focus-visible:ring-0" dir="auto" />
                <div className="flex items-center justify-between px-1.5 pb-0.5"><div className="flex items-center gap-0.5 text-[#ad9b91]"><button className="rounded-xl p-2 hover:bg-[#f5efeb]" title="پیوست"><Paperclip size={17} /></button><button className="rounded-xl p-2 hover:bg-[#f5efeb]" title="تصویر"><ImageIcon size={17} /></button><span className="mr-2 hidden text-[10px] text-[#b6a49a] sm:block">{messageCount} پیام در این گفت‌وگو</span></div><Button onClick={() => sendMessage()} disabled={!canSend} size="icon" className="h-9 w-9 rounded-xl bg-[#39312e] text-white hover:bg-[#594a43] disabled:bg-[#e8e0db] disabled:text-[#b6a69d]"><ArrowUp size={17} /></Button></div>
              </div>
              <p className="mt-3 text-center text-[10px] text-[#b3a29a]">مانیکا ممکن است اشتباه کند؛ برای تصمیم‌های مهم، اطلاعات را بررسی کن.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
