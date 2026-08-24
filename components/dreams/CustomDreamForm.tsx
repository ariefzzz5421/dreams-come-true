"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useDreams } from "@/components/providers/DreamProvider";
import { MoneyInput, MoneyShortcuts } from "@/components/ui/MoneyInput";
import { CATEGORIES } from "@/data/catalog";
import type { DreamCategory, DreamPriority } from "@/lib/types";

const EXAMPLES = [
  { name: "Build my parents a house", amount: 750_000_000 },
  { name: "Start my own company", amount: 500_000_000 },
  { name: "Travel around Europe", amount: 100_000_000 },
];

const PRIORITIES: Array<{ value: DreamPriority; label: string }> = [
  { value: "next", label: "Next goal" },
  { value: "high", label: "High" },
  { value: "someday", label: "Someday" },
];

/** "+ Add My Own Dream" — the category that makes the catalog personal. */
export function CustomDreamForm() {
  const { addCustomDream } = useDreams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DreamCategory>("custom");
  const [targetPrice, setTargetPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState<DreamPriority>("high");
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const valid = name.trim().length > 0 && targetPrice > 0;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;

    addCustomDream(
      {
        name: name.trim(),
        category,
        targetPrice,
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      {
        priority,
        targetDate: targetDate || undefined,
        achieved: alreadyOwned,
        achievedAt: alreadyOwned ? new Date().toISOString().slice(0, 10) : undefined,
      },
    );

    setSaved(name.trim());
    setName("");
    setTargetPrice(0);
    setDescription("");
    setNotes("");
    setTargetDate("");
    setAlreadyOwned(false);
    setPriority("high");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={submit}
        className="rounded-4xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
      >
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gold-200">
            <Sparkles className="h-3 w-3" /> Add my own dream
          </div>
          <h3 className="font-display text-2xl font-semibold text-white">
            The one only you have
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            Not everything worth saving for is in a catalog.
          </p>
        </div>

        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="custom-name" className="label-xs mb-2 block">Dream name</label>
            <input
              id="custom-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Build my parents a house"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold-400/50"
            />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example.name}
                  type="button"
                  onClick={() => { setName(example.name); setTargetPrice(example.amount); }}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/45 transition hover:border-gold-400/35 hover:text-gold-200"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <label htmlFor="custom-category" className="label-xs mb-2 block">Category</label>
            <select
              id="custom-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as DreamCategory)}
              className="w-full rounded-2xl border border-white/10 bg-ink-850 px-4 py-3.5 text-sm text-white/85 outline-none focus:border-gold-400/50"
            >
              {CATEGORIES.map((entry) => (
                <option key={entry.id} value={entry.id} className="bg-ink-850">
                  {entry.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label htmlFor="custom-date" className="label-xs mb-2 block">Target date (optional)</label>
            <input
              id="custom-date"
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="w-full min-w-0 max-w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none focus:border-gold-400/50"
            />
          </div>

          <div className="min-w-0 sm:col-span-2">
            <MoneyInput
              label="Target price"
              value={targetPrice}
              onChange={setTargetPrice}
              placeholder="750.000.000"
            />
            <div className="mt-3">
              <MoneyShortcuts onPick={setTargetPrice} />
            </div>
          </div>

          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="custom-description" className="label-xs mb-2 block">
              Description (optional)
            </label>
            <input
              id="custom-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A three-bedroom house in Bandung for my parents."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold-400/50"
            />
          </div>

          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="custom-notes" className="label-xs mb-2 block">Notes (optional)</label>
            <textarea
              id="custom-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Anything you want to remember about this goal."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold-400/50"
            />
          </div>

          <div className="min-w-0">
            <p className="label-xs mb-2">Priority</p>
            <div className="flex gap-2">
              {PRIORITIES.map((entry) => (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => setPriority(entry.value)}
                  aria-pressed={priority === entry.value}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    priority === entry.value
                      ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 self-end">
            <input
              type="checkbox"
              checked={alreadyOwned}
              onChange={(event) => setAlreadyOwned(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 accent-gold-400"
            />
            <span className="text-sm text-white/60">I already achieved this</span>
          </label>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!valid}
            className="rounded-xl bg-gradient-to-r from-gold-300 to-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:from-gold-200 hover:to-gold-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add my dream
          </button>
          {saved && (
            <p className="text-sm text-emerald-300">
              &ldquo;{saved}&rdquo; added to My Dreams.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
