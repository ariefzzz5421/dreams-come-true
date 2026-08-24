"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown, ChevronUp, Download, ExternalLink, Pencil, Trash2, Trophy,
} from "lucide-react";
import { useDreams, type ResolvedDream } from "@/components/providers/DreamProvider";
import { PriceTypeBadge } from "@/components/ui/Badge";
import { BrandMark } from "@/components/ui/BrandMark";
import { DreamVisual } from "@/components/ui/DreamVisual";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { displayRupiah, formatDateID } from "@/lib/format";
import {
  BUDGET_STYLE_LABELS, DEPARTURE_CITIES, estimateTravelBudget,
} from "@/lib/progress";
import type { BudgetStyle, DreamPriority } from "@/lib/types";

const PRIORITY_LABELS: Record<DreamPriority, string> = {
  next: "Next goal",
  high: "High",
  someday: "Someday",
};

const PRIORITY_STYLES: Record<DreamPriority, string> = {
  next: "border-gold-300/50 bg-gold-400/15 text-gold-100",
  high: "border-white/20 bg-white/[0.06] text-white/70",
  someday: "border-white/12 bg-white/[0.03] text-white/45",
};

/**
 * One dream on the user's board. Everything adjustable about a dream lives here:
 * priority, ordering, target override, travel shape, party size, achieved state
 * and the PNG export.
 */
