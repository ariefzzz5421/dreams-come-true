"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { displayRupiah } from "@/lib/format";
import type { AssetCategory } from "@/lib/types";

const ASSET_CATEGORIES: Array<{ value: AssetCategory; label: string }> = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "car", label: "Car" },
  { value: "watch", label: "Watch" },
  { value: "property", label: "House / property" },
  { value: "electronics", label: "Smartphone / laptop" },
  { value: "investment", label: "Investment" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

const EMPTY_DRAFT = {
  name: "",
  category: "other" as AssetCategory,
  purchasePrice: 0,
  currentValue: 0,
  includeInNetWorth: false,
};

/**
 * Owned assets.
 *
 * The `includeInNetWorth` toggle defaults to *off* on purpose. A motorcycle is
 * not cash, and quietly folding it into the number a progress bar reads from
 * would be exactly the misleading calculation this app is meant to avoid.
 */
export function AssetsManager() {
  const { state, addAsset, updateAsset, removeAsset, assetsTotal, includedAssetsTotal } = useDreams();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const hidden = state.preferences.hideNumbers;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || draft.currentValue <= 0) return;
    addAsset({ ...draft, name: draft.name.trim() });
    setDraft(EMPTY_DRAFT);
    setOpen(false);
  };

  return (
    <div className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="label-xs mb-2">Optional</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            What you already own
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/45">
            Add the things you own so your net worth is complete. Each one is excluded from
            progress calculations until you say otherwise.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-2.5 text-sm font-medium text-gold-100 transition hover:border-gold-300/50"
        >
          <Plus className="h-4 w-4" /> Add asset
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={submit}
            className="overflow-hidden"
          >
            <div className="mb-6 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
              <div>
                <label htmlFor="asset-name" className="label-xs mb-2 block">Asset name</label>
                <input
                  id="asset-name"
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="Honda Vario 160"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold-400/50"
                />
              </div>

              <div>
                <label htmlFor="asset-category" className="label-xs mb-2 block">Category</label>
                <select
                  id="asset-category"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value as AssetCategory })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-ink-850 px-4 py-3.5 text-sm text-white/85 outline-none focus:border-gold-400/50"
                >
                  {ASSET_CATEGORIES.map((entry) => (
                    <option key={entry.value} value={entry.value} className="bg-ink-850">
                      {entry.label}
                    </option>
                  ))}
                </select>
              </div>

              <MoneyInput
                label="Purchase price (optional)"
                value={draft.purchasePrice}
                onChange={(value) => setDraft({ ...draft, purchasePrice: value })}
              />
              <MoneyInput
                label="Current estimated value"
                value={draft.currentValue}
                onChange={(value) => setDraft({ ...draft, currentValue: value })}
              />

              <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.includeInNetWorth}
                  onChange={(event) =>
                    setDraft({ ...draft, includeInNetWorth: event.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 accent-gold-400"
                />
                <span className="text-sm text-white/65">
                  Include in net worth
                  <span className="mt-0.5 block text-xs text-white/35">
                    Only tick this if you would genuinely count it toward your wealth.
                  </span>
                </span>
              </label>

              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={!draft.name.trim() || draft.currentValue <= 0}
                  className="rounded-xl bg-gold-400/20 px-5 py-2.5 text-sm font-medium text-gold-100 ring-1 ring-inset ring-gold-400/40 transition hover:bg-gold-400/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save asset
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setDraft(EMPTY_DRAFT); }}
                  className="rounded-xl px-5 py-2.5 text-sm text-white/50 transition hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {state.assets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/12 p-8 text-center">
          <p className="text-sm text-white/40">
            No assets added yet. This section is entirely optional.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-2.5">
            {state.assets.map((asset) => (
              <li
                key={asset.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{asset.name}</p>
                  <p className="mt-0.5 text-xs capitalize text-white/35">
                    {ASSET_CATEGORIES.find((entry) => entry.value === asset.category)?.label}
                    {asset.purchasePrice
                      ? ` · bought at ${displayRupiah(asset.purchasePrice, hidden)}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="tnum text-sm font-semibold text-white">
                    {displayRupiah(asset.currentValue, hidden)}
                  </p>

                  <label className="flex cursor-pointer items-center gap-2 text-xs text-white/45">
                    <input
                      type="checkbox"
                      checked={asset.includeInNetWorth}
                      onChange={(event) =>
                        updateAsset(asset.id, { includeInNetWorth: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/10 accent-gold-400"
                    />
                    <span className="hidden sm:inline">Count</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeAsset(asset.id)}
                    aria-label={`Remove ${asset.name}`}
                    className="text-white/25 transition hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center text-white/45">
              Counted toward net worth
              <Tooltip
                label="How assets are counted"
                text="Only assets you ticked are added to your net worth. Nothing here is ever added to your cash progress."
              />
            </span>
            <span className="tnum font-semibold text-white">
              {displayRupiah(includedAssetsTotal, hidden)}
              <span className="ml-2 text-xs font-normal text-white/35">
                of {displayRupiah(assetsTotal, hidden)} total
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
