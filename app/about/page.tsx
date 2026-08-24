import type { Metadata } from "next";
import Link from "next/link";
import { PRICE_TYPE_LABELS } from "@/data/catalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResetPanel } from "@/components/dashboard/ResetPanel";

export const metadata: Metadata = {
  title: "About — Dreams Come True",
  description: "How prices are sourced, what the numbers mean, and where your data lives.",
};

const PRICE_TYPE_NOTES: Record<keyof typeof PRICE_TYPE_LABELS, string> = {
  official: "Published by the brand, bank or manufacturer itself.",
  "starting-price": "The lowest trim or variant. Higher trims and other provinces cost more.",
  "authorized-dealer": "Quoted by an authorised dealer rather than the brand's own price list.",
  estimated: "Researched approximation. Always editable, and never presented as a quote.",
  "user-defined": "Your own number. The app makes no claim about it at all.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <SectionHeading
        eyebrow="About"
        title="How this works"
        description="Dreams Come True is a goal visualisation tool. It is not financial advice, and it is careful about what it claims to know."
      />

      <div className="space-y-10 text-sm leading-relaxed text-white/55">
        <section id="prices">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">
            Where the prices come from
          </h2>
          <p>
            Every item in the catalog carries the source it was researched from, the region
            the price applies to, and the date it was last checked. Nothing is invented
            silently: where a current, verifiable price could not be established, the item is
            labelled an estimate and left editable.
          </p>
          <ul className="mt-5 space-y-3">
            {(Object.keys(PRICE_TYPE_NOTES) as Array<keyof typeof PRICE_TYPE_LABELS>).map((type) => (
              <li key={type} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-200">
                  {PRICE_TYPE_LABELS[type]}
                </p>
                <p className="mt-1.5 text-sm text-white/50">{PRICE_TYPE_NOTES[type]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5">
            Vehicle prices are OTR (on-the-road) figures for a stated region. OTR bundles
            registration and tax, both set per province, so a Jakarta price is never presented
            as a national one. Travel budgets are built from a transparent cost model with a
            10% buffer, not a booking quote. Property targets are explicitly user-defined,
            because there is no such thing as a national house price. Banking requirements
            change, and reaching a portfolio figure does not by itself qualify you — most
            priority tiers also require CASA balances, a multi-month average, and an
            invitation from the bank.
          </p>
        </section>

        <section id="images">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">
            Why there are no product photos
          </h2>
          <p>
            Manufacturer product photography and brand logos are copyrighted, and most
            official sites do not permit hotlinking their assets. Rather than fall back on
            low-quality copies from unknown hosts, each card renders a neutral generated
            visual and links straight to the official source, where the real imagery lives.
          </p>
        </section>

        <section id="philosophy">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">
            Target reached is not the same as affordable
          </h2>
          <p>
            When your money meets a target, this app says{" "}
            <span className="text-gold-200">Dream unlocked</span> — never &ldquo;you can afford
            this.&rdquo; It cannot see your emergency fund, your debts, your tax position or
            anyone who depends on you. Cash progress is the default calculation mode for the
            same reason: owning Rp1 miliar of property does not mean you have Rp1 miliar
            available to spend.
          </p>
          <p className="mt-4">
            A Rp5 juta goal is treated exactly as seriously as a Rp5 miliar one. The point is
            the distance you have covered, not the size of the number.
          </p>
        </section>

        <section id="privacy">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Your data</h2>
          <p>
            Everything you enter is stored in this browser&apos;s local storage and nowhere
            else. There is no account, no server, and nothing is uploaded. Clearing your
            browser data will clear your dreams too, and opening the site on another device
            starts fresh.
          </p>
        </section>

        <ResetPanel />

        <p className="border-t border-white/10 pt-8 text-xs text-white/35">
          Catalog last reviewed 24 August 2026. Prices change constantly — always confirm with
          the official source before making a decision.{" "}
          <Link href="/dreams" className="text-gold-200 underline-offset-4 hover:underline">
            Back to the catalog →
          </Link>
        </p>
      </div>
    </div>
  );
}
