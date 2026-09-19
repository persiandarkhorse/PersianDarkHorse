import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, ExternalLink, Image as ImageIcon, KeyRound, Play, Sparkles, Video, WandSparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { mediaProviderStatus, mediaProvidersFor } from "@shared/mediaProviders";

const profiles: Record<string, string[]> = {
  "Seedance 2.0": ["Cinematic Motion", "Product Commercial", "UGC Vertical", "Action Sequence"],
  Runway: ["Gen-4 Visual", "Director Mode", "Stylized Motion", "Product Ad"],
  "Hugging Face Inference": ["Text to Video", "Image to Video", "Fast Draft", "Quality Draft"],
  "Google Gemini / Veo": ["Film Director", "Documentary", "Product Shot", "Dialogue Scene"],
  "FEZI Image Core": ["Identity Preserve", "Creative Edit", "Product Image", "Editorial"],
  "Hugging Face Inference Image": ["Fast Draft", "Illustration", "Photorealistic", "Safe Edit"],
};

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="block text-xs font-medium text-[#333]"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#dededb] bg-white px-3 text-xs outline-none focus:border-black">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export default function CreationStudio({ kind }: { kind: "video" | "image" }) {
  const [, navigate] = useLocation();
  const isVideo = kind === "video";
  const providers = useMemo(() => mediaProvidersFor(kind), [kind]);
  const params = new URLSearchParams(window.location.search);
  const requestedModel = params.get("provider");
  const initialModel = providers.some((provider) => provider.id === requestedModel) ? requestedModel! : providers[0].id;
  const [model, setModel] = useState(initialModel);
  const [profile, setProfile] = useState(profiles[initialModel]?.[0] ?? "استاندارد FEZI");
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState(isVideo ? "16:9" : "1:1");
  const [quality, setQuality] = useState("High");
  const [duration, setDuration] = useState("10 ثانیه");
  const [resolution, setResolution] = useState("1080p");
  const [format, setFormat] = useState(isVideo ? "MP4" : "PNG");
  const [size, setSize] = useState("1024×1024");
  const [motion, setMotion] = useState("متوسط");
  const [camera, setCamera] = useState("حرکت نرم سینمایی");
  const [fidelity, setFidelity] = useState("بالا");
  const [style, setStyle] = useState("طبیعی");
  const [background, setBackground] = useState("واقعی");
  const [audio, setAudio] = useState("با صدا");
  const [notice, setNotice] = useState("");
  const [output, setOutput] = useState<{ url: string; engine: string } | null>(null);
  const imageMutation = trpc.manika.image.useMutation({ onError: (error) => setNotice(error.message) });
  const credentials = trpc.subscription.videoCredentials.useQuery(undefined, { enabled: isVideo, retry: false });
  const hasKey = credentials.data?.some((credential) => credential.provider === model || (model === "Seedance 2.0" && credential.provider === "Seedance")) ?? false;
  const selectedProvider = providers.find((provider) => provider.id === model) ?? providers[0];
  const providerStatus = mediaProviderStatus(selectedProvider, hasKey);
  const selectedProfiles = profiles[model] ?? ["استاندارد FEZI", "کیفیت بالا", "سریع", "تخصصی"];
  const canGenerateImage = !isVideo && model === "FEZI Image Core";

  function changeModel(value: string) {
    setModel(value);
    setProfile(profiles[value]?.[0] ?? "استاندارد FEZI");
    setOutput(null);
    setNotice("");
  }

  async function generateImage() {
    if (prompt.trim().length < 3) return;
    if (!canGenerateImage) {
      setNotice("این Provider در کاتالوگ ثبت شده است، اما adapter اجرایی آن هنوز به FEZI متصل نیست. برای تولید واقعی، FEZI Image Core را انتخاب کنید.");
      return;
    }
    const result = await imageMutation.mutateAsync({ prompt, mode: "generate", imageType: "general", engine: model, aspectRatio: ratio, size, quality, duration, fidelity, visualStyle: style, background, renderDetail: "جزئیات حداکثری" });
    if (result.imageUrl) setOutput({ url: result.imageUrl, engine: result.engine });
  }

  function requestVideo() {
    setNotice(selectedProvider.requiresKey && !hasKey ? "برای این Provider ابتدا کلید یا توکن معتبر را در پنل حساب وارد کنید." : "کاتالوگ و تنظیمات ویدیو آماده است، اما adapter تولید ویدیو در backend هنوز فعال نشده است؛ این درخواست به‌عنوان تولید واقعی ارسال نشد.");
  }

  return <main dir="rtl" className="min-h-screen bg-[#f7f4f0] px-3 py-4 text-[#24211f] sm:px-4 sm:py-6 md:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e0db] pb-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3"><Link href="/" className="rounded-xl p-2 hover:bg-white" aria-label="بازگشت"><ArrowLeft size={18} /></Link><div className="min-w-0"><p className="truncate font-serif text-xl font-semibold sm:text-2xl">{isVideo ? "استودیو ساخت ویدیو" : "استودیو تولید تصویر"}</p><p className="mt-1 text-xs text-[#777]">FEZI AI · {isVideo ? "Video Creation Studio" : "Image Creation Studio"}</p></div></div>
        <div className="rounded-2xl bg-black px-3 py-2 text-xs text-white"><Sparkles size={14} className="ml-1 inline" /> {isVideo ? "Video Lab" : "Image Lab"}</div>
      </header>
      <div className="mt-5 grid gap-5 lg:mt-7 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="rounded-3xl border border-[#dededb] bg-white p-4 shadow-sm sm:p-5 md:p-7">
            <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-white">{isVideo ? <Video size={19} /> : <ImageIcon size={19} />}</div><div><h1 className="text-xl font-bold">{isVideo ? "ویدیوی خود را طراحی کنید" : "تصویر خود را طراحی کنید"}</h1><p className="mt-1 text-xs leading-6 text-[#777]">مدل، پروفایل و تمام جزئیات خروجی را پیش از ارسال انتخاب کنید.</p></div></div>
            <label className="mt-6 block text-xs font-medium text-[#333]">توضیح کامل / Prompt<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} placeholder={isVideo ? "صحنه، حرکت، دوربین، نور، صدا و هدف ویدیو را دقیق بنویسید..." : "سوژه، ترکیب‌بندی، سبک، نور و محدودیت‌های تصویر را بنویسید..."} className="mt-2 w-full resize-none rounded-2xl border border-[#dededb] bg-[#fcfcfb] p-4 text-sm leading-7 outline-none focus:border-black" /></label>
            <div className="mt-4 rounded-2xl border border-dashed border-[#d8c8bd] bg-[#fffaf6] p-3 text-[11px] leading-5 text-[#765d4c]">{isVideo ? "برای تولید مستقیم ویدیو، Provider انتخابی باید کلید یا free-tier معتبر داشته باشد. وضعیت اتصال در ستون کناری نمایش داده می‌شود." : "در حال حاضر FEZI Image Core مسیر اجرایی متصل برای تولید تصویر است؛ Providerهای دیگر تا اتصال adapter به‌صورت شفاف علامت‌گذاری می‌شوند."}</div>
            {notice && <div className="mt-4 rounded-2xl border border-[#e2cfc2] bg-[#fff8f3] p-3 text-xs leading-6 text-[#765d4c]" role="status">{notice}</div>}
            {output && <div className="mt-5 overflow-hidden rounded-2xl border border-[#ddd] bg-[#fbfbfa]"><img src={output.url} alt="خروجی تولیدشده" className="max-h-[560px] w-full object-cover" /><div className="flex items-center justify-between px-4 py-3 text-xs"><span>تولیدشده با {output.engine}</span><a href={output.url} target="_blank" rel="noreferrer" download className="rounded-lg bg-black px-3 py-2 text-white">دانلود تصویر</a></div></div>}
            <button onClick={isVideo ? requestVideo : () => void generateImage()} disabled={(!isVideo && imageMutation.isPending) || prompt.trim().length < 3} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-semibold text-white disabled:opacity-40">{isVideo ? <Play size={15} /> : <WandSparkles size={15} />}{imageMutation.isPending ? "در حال تولید..." : isVideo ? "ساخت ویدیو" : "تولید تصویر"}</button>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">01 · Provider</p><SelectField label="انتخاب مسیر تولید" value={model} onChange={changeModel} options={providers.map((provider) => provider.id)} /><div className="mt-4 rounded-2xl bg-[#f7f7f5] p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold">{selectedProvider.label}</p><span className={`rounded-full px-2 py-1 text-[9px] ${providerStatus.tone === "connected" ? "bg-[#e7f5e8] text-[#256b2c]" : providerStatus.tone === "free-tier" ? "bg-[#fff4d8] text-[#80621e]" : "bg-[#eeeeec] text-[#666]"}`}>{providerStatus.label}</span></div><p className="mt-2 text-[10px] leading-5 text-[#777]">{selectedProvider.description}</p><p className="mt-2 text-[10px] leading-5 text-[#888]">{selectedProvider.note}</p>{selectedProvider.setupHref && <Link href={selectedProvider.setupHref} className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold underline">مدیریت کلید / اتصال <ExternalLink size={12} /></Link>}</div><div className="mt-4"><SelectField label="پروفایل آماده موتور" value={profile} onChange={setProfile} options={selectedProfiles} /></div></div>
          <div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">02 · خروجی</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{isVideo ? <><SelectField label="نسبت تصویر" value={ratio} onChange={setRatio} options={["16:9", "9:16"]} /><SelectField label="رزولوشن" value={resolution} onChange={setResolution} options={["720p", "1080p"]} /><SelectField label="مدت" value={duration} onChange={setDuration} options={["5 ثانیه", "10 ثانیه", "15 ثانیه", "30 ثانیه"]} /><SelectField label="فرمت" value={format} onChange={setFormat} options={["MP4", "WEBM", "MOV"]} /></> : <><SelectField label="نسبت تصویر" value={ratio} onChange={setRatio} options={["1:1", "16:9", "9:16", "4:5", "4:3"]} /><SelectField label="اندازه" value={size} onChange={setSize} options={["512×512", "1024×1024", "1536×1024", "1024×1536", "2048×2048"]} /><SelectField label="کیفیت" value={quality} onChange={setQuality} options={["Draft", "Standard", "High", "Ultra"]} /><SelectField label="فرمت" value={format} onChange={setFormat} options={["PNG", "JPG", "WEBP"]} /></>}</div></div>
          <div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">03 · کنترل تخصصی</p><div className="mt-4 grid gap-4">{isVideo ? <><SelectField label="شدت حرکت" value={motion} onChange={setMotion} options={["کم", "متوسط", "زیاد", "بسیار زیاد"]} /><SelectField label="حرکت دوربین" value={camera} onChange={setCamera} options={["ثابت", "حرکت نرم سینمایی", "پن / تیلت", "دنبال‌کردن سوژه", "اوربیت ۳۶۰ درجه"]} /><SelectField label="صدا" value={audio} onChange={setAudio} options={["با صدا", "بدون صدا", "دیالوگ هماهنگ"]} /></> : <><SelectField label="وفاداری به مرجع" value={fidelity} onChange={setFidelity} options={["کم", "متوسط", "بالا", "حداکثری"]} /><SelectField label="سبک تصویر" value={style} onChange={setStyle} options={["طبیعی", "سینمایی", "ادیتوریال", "تبلیغاتی", "تصویرسازی"]} /><SelectField label="پس‌زمینه" value={background} onChange={setBackground} options={["واقعی", "استودیویی", "شفاف", "حذف پس‌زمینه"]} /></>}</div></div>
          {isVideo && <div className="rounded-3xl border border-[#dededb] bg-white p-5">{hasKey ? <p className="flex items-center gap-2 text-xs text-[#256b2c]"><Check size={15} /> کلید {model} متصل است.</p> : <><p className="flex items-center gap-2 text-xs text-[#8a6330]"><KeyRound size={15} /> {providerStatus.label}</p><Link href="/account" className="mt-3 block text-xs font-semibold underline">رفتن به تنظیمات حساب</Link></>}</div>}
        </aside>
      </div>
    </div>
  </main>;
}
