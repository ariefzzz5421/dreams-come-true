"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useDreams, type ResolvedDream } from "@/components/providers/DreamProvider";
import { DreamBoardCard } from "./DreamBoardCard";
import { DreamCardExport } from "./DreamCardExport";
import { DreamLadder } from "./DreamLadder";
import { Confetti } from "@/components/ui/Confetti";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { displayRupiah } from "@/lib/format";
import type { DreamPriority } from "@/lib/types";

const GROUPS: Array<{ id: DreamPriority; label: string; blurb: string }> = [
  { id: "next", label: "Next Goal", blurb: "The one you are actively working toward" },
  { id: "high", label: "High", blurb: "Coming up after that" },
  { id: "someday", label: "Someday", blurb: "Still on the list, no rush" },
];

/**
 * The dream board. Groups selections by priority, keeps the ladder alongside,
 * and fires the celebration exactly once per newly unlocked dream.
 */
export function MyDreamsBoard() {
  const { dreams, availableMoney, unlockedCount, state, hydrated } = useDreams();
  const [exporting, setExporting] = useState<ResolvedDream | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [seenUnlocked, setSeenUnlocked] = useState<number | null>(null);

  const hidden = state.preferences.hideNumbers;

  // Celebrate only when the unlocked count *rises* after hydration, so a reload
  // with existing achievements doesn't re-trigger confetti.
  useEffect(() => {
    if (!hydrated) return;
    if (seenUnlocked === null) {
      setSeenUnlocked(unlockedCount);
      return;
    }
    if (unlockedCount > seenUnlocked) {
      setCelebrate(true);
      const timer = window.setTimeout(() => setCelebrate(false), 3400);
      setSeenUnlocked(unlockedCount);
      return () => window.clearTimeout(timer);
    }
    if (unlockedCount < seenUnlocked) setSeenUnlocked(unlockedCount);
  }, [unlockedCount, hydrated, seenUnlocked]);

  const totalTarget = dreams.reduce((sum, dream) => sum + dream.target, 0);

  if (hydrated && dreams.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          What does your dream life look like?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/45 sm:text-base">
          Pick your first dream and start measuring the distance between today and where you
          want to be.
        </p>
        <Link
          href="/dreams"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-gold-300 to-gold-500 px-7 py-4 text-sm font-semibold text-ink-950 transition hover:from-gold-200 hover:to-gold-400"
        >
          Explore Dreams
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <Confetti active={celebrate} />

      <SectionHeading
        eyebrow={`${dreams.length} ${dreams.length === 1 ? "dream" : "dreams"} · ${unlockedCount} unlocked`}
        title="My Dreams"
        description="Reorder with the arrows, adjust any target, and download a card for the ones worth sharing."
        action={
          <Link
            href="/dreams"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-100"
          >
            Add more →
          </Link>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Measured against" value={displayRupiah(availableMoney, hidden)} accent />
        <SummaryTile label="Total of all targets" value={displayRupiah(totalTarget, hidden)} />
        <SummaryTile
          label="Unlocked"
          value={`${unlockedCount} of ${dreams.length}`}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const inGroup = dreams.filter((dream) => dream.selection.priority === group.id);
            if (inGroup.length === 0) return null;

            return (
              <section key={group.id}>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="font-display text-lg font-semibold text-white">{group.label}</h2>
                  <span className="text-xs text-white/30">{group.blurb}</span>
                </div>
                <div className="space-y-4">
                  {inGroup.map((dream, index) => (
                    <DreamBoardCard
                      key={dream.selection.id}
                      dream={dream}
                      onExport={() => setExporting(dream)}
                      isFirst={index === 0}
                      isLast={index === inGroup.length - 1}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DreamLadder />
        </aside>
      </div>

      <AnimatePresence>
        {exporting && (
          <DreamCardExport dream={exporting} onClose={() => setExporting(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "border-gold-400/25 bg-gold-400/[0.06]" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <p className="label-xs mb-1.5">{label}</p>
      <p className={`tnum font-display text-xl font-semibold ${accent ? "text-gold-100" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