export function DreamBoardCard({
  dream,
  onExport,
  isFirst,
  isLast,
}: {
  dream: ResolvedDream;
  onExport: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { state, updateDream, removeDream, reorderDream, setAchieved } = useDreams();
  const [editing, setEditing] = useState(false);
  const hidden = state.preferences.hideNumbers;
  const { item, selection, target, progress } = dream;
  const achieved = dream.achieved;

  const travelBreakdown =
    item.travel && selection.travelConfig
      ? estimateTravelBudget(item.travel, selection.travelConfig)
      : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-3xl border transition-colors ${
        achieved
          ? "border-emerald-400/30 bg-emerald-400/[0.04]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        <div className="w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
          <DreamVisual item={item} aspect="aspect-[16/10] sm:aspect-square" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${PRIORITY_STYLES[selection.priority]}`}
            >
              {PRIORITY_LABELS[selection.priority]}
            </span>
            {item.brand && <BrandMark logo={item.logo} label={item.brand} />}
            <PriceTypeBadge type={selection.customTarget ? "user-defined" : item.priceType} />
            {achieved && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                <Trophy className="h-3 w-3" /> Unlocked
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold leading-snug text-white">
                {item.name}
              </h3>
              {item.variant && <p className="mt-0.5 text-xs text-white/35">{item.variant}</p>}
            </div>

            {/* Simple keyboard-friendly reordering — no drag library needed. */}
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => reorderDream(selection.id, -1)}
                disabled={isFirst}
                aria-label="Move up"
                className="rounded-md border border-white/10 p-1 text-white/40 transition hover:text-white disabled:opacity-20"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => reorderDream(selection.id, 1)}
                disabled={isLast}
                aria-label="Move down"
                className="rounded-md border border-white/10 p-1 text-white/40 transition hover:text-white disabled:opacity-20"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="label-xs mb-1">Target</p>
              <p className="tnum font-display text-lg font-semibold text-white xl:text-xl">
                {displayRupiah(target, hidden)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="label-xs mb-1">{achieved ? "Achieved" : "Still needed"}</p>
              <p
                className={`tnum font-display text-lg font-semibold xl:text-xl ${
                  achieved ? "text-emerald-300" : "text-white/60"
                }`}
              >
                {achieved
                  ? formatDateID(selection.achievedAt) || "Target reached"
                  : displayRupiah(progress.remaining, hidden)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar progress={progress} hidden={hidden} />
          </div>

          {selection.targetDate && (
            <p className="mt-3 text-xs text-white/35">
              Target date: {formatDateID(selection.targetDate)}
            </p>
          )}
          {selection.notes && (
            <p className="mt-2 text-xs leading-relaxed text-white/40">{selection.notes}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              {(Object.keys(PRIORITY_LABELS) as DreamPriority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => updateDream(selection.id, { priority })}
                  aria-pressed={selection.priority === priority}
                  className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${
                    selection.priority === priority
                      ? "bg-gold-400/15 text-gold-100"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {PRIORITY_LABELS[priority]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setEditing((previous) => !previous)}
              aria-expanded={editing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium text-white/55 transition hover:text-white"
            >
              <Pencil className="h-3 w-3" /> Adjust
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-[11px] font-medium text-gold-100 transition hover:border-gold-300/50"
            >
              <Download className="h-3 w-3" /> Download card
            </button>

            <button
              type="button"
              onClick={() => setAchieved(selection.id, !selection.achieved)}
              aria-pressed={selection.achieved}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition ${
                selection.achieved
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 text-white/55 hover:text-white"
              }`}
            >
              <Trophy className="h-3 w-3" />
              {selection.achieved ? "Achieved" : "I achieved this"}
            </button>

            {item.officialSource && (
              <a
                href={item.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-medium text-white/45 transition hover:text-gold-200"
              >
                <ExternalLink className="h-3 w-3" /> Source
              </a>
            )}

            <button
              type="button"
              onClick={() => removeDream(selection.itemId)}
              aria-label={`Remove ${item.name}`}
              className="ml-auto rounded-lg p-1.5 text-white/25 transition hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="border-t border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <div>
              <MoneyInput
                label="Custom target (overrides everything below)"
                value={selection.customTarget ?? 0}
                onChange={(value) =>
                  updateDream(selection.id, { customTarget: value > 0 ? value : undefined })
                }
                hint={
                  selection.customTarget
                    ? "Your own number is in use."
                    : `Leave empty to use ${displayRupiah(item.targetPrice, hidden)}.`
                }
              />
            </div>

            <div>
              <label htmlFor={`date-${selection.id}`} className="label-xs mb-2 block">
                Target date
              </label>
              <input
                id={`date-${selection.id}`}
                type="date"
                value={selection.targetDate ?? ""}
                onChange={(event) =>
                  updateDream(selection.id, { targetDate: event.target.value || undefined })
                }
                className="w-full min-w-0 max-w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none focus:border-gold-400/50"
              />
            </div>

            {item.experience && (
              <div className="sm:col-span-2">
                <p className="label-xs mb-2">How many people?</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 4, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateDream(selection.id, { quantity: count })}
                      aria-pressed={(selection.quantity ?? 1) === count}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                        (selection.quantity ?? 1) === count
                          ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                          : "border-white/10 text-white/50 hover:text-white"
                      }`}
                    >
                      {count === 1 ? "For 1 person" : count === 6 ? "For family (6)" : `For ${count} people`}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/35">
                  {displayRupiah(item.experience.pricePerPerson, hidden)} per person, estimated
                  · {item.experience.venue}
                </p>
              </div>
            )}

            {item.travel && selection.travelConfig && (
              <div className="sm:col-span-2">
                <p className="label-xs mb-3">Shape the trip</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label htmlFor={`city-${selection.id}`} className="mb-1.5 block text-[11px] text-white/40">
                      Departure city
                    </label>
                    <select
                      id={`city-${selection.id}`}
                      value={selection.travelConfig.departureCity}
                      onChange={(event) =>
                        updateDream(selection.id, {
                          travelConfig: {
                            ...selection.travelConfig!,
                            departureCity: event.target.value,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-gold-400/50"
                    >
                      {DEPARTURE_CITIES.map((city) => (
                        <option key={city.id} value={city.id} className="bg-ink-850">
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`people-${selection.id}`} className="mb-1.5 block text-[11px] text-white/40">
                      People
                    </label>
                    <input
                      id={`people-${selection.id}`}
                      type="number"
                      min={1}
                      max={12}
                      inputMode="numeric"
                      value={selection.travelConfig.people}
                      onChange={(event) =>
                        updateDream(selection.id, {
                          travelConfig: {
                            ...selection.travelConfig!,
                            people: Math.max(1, Math.min(12, Number(event.target.value) || 1)),
                          },
                        })
                      }
                      className="tnum w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-gold-400/50"
                    />
                  </div>

                  <div>
                    <label htmlFor={`days-${selection.id}`} className="mb-1.5 block text-[11px] text-white/40">
                      Days
                    </label>
                    <input
                      id={`days-${selection.id}`}
                      type="number"
                      min={1}
                      max={60}
                      inputMode="numeric"
                      value={selection.travelConfig.days}
                      onChange={(event) =>
                        updateDream(selection.id, {
                          travelConfig: {
                            ...selection.travelConfig!,
                            days: Math.max(1, Math.min(60, Number(event.target.value) || 1)),
                          },
                        })
                      }
                      className="tnum w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-gold-400/50"
                    />
                  </div>

                  <div>
                    <label htmlFor={`style-${selection.id}`} className="mb-1.5 block text-[11px] text-white/40">
                      Budget style
                    </label>
                    <select
                      id={`style-${selection.id}`}
                      value={selection.travelConfig.style}
                      onChange={(event) =>
                        updateDream(selection.id, {
                          travelConfig: {
                            ...selection.travelConfig!,
                            style: event.target.value as BudgetStyle,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-gold-400/50"
                    >
                      {(Object.keys(BUDGET_STYLE_LABELS) as BudgetStyle[]).map((style) => (
                        <option key={style} value={style} className="bg-ink-850">
                          {BUDGET_STYLE_LABELS[style]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {travelBreakdown && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="label-xs mb-3">Estimated budget breakdown</p>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
                      {([
                        ["Flights", travelBreakdown.flights],
                        ["Accommodation", travelBreakdown.accommodation],
                        ["Food", travelBreakdown.food],
                        ["Local transport", travelBreakdown.localTransport],
                        ["Attractions", travelBreakdown.attractions],
                        ["Buffer (10%)", travelBreakdown.buffer],
                      ] as const).map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-2">
                          <dt className="text-white/40">{label}</dt>
                          <dd className="tnum text-white/70">{displayRupiah(value, hidden)}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-amber-200/50">
                      Estimated budget — not a quoted price.
                      {item.travel.visaNote ? ` ${item.travel.visaNote}` : ""}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
              <label htmlFor={`notes-${selection.id}`} className="label-xs mb-2 block">Notes</label>
              <textarea
                id={`notes-${selection.id}`}
                rows={2}
                value={selection.notes ?? ""}
                onChange={(event) =>
                  updateDream(selection.id, { notes: event.target.value || undefined })
                }
                placeholder="Why this one matters."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-gold-400/50"
              />
            </div>
          </div>

          <p className="mt-4 text-[11px] text-white/30">
            {item.location} · price last reviewed {formatDateID(item.lastUpdated)}
          </p>
        </div>
      )}
    </motion.article>
  );
}
