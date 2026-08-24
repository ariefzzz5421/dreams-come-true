"use client";

import { Check } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { displayCompactRupiah, displayRupiah, formatPercent } from "@/lib/format";
import { milestonePositions, milestoneProgress } from "@/lib/progress";

/**
 * The generic wealth ladder — Rp1 juta through Rp100 miliar.
 *
 * Deliberately starts at Rp1 juta so someone with a small balance still sees
 * cleared milestones. The point is momentum, not a leaderboard.
 */
export function WealthMilestones() {
  const { availableMoney, state } = useDreams();
  const hidden = state.preferences.hideNumbers;

  const positions = milestonePositions(availableMoney);
  const { next, percent } = milestoneProgress(availableMoney);
  const cleared = positions.filter((position) => position.passed).length;

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs mb-2">Your wealth journey</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Wealth Milestones
          </h2>
          <p className="mt-2 text-sm text-white/45">
            {cleared} of {positions.length} cleared.
          </p>
        </div>

        <div className="text-right">
          <p className="label-xs mb-1">Current</p>
          <p className="tnum font-display text-2xl font-semibold text-gold-200">
            {displayRupiah(availableMoney, hidden)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {positions.map((position) => (
          <div
            key={position.amount}
            className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 transition ${
              position.passed
                ? "border-emerald-400/25 bg-emerald-400/[0.06]"
                : position.isNext
                  ? "border-gold-400/45 bg-gold-400/[0.08]"
                  : "border-white/8 bg-white/[0.015]"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                position.passed
                  ? "bg-emerald-400 text-ink-950"
                  : position.isNext
                    ? "bg-gold-300 text-ink-950"
                    : "border border-white/15 text-white/25"
              }`}
            >
              {position.passed ? <Check className="h-3 w-3" strokeWidth={3.5} /> : position.isNext ? "→" : "○"}
            </span>
            <span
              className={`tnum text-sm font-medium ${
                position.passed
                  ? "text-emerald-200/85"
                  : position.isNext
                    ? "text-gold-100"
                    : "text-white/30"
              }`}
            >
              {displayCompactRupiah(position.amount, hidden)}
            </span>
          </div>
        ))}
      </div>

      {next !== null ? (
        <div className="mt-7 border-t border-white/10 pt-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-white/50">
              Next milestone ·{" "}
              <span className="tnum font-semibold text-gold-200">
                {displayCompactRupiah(next, hidden)}
              </span>
            </p>
            <p className="tnum text-sm font-semibold text-gold-200">
              {hidden ? "••%" : formatPercent(percent)} complete
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-[width] duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-white/35">
            {displayRupiah(Math.max(0, next - availableMoney), hidden)} to go.
          </p>
        </div>
      ) : (
        <p className="mt-7 border-t border-white/10 pt-6 text-sm text-emerald-300">
          Every milestone on this ladder is cleared.
        </p>
      )}
    </div>
  );
}
