"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCatalogItem } from "@/data/catalog";
import {
  calculateProgress,
  defaultTravelConfig,
  estimateTravelBudget,
  sumAssets,
  sumLiquid,
  type ProgressResult,
} from "@/lib/progress";
import { createId, createInitialState, loadState, saveState } from "@/lib/storage";
import type {
  AppState,
  CatalogItem,
  CustomDream,
  DreamPriority,
  LiquidMoney,
  OwnedAsset,
  Preferences,
  SelectedDream,
} from "@/lib/types";

/**
 * Single source of truth for everything the user owns, wants and prefers.
 *
 * The provider hydrates from LocalStorage on mount (never during render, so the
 * server and first client paint agree) and writes back on every change. All money
 * maths that more than one screen needs lives here, so a dream's progress is
 * computed identically on the catalog, the board, the ladder and the export card.
 */

export interface ResolvedDream {
  selection: SelectedDream;
  item: CatalogItem;
  /** The effective target after travel config, quantity and manual overrides. */
  target: number;
  progress: ProgressResult;
  /** True when the user ticked "I achieved this", regardless of the maths. */
  achieved: boolean;
}

interface DreamContextValue {
  state: AppState;
  hydrated: boolean;

  /* Money */
  liquidTotal: number;
  assetsTotal: number;
  includedAssetsTotal: number;
  netWorth: number;
  /** The figure progress is measured against, per the current calculation mode. */
  availableMoney: number;

  /* Derived dreams */
  dreams: ResolvedDream[];
  unlockedCount: number;

  /* Mutations */
  setLiquid: (patch: Partial<LiquidMoney>) => void;
  setSimpleTotal: (value: number) => void;
  addAsset: (asset: Omit<OwnedAsset, "id">) => void;
  updateAsset: (id: string, patch: Partial<OwnedAsset>) => void;
  removeAsset: (id: string) => void;
  addDream: (itemId: string, seed?: Partial<SelectedDream>) => void;
  removeDream: (itemId: string) => void;
  toggleDream: (itemId: string) => void;
  updateDream: (id: string, patch: Partial<SelectedDream>) => void;
  reorderDream: (id: string, direction: -1 | 1) => void;
  setAchieved: (id: string, achieved: boolean) => void;
  addCustomDream: (dream: Omit<CustomDream, "id">, seed?: Partial<SelectedDream>) => void;
  updateCustomDream: (id: string, patch: Partial<CustomDream>) => void;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetAll: () => void;

  /* Lookups */
  isSelected: (itemId: string) => boolean;
  resolveItem: (itemId: string) => CatalogItem | undefined;
  targetFor: (selection: SelectedDream, item: CatalogItem) => number;
}

const DreamContext = createContext<DreamContextValue | null>(null);

/** Turns a stored custom dream into the same shape catalog items use. */
function customToCatalogItem(custom: CustomDream): CatalogItem {
  return {
    id: custom.id,
    name: custom.name,
    category: custom.category,
    targetPrice: custom.targetPrice,
    priceType: "user-defined",
    currency: "IDR",
    image: custom.image,
    officialSource: "",
    location: "Your own target",
    lastUpdated: new Date().toISOString().slice(0, 10),
    description: custom.description ?? "A dream you defined yourself.",
    tier: "aspirational",
  };
}

