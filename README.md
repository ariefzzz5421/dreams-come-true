# Dreams Come True

A goal visualisation tool for Indonesia. Enter what you have, pick what you want,
and see the distance between the two — in Rupiah, with every price labelled by
where it came from.

**How close are you to the life you imagine?**

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Node 20+ recommended.

## What's in it

| Area | Notes |
| --- | --- |
| **Catalog** | 72 seeded dreams across 7 researched categories plus custom dreams |
| **Progress** | Cash vs net-worth modes, clamped bars with true ratios preserved |
| **Dream Ladder** | Selected dreams stacked cheapest → most expensive with a "you are here" line |
| **Wealth Milestones** | Rp1 juta → Rp100 miliar |
| **Savings simulator** | Plain arithmetic, with an optional compounding projection |
| **PNG export** | 1080×1080 and 1080×1920, with a separate achievement design at 100% |
| **Persistence** | LocalStorage, versioned and migration-guarded |

No database, no authentication, no network calls at runtime.

## Project structure

```
app/                    Routes (home, dreams, my-dreams, journey, milestones, about)
components/
  providers/            DreamProvider — the single source of truth
  catalog/              Catalog browser, dream cards, banking cards
  dreams/               Board, ladder, custom dream form, PNG export
  dashboard/            Wealth input, assets, milestones, simulator, portfolio
  layout/               Navigation, hero, footer
  ui/                   Progress bar, money input, badges, visuals
data/catalog/           Seeded catalog, one file per category
lib/
  types.ts              Domain types
  format.ts             Rupiah formatting / parsing / masking
  progress.ts           Progress, travel budgets, savings, milestones
  storage.ts            LocalStorage repository
```

### Updating prices

Catalog data is fully separated from UI. Each category lives in its own file
under `data/catalog/` — edit `targetPrice`, `priceType`, `location` and
`lastUpdated` there; nothing in `components/` needs to change.

### Moving to a database later

`lib/storage.ts` is a small repository with three entry points (`loadState`,
`saveState`, `clearState`) over a versioned `AppState`, and `migrateState`
already backfills missing fields. Swapping LocalStorage for Supabase/PostgreSQL
means reimplementing those functions; the UI reads everything through
`useDreams()` and is unaware of where state is stored.

## How prices are handled

Every catalog item carries an `officialSource`, a `location`, a `lastUpdated`
date and a `priceType` badge:

- `official` — published by the brand, bank or manufacturer
- `starting-price` — the lowest trim; higher trims and other provinces cost more
- `authorized-dealer` — quoted by a dealer rather than the brand's own list
- `estimated` — a researched approximation, always editable
- `user-defined` — the user's own number

Vehicle prices are OTR for a stated region, because registration and tax are set
per province — a Jakarta figure is never presented as a national one. Travel
budgets are derived from a transparent cost model (flights, stay, food, local
transport, attractions, 10% buffer) that recalculates when the trip changes.
Property targets are explicitly user-defined. Watch prices are boutique/AD
reference estimates, never grey-market figures. Banking milestones list every
condition — CASA, average-balance history, invitation — not just the headline
portfolio number.

Product photography and brand logos are copyrighted and most official sites do
not permit hotlinking, so cards render a generated visual and link out to the
official source rather than using low-quality third-party copies.

## Product philosophy

Reaching a target shows **Dream unlocked**, never "you can afford this." The app
cannot see debts, taxes, dependants or an emergency fund. Cash progress is the
default calculation mode for the same reason: owning Rp1 miliar of property does
not mean having Rp1 miliar to spend.

A Rp5 juta goal is treated as seriously as a Rp5 miliar one.

This is a goal visualisation tool, not financial advice.
