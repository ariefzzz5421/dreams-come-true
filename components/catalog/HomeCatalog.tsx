"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, catalog } from "@/data/catalog";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DreamCard } from "./DreamCard";
import { BankingCard } from "./BankingCard";
import type { DreamCategory } from "@/lib/types";

/**
 * A trimmed catalog preview for the homepage: category tabs and the first eight
 * items. The full filter set lives on /dreams so the homepage stays readable.
 */
export function HomeCatalog() {
  const [category, setCategory] = useState<DreamCategory>("motorcycles");
  const items = catalog.filter((item) => item.category === category).slice(0, 8);

  return (
    <div>
      <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.filter((entry) => entry.id !== "custom").map((entry) => {
          const active = entry.id === category;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setCategory(entry.id)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              <CategoryIcon name={entry.icon} className="h-4 w-4" />
              {entry.label}
            </button>
          );
        })}
        <Link
          href="/dreams"
          className="flex shrink-0 items-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-2.5 text-sm font-medium text-white/50 transition hover:border-gold-400/40 hover:text-gold-100"
        >
          <CategoryIcon name="sparkles" className="h-4 w-4" />
          Custom dream
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) =>
          item.category === "banking" ? (
            <BankingCard key={item.id} item={item} />
          ) : (
            <DreamCard key={item.id} item={item} />
          ),
        )}
      </div>
    </div>
  );
}
