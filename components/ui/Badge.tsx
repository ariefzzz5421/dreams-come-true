import { PRICE_TYPE_LABELS, TIER_LABELS } from "@/data/catalog";
import type { CatalogItem } from "@/lib/types";

/**
 * Price-provenance badge. Every card carries one, so a researched OTR price and
 * an editable estimate are never visually interchangeable.
 */
const PRICE_TYPE_STYLES: Record<CatalogItem["priceType"], string> = {
  official: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  "starting-price": "border-sky-400/30 bg-sky-400/10 text-sky-200",
  "authorized-dealer": "border-violet-400/30 bg-violet-400/10 text-violet-200",
  estimated: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  "user-defined": "border-white/20 bg-white/[0.06] text-white/70",
};

export function PriceTypeBadge({ type }: { type: CatalogItem["priceType"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${PRICE_TYPE_STYLES[type]}`}
    >
      {PRICE_TYPE_LABELS[type]}
    </span>
  );
}

const TIER_STYLES: Record<NonNullable<CatalogItem["tier"]>, string> = {
  entry: "border-white/15 bg-white/[0.05] text-white/60",
  aspirational: "border-gold-400/25 bg-gold-400/[0.08] text-gold-200/90",
  premium: "border-gold-400/40 bg-gold-400/[0.12] text-gold-200",
  luxury: "border-gold-300/55 bg-gold-300/[0.16] text-gold-100",
  dream: "border-gold-200/70 bg-gradient-to-r from-gold-400/25 to-gold-200/10 text-gold-50",
};

export function TierBadge({ tier }: { tier?: CatalogItem["tier"] }) {
  if (!tier) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${TIER_STYLES[tier]}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
