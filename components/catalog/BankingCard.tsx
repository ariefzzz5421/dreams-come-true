"use client";

import { motion } from "framer-motion";
import { Check, Circle, ExternalLink, Heart } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { PriceTypeBadge, TierBadge } from "@/components/ui/Badge";
import { BrandMark } from "@/components/ui/BrandMark";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { displayRupiah, formatDateID } from "@/lib/format";
import { calculateProgress } from "@/lib/progress";
import type { CatalogItem } from "@/lib/types";

/**
 * Banking milestones get their own card.
 *
 * A priority-banking tier is not a price tag: reaching the portfolio number is
 * necessary but usually not sufficient. So the portfolio figure drives the
 * progress bar, and every other condition — CASA, average-balance history,
 * invitation — is listed as its own unticked line that only the user can
 * confirm. Collapsing all of that into a single percentage would be misleading.
 */
export function BankingCard({ item }: { item: CatalogItem }) {
  const { availableMoney, isSelected, toggleDream, state } = useDreams();
  const selected = isSelected(item.id);
  const hidden = state.preferences.hideNumbers;

  const portfolioRequirement = item.requirements?.find((requirement) => requirement.measurable);
  const targetAmount = portfolioRequirement?.amount ?? item.targetPrice;
  const progress = calculateProgress(availableMoney, targetAmount);
  const otherRequirements = item.requirements?.filter((requirement) => !requirement.measurable) ?? [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col overflow-hidden rounded-3xl border transition-colors duration-300 ${
        selected
          ? "border-gold-400/40 bg-gold-400/[0.045]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20"
      }`}
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <BrandMark logo={item.logo} label={item.brand} />
            <TierBadge tier={item.tier} />
          </div>
          <button
            type="button"
            onClick={() => toggleDream(item.id)}
            aria-pressed={selected}
            aria-label={selected ? `Remove ${item.name}` : `Add ${item.name} to my dreams`}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              selected
                ? "border-gold-300/60 bg-gold-400/25 text-gold-100"
                : "border-white/15 bg-white/[0.04] text-white/50 hover:border-gold-300/50 hover:text-gold-200"
            }`}
          >
            <Heart className={`h-4 w-4 ${selected ? "fill-current" : ""}`} />
          </button>
        </div>

        <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-white">
          {item.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/45">{item.description}</p>

        {/* Label above value, stacked. A nine-figure Rupiah number needs the full
            inner width of the card — it cannot share a row with its own label. */}
        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div>
            <p className="label-xs mb-1">Target portfolio</p>
            <p className="tnum font-display text-lg font-semibold leading-tight text-white">
              {displayRupiah(targetAmount, hidden)}
            </p>
          </div>
          <div className="border-t border-white/[0.07] pt-3">
            <p className="label-xs mb-1">Your portfolio</p>
            <p className="tnum font-display text-lg font-semibold leading-tight text-gold-100">
              {displayRupiah(availableMoney, hidden)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar progress={progress} hidden={hidden} />
          {!progress.reached && (
            <p className="tnum mt-2 text-xs text-white/45">
              {displayRupiah(progress.remaining, hidden)} to go
            </p>
          )}
        </div>

        {item.requirements && item.requirements.length > 0 && (
          <div className="mt-5">
            <p className="label-xs mb-3">All requirements</p>
            <ul className="space-y-2.5">
              {/* The measurable one is ticked automatically… */}
              {portfolioRequirement && (
                <RequirementRow
                  met={progress.reached}
                  label={portfolioRequirement.label}
                  detail={portfolioRequirement.detail}
                />
              )}
              {/* …everything else stays open, because only the bank can confirm it. */}
              {otherRequirements.map((requirement) => (
                <RequirementRow
                  key={requirement.label}
                  met={false}
                  label={requirement.label}
                  detail={requirement.detail}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <PriceTypeBadge type={item.priceType} />
          <span className="text-[11px] text-white/30">
            Last verified {formatDateID(item.lastUpdated)}
          </span>
        </div>
        {item.priceNote && (
          <p className="mt-2 text-[11px] leading-relaxed text-amber-200/50">{item.priceNote}</p>
        )}

        <div className="mt-5 flex flex-1 items-end gap-2">
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
          <a
            href={item.officialSource}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Official source for ${item.name}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 ring-1 ring-inset ring-white/10 transition hover:text-gold-200"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function RequirementRow({
  met,
  label,
  detail,
}: {
  met: boolean;
  label: string;
  detail: string;
}) {
  return (
    <li className="flex gap-2.5">
      {met ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={3} />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
      )}
      <div>
        <p className={`text-sm ${met ? "text-emerald-200/90" : "text-white/65"}`}>{label}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-white/35">{detail}</p>
      </div>
    </li>
  );
}
