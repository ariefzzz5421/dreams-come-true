"use client";

import Link from "next/link";
import { useDreams } from "@/components/providers/DreamProvider";
import { WealthInput } from "./WealthInput";
import { AssetsManager } from "./AssetsManager";
import { SavingsSimulator } from "./SavingsSimulator";
import { DreamPortfolio } from "./DreamPortfolio";
import { DreamLadder } from "@/components/dreams/DreamLadder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tooltip } from "@/components/ui/Tooltip";
import { displayRupiah } from "@/lib/format";

/**
 * "Your Journey" — the overall financial dashboard.
 *
 * Deliberately shows liquid, assets and net worth as three separate figures. One
 * combined number would be the single most misleading thing this app could do.
 */
export function JourneyDashboard() {
  const {
    liquidTotal, includedAssetsTotal, netWorth, dreams, unlockedCount, state, hydrated,
  } = useDreams();

  const hidden = state.preferences.hideNumbers;

  const pending = [...dreams].filter((dream) => !dream.achieved);
  const nextDream = [...pending].sort((a, b) => b.progress.percent - a.progress.percent)[0];
  const closest = [...pending].sort((a, b) => a.progress.remaining - b.progress.remaining)[0];
  const largest = [...dreams].sort((a, b) => b.target - a.target)[0];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <SectionHeading
        eyebrow="Your journey"
        title="Where you are today"
        description="Liquid money, what you own, and the distance to everything you picked — kept deliberately separate."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label="Liquid money" value={displayRupiah(liquidTotal, hidden)} accent />
        <StatTile label="Owned assets (counted)" value={displayRupiah(includedAssetsTotal, hidden)} />
        <StatTile
          label="Estimated net worth"
          value={displayRupiah(netWorth, hidden)}
          tooltip="Liquid money plus only the assets you ticked. It is not the same as money you can spend."
        />
        <StatTile label="Dreams selected" value={hydrated ? String(dreams.length) : "—"} />
        <StatTile label="Dreams unlocked" value={hydrated ? String(unlockedCount) : "—"} />
        <StatTile
          label="Calculation mode"
          value={state.preferences.calculationMode === "cash" ? "Cash progress" : "Net worth progress"}
        />
      </div>

      {hydrated && dreams.length > 0 && (
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <HighlightTile
            label="Next dream"
            name={nextDream?.item.name ?? "All targets reached"}
            detail={nextDream ? `${Math.round(nextDream.progress.percent)}% of the way there` : undefined}
          />
          <HighlightTile
            label="Closest major goal"
            name={closest?.item.name ?? "Nothing outstanding"}
            detail={closest ? `${displayRupiah(closest.progress.remaining, hidden)} to go` : undefined}
          />
          <HighlightTile
            label="Largest dream"
            name={largest?.item.name ?? "—"}
            detail={largest ? displayRupiah(largest.target, hidden) : undefined}
          />
        </div>
      )}

      <div className="space-y-8">
        <WealthInput />
        <AssetsManager />
        <DreamPortfolio />
        {hydrated && dreams.length > 0 && <DreamLadder />}
        <SavingsSimulator />
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm leading-relaxed text-white/45 sm:p-8">
        <p>
          Dreams Come True is a goal visualisation tool, not financial advice. Hitting a
          target here means the number is met — it says nothing about your emergency fund,
          your debts, taxes or anything else this app cannot see.{" "}
          <Link href="/about" className="text-gold-200 underline-offset-4 hover:underline">
            More on how this works →
          </Link>
        </p>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent = false,
  tooltip,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tooltip?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-gold-400/25 bg-gold-400/[0.06]" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="mb-2 flex items-center">
        <p className="label-xs mb-0">{label}</p>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <p
        className={`tnum font-display text-2xl font-semibold ${
          accent ? "text-gold-100" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function HighlightTile({
  label,
  name,
  detail,
}: {
  label: string;
  name: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5">
      <p className="label-xs mb-2">{label}</p>
      <p className="font-display text-lg font-semibold leading-snug text-white">{name}</p>
      {detail && <p className="tnum mt-1 text-xs text-white/40">{detail}</p>}
    </div>
  );
}
