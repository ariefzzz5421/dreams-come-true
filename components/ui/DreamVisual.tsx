import { CategoryIcon } from "./CategoryIcon";
import type { CatalogItem } from "@/lib/types";

/**
 * The visual on every dream card.
 *
 * Manufacturer product photography is copyrighted and most official sites don't
 * permit hotlinking, so when `item.image` is absent (which is the default for the
 * seeded catalog) this renders a generated, high-quality placeholder instead of
 * pulling a low-quality third-party copy: a deterministic gradient derived from
 * the item's id, a soft light sweep, and the category glyph. The official source
 * link is always kept on the card so the real imagery is one click away.
 */

const CATEGORY_ICONS: Record<CatalogItem["category"], string> = {
  motorcycles: "bike",
  cars: "car",
  watches: "watch",
  travel: "plane",
  food: "utensils",
  banking: "landmark",
  property: "home",
  custom: "sparkles",
};

/** Stable hash so a given item always gets the same gradient. */
function hash(input: string): number {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }
  return value;
}

const PALETTES: Array<[string, string]> = [
  ["#1a2440", "#0b0f18"],
  ["#2a1f34", "#0d0b14"],
  ["#12302c", "#080f0e"],
  ["#33261a", "#140f0a"],
  ["#1d2a3c", "#0a0e16"],
  ["#2c2436", "#100c16"],
  ["#1c3038", "#090f12"],
];

export function DreamVisual({
  item,
  className = "",
  aspect = "aspect-[16/10]",
  large = false,
}: {
  item: Pick<CatalogItem, "id" | "category" | "name" | "image">;
  className?: string;
  aspect?: string;
  large?: boolean;
}) {
  const [from, to] = PALETTES[hash(item.id) % PALETTES.length];
  const angle = 120 + (hash(item.name) % 90);

  if (item.image) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${aspect} ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_-10%,rgba(216,171,82,0.20),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.07)_48%,transparent_58%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <CategoryIcon
          name={CATEGORY_ICONS[item.category]}
          className={`${large ? "h-16 w-16" : "h-9 w-9"} text-white/[0.16]`}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
