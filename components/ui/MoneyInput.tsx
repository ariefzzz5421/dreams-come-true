"use client";

import { useEffect, useId, useState } from "react";
import { formatNumberID, parseRupiah } from "@/lib/format";

/**
 * Rupiah input.
 *
 * The field shows a thousand-separated string while the parent only ever receives
 * a raw integer — the two are kept in sync by re-formatting on every keystroke.
 * `inputMode="numeric"` gets the numeric keypad on mobile, which matters a lot
 * here since almost every input in the app is money.
 */
export function MoneyInput({
  value,
  onChange,
  label,
  placeholder = "0",
  hint,
  hidden = false,
  className = "",
  id: providedId,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  hidden?: boolean;
  className?: string;
  id?: string;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [text, setText] = useState(() => (value ? formatNumberID(value) : ""));

  // Keep the visible text in step when the value changes from outside (shortcut
  // chips, reset, hydration) without fighting the user mid-typing.
  useEffect(() => {
    const parsedCurrent = parseRupiah(text);
    if (parsedCurrent !== value) {
      setText(value ? formatNumberID(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label-xs mb-2 block">
          {label}
        </label>
      )}
      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/40">
          Rp
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={hidden ? text.replace(/\d/g, "•") : text}
          placeholder={placeholder}
          onChange={(event) => {
            const raw = parseRupiah(event.target.value);
            setText(raw ? formatNumberID(raw) : "");
            onChange(raw);
          }}
          className="tnum w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-right text-lg font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-gold-400/50 focus:bg-white/[0.07]"
        />
      </div>
      {hint && <p className="mt-2 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

/** The shortcut chips that sit under the main money field. */
export const MONEY_SHORTCUTS: Array<{ label: string; value: number }> = [
  { label: "Rp10 jt", value: 10_000_000 },
  { label: "Rp50 jt", value: 50_000_000 },
  { label: "Rp100 jt", value: 100_000_000 },
  { label: "Rp250 jt", value: 250_000_000 },
  { label: "Rp500 jt", value: 500_000_000 },
  { label: "Rp1 M", value: 1_000_000_000 },
  { label: "Rp5 M", value: 5_000_000_000 },
];

export function MoneyShortcuts({ onPick }: { onPick: (value: number) => void }) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {MONEY_SHORTCUTS.map((shortcut) => (
        <button
          key={shortcut.label}
          type="button"
          onClick={() => onPick(shortcut.value)}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:border-gold-400/40 hover:bg-gold-400/10 hover:text-gold-100"
        >
          {shortcut.label}
        </button>
      ))}
    </div>
  );
}
