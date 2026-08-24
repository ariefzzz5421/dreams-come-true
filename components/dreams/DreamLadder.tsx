"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { displayCompactRupiah, displayRupiah, formatPercent } from "@/lib/format";

/**
 * The Dream Ladder — the app's signature visualisation.
 *
 * Every selected dream is stacked cheapest to most expensive with the user's
 * current money drawn as a line across it. Everything below the line is already
 * within reach; everything above is the climb still ahead.
 */
export function DreamLadder() {
  const { dreams, availableMoney, state } = useDreams();
  const hidden = state.preferences.hideNumbers;

  if (dreams.length === 0) return null;

  const ordered = [...dreams].sort((a, b) => a.target - b.target);
  const reachedCount = ordered.filter((dream) => dream.progress.reached).length;
  // The rung the money line sits just above.
  const lineIndex = reachedCount;

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs mb-2">Cheapest to most expensive</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Dream Ladder
          </h2>
        </div>
        <div className="text-right">
          <p className="label-xs mb-1">Within reach</p>
          <p className="tnum font-display text-2xl font-semibold text-gold-200">
            {reachedCount}
            <span className="text-base font-normal text-white/35"> of {ordered.length}</span>
          </p>
        </div>
      </div>

      <ol className="relative">
        {/* The rail every rung hangs from. */}
        <div className="absolute bottom-4 left-[7px] top-4 w-px bg-gradient-to-b from-emerald-400/40 via-gold-400/25 to-white/8" />

        {ordered.map((dream, index) => {
          const reached = dream.progress.reached;
          return (
            <li key={dream.selection.id}>
              {index === lineIndex && lineIndex > 0 && (
                <MoneyLine amount={availableMoney} hidden={hidden} />
              )}

              {/* Staggered on mount rather than on scroll: the ladder is often
                  rendered inside a sticky column that never crosses a viewport
                  boundary, so a scroll trigger would leave rungs invisible. */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
                className="relative flex items-center gap-4 py-3 pl-8"
              >
                <span
                  className={`absolute left-0 top-1/2 flex h-3.5 w-3.5 -translate-y-1/2 items-center justify-center rounded-full ring-4 ring-ink-950 ${
                    reached ? "bg-emerald-400" : "bg-white/20"
                  }`}
                >
                  {reached && <Check className="h-2 w-2 text-ink-950" strokeWidth={4} />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className={`truncate text-sm font-medium ${
                        reached ? "text-white" : "text-white/60"
                      }`}
                    >
                      {dream.item.name}
                    </p>
                    <p
                      className={`tnum shrink-0 text-sm font-semibold ${
                        reached ? "text-emerald-300" : "text-white/70"
                      }`}
                    >
                      {displayCompactRupiah(dream.target, hidden)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full ${
                          reached
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                            : "bg-gradient-to-r from-gold-600 to-gold-300"
                        }`}
                        style={{ width: `${dream.progress.clamped}%` }}
                      />
                    </div>
                    <span
                      className={`tnum w-14 shrink-0 text-right text-[11px] ${
                        reached ? "text-emerald-300/80" : "text-white/35"
                      }`}
                    >
                      {hidden ? "••%" : formatPercent(dream.progress.percent, 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}

        {/* If nothing is reached yet the line belongs at the very bottom. */}
        {lineIndex === 0 && <MoneyLine amount={availableMoney} hidden={hidden} atStart />}
        {lineIndex === ordered.length && ordered.length > 0 && (
          <MoneyLine amount={availableMoney} hidden={hidden} />
        )}
      </ol>
    </div>
  );
}

function MoneyLine({
  amount,
  hidden,
  atStart = false,
}: {
  amount: number;
  hidden: boolean;
  atStart?: boolean;
}) {
  return (
    <div className={`relative flex items-center gap-3 ${atStart ? "pt-2" : "py-3"} pl-8`}>
      <div className="h-px flex-1 bg-gradient-to-r from-gold-400/70 via-gold-400/30 to-transparent" />
      <span className="tnum shrink-0 rounded-full border border-gold-400/35 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold text-gold-100">
        You are here · {displayRupiah(amount, hidden)}
      </span>
    </div>
  );
}
