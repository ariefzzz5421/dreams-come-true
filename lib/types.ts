/**
 * Core domain types for Dreams Come True.
 *
 * Everything the catalog and the user's own data flows through here. The shapes
 * are intentionally storage-agnostic so the LocalStorage repository in
 * `lib/storage.ts` can be swapped for Supabase/PostgreSQL later without touching
 * the UI layer.
 */

export type DreamCategory =
  | "motorcycles"
  | "cars"
  | "watches"
  | "travel"
  | "food"
  | "banking"
  | "property"
  | "custom";

/**
 * How much trust a price deserves. Rendered as a visible badge on every card so
 * a researched OTR price is never confused with an editable estimate.
 */
export type PriceType =
  | "official"
  | "starting-price"
  | "authorized-dealer"
  | "estimated"
  | "user-defined";

export type PriceTier = "entry" | "aspirational" | "premium" | "luxury" | "dream";

export interface BankingRequirement {
  /** Short label, e.g. "Minimum portfolio (AUM)". */
  label: string;
  /** The condition itself, e.g. "Rp1.000.000.000 in savings, deposits & investments". */
  detail: string;
  /**
   * When true this requirement is measured against the user's money and can be
   * ticked automatically. When false it is a qualitative condition (invitation,
   * average balance history) that only the user can confirm.
   */
  measurable: boolean;
  /** Amount in IDR for measurable requirements. */
  amount?: number;
}

/** A single researched or estimated dream in the catalog. */
export interface CatalogItem {
  id: string;
  name: string;
  brand?: string;
  category: DreamCategory;
  /** Target amount in IDR. Always a raw number — never a formatted string. */
  targetPrice: number;
  priceType: PriceType;
  currency: "IDR";
  /** Optional remote image. Undefined means the branded placeholder is used. */
  image?: string;
  /** Inline brand mark key resolved by `components/ui/BrandMark.tsx`. */
  logo?: string;
  officialSource: string;
  /** Human label for where the price applies, e.g. "OTR Jakarta". */
  location: string;
  /** ISO date (YYYY-MM-DD) the price was last checked. */
  lastUpdated: string;
  description: string;
  tier?: PriceTier;
  variant?: string;
  /** Banking milestones only: the full eligibility picture, not just one number. */
  requirements?: BankingRequirement[];
  /** Travel only: the cost breakdown that produced `targetPrice`. */
  travel?: TravelBlueprint;
  /** Food & experiences only. */
  experience?: ExperienceMeta;
  /** Free-form caveat shown under the price. */
  priceNote?: string;
}

export type BudgetStyle = "budget" | "comfortable" | "premium" | "luxury";

export interface TravelCostLine {
  flights: number;
  accommodation: number;
  food: number;
  localTransport: number;
  attractions: number;
}

export interface TravelBlueprint {
  destination: string;
  /** Per-person, per-trip flight cost from Jakarta at "comfortable" style. */
  baseFlight: number;
  /** Per-person, per-night at "comfortable" style. */
  baseAccommodationPerNight: number;
  /** Per-person, per-day at "comfortable" style. */
  baseFoodPerDay: number;
  baseLocalTransportPerDay: number;
  baseAttractionsPerDay: number;
  defaultDays: number;
  visaNote?: string;
}

export interface TravelConfig {
  departureCity: string;
  people: number;
  days: number;
  style: BudgetStyle;
}

export interface ExperienceMeta {
  venue: string;
  city: string;
  pricePerPerson: number;
  defaultPeople: number;
}

/** Priority buckets used to order the user's dream board. */
export type DreamPriority = "next" | "high" | "someday";

/** A catalog item (or custom creation) the user has added to their board. */
export interface SelectedDream {
  id: string;
  /** Catalog id, or `custom:<uuid>` for user-created dreams. */
  itemId: string;
  priority: DreamPriority;
  /** User override of the catalog target price, in IDR. */
  customTarget?: number;
  /** Travel dreams: the user's chosen trip shape. */
  travelConfig?: TravelConfig;
  /** Food dreams: number of people. */
  quantity?: number;
  achieved: boolean;
  /** ISO date the user marked it achieved. */
  achievedAt?: string;
  /** ISO date (YYYY-MM-DD) the user is aiming for. */
  targetDate?: string;
  notes?: string;
  addedAt: string;
  /** Board ordering within the whole list. Lower comes first. */
  order: number;
}

/** A dream the user invented themselves. Stored alongside catalog references. */
export interface CustomDream {
  id: string;
  name: string;
  category: DreamCategory;
  targetPrice: number;
  image?: string;
  description?: string;
  notes?: string;
}

export type AssetCategory =
  | "motorcycle"
  | "car"
  | "watch"
  | "property"
  | "electronics"
  | "investment"
  | "business"
  | "other";

export interface OwnedAsset {
  id: string;
  name: string;
  category: AssetCategory;
  purchasePrice?: number;
  currentValue: number;
  image?: string;
  /** Owner decides whether this counts toward net worth — never assumed. */
  includeInNetWorth: boolean;
}

export interface LiquidMoney {
  cash: number;
  bank: number;
  investments: number;
  crypto: number;
  other: number;
}

/** Cash progress is the honest default; net worth is opt-in. */
export type CalculationMode = "cash" | "networth";

export interface Preferences {
  calculationMode: CalculationMode;
  hideNumbers: boolean;
  /** Simple mode collapses the five liquid buckets into one total. */
  simpleMoneyInput: boolean;
  monthlyContribution: number;
  annualReturnEnabled: boolean;
  annualReturnRate: number;
  onboarded: boolean;
}

/** The complete persisted state. Versioned so migrations stay cheap. */
export interface AppState {
  version: number;
  liquid: LiquidMoney;
  /** Used when `preferences.simpleMoneyInput` is true. */
  simpleTotal: number;
  assets: OwnedAsset[];
  dreams: SelectedDream[];
  customDreams: CustomDream[];
  preferences: Preferences;
  updatedAt: string;
}
