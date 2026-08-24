import type { BudgetStyle, LiquidMoney, OwnedAsset, TravelBlueprint, TravelConfig } from "./types";

/**
 * Progress maths.
 *
 * Two rules the rest of the app depends on:
 *  1. The *visual* bar is clamped to 0–100, but the true ratio is preserved so a
 *     417% result can still be shown as a number.
 *  2. Reaching 100% means "target reached", never "you can afford this" — the app
 *     knows nothing about the user's liabilities, taxes or emergency fund.
 */

export interface ProgressResult {
  /** True ratio as a percentage. Can exceed 100. */
  percent: number;
  /** Percentage clamped to 0–100, for bar widths. */
  clamped: number;
  /** Zero once the target is reached. */
  remaining: number;
  reached: boolean;
  status: ProgressStatus;
}

export interface ProgressStatus {
  label: string;
  /** Tailwind text colour token for the status line. */
  tone: "muted" | "progress" | "close" | "unlocked";
}

const STATUS_BANDS: Array<{ min: number; status: ProgressStatus }> = [
  { min: 100, status: { label: "Dream unlocked.", tone: "unlocked" } },
  { min: 75, status: { label: "Almost there.", tone: "close" } },
  { min: 50, status: { label: "Closer than it looks.", tone: "close" } },
  { min: 25, status: { label: "It's becoming real.", tone: "progress" } },
  { min: 10, status: { label: "You're moving.", tone: "progress" } },
  { min: 0, status: { label: "The journey starts here.", tone: "muted" } },
];

export function statusFor(percent: number): ProgressStatus {
  return (STATUS_BANDS.find((band) => percent >= band.min) ?? STATUS_BANDS[STATUS_BANDS.length - 1])
    .status;
}

export function calculateProgress(available: number, target: number): ProgressResult {
  if (!Number.isFinite(target) || target <= 0) {
    // A zero target would divide by zero; treat it as already met rather than NaN.
    return {
      percent: 100,
      clamped: 100,
      remaining: 0,
      reached: true,
      status: statusFor(100),
    };
  }
  const money = Number.isFinite(available) ? Math.max(0, available) : 0;
  const percent = (money / target) * 100;
  return {
    percent,
    clamped: Math.min(100, Math.max(0, percent)),
    remaining: Math.max(0, target - money),
    reached: money >= target,
    status: statusFor(percent),
  };
}

export function sumLiquid(liquid: LiquidMoney): number {
  return liquid.cash + liquid.bank + liquid.investments + liquid.crypto + liquid.other;
}

/** Only assets the user explicitly opted in are counted. */
export function sumAssets(assets: OwnedAsset[]): number {
  return assets
    .filter((asset) => asset.includeInNetWorth)
    .reduce((total, asset) => total + (Number.isFinite(asset.currentValue) ? asset.currentValue : 0), 0);
}

export function sumAllAssets(assets: OwnedAsset[]): number {
  return assets.reduce(
    (total, asset) => total + (Number.isFinite(asset.currentValue) ? asset.currentValue : 0),
    0,
  );
}

/* -------------------------------------------------------------------------- */
/*  Travel budgets                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Multipliers applied to the "comfortable" baseline in each travel blueprint.
 * These shape a researched baseline into four budget styles rather than
 * pretending each style has its own quoted price.
 */
export const BUDGET_STYLE_FACTORS: Record<BudgetStyle, { flight: number; stay: number; daily: number }> = {
  budget: { flight: 0.75, stay: 0.4, daily: 0.55 },
  comfortable: { flight: 1, stay: 1, daily: 1 },
  premium: { flight: 1.6, stay: 2.2, daily: 1.8 },
  luxury: { flight: 3.2, stay: 4.5, daily: 3 },
};

export const BUDGET_STYLE_LABELS: Record<BudgetStyle, string> = {
  budget: "Budget",
  comfortable: "Comfortable",
  premium: "Premium",
  luxury: "Luxury",
};

/**
 * Departure city multiplier on flights only. Jakarta is the reference point
 * because every researched fare baseline starts there.
 */
export const DEPARTURE_CITIES: Array<{ id: string; label: string; flightFactor: number }> = [
  { id: "jakarta", label: "Jakarta (CGK)", flightFactor: 1 },
  { id: "surabaya", label: "Surabaya (SUB)", flightFactor: 1.08 },
  { id: "bandung", label: "Bandung (BDO)", flightFactor: 1.05 },
  { id: "medan", label: "Medan (KNO)", flightFactor: 1.12 },
  { id: "denpasar", label: "Denpasar (DPS)", flightFactor: 1.06 },
  { id: "makassar", label: "Makassar (UPG)", flightFactor: 1.15 },
  { id: "yogyakarta", label: "Yogyakarta (YIA)", flightFactor: 1.07 },
];

/** A 10% buffer is added on top — trips overrun, and pretending otherwise is worse. */
export const TRAVEL_BUFFER_RATE = 0.1;

export interface TravelEstimate {
  flights: number;
  accommodation: number;
  food: number;
  localTransport: number;
  attractions: number;
  buffer: number;
  total: number;
}

