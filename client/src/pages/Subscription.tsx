import { useState } from "react";
import { Link } from "wouter";
import { Check, ChevronDown, Clipboard, Copy, LockKeyhole, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const wallets = [
  ["BNB", "binance", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["USDT BEP20", "tether", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["ETH", "ethereum", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["USDT ERC20", "tether", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["BTC", "bitcoin", "bc1qt9gu52gnez4gq86qfdzcvpd9rjx7kc4srmssmn"],
  ["SOL", "solana", "4hVx2LG5hygUPWxk1XNVeeqS9X8H7ngWpFyTEbfSAvSA"],
  ["TRX", "tron", "TWCLiDUumxSegdbY2Qq6n25PaoGuDedovp"],
  ["USDT TRC20", "tether", "TWCLiDUumxSegdbY2Qq6n25PaoGuDedovp"],
  ["TON", "ton", "UQD5B1s87qakuDlnkW3RyFkgUDhxjIxTD6SRK30yLUhnP8Cl"],
  ["Usdc Base", "usdcoin", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Usdc Eth", "usdcoin", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Usdc Sol", "usdcoin", "4hVx2LG5hygUPWxk1XNVeeqS9X8H7ngWpFyTEbfSAvSA"],
  ["Ada cardano", "cardano", "addr1qy4rgsjtfu2npgnurq2f8qszusyg9c2h4qsnusdp84f7zj8twteydfy047tv9a5djxkwd6j35yu96dxydhdcu05mefhs7v47nz"],
  ["Artibitrum", "arbitrum", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Base", "base", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Doge coin", "dogecoin", "DN16CWU5G55HfvLfMbBTqVfHdtWwcr1KLm"],
  ["Polygon", "polygon", "0x50e30db8199daa52A24d88e458B65D91DC721B48"],
  ["Vechain", "vechain", "0x14Cc495A76eCd89DC3a7a02B0Bf7260519da0282"],
  ["Xrp", "xrp", "rKgwz3TZUUd3RcjpgDFKJneBr686mtZ7nh"],
  ["Zcash", "zcash", "t1Tnv16LWZwMaSxnmJdgdpe8CChj5LyZrkP"],
  ["Bitcoin cash", "bitcoin-cash", "qr5357j8uertuhnd4xvty8fy5dz65sa4a5eyu44tzp"],
  ["Dash", "dash", "XhPinGvasdYXcE9yioVGxLvjvjNBRuAk8f"],
] as const;

const logo = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

type Wallet = (typeof wallets)[number];

export default function Subscription() {
  const [amount, setAmount] = useState("");
  const [openWallet, setOpenWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  async function copyAddress(label: string, address: string) {
    await navigator.clipboard.writeText(address);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function selectWallet(label: string) {
    setOpenWallet(openWallet === label ? null : label);
    setSubmitted(false);
  }

  function shareReceipt() {
    const text = `FEZI AI subscription${amount ? ` — ${amount} USDT` : ""}${selectedWallet ? ` — ${selectedWallet[0]}` : ""}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white"><Sparkles size={17} /></div>
            <div><p className="text-lg font-bold tracking-tight">FEZI AI</p><p className="text-[9px] font-medium tracking-[0.2em] text-black/45">THE INTELLIGENCE TEAM</p></div>
          </Link>
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-black/55 hover:bg-black hover:text-white">بازگشت به چت</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pt-20">
        <div className="max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-black/65"><LockKeyhole size={13} /> پرداخت امن با انتخاب شبکه</div><h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl">اشتراک FEZI AI<br /><span className="text-black/45">هوش بیشتر، یکجا</span></h1><p className="mt-5 max-w-2xl text-base leading-8 text-black/55 sm:text-lg">مبلغ را وارد کنید، شبکهٔ پرداخت را انتخاب کنید و آدرس کیف‌پول را دریافت کنید. پرداخت به‌صورت انتقال مستقیم رمزارزی انجام می‌شود.</p></div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,.06)] sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-6"><div><p className="text-xs font-bold tracking-[0.18em] text-black/45">STEP 01</p><h2 className="mt-2 text-2xl font-bold">مبلغ اشتراک</h2><p className="mt-2 text-sm text-black/50">مبلغ پرداخت را به USDT وارد کنید.</p></div><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white"><Clipboard size={19} /></div></div>
            <div className="mt-7"><label htmlFor="amount" className="mb-2 block text-sm font-semibold">مبلغ</label><div className="relative"><Input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="مثلاً 100" className="h-14 rounded-xl border-black/15 bg-white pl-20 text-lg shadow-none focus-visible:ring-black" /><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/45">USDT</span></div></div>
            <div className="mt-8 border-t border-black/10 pt-6"><div className="flex gap-3 text-sm leading-7 text-black/55"><Check className="mt-1 shrink-0 text-black" size={17} /><p>پس از انتقال، رسید یا TXID را در تلگرام برای تیم FEZI AI ارسال کنید تا اشتراک شما فعال شود.</p></div><button onClick={shareReceipt} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"><Send size={15} /> ارسال رسید در تلگرام</button></div>
            {submitted && <div className="mt-5 rounded-xl border border-black/15 bg-black/[.03] p-3 text-sm text-black/70">آدرس انتخاب شد. لطفاً مبلغ را منتقل کنید و رسید را در تلگرام ارسال کنید.</div>}
          </section>

          <section className="rounded-[28px] bg-black p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.18)] sm:p-7"><p className="text-xs font-bold tracking-[0.18em] text-white/45">STEP 02</p><h2 className="mt-2 text-2xl font-bold">انتخاب ارز و شبکه</h2><p className="mt-2 text-sm leading-7 text-white/55">برای دیدن آدرس، روی گزینهٔ موردنظر کلیک کنید.</p><div className="mt-6 space-y-2">{wallets.map((wallet) => { const [label, slug, address] = wallet; const isOpen = openWallet === label; return <div key={label} className={`overflow-hidden rounded-xl border transition ${isOpen ? "border-white bg-white/10" : "border-white/15 bg-white/[.03] hover:border-white/40"}`}><button onClick={() => selectWallet(label)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right"><span className="flex items-center gap-3"><img src={logo(slug)} alt={`${label} logo`} className="h-8 w-8 rounded-full bg-white p-1.5" /><span className="text-sm font-semibold">{label}</span></span><ChevronDown size={17} className={`text-white/55 transition ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <div className="border-t border-white/15 px-4 pb-4 pt-3"><p className="mb-2 text-xs text-white/50">آدرس پرداخت</p><p dir="ltr" className="break-all rounded-xl bg-black px-3 py-3 font-mono text-[11px] leading-5 text-white/85">{address}</p><div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => copyAddress(label, address)} variant="outline" className="h-9 rounded-lg border-white/25 bg-transparent text-xs text-white hover:bg-white hover:text-black">{copied === label ? <Check size={14} className="ml-2" /> : <Copy size={14} className="ml-2" />}{copied === label ? "کپی شد" : "کپی آدرس"}</Button><Button onClick={() => { setSelectedWallet(wallet); setSubmitted(true); }} className="h-9 rounded-lg bg-white text-xs text-black hover:bg-white/85">انتخاب برای پرداخت</Button></div></div>}</div>; })}</div></section>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-6 text-black/45">لطفاً پیش از انتقال، نام شبکه و آدرس را چند بار بررسی کنید. انتقال روی شبکهٔ اشتباه قابل برگشت نیست.</p>
      </section>
    </main>
  );
}
