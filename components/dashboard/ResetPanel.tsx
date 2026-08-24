"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";

/** Destructive action, so it asks once before wiping local storage. */
export function ResetPanel() {
  const { resetAll } = useDreams();
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <h2 className="mb-2 font-display text-lg font-semibold text-white">Start over</h2>
      <p className="text-sm text-white/45">
        Clears your money, assets, dreams and preferences from this browser. This cannot be
        undone.
      </p>

      {confirming ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4" /> Erase everything?
          </span>
          <button
            type="button"
            onClick={() => {
              resetAll();
              setConfirming(false);
            }}
            className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/15"
          >
            Yes, erase
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-xl px-4 py-2 text-sm text-white/50 transition hover:text-white"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-red-400/40 hover:text-red-200"
        >
          Reset all my data
        </button>
      )}
    </section>
  );
}
