import type { CatalogItem } from "@/lib/types";

/**
 * Banking & wealth milestones.
 *
 * These are the one category where a single number is genuinely misleading.
 * Priority and private banking tiers combine a portfolio minimum with CASA rules,
 * average-balance history over several months, and — for the top tiers — an
 * invitation the bank issues at its own discretion. So each entry carries the
 * full `requirements` list: the portfolio figure drives the progress bar, and the
 * qualitative conditions are shown as their own checklist that only the user can
 * confirm. Requirements change; always verify against the bank before acting.
 */
export const banking: CatalogItem[] = [
  {
    id: "bank-cimb-preferred",
    name: "CIMB Preferred",
    brand: "CIMB Niaga",
    logo: "cimb",
    category: "banking",
    targetPrice: 500_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://www.cimbniaga.co.id/id/preferred/index/new-to-preferred",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "aspirational",
    description:
      "The most accessible priority tier among the major banks — a realistic first wealth-management milestone.",
    requirements: [
      {
        label: "Minimum AUM",
        detail: "Rp500.000.000 combined across savings, current accounts, deposits, investments and bancassurance.",
        measurable: true,
        amount: 500_000_000,
      },
      {
        label: "Maintain the balance",
        detail: "The relationship balance must be sustained, not just reached once.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-dbs-treasures",
    name: "DBS Treasures",
    brand: "DBS",
    logo: "dbs",
    category: "banking",
    targetPrice: 500_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://www.dbs.id/treasures-id/default.page",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "aspirational",
    description:
      "Wealth management with a strong multi-currency and offshore-investment focus for Indonesian clients.",
    priceNote: "Entry AUM estimated — DBS Indonesia does not publish a single public figure.",
    requirements: [
      {
        label: "Minimum AUM (estimated)",
        detail: "Around Rp500.000.000 in combined funds under management.",
        measurable: true,
        amount: 500_000_000,
      },
      {
        label: "Confirm with the bank",
        detail: "Entry requirements are set per segment and can change without notice.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-ocbc-premier",
    name: "OCBC Premier Banking",
    brand: "OCBC",
    logo: "ocbc",
    category: "banking",
    targetPrice: 1_000_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://www.ocbc.id/id/individu/premier-banking",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "Premier banking with regional linkage into OCBC Singapore for clients who bank across borders.",
    priceNote: "Entry AUM estimated — verify the current threshold with OCBC Indonesia.",
    requirements: [
      {
        label: "Minimum AUM (estimated)",
        detail: "Around Rp1.000.000.000 in combined funds under management.",
        measurable: true,
        amount: 1_000_000_000,
      },
      {
        label: "Maintain average balance",
        detail: "Status is reviewed periodically against your average balance.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bca-prioritas",
    name: "BCA Prioritas",
    brand: "BCA",
    logo: "bca",
    category: "banking",
    targetPrice: 1_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://www.bca.co.id/id/individu/produk/perbankan-prioritas",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "The best-known priority tier in Indonesia. Reaching the portfolio number is necessary but not sufficient — BCA extends the invitation.",
    requirements: [
      {
        label: "Minimum portfolio (AUM)",
        detail: "Rp1.000.000.000 combined across savings, deposits and investment products.",
        measurable: true,
        amount: 1_000_000_000,
      },
      {
        label: "CASA requirement",
        detail: "A portion must sit in savings or current accounts, not only in investments.",
        measurable: false,
      },
      {
        label: "Average balance history",
        detail: "The portfolio is assessed on a multi-month average, not a single-day snapshot.",
        measurable: false,
      },
      {
        label: "Invitation from BCA",
        detail: "Priority status is offered by the bank; it cannot simply be applied for.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-mandiri-prioritas",
    name: "Mandiri Prioritas",
    brand: "Bank Mandiri",
    logo: "mandiri",
    category: "banking",
    targetPrice: 1_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://bankmandiri.co.id/web/mandiri-prioritas",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "Mandiri's priority tier, sitting in a band that runs from Rp1 miliar up to the Private threshold.",
    requirements: [
      {
        label: "Minimum placement",
        detail: "From Rp1.000.000.000 in total funds placed with Bank Mandiri.",
        measurable: true,
        amount: 1_000_000_000,
      },
      {
        label: "Tiered band",
        detail: "The Prioritas segment spans roughly Rp1 miliar to Rp20 miliar before Private applies.",
        measurable: false,
      },
      {
        label: "Maintain the relationship",
        detail: "Status is reviewed against sustained balances.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bni-emerald",
    name: "BNI Emerald",
    brand: "BNI",
    logo: "bni",
    category: "banking",
    targetPrice: 1_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://www.bni.co.id/id-id/personal/emerald",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "BNI's priority banking service, with dedicated Emerald lounges across major Indonesian cities.",
    requirements: [
      {
        label: "Minimum funds",
        detail: "Rp1.000.000.000 held with BNI.",
        measurable: true,
        amount: 1_000_000_000,
      },
      {
        label: "Maintain average balance",
        detail: "Emerald status is reviewed periodically against your balance.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bri-prioritas",
    name: "BRI Prioritas",
    brand: "BRI",
    logo: "bri",
    category: "banking",
    targetPrice: 1_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://bri.co.id/prioritas",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "Priority banking from Indonesia's largest bank by branch network, with the widest regional coverage.",
    requirements: [
      {
        label: "Minimum savings balance",
        detail: "Rp1.000.000.000 in savings held with BRI.",
        measurable: true,
        amount: 1_000_000_000,
      },
      {
        label: "Maintain the balance",
        detail: "The threshold is assessed on an ongoing basis.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bri-private",
    name: "BRI Private",
    brand: "BRI",
    logo: "bri",
    category: "banking",
    targetPrice: 10_000_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://bri.co.id/prioritas",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "BRI's ultra-high-net-worth tier above Prioritas, with dedicated wealth planning and estate services.",
    priceNote:
      "Threshold estimated — BRI does not publish a public Private figure. Verify directly with the bank.",
    requirements: [
      {
        label: "Minimum portfolio (estimated)",
        detail: "Around Rp10.000.000.000 in funds under management.",
        measurable: true,
        amount: 10_000_000_000,
      },
      {
        label: "Invitation required",
        detail: "Private tiers are offered at the bank's discretion.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bni-private",
    name: "BNI Private",
    brand: "BNI",
    logo: "bni",
    category: "banking",
    targetPrice: 15_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://www.bni.co.id/id-id/personal/emerald",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "The tier above Emerald. Private banking, family wealth structuring and dedicated relationship teams.",
    requirements: [
      {
        label: "Minimum funds",
        detail: "Rp15.000.000.000 available with BNI.",
        measurable: true,
        amount: 15_000_000_000,
      },
      {
        label: "Invitation required",
        detail: "Private status is extended by the bank, not applied for.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-mandiri-private",
    name: "Mandiri Private",
    brand: "Bank Mandiri",
    logo: "mandiri",
    category: "banking",
    targetPrice: 20_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://bankmandiri.co.id/web/mandiri-private",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "Mandiri's private banking arm for ultra-high-net-worth families, with an Infinite tier above it.",
    requirements: [
      {
        label: "Minimum FUM",
        detail: "Rp20.000.000.000 in funds under management.",
        measurable: true,
        amount: 20_000_000_000,
      },
      {
        label: "Infinite tier",
        detail: "Mandiri Private Infinite sits higher again, at around Rp50.000.000.000.",
        measurable: false,
      },
      {
        label: "Invitation required",
        detail: "Onboarding is by invitation and relationship review.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-bca-solitaire",
    name: "BCA Solitaire",
    brand: "BCA",
    logo: "bca",
    category: "banking",
    targetPrice: 5_000_000_000,
    priceType: "official",
    currency: "IDR",
    officialSource: "https://www.bca.co.id/id/individu/produk/perbankan-prioritas",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "BCA's highest tier, above Prioritas. Strictly invitation-only, for ultra-high-net-worth clients.",
    requirements: [
      {
        label: "Minimum portfolio (AUM)",
        detail: "Rp5.000.000.000 combined across savings, deposits and investment products.",
        measurable: true,
        amount: 5_000_000_000,
      },
      {
        label: "CASA requirement",
        detail: "A portion must be held in savings or current accounts.",
        measurable: false,
      },
      {
        label: "Average balance history",
        detail: "Assessed on a sustained multi-month average.",
        measurable: false,
      },
      {
        label: "Invitation from BCA",
        detail: "Solitaire is offered by BCA to selected clients only.",
        measurable: false,
      },
    ],
  },
  {
    id: "bank-hsbc-premier",
    name: "HSBC Premier",
    brand: "HSBC",
    logo: "hsbc",
    category: "banking",
    targetPrice: 2_000_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://www.hsbc.co.id/premier/",
    location: "Indonesia",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "Global premier banking — status recognised across HSBC markets, useful if you move money internationally.",
    priceNote: "Indonesian threshold estimated. Confirm the current Total Relationship Balance with HSBC.",
    requirements: [
      {
        label: "Total Relationship Balance (estimated)",
        detail: "Around Rp2.000.000.000 across deposits and investments.",
        measurable: true,
        amount: 2_000_000_000,
      },
      {
        label: "Global status",
        detail: "Premier status can carry across HSBC markets, subject to local rules.",
        measurable: false,
      },
    ],
  },
];
