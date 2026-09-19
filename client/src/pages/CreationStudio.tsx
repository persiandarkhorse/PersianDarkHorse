import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, Image as ImageIcon, KeyRound, Play, Sparkles, Video, WandSparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const videoModels = ["Seedance 2.0", "Runway", "Kling AI", "Veo", "FEZI Video Core"];
const imageModels = ["FEZI Image Core", "Nano Banana", "ChatGPT Image", "Gemma Image", "Kling AI"];
const profiles: Record<string, string[]> = {
  "Seedance 2.0": ["Cinematic Motion", "Product Commercial", "UGC Vertical", "Action Sequence"],
  Runway: ["Gen-4 Visual", "Director Mode", "Stylized Motion", "Product Ad"],
  "Kling AI": ["Cinematic", "Realistic Motion", "Image-to-Video", "Motion Control"],
  Veo: ["Film Director", "Documentary", "Product Shot", "Dialogue Scene"],
  "Nano Banana": ["Identity Preserve", "Creative Edit", "Product Image", "Editorial"],
  "ChatGPT Image": ["Photorealistic", "Editorial", "Typography", "Concept Art"],
  "Gemma Image": ["Fast Draft", "Illustration", "Photorealistic", "Safe Edit"],
};

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="block text-xs font-medium text-[#333]"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#dededb] bg-white px-3 text-xs outline-none focus:border-black">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export default function CreationStudio({ kind }: { kind: "video" | "image" }) {
  const [, navigate] = useLocation();
  const isVideo = kind === "video";
  const params = new URLSearchParams(window.location.search);
  const initialModel = params.get("provider") ?? (isVideo ? videoModels[0] : imageModels[0]);
  const [model, setModel] = useState((isVideo ? videoModels : imageModels).includes(initialModel) ? initialModel : (isVideo ? videoModels[0] : imageModels[0]));
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
  const [output, setOutput] = useState<{ url: string; engine: string } | null>(null);
  const imageMutation = trpc.manika.image.useMutation();
  const credentials = trpc.subscription.videoCredentials.useQuery(undefined, { enabled: isVideo, retry: false });
  const selectedProfiles = useMemo(() => profiles[model] ?? ["استاندارد FEZI", "کیفیت بالا", "سریع", "تخصصی"], [model]);
  const hasKey = credentials.data?.some((credential) => credential.provider === model || (model === "Seedance 2.0" && credential.provider === "Seedance"));

  function changeModel(value: string) { setModel(value); setProfile((profiles[value] ?? ["استاندارد FEZI"])[0]); setOutput(null); }
  async function generateImage() {
    if (prompt.trim().length < 3) return;
    const result = await imageMutation.mutateAsync({ prompt, mode: "generate", imageType: "general", engine: model, aspectRatio: ratio, size, quality, duration, fidelity, visualStyle: style, background, renderDetail: "جزئیات حداکثری" });
    if (result.imageUrl) setOutput({ url: result.imageUrl, engine: result.engine });
  }

  return <main dir="rtl" className="min-h-screen bg-[#f7f4f0] px-4 py-6 text-[#24211f] md:px-8"><div className="mx-auto max-w-6xl"><header className="flex items-center justify-between border-b border-[#e6e0db] pb-5"><div className="flex items-center gap-3"><Link href="/" className="rounded-xl p-2 hover:bg-white" aria-label="بازگشت"><ArrowLeft size={18} /></Link><div><p className="font-serif text-2xl font-semibold">{isVideo ? "استودیو ساخت ویدیو" : "استودیو تولید تصویر"}</p><p className="mt-1 text-xs text-[#777]">FEZI AI · {isVideo ? "Video Creation Studio" : "Image Creation Studio"}</p></div></div><div className="rounded-2xl bg-black px-3 py-2 text-xs text-white"><Sparkles size={14} className="ml-1 inline" /> {isVideo ? "Video Lab" : "Image Lab"}</div></header><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="space-y-5"><div className="rounded-3xl border border-[#dededb] bg-white p-5 shadow-sm md:p-7"><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">{isVideo ? <Video size={19} /> : <ImageIcon size={19} />}</div><div><h1 className="text-xl font-bold">{isVideo ? "ویدیوی خود را طراحی کنید" : "تصویر خود را طراحی کنید"}</h1><p className="mt-1 text-xs leading-6 text-[#777]">مدل، پروفایل و تمام جزئیات خروجی را پیش از ارسال انتخاب کنید.</p></div></div><label className="mt-7 block text-xs font-medium text-[#333]">توضیح کامل / Prompt<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} placeholder={isVideo ? "صحنه، حرکت، دوربین، نور، صدا و هدف ویدیو را دقیق بنویسید..." : "سوژه، ترکیب‌بندی، سبک، نور و محدودیت‌های تصویر را بنویسید..."} className="mt-2 w-full resize-none rounded-2xl border border-[#dededb] bg-[#fcfcfb] p-4 text-sm leading-7 outline-none focus:border-black" /></label>{isVideo && <div className="mt-3 rounded-2xl border border-dashed border-[#d8c8bd] bg-[#fffaf6] p-3 text-[11px] leading-5 text-[#765d4c]">برای ویدیو، مسیر تحویل MP4 بعد از اتصال API مدل انتخابی فعال می‌شود. کلیدها را از پنل حساب مدیریت کنید.</div>}{output && <div className="mt-5 overflow-hidden rounded-2xl border border-[#ddd] bg-[#fbfbfa]"><img src={output.url} alt="خروجی تولیدشده" className="max-h-[560px] w-full object-cover" /><div className="flex items-center justify-between px-4 py-3 text-xs"><span>تولیدشده با {output.engine}</span><a href={output.url} target="_blank" rel="noreferrer" download className="rounded-lg bg-black px-3 py-2 text-white">دانلود تصویر</a></div></div>}<button onClick={() => { if (isVideo) { setPrompt((value) => value.trim() ? value : "درخواست ویدیو آماده است؛ لطفاً API Provider را متصل کنید."); return; } void generateImage(); }} disabled={imageMutation.isPending || prompt.trim().length < 3} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-semibold text-white disabled:opacity-40">{isVideo ? <Play size={15} /> : <WandSparkles size={15} />}{imageMutation.isPending ? "در حال تولید..." : isVideo ? "ساخت ویدیو" : "تولید تصویر"}</button></div></section><aside className="space-y-4"><div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">01 · موتور</p><SelectField label="انتخاب مدل" value={model} onChange={changeModel} options={isVideo ? videoModels : imageModels} /><div className="mt-4"><SelectField label="پروفایل آماده موتور" value={profile} onChange={setProfile} options={selectedProfiles} /></div></div><div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">02 · خروجی</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{isVideo ? <><SelectField label="نسبت تصویر" value={ratio} onChange={setRatio} options={["16:9", "9:16"]} /><SelectField label="رزولوشن" value={resolution} onChange={setResolution} options={["720p", "1080p"]} /><SelectField label="مدت" value={duration} onChange={setDuration} options={["5 ثانیه", "10 ثانیه", "15 ثانیه", "30 ثانیه"]} /><SelectField label="فرمت" value={format} onChange={setFormat} options={["MP4", "WEBM", "MOV"]} /></> : <><SelectField label="نسبت تصویر" value={ratio} onChange={setRatio} options={["1:1", "16:9", "9:16", "4:5", "4:3"]} /><SelectField label="اندازه" value={size} onChange={setSize} options={["512×512", "1024×1024", "1536×1024", "1024×1536", "2048×2048"]} /><SelectField label="کیفیت" value={quality} onChange={setQuality} options={["Draft", "Standard", "High", "Ultra"]} /><SelectField label="فرمت" value={format} onChange={setFormat} options={["PNG", "JPG", "WEBP"]} /></>}</div></div><div className="rounded-3xl border border-[#dededb] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">03 · کنترل تخصصی</p><div className="mt-4 grid gap-4">{isVideo ? <><SelectField label="شدت حرکت" value={motion} onChange={setMotion} options={["کم", "متوسط", "زیاد", "بسیار زیاد"]} /><SelectField label="حرکت دوربین" value={camera} onChange={setCamera} options={["ثابت", "حرکت نرم سینمایی", "پن / تیلت", "دنبال‌کردن سوژه", "اوربیت ۳۶۰ درجه"]} /><SelectField label="صدا" value={audio} onChange={setAudio} options={["با صدا", "بدون صدا", "دیالوگ هماهنگ"]} /> </> : <><SelectField label="وفاداری به مرجع" value={fidelity} onChange={setFidelity} options={["کم", "متوسط", "بالا", "حداکثری"]} /><SelectField label="سبک تصویر" value={style} onChange={setStyle} options={["طبیعی", "سینمایی", "ادیتوریال", "تبلیغاتی", "تصویرسازی"]} /><SelectField label="پس‌زمینه" value={background} onChange={setBackground} options={["واقعی", "استودیویی", "شفاف", "حذف پس‌زمینه"]} /></>}</div></div>{isVideo && <div className="rounded-3xl border border-[#dededb] bg-white p-5">{hasKey ? <p className="flex items-center gap-2 text-xs text-[#256b2c]"><Check size={15} /> کلید {model} متصل است.</p> : <><p className="flex items-center gap-2 text-xs text-[#8a6330]"><KeyRound size={15} /> کلید این موتور متصل نیست.</p><Link href="/account" className="mt-3 block text-xs font-semibold underline">رفتن به تنظیمات حساب</Link></>}</div>}</aside></div></div></main>;
}
