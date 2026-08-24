import type { CatalogItem, DreamCategory } from "@/lib/types";
import { motorcycles } from "./motorcycles";
import { cars } from "./cars";
import { watches } from "./watches";
import { travel } from "./travel";
import { food } from "./food";
import { banking } from "./banking";
import { property } from "./property";

export { motorcycles, cars, watches, travel, food, banking, property };

/** Every catalog item, in a stable order. */
export const catalog: CatalogItem[] = [
  ...motorcycles,
  ...cars,
  ...watches,
  ...travel,
  ...food,
  ...banking,
  ...property,
];

const byId = new Map(catalog.map((item) => [item.id, item]));

export function getCatalogItem(id: string): CatalogItem | undefined {
  return byId.get(id);
}

export interface CategoryMeta {
  id: DreamCategory;
  label: string;
  blurb: string;
  /** lucide-react icon name, resolved in `components/ui/CategoryIcon.tsx`. */
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "motorcycles", label: "Motorcycles", blurb: "From first ride to first superbike", icon: "bike" },
  { id: "cars", label: "Cars", blurb: "The clearest wealth ladder there is", icon: "car" },
  { id: "watches", label: "Luxury Watches", blurb: "Mechanical things that hold their value", icon: "watch" },
  { id: "travel", label: "Travel", blurb: "Budgets you can shape yourself", icon: "plane" },
  { id: "food", label: "Food & Experiences", blurb: "Evenings worth saving for", icon: "utensils" },
  { id: "banking", label: "Banking & Wealth", blurb: "Financial status milestones", icon: "landmark" },
  { id: "property", label: "Property", blurb: "Editable targets, not fake market prices", icon: "home" },
  { id: "custom", label: "Custom Dream", blurb: "The one only you have", icon: "sparkles" },
];

export const CATEGORY_LABELS: Record<DreamCategory, string> = CATEGORIES.reduce(
  (acc, category) => ({ ...acc, [category.id]: category.label }),
  {} as Record<DreamCategory, string>,
);

/** All distinct brands present in the catalog, for the brand filter. */
export const BRANDS: string[] = Array.from(
  new Set(catalog.map((item) => item.brand).filter((brand): brand is string => Boolean(brand))),
).sort((a, b) => a.localeCompare(b));

export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BANDS: PriceBand[] = [
  { id: "u10", label: "Under Rp10 jt", min: 0, max: 10_000_000 },
  { id: "10-50", label: "Rp10 jt – 50 jt", min: 10_000_000, max: 50_000_000 },
  { id: "50-100", label: "Rp50 jt – 100 jt", min: 50_000_000, max: 100_000_000 },
  { id: "100-500", label: "Rp100 jt – 500 jt", min: 100_000_000, max: 500_000_000 },
  { id: "500-1b", label: "Rp500 jt – 1 M", min: 500_000_000, max: 1_000_000_000 },
  { id: "1b-5b", label: "Rp1 M – 5 M", min: 1_000_000_000, max: 5_000_000_000 },
  { id: "5b+", label: "Rp5 M+", min: 5_000_000_000, max: Number.POSITIVE_INFINITY },
];

export const PRICE_TYPE_LABELS: Record<CatalogItem["priceType"], string> = {
  official: "Official",
  "starting-price": "Starting price",
  "authorized-dealer": "Authorised dealer",
  estimated: "Estimated",
  "user-defined": "User-defined",
};

export const TIER_LABELS: Record<NonNullable<CatalogItem["tier"]>, string> = {
  entry: "Entry",
  aspirational: "Aspirational",
  premium: "Premium",
  luxury: "Luxury",
  dream: "Dream",
};
