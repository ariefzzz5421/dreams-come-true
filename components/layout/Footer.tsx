import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 text-[13px] font-bold text-ink-950">
                D
              </span>
              <span className="font-display text-base font-semibold text-white">
                Dreams Come True
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
              A goal visualisation tool, not financial advice. Reaching a target here means
              the number is met — it says nothing about your emergency fund, debts, taxes or
              other obligations.
            </p>
            <p className="mt-4 text-xs text-white/35">
              Your financial information stays on your device. Nothing is uploaded, and there
              is no account to create.
            </p>
          </div>

          <div>
            <p className="label-xs mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="/dreams" className="transition hover:text-gold-200">Dream Catalog</Link></li>
              <li><Link href="/my-dreams" className="transition hover:text-gold-200">My Dreams</Link></li>
              <li><Link href="/journey" className="transition hover:text-gold-200">My Journey</Link></li>
              <li><Link href="/milestones" className="transition hover:text-gold-200">Wealth Milestones</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-xs mb-4">Data</p>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="/about" className="transition hover:text-gold-200">How prices are sourced</Link></li>
              <li><Link href="/about#philosophy" className="transition hover:text-gold-200">Product philosophy</Link></li>
              <li><Link href="/about#privacy" className="transition hover:text-gold-200">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Prices in Indonesian Rupiah (IDR). Catalog last reviewed 24 August 2026.</p>
          <p>Dreams Come True</p>
        </div>
      </div>
    </footer>
  );
}
