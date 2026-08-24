import type { AppState } from "./types";

/**
 * LocalStorage repository for the MVP.
 *
 * Deliberately shaped like a remote repository: every function is async-ready in
 * spirit, state is versioned, and reads never throw. Swapping in Supabase later
 * means replacing the three functions below, not rewriting the UI.
 */

export const STORAGE_KEY = "dct.state.v1";
export const STATE_VERSION = 1;

export function createInitialState(): AppState {
  return {
    version: STATE_VERSION,
    liquid: { cash: 0, bank: 0, investments: 0, crypto: 0, other: 0 },
    simpleTotal: 0,
    assets: [],
    dreams: [],
    customDreams: [],
    preferences: {
      calculationMode: "cash",
      hideNumbers: false,
      simpleMoneyInput: true,
      monthlyContribution: 0,
      annualReturnEnabled: false,
      annualReturnRate: 7,
      onboarded: false,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fills in anything a stored payload is missing. Guards against both older
 * versions of the app and a partially hand-edited LocalStorage entry.
 */
export function migrateState(raw: unknown): AppState {
  const base = createInitialState();
  if (!raw || typeof raw !== "object") return base;
  const input = raw as Partial<AppState>;

  return {
    version: STATE_VERSION,
    liquid: { ...base.liquid, ...(input.liquid ?? {}) },
    simpleTotal: typeof input.simpleTotal === "number" ? input.simpleTotal : 0,
    assets: Array.isArray(input.assets) ? input.assets : [],
    dreams: Array.isArray(input.dreams) ? input.dreams : [],
    customDreams: Array.isArray(input.customDreams) ? input.customDreams : [],
    preferences: { ...base.preferences, ...(input.preferences ?? {}) },
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : base.updatedAt,
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return migrateState(JSON.parse(raw));
  } catch {
    // Corrupt or blocked storage should never take the app down.
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, version: STATE_VERSION, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Private-browsing quota errors are non-fatal — the session still works.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

/** Small id helper; `crypto.randomUUID` is not guaranteed on older mobile Safari. */
export function createId(prefix = "id"): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}
