"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { BRANDS, CATEGORIES, PRICE_BANDS, catalog } from "@/data/catalog";
import { useDreams } from "@/components/providers/DreamProvider";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DreamCard } from "./DreamCard";
import { BankingCard } from "./BankingCard";
import { CustomDreamForm } from "@/components/dreams/CustomDreamForm";
import { calculateProgress } from "@/lib/progress";
import type { DreamCategory } from "@/lib/types";

type SortKey = "default" | "closest" | "cheapest" | "expensive";
type StatusKey = "all" | "unlocked" | "in-progress" | "selected";
type ProgressKey = "all" | "0-25" | "25-50" | "50-75" | "75-100" | "100";

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: "default", label: "Curated" },
  { id: "closest", label: "Closest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "expensive", label: "Most expensive" },
];

const STATUSES: Array<{ id: StatusKey; label: string }> = [
  { id: "all", label: "All" },
  { id: "unlocked", label: "Unlocked" },
  { id: "in-progress", label: "In progress" },
  { id: "selected", label: "In my dreams" },
];

const PROGRESS_BANDS: Array<{ id: ProgressKey; label: string; min: number; max: number }> = [
  { id: "all", label: "Any progress", min: -1, max: Number.POSITIVE_INFINITY },
  { id: "0-25", label: "0–25%", min: 0, max: 25 },
  { id: "25-50", label: "25–50%", min: 25, max: 50 },
  { id: "50-75", label: "50–75%", min: 50, max: 75 },
  { id: "75-100", label: "75–100%", min: 75, max: 100 },
  { id: "100", label: "Target reached", min: 100, max: Number.POSITIVE_INFINITY },
];

/**
 * The catalog with its full filter set. All filtering happens client-side over
 * the seeded arrays — there's no network call, so results update as you type.
 */
export function CatalogBrowser({
  initialCategory = "motorcycles",
}: {
  initialCategory?: DreamCategory;
}) {
  const { availableMoney, isSelected } = useDreams();

  const [category, setCategory] = useState<DreamCategory>(initialCategory);
  const [query, setQuery] = useState("");
  const [band, setBand] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [status, setStatus] = useState<StatusKey>("all");
  const [progressBand, setProgressBand] = useState<ProgressKey>("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    if (category === "custom") return [];

    const priceBand = PRICE_BANDS.find((entry) => entry.id === band);
    const progressRange = PROGRESS_BANDS.find((entry) => entry.id === progressBand);
    const needle = query.trim().toLowerCase();

    const items = catalog.filter((item) => {
      if (item.category !== category) return false;

      if (needle) {
        const haystack = `${item.name} ${item.brand ?? ""} ${item.description} ${item.variant ?? ""}`
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      if (priceBand && item.targetPrice >= priceBand.max) return false;
      if (priceBand && item.targetPrice < priceBand.min) return false;
      if (brand !== "all" && item.brand !== brand) return false;

      const percent = calculateProgress(availableMoney, item.targetPrice).percent;

      if (status === "unlocked" && percent < 100) return false;
      if (status === "in-progress" && percent >= 100) return false;
      if (status === "selected" && !isSelected(item.id)) return false;

      if (progressRange && progressBand !== "all") {
        if (percent < progressRange.min) return false;
        if (progressBand !== "100" && percent >= progressRange.max) return false;
      }

      return true;
    });

    switch (sort) {
      case "cheapest":
        return [...items].sort((a, b) => a.targetPrice - b.targetPrice);
      case "expensive":
        return [...items].sort((a, b) => b.targetPrice - a.targetPrice);
      case "closest":
        return [...items].sort(
          (a, b) =>
            calculateProgress(availableMoney, b.targetPrice).percent -
            calculateProgress(availableMoney, a.targetPrice).percent,
        );
      default:
        return items;
    }
  }, [category, query, band, brand, status, progressBand, sort, availableMoney, isSelected]);

  const brandsForCategory = useMemo(
    () =>
      BRANDS.filter((entry) =>
        catalog.some((item) => item.category === category && item.brand === entry),
      ),
    [category],
  );

  const activeFilterCount =
    (band !== "all" ? 1 : 0) +
    (brand !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (progressBand !== "all" ? 1 : 0) +
    (sort !== "default" ? 1 : 0);

  const resetFilters = () => {
    setBand("all");
    setBrand("all");
    setStatus("all");
    setProgressBand("all");
    setSort("default");
  };

  return (
    <div>
      {/* Category tabs — horizontally scrollable on mobile, per the spec. */}
      <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.map((entry) => {
          const active = entry.id === category;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setCategory(entry.id);
                setBrand("all");
              }}
              aria-pressed={active}
              className={`group flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
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
      </div>

      {category === "custom" ? (
        <CustomDreamForm />
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this category…"
                aria-label="Search dreams"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold-400/50"
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((previous) => !previous)}
              aria-expanded={filtersOpen}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                filtersOpen || activeFilterCount > 0
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-100"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="tnum rounded-full bg-gold-300 px-1.5 text-[11px] font-bold text-ink-950">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mb-6 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <FilterSelect
                    label="Price"
                    value={band}
                    onChange={setBand}
                    options={[
                      { value: "all", label: "Any price" },
                      ...PRICE_BANDS.map((entry) => ({ value: entry.id, label: entry.label })),
                    ]}
                  />
                  <FilterSelect
                    label="Brand"
                    value={brand}
                    onChange={setBrand}
                    disabled={brandsForCategory.length === 0}
                    options={[
                      { value: "all", label: brandsForCategory.length ? "All brands" : "No brands here" },
                      ...brandsForCategory.map((entry) => ({ value: entry, label: entry })),
                    ]}
                  />
                  <FilterSelect
                    label="Status"
                    value={status}
                    onChange={(value) => setStatus(value as StatusKey)}
                    options={STATUSES.map((entry) => ({ value: entry.id, label: entry.label }))}
                  />
                  <FilterSelect
                    label="Progress"
                    value={progressBand}
                    onChange={(value) => setProgressBand(value as ProgressKey)}
                    options={PROGRESS_BANDS.map((entry) => ({ value: entry.id, label: entry.label }))}
                  />

                  <div className="sm:col-span-2 lg:col-span-4">
                    <p className="label-xs mb-2">Sort by</p>
                    <div className="flex flex-wrap gap-2">
                      {SORTS.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setSort(entry.id)}
                          aria-pressed={sort === entry.id}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            sort === entry.id
                              ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                          }`}
                        >
                          {entry.label}
                        </button>
                      ))}
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/50 transition hover:text-white"
                        >
                          <X className="h-3 w-3" /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mb-4 text-xs text-white/35">
            {filtered.length} {filtered.length === 1 ? "dream" : "dreams"} in this view
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center">
              <p className="text-sm text-white/50">Nothing matches these filters.</p>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setQuery("");
                }}
                className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-gold-400/40 hover:text-gold-200"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) =>
                item.category === "banking" ? (
                  <BankingCard key={item.id} item={item} />
                ) : (
                  <DreamCard key={item.id} item={item} />
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="label-xs mb-2">{label}</p>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-full rounded-xl border border-white/10 bg-ink-850 px-3.5 py-2.5 text-sm text-white/80 outline-none transition focus:border-gold-400/50 disabled:opacity-40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-850">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
