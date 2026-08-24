"use client";

import { Info } from "lucide-react";
import { useState } from "react";

/**
 * Tiny inline explainer. Opens on hover *and* on tap, because the most important
 * tooltip in this app (cash vs net worth) has to be reachable on a phone.
 */
export function Tooltip({ text, label }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label ?? "More information"}
        onClick={() => setOpen((previous) => !previous)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-white/35 transition hover:text-gold-200"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-white/12 bg-ink-850 p-3 text-xs leading-relaxed text-white/75 shadow-lift"
        >
          {text}
        </span>
      )}
    </span>
  );
}