export function estimateTravelBudget(
  blueprint: TravelBlueprint,
  config: TravelConfig,
): TravelEstimate {
  const factors = BUDGET_STYLE_FACTORS[config.style] ?? BUDGET_STYLE_FACTORS.comfortable;
  const city = DEPARTURE_CITIES.find((c) => c.id === config.departureCity) ?? DEPARTURE_CITIES[0];
  const people = Math.max(1, Math.round(config.people || 1));
  const days = Math.max(1, Math.round(config.days || blueprint.defaultDays));
  // Hotel rooms are shared two-up; a solo traveller still pays for a whole room.
  const nights = Math.max(1, days - 1);
  const rooms = Math.ceil(people / 2);

  const flights = blueprint.baseFlight * factors.flight * city.flightFactor * people;
  const accommodation = blueprint.baseAccommodationPerNight * factors.stay * nights * rooms * 2;
  const food = blueprint.baseFoodPerDay * factors.daily * days * people;
  const localTransport = blueprint.baseLocalTransportPerDay * factors.daily * days * people;
  const attractions = blueprint.baseAttractionsPerDay * factors.daily * days * people;

  const subtotal = flights + accommodation + food + localTransport + attractions;
  const buffer = subtotal * TRAVEL_BUFFER_RATE;

  const round = (n: number) => Math.round(n / 50_000) * 50_000;

  return {
    flights: round(flights),
    accommodation: round(accommodation),
    food: round(food),
    localTransport: round(localTransport),
    attractions: round(attractions),
    buffer: round(buffer),
    total: round(subtotal + buffer),
  };
}

export function defaultTravelConfig(blueprint: TravelBlueprint): TravelConfig {
  return {
    departureCity: "jakarta",
    people: 2,
    days: blueprint.defaultDays,
    style: "comfortable",
  };
}

/* -------------------------------------------------------------------------- */
/*  Savings simulator                                                         */
/* -------------------------------------------------------------------------- */

export interface SavingsProjection {
  months: number | null;
  remaining: number;
  reachable: boolean;
  /** True when the target is already met. */
  alreadyThere: boolean;
}

/**
 * Months to reach `target` from `current` saving `monthly` each month.
 * With `annualRate` the balance compounds monthly; without it the projection is
 * plain arithmetic. Either way it is a projection, not a guarantee.
 */
export function projectSavings(
  current: number,
  monthly: number,
  target: number,
  annualRate = 0,
): SavingsProjection {
  const remaining = Math.max(0, target - current);
  if (current >= target) {
    return { months: 0, remaining: 0, reachable: true, alreadyThere: true };
  }
  if (monthly <= 0 && annualRate <= 0) {
    return { months: null, remaining, reachable: false, alreadyThere: false };
  }

  if (annualRate <= 0) {
    return {
      months: Math.ceil(remaining / monthly),
      remaining,
      reachable: true,
      alreadyThere: false,
    };
  }

  // Compound monthly, capped at 100 years so a hopeless case terminates.
  const monthlyRate = annualRate / 100 / 12;
  let balance = current;
  for (let month = 1; month <= 1200; month += 1) {
    balance = balance * (1 + monthlyRate) + monthly;
    if (balance >= target) {
      return { months: month, remaining, reachable: true, alreadyThere: false };
    }
  }
  return { months: null, remaining, reachable: false, alreadyThere: false };
}

/* -------------------------------------------------------------------------- */
/*  Wealth milestone ladder                                                   */
/* -------------------------------------------------------------------------- */

export const WEALTH_MILESTONES: number[] = [
  1_000_000,
  10_000_000,
  50_000_000,
  100_000_000,
  250_000_000,
  500_000_000,
  1_000_000_000,
  2_500_000_000,
  5_000_000_000,
  10_000_000_000,
  50_000_000_000,
  100_000_000_000,
];

export interface MilestonePosition {
  amount: number;
  passed: boolean;
  isNext: boolean;
}

export function milestonePositions(amount: number): MilestonePosition[] {
  const nextIndex = WEALTH_MILESTONES.findIndex((milestone) => amount < milestone);
  return WEALTH_MILESTONES.map((milestone, index) => ({
    amount: milestone,
    passed: amount >= milestone,
    isNext: index === nextIndex,
  }));
}

/**
 * Progress toward the next milestone, measured from zero rather than from the
 * previous rung — so Rp184,5 jt reads as 73,8% of the Rp250 jt milestone. That
 * is the ratio people actually mean when they ask how far along they are.
 */
export function milestoneProgress(amount: number): {
  next: number | null;
  previous: number;
  percent: number;
} {
  const nextIndex = WEALTH_MILESTONES.findIndex((milestone) => amount < milestone);
  if (nextIndex === -1) {
    return { next: null, previous: WEALTH_MILESTONES[WEALTH_MILESTONES.length - 1], percent: 100 };
  }
  const next = WEALTH_MILESTONES[nextIndex];
  const previous = nextIndex === 0 ? 0 : WEALTH_MILESTONES[nextIndex - 1];
  const percent = next <= 0 ? 0 : (Math.max(0, amount) / next) * 100;
  return { next, previous, percent: Math.min(100, Math.max(0, percent)) };
}
