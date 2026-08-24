"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { displayRupiah, formatMonthsAsDuration } from "@/lib/format";
import { projectSavings } from "@/lib/progress";

/**
 * "When can I reach it?"
 *
 * Plain arithmetic by default. The optional return rate compounds monthly and is
 * labelled as a projection, because nobody should read a 7% line as a promise.
 */
export function SavingsSimulator() {
  const { availableMoney, dreams, state, setPreference } = useDreams();
  const hidden = state.preferences.hideNumbers;

  const [target, setTarget] = useState(() => {
    // Default to the nearest dream still out of reach — the most useful case.
    const pending = [...dreams]
      .filter((dream) => !dream.progress.reached)
      .sort((a, b) => a.target - b.target)[0];
    return pending?.target ?? 500_000_000;
  });

  const monthly = state.preferences.monthlyContribution;
  const useReturn = state.preferences.annualReturnEnabled;
  const rate = state.preferences.annualReturnRate;

  const projection = useMemo(
    () => projectSavings(availableMoney, monthly, target, useReturn ? rate : 0),
    [availableMoney, monthly, target, useReturn, rate],
  );

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-6">
        <p className="label-xs mb-2">Optional</p>
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          When can I reach it?
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/45">
          A rough timeline from what you have now and what you can add each month.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="label-xs mb-1.5">Current money</p>
          <p className="tnum font-display text-xl font-semibold text-white">
            {displayRupiah(availableMoney, hidden)}
          </p>
          <p className="mt-1 text-[11px] text-white/30">
            From your {state.preferences.calculationMode === "cash" ? "liquid money" : "net worth"}.
          </p>
        </div>

        <MoneyInput
          label="Monthly contribution"
          value={monthly}
          onChange={(value) => setPreference("monthlyContribution", value)}
          hidden={hidden}
          placeholder="10.000.000"
        />

        <MoneyInput
          label="Target"
          value={target}
          onChange={setTarget}
          hidden={hidden}
          placeholder="500.000.000"
        />
      </div>

      {dreams.length > 0 && (
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {[...dreams]
            .sort((a, b) => a.target - b.target)
            .slice(0, 8)
            .map((dream) => (
              <button
                key={dream.selection.id}
                type="button"
                onClick={() => setTarget(dream.target)}
                className="shrink-0 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/55 transition hover:border-gold-400/40 hover:text-gold-100"
              >
                {dream.item.name}
              </button>
            ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={useReturn}
            onChange={(event) => setPreference("annualReturnEnabled", event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/10 accent-gold-400"
          />
          <span className="text-sm text-white/60">Include estimated annual return</span>
        </label>

        {useReturn && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={40}
              step={0.5}
              inputMode="decimal"
              value={rate}
              onChange={(event) =>
                setPreference("annualReturnRate", Math.max(0, Math.min(40, Number(event.target.value) || 0)))
              }
              className="tnum w-20 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold-400/50"
            />
            <span className="text-sm text-white/45">% per year</span>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-gold-400/20 bg-gold-400/[0.05] p-5 sm:p-6">
        {projection.alreadyThere ? (
          <p className="font-display text-xl font-semibold text-emerald-300">
            You are already at this target.
          </p>
        ) : projection.months === null ? (
          <p className="text-sm text-white/55">
            Add a monthly contribution to see a timeline.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="label-xs mb-1.5">Remaining</p>
              <p className="tnum font-display text-xl font-semibold text-white">
                {displayRupiah(projection.remaining, hidden)}
              </p>
            </div>
            <div>
              <p className="label-xs mb-1.5">Approximate months</p>
              <p className="tnum font-display text-xl font-semibold text-white">
                {projection.months} months
              </p>
            </div>
            <div>
              <p className="label-xs mb-1.5">That is about</p>
              <p className="font-display text-xl font-semibold text-gold-100">
                {formatMonthsAsDuration(projection.months)}
              </p>
            </div>
          </div>
        )}

        <p className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/35">
          <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {useReturn
            ? `A projection using ${rate}% compounded monthly. Returns are not guaranteed and real results will differ.`
            : "A projection with no investment return applied. It ignores inflation and price changes."}
        </p>
      </div>
    </div>
  );
}
