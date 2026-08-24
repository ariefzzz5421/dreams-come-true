"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { CATEGORY_LABELS } from "@/data/catalog";
import { displayRupiah, formatPercent } from "@/lib/format";
import type { DreamPriority } from "@/lib/types";

type SortKey = "closest" | "cheapest" | "expensive" | "category" | "priority" | "progress";

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: "closest", label: "Closest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "expensive", label: "Most expensive" },
  { id: "category", label: "Category" },
  { id: "priority", label: "Priority" },
  { id: "progress", label: "Dream progress" },
];

const PRIORITY_RANK: Record<DreamPriority, number> = { next: 0, high: 1, someday: 2 };

/** The portfolio table: every selected dream, sortable six ways. */
export function DreamPortfolio() {
  const { dreams, availableMoney, state } = useDreams();
  const [sort, setSort] = useState<SortKey>("closest");
  const hidden = state.preferences.hideNumbers;

  const sorted = useMemo(() => {
    const list = [...dreams];
    switch (sort) {
      case "cheapest":
        return list.sort((a, b) => a.target - b.target);
      case "expensive":
        return list.sort((a, b) => b.target - a.target);
      case "category":
        return list.sort((a, b) => a.item.category.localeCompare(b.item.category));
      case "priority":
        return list.sort(
          (a, b) => PRIORITY_RANK[a.selection.priority] - PRIORITY_RANK[b.selection.priority],
        );
      case "progress":
      case "closest":
      default:
        return list.sort((a, b) => b.progress.percent - a.progress.percent);
    }
  }, [dreams, sort]);

  if (dreams.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-white/15 p-10 text-center sm:p-14">
        <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
          What does your dream life look like?
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
          Pick your first dream and start measuring the distance between today and where you
          want to be.
        </p>
        <Link
          href="/dreams"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-gold-300 to-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:from-gold-200 hover:to-gold-400"
        >
          Explore Dreams
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-xs mb-2">
            Measured against {displayRupiah(availableMoney, hidden)}
          </p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Your Dream Portfolio
          </h2>
        </div>
      </div>

      <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
        {SORTS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSort(entry.id)}
            aria-pressed={sort === entry.id}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              sort === entry.id
                ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-white/[0.07]">
        {sorted.map((dream) => (
          <li key={dream.selection.id} className="flex items-center gap-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{dream.item.name}</p>
              <p className="mt-0.5 text-[11px] text-white/30">
                {CATEGORY_LABELS[dream.item.category]}
              </p>
            </div>

            <p className="tnum hidden w-32 shrink-0 text-right text-sm text-white/55 sm:block">
              {displayRupiah(dream.target, hidden)}
            </p>

            <div className="hidden w-28 shrink-0 md:block">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className={`h-full rounded-full ${
                    dream.progress.reached
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                      : "bg-gradient-to-r from-gold-600 to-gold-300"
                  }`}
                  style={{ width: `${dream.progress.clamped}%` }}
                />
              </div>
            </div>

            <div className="w-28 shrink-0 text-right">
              {dream.achieved ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} /> Reached
                </span>
              ) : (
                <span className="tnum text-sm font-semibold text-white/70">
                  {hidden ? "••%" : formatPercent(dream.progress.percent, 0)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/30">
        &ldquo;Reached&rdquo; means the target number is met. It is not a statement that you can
        afford it — this app knows nothing about your debts, taxes or emergency fund.
      </p>
    </div>
  );
}
