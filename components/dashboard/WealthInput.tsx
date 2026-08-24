"use client";

import { Banknote, Bitcoin, Landmark, Lock, TrendingUp, Wallet } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { MoneyInput, MoneyShortcuts } from "@/components/ui/MoneyInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { displayRupiah } from "@/lib/format";
import type { LiquidMoney } from "@/lib/types";

const BUCKETS: Array<{ key: keyof LiquidMoney; label: string; icon: typeof Wallet }> = [
  { key: "cash", label: "Cash", icon: Wallet },
  { key: "bank", label: "Bank balance", icon: Landmark },
  { key: "investments", label: "Investments", icon: TrendingUp },
  { key: "crypto", label: "Crypto", icon: Bitcoin },
  { key: "other", label: "Other liquid assets", icon: Banknote },
];

/**
 * "Where are you today?" — the single input that makes the whole app work.
 *
 * Two modes: one total, or five buckets. Whichever is active is the only figure
 * used for cash progress; owned assets are kept strictly separate downstream.
 */
export function WealthInput() {
  const {
    state, setLiquid, setSimpleTotal, setPreference,
    liquidTotal, includedAssetsTotal, netWorth,
  } = useDreams();

  const hidden = state.preferences.hideNumbers;
  const simple = state.preferences.simpleMoneyInput;

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="label-xs mb-2">Step one</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Where are you today?
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/45">
            Enter the money you could actually reach if you needed to. This is the number
            every dream is measured against.
          </p>
        </div>

        <div className="inline-flex shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setPreference("simpleMoneyInput", true)}
            aria-pressed={simple}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              simple ? "bg-gold-400/15 text-gold-100" : "text-white/50 hover:text-white"
            }`}
          >
            Single total
          </button>
          <button
            type="button"
            onClick={() => setPreference("simpleMoneyInput", false)}
            aria-pressed={!simple}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              !simple ? "bg-gold-400/15 text-gold-100" : "text-white/50 hover:text-white"
            }`}
          >
            Break it down
          </button>
        </div>
      </div>

      {simple ? (
        <div className="max-w-lg">
          <MoneyInput
            label="Total money I currently have"
            value={state.simpleTotal}
            onChange={setSimpleTotal}
            hidden={hidden}
            placeholder="150.000.000"
          />
          <div className="mt-3">
            <MoneyShortcuts onPick={setSimpleTotal} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUCKETS.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <div key={bucket.key}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-white/35" />
                  <span className="label-xs mb-0">{bucket.label}</span>
                </div>
                <MoneyInput
                  value={state.liquid[bucket.key]}
                  onChange={(value) => setLiquid({ [bucket.key]: value })}
                  hidden={hidden}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* The three-number split that stops net worth being mistaken for cash. */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Liquid money" value={displayRupiah(liquidTotal, hidden)} accent />
        <SummaryTile label="Owned assets (counted)" value={displayRupiah(includedAssetsTotal, hidden)} />
        <SummaryTile
          label="Estimated net worth"
          value={displayRupiah(netWorth, hidden)}
          note="Liquid + assets you chose to include"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <span className="label-xs mb-0">Measure progress against</span>
          <Tooltip
            label="Why cash progress is the default"
            text="Cash progress uses only money you can actually spend. Net worth adds the assets you chose to include — but owning Rp1 miliar of property doesn't mean you have Rp1 miliar available to buy a car. Cash is the honest default."
          />
        </div>

        <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setPreference("calculationMode", "cash")}
            aria-pressed={state.preferences.calculationMode === "cash"}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
              state.preferences.calculationMode === "cash"
                ? "bg-gold-400/15 text-gold-100"
                : "text-white/50 hover:text-white"
            }`}
          >
            Cash progress
          </button>
          <button
            type="button"
            onClick={() => setPreference("calculationMode", "networth")}
            aria-pressed={state.preferences.calculationMode === "networth"}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
              state.preferences.calculationMode === "networth"
                ? "bg-gold-400/15 text-gold-100"
                : "text-white/50 hover:text-white"
            }`}
          >
            Net worth progress
          </button>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-white/35">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Your financial information stays on your device. It is saved to this browser only —
        never uploaded, and there is no account to create.
      </p>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note?: string;
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
      {note && <p className="mt-1 text-[11px] text-white/35">{note}</p>}
    </div>
  );
}
