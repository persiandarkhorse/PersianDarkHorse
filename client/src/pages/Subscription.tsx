import { useState } from "react";
import { Link } from "wouter";
import { Check, ChevronDown, Clipboard, Coins, Copy, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const wallets = [
  ["BNB", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["USDT BEP20", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["ETH", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["USDT ERC20", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["BTC", "bc1qt9gu52gnez4gq86qfdzcvpd9rjx7kc4srmssmn"],
  ["SOL", "4hVx2LG5hygUPWxk1XNVeeqS9X8H7ngWpFyTEbfSAvSA"],
  ["TRX", "TWCLiDUumxSegdbY2Qq6n25PaoGuDedovp"],
  ["USDT TRC20", "TWCLiDUumxSegdbY2Qq6n25PaoGuDedovp"],
  ["TON", "UQD5B1s87qakuDlnkW3RyFkgUDhxjIxTD6SRK30yLUhnP8Cl"],
  ["Usdc Base", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Usdc Eth", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Usdc Sol", "4hVx2LG5hygUPWxk1XNVeeqS9X8H7ngWpFyTEbfSAvSA"],
  ["Ada cardano", "addr1qy4rgsjtfu2npgnurq2f8qszusyg9c2h4qsnusdp84f7zj8twteydfy047tv9a5djxkwd6j35yu96dxydhdcu05mefhs7v47nz"],
  ["Artibitrum", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Base", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Doge coin", "DN16CWU5G55HfvLfMbBTqVfHdtWwcr1KLm"],
  ["Polygon", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Vechain", "0x14Cc495A76eCd89DC3a7a02B0Bf7260519da0282"],
  ["Xrp", "rKgwz3TZUUd3RcjpgDFKJneBr686mtZ7nh"],
  ["Zcash", "t1Tnv16LWZwMaSxnmJdgdpe8CChj5LyZrkP"],
  ["Bitcoin cash", "qr5357j8uertuhnd4xvty8fy5dz65sa4a5eyu44tzp"],
  ["Dash", "XhPinGvasdYXcE9yioVGxLvjvjNBRuAk8f"],
] as const;

export default function Subscription() {
  const [amount, setAmount] = useState("");
  const [openWallet, setOpenWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyAddress(label: string, address: string) {
    await navigator.clipboard.writeText(address);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f7f4f0] text-[#292321]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_75%_0%,rgba(193,149,112,.22),transparent_48%),radial-gradient(circle_at_15%_20%,rgba(68,53,46,.10),transparent_42%)]" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f2927] text-[#f4d2b8] shadow-lg shadow-[#2f2927]/15"><Sparkles size={18} /></div>
          <div><p className="font-serif text-lg font-semibold tracking-tight">FEZI AI</p><p className="text-[10px] tracking-[0.18em] text-[#9b8980]">THE INTELLIGENCE TEAM</p></div>
        </Link>
        <Link href="/" className="rounded-xl px-3 py-2 text-sm text-[#806e64] transition hover:bg-white hover:text-[#493b34]">بازگشت به چت</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pt-14">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e1d1c5] bg-white/70 px-3 py-1.5 text-xs text-[#866756]"><LockKeyhole size={13} /> دسترسی زودهنگام FEZI AI</div>
          <h1 className="font-serif text-4xl font-semibold leading-[1.2] tracking-tight text-[#302824] sm:text-6xl">دروازهٔ ورود به<br /><span className="text-[#986a4f]">تیم هوشمند شما</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#806e64] sm:text-lg">اشتراک خود را برای دسترسی به تجربهٔ کامل FEZI AI آماده کنید. این بخش در حال حاضر در مرحلهٔ پیش‌راه‌اندازی است و جزئیات پلن‌ها به‌زودی اعلام می‌شود.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="rounded-[30px] border border-[#e5d8cf] bg-white/85 p-5 shadow-[0_24px_70px_rgba(76,52,39,.08)] backdrop-blur sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#eee5df] pb-6"><div><p className="text-xs font-semibold tracking-[0.18em] text-[#a47a61]">STEP 01</p><h2 className="mt-2 text-2xl font-semibold text-[#3e322d]">مبلغ موردنظر را وارد کنید</h2><p className="mt-2 text-sm text-[#9a877c]">مبلغ را به‌صورت آزمایشی وارد کنید؛ پرداخت واقعی هنوز فعال نشده است.</p></div><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3e7de] text-[#986a4f]"><Coins size={22} /></div></div>
            <div className="mt-7"><label htmlFor="amount" className="mb-2 block text-sm font-medium text-[#5c4a41]">مبلغ اشتراک</label><div className="relative"><Input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="مثلاً 100" className="h-14 rounded-2xl border-[#e0d1c7] bg-[#fffdfb] pl-20 text-lg shadow-none focus-visible:ring-[#c9a991]" /><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#aa9588]">USDT</span></div></div>
            <div className="mt-8 rounded-2xl bg-[#f7f2ee] p-4 text-sm leading-7 text-[#806e64]"><div className="flex gap-3"><Check className="mt-1 shrink-0 text-[#9a6a4f]" size={17} /><p>در نسخهٔ فعلی، این فرم فقط برای آماده‌سازی فرآیند خرید است. پس از انتخاب کیف‌پول، آدرس نمایش داده می‌شود و تأیید پرداخت هنوز خودکار نیست.</p></div></div>
          </section>

          <section className="rounded-[30px] border border-[#3a302c] bg-[#302925] p-5 text-white shadow-[0_24px_70px_rgba(45,31,24,.20)] sm:p-7"><p className="text-xs font-semibold tracking-[0.18em] text-[#dcb49b]">STEP 02</p><h2 className="mt-2 text-2xl font-semibold">روش پرداخت را انتخاب کنید</h2><p className="mt-2 text-sm leading-7 text-[#cbbab0]">روی شبکهٔ موردنظر بزنید تا آدرس کیف‌پول باز شود.</p><div className="mt-6 space-y-2">{wallets.map(([label, address]) => { const isOpen = openWallet === label; return <div key={label} className={`overflow-hidden rounded-2xl border transition ${isOpen ? "border-[#b78b6e] bg-[#463832]" : "border-white/10 bg-white/[.05] hover:border-white/25"}`}><button onClick={() => setOpenWallet(isOpen ? null : label)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right"><span className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d0a588]/15 text-[#e2b99d]"><Coins size={15} /></span><span className="text-sm font-medium">{label}</span></span><ChevronDown size={17} className={`text-[#cbb0a0] transition ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <div className="border-t border-white/10 px-4 pb-4 pt-3"><p dir="ltr" className="break-all rounded-xl bg-black/20 px-3 py-3 font-mono text-[11px] leading-5 text-[#f0ddd1]">{address}</p><Button onClick={() => copyAddress(label, address)} variant="outline" className="mt-3 h-9 rounded-xl border-white/15 bg-transparent text-xs text-[#f4ddd0] hover:bg-white/10 hover:text-white">{copied === label ? <Check size={14} className="ml-2" /> : <Copy size={14} className="ml-2" />}{copied === label ? "کپی شد" : "کپی آدرس"}</Button></div>}</div>; })}</div></section>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-6 text-[#a18e84]">لطفاً پیش از هر انتقال، نام شبکه و آدرس را با دقت بررسی کنید. FEZI AI در این مرحله هیچ تراکنش یا تأیید پرداختی را به‌صورت خودکار انجام نمی‌دهد.</p>
      </section>
    </main>
  );
}