export function DreamProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  // Skips the first persist so hydration doesn't immediately rewrite storage.
  const skipPersist = useRef(true);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    saveState(state);
  }, [state, hydrated]);

  const patch = useCallback((updater: (previous: AppState) => AppState) => {
    setState((previous) => updater(previous));
  }, []);

  /* ---------------------------------------------------------------- money */

  const liquidTotal = useMemo(
    () => (state.preferences.simpleMoneyInput ? state.simpleTotal : sumLiquid(state.liquid)),
    [state.preferences.simpleMoneyInput, state.simpleTotal, state.liquid],
  );

  const assetsTotal = useMemo(
    () => state.assets.reduce((total, asset) => total + (asset.currentValue || 0), 0),
    [state.assets],
  );
  const includedAssetsTotal = useMemo(() => sumAssets(state.assets), [state.assets]);
  const netWorth = liquidTotal + includedAssetsTotal;
  const availableMoney = state.preferences.calculationMode === "networth" ? netWorth : liquidTotal;

  /* ---------------------------------------------------------------- items */

  const customItems = useMemo(
    () => new Map(state.customDreams.map((custom) => [custom.id, customToCatalogItem(custom)])),
    [state.customDreams],
  );

  const resolveItem = useCallback(
    (itemId: string) => customItems.get(itemId) ?? getCatalogItem(itemId),
    [customItems],
  );

  /**
   * The effective target for a selection. Priority order:
   *   1. an explicit user override
   *   2. a live travel-budget recalculation
   *   3. per-person experience pricing × quantity
   *   4. the catalog price
   */
  const targetFor = useCallback((selection: SelectedDream, item: CatalogItem): number => {
    if (typeof selection.customTarget === "number" && selection.customTarget > 0) {
      return selection.customTarget;
    }
    if (item.travel && selection.travelConfig) {
      return estimateTravelBudget(item.travel, selection.travelConfig).total;
    }
    if (item.experience && selection.quantity) {
      return item.experience.pricePerPerson * Math.max(1, selection.quantity);
    }
    return item.targetPrice;
  }, []);

  const dreams = useMemo<ResolvedDream[]>(() => {
    return state.dreams
      .map((selection) => {
        const item = resolveItem(selection.itemId);
        if (!item) return null;
        const target = targetFor(selection, item);
        const progress = calculateProgress(availableMoney, target);
        return {
          selection,
          item,
          target,
          progress,
          achieved: selection.achieved || progress.reached,
        } satisfies ResolvedDream;
      })
      .filter((dream): dream is ResolvedDream => dream !== null)
      .sort((a, b) => a.selection.order - b.selection.order);
  }, [state.dreams, resolveItem, targetFor, availableMoney]);

  const unlockedCount = dreams.filter((dream) => dream.achieved).length;

  /* ------------------------------------------------------------ mutations */

  const setLiquid = useCallback(
    (next: Partial<LiquidMoney>) =>
      patch((previous) => ({ ...previous, liquid: { ...previous.liquid, ...next } })),
    [patch],
  );

  const setSimpleTotal = useCallback(
    (value: number) => patch((previous) => ({ ...previous, simpleTotal: Math.max(0, value) })),
    [patch],
  );

  const addAsset = useCallback(
    (asset: Omit<OwnedAsset, "id">) =>
      patch((previous) => ({
        ...previous,
        assets: [...previous.assets, { ...asset, id: createId("asset") }],
      })),
    [patch],
  );

  const updateAsset = useCallback(
    (id: string, next: Partial<OwnedAsset>) =>
      patch((previous) => ({
        ...previous,
        assets: previous.assets.map((asset) => (asset.id === id ? { ...asset, ...next } : asset)),
      })),
    [patch],
  );

  const removeAsset = useCallback(
    (id: string) =>
      patch((previous) => ({
        ...previous,
        assets: previous.assets.filter((asset) => asset.id !== id),
      })),
    [patch],
  );

  const addDream = useCallback(
    (itemId: string, seed?: Partial<SelectedDream>) =>
      patch((previous) => {
        if (previous.dreams.some((dream) => dream.itemId === itemId)) return previous;
        const item = getCatalogItem(itemId);
        const nextOrder =
          previous.dreams.reduce((max, dream) => Math.max(max, dream.order), -1) + 1;
        const selection: SelectedDream = {
          id: createId("dream"),
          itemId,
          priority: "high",
          achieved: false,
          addedAt: new Date().toISOString(),
          order: nextOrder,
          // Travel and experience dreams start from their own sensible defaults so
          // the card is immediately adjustable rather than frozen at one price.
          travelConfig: item?.travel ? defaultTravelConfig(item.travel) : undefined,
          quantity: item?.experience ? item.experience.defaultPeople : undefined,
          ...seed,
        };
        return { ...previous, dreams: [...previous.dreams, selection] };
      }),
    [patch],
  );

  const removeDream = useCallback(
    (itemId: string) =>
      patch((previous) => ({
        ...previous,
        dreams: previous.dreams.filter((dream) => dream.itemId !== itemId),
      })),
    [patch],
  );

  const toggleDream = useCallback(
    (itemId: string) =>
      patch((previous) => {
        const exists = previous.dreams.some((dream) => dream.itemId === itemId);
        if (exists) {
          return {
            ...previous,
            dreams: previous.dreams.filter((dream) => dream.itemId !== itemId),
          };
        }
        const item = getCatalogItem(itemId);
        const nextOrder =
          previous.dreams.reduce((max, dream) => Math.max(max, dream.order), -1) + 1;
        return {
          ...previous,
          dreams: [
            ...previous.dreams,
            {
              id: createId("dream"),
              itemId,
              priority: "high" as DreamPriority,
              achieved: false,
              addedAt: new Date().toISOString(),
              order: nextOrder,
              travelConfig: item?.travel ? defaultTravelConfig(item.travel) : undefined,
              quantity: item?.experience ? item.experience.defaultPeople : undefined,
            },
          ],
        };
      }),
    [patch],
  );

  const updateDream = useCallback(
    (id: string, next: Partial<SelectedDream>) =>
      patch((previous) => ({
        ...previous,
        dreams: previous.dreams.map((dream) => (dream.id === id ? { ...dream, ...next } : dream)),
      })),
    [patch],
  );

  /** Moves a dream one slot up or down the board and renumbers the whole list. */
  const reorderDream = useCallback(
    (id: string, direction: -1 | 1) =>
      patch((previous) => {
        const ordered = [...previous.dreams].sort((a, b) => a.order - b.order);
        const index = ordered.findIndex((dream) => dream.id === id);
        const target = index + direction;
        if (index === -1 || target < 0 || target >= ordered.length) return previous;
        [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
        return {
          ...previous,
          dreams: ordered.map((dream, position) => ({ ...dream, order: position })),
        };
      }),
    [patch],
  );

  const setAchieved = useCallback(
    (id: string, achieved: boolean) =>
      patch((previous) => ({
        ...previous,
        dreams: previous.dreams.map((dream) =>
          dream.id === id
            ? {
                ...dream,
                achieved,
                achievedAt: achieved
                  ? (dream.achievedAt ?? new Date().toISOString().slice(0, 10))
                  : undefined,
              }
            : dream,
        ),
      })),
    [patch],
  );

  const addCustomDream = useCallback(
    (dream: Omit<CustomDream, "id">, seed?: Partial<SelectedDream>) =>
      patch((previous) => {
        const id = createId("custom");
        const nextOrder =
          previous.dreams.reduce((max, existing) => Math.max(max, existing.order), -1) + 1;
        return {
          ...previous,
          customDreams: [...previous.customDreams, { ...dream, id }],
          dreams: [
            ...previous.dreams,
            {
              id: createId("dream"),
              itemId: id,
              priority: "high" as DreamPriority,
              achieved: false,
              addedAt: new Date().toISOString(),
              order: nextOrder,
              notes: dream.notes,
              ...seed,
            },
          ],
        };
      }),
    [patch],
  );

  const updateCustomDream = useCallback(
    (id: string, next: Partial<CustomDream>) =>
      patch((previous) => ({
        ...previous,
        customDreams: previous.customDreams.map((dream) =>
          dream.id === id ? { ...dream, ...next } : dream,
        ),
      })),
    [patch],
  );

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
      patch((previous) => ({
        ...previous,
        preferences: { ...previous.preferences, [key]: value },
      })),
    [patch],
  );

  const resetAll = useCallback(() => {
    skipPersist.current = false;
    setState(createInitialState());
  }, []);

  const isSelected = useCallback(
    (itemId: string) => state.dreams.some((dream) => dream.itemId === itemId),
    [state.dreams],
  );

  const value = useMemo<DreamContextValue>(
    () => ({
      state,
      hydrated,
      liquidTotal,
      assetsTotal,
      includedAssetsTotal,
      netWorth,
      availableMoney,
      dreams,
      unlockedCount,
      setLiquid,
      setSimpleTotal,
      addAsset,
      updateAsset,
      removeAsset,
      addDream,
      removeDream,
      toggleDream,
      updateDream,
      reorderDream,
      setAchieved,
      addCustomDream,
      updateCustomDream,
      setPreference,
      resetAll,
      isSelected,
      resolveItem,
      targetFor,
    }),
    [
      state, hydrated, liquidTotal, assetsTotal, includedAssetsTotal, netWorth, availableMoney,
      dreams, unlockedCount, setLiquid, setSimpleTotal, addAsset, updateAsset, removeAsset,
      addDream, removeDream, toggleDream, updateDream, reorderDream, setAchieved, addCustomDream,
      updateCustomDream, setPreference, resetAll, isSelected, resolveItem, targetFor,
    ],
  );

  return <DreamContext.Provider value={value}>{children}</DreamContext.Provider>;
}

export function useDreams(): DreamContextValue {
  const context = useContext(DreamContext);
  if (!context) throw new Error("useDreams must be used inside <DreamProvider>");
  return context;
}

/** Convenience hook so components don't repeat the hide-numbers plumbing. */
export function useMoneyDisplay() {
  const { state } = useDreams();
  return state.preferences.hideNumbers;
}
