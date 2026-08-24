"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ExternalLink, Heart } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { PriceTypeBadge, TierBadge } from "@/components/ui/Badge";
import { BrandMark } from "@/components/ui/BrandMark";
import { DreamVisual } from "@/components/ui/DreamVisual";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { displayRupiah, formatDateID } from "@/lib/format";
import { calculateProgress } from "@/lib/progress";
import type { CatalogItem } from "@/lib/types";

/**
 * A single catalog card. Shows the researched price with its provenance, the
 * user's live progress toward it, and a one-tap add/remove control.
 */
export function DreamCard({ item }: { item: CatalogItem }) {
  const { availableMoney, isSelected, toggleDream, state } = useDreams();
  const selected = isSelected(item.id);
  const hidden = state.preferences.hideNumbers;
  const progress = calculateProgress(availableMoney, item.targetPrice);
  const hasMoney = availableMoney > 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-colors duration-300 ${
        selected
          ? "border-gold-400/40 bg-gold-400/[0.045]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20"
      }`}
    >
      <div className="relative">
        <DreamVisual item={item} />
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          <TierBadge tier={item.tier} />
        </div>
        <button
          type="button"
          onClick={() => toggleDream(item.id)}
          aria-pressed={selected}
          aria-label={selected ? `Remove ${item.name} from my dreams` : `Add ${item.name} to my dreams`}
          className={`absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
            selected
              ? "border-gold-300/60 bg-gold-400/25 text-gold-100"
              : "border-white/15 bg-ink-950/50 text-white/60 hover:border-gold-300/50 hover:text-gold-200"
          }`}
        >
          <Heart className={`h-4 w-4 ${selected ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {item.brand && <BrandMark logo={item.logo} label={item.brand} />}
          <PriceTypeBadge type={item.priceType} />
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-white">{item.name}</h3>
        {item.variant && <p className="mt-0.5 text-xs text-white/40">{item.variant}</p>}

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/45">
          {item.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="label-xs mb-1">Target</p>
            <p className="tnum font-display text-2xl font-semibold text-white">
              {displayRupiah(item.targetPrice, hidden)}
            </p>
          </div>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-white/35">
          {item.location} · updated {formatDateID(item.lastUpdated)}
        </p>
        {item.priceNote && (
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/50">{item.priceNote}</p>
        )}

        <div className="mt-4 flex-1" />

        {hasMoney ? (
          <div className="mb-4">
            <ProgressBar progress={progress} size="sm" hidden={hidden} />
          </div>
        ) : (
          <p className="mb-4 text-xs text-white/30">
            Enter your money to see how close you are.
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleDream(item.id)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              selected
                ? "bg-gold-400/15 text-gold-100 ring-1 ring-inset ring-gold-400/40"
                : "bg-white/[0.06] text-white/80 ring-1 ring-inset ring-white/10 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            {selected ? (
              <><Check className="h-4 w-4" /> Dream Added</>
            ) : (
              <><Heart className="h-4 w-4" /> Add to My Dreams</>
            )}
          </button>

          {item.officialSource && (
            <a
              href={item.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              title="Official source"
              aria-label={`Official source for ${item.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 ring-1 ring-inset ring-white/10 transition hover:text-gold-200"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {selected && (
        <Link
          href="/my-dreams"
          className="border-t border-gold-400/20 bg-gold-400/[0.06] px-5 py-2.5 text-center text-xs font-medium text-gold-100/80 transition hover:bg-gold-400/10"
        >
          Open in My Dreams →
        </Link>
      )}
    </motion.article>
  );
}
