import type { CatalogItem } from "@/lib/types";

/**
 * Property dreams.
 *
 * There is no such thing as a national house price. The same building costs
 * wildly different amounts in Bekasi, Bandung and Kebayoran Baru, and listings go
 * stale within weeks. So this category deliberately does *not* claim live market
 * data: each entry is an editable target the user is expected to adjust to their
 * own city and their own plan, and every card says so on its face.
 */
export const property: CatalogItem[] = [
  {
    id: "prop-rumah-subsidi",
    name: "Rumah Subsidi",
    category: "property",
    targetPrice: 185_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://ppdpp.id/",
    location: "Government-subsidised housing programme",
    lastUpdated: "2026-08-24",
    tier: "entry",
    description:
      "Government-backed subsidised housing under the FLPP scheme. The most accessible route to owning, with income caps and location limits.",
    priceNote: "Estimated target. FLPP price ceilings are set per region and revised periodically.",
  },
  {
    id: "prop-first-home",
    name: "Small First Home",
    category: "property",
    targetPrice: 350_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://ppdpp.id/",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "entry",
    description:
      "A modest first house in a satellite city. Two bedrooms, a small yard, and a mortgage you can actually service.",
    priceNote: "User-defined target — set this to a real listing in the area you are looking at.",
  },
  {
    id: "prop-rumah-500",
    name: "Rumah Rp500 Juta",
    category: "property",
    targetPrice: 500_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "aspirational",
    description:
      "The standard aspiration for a young Indonesian family — a proper house in a developed cluster within commuting distance.",
    priceNote: "User-defined target. Bank Indonesia's residential property price survey is a useful reference.",
  },
  {
    id: "prop-premium-apartment",
    name: "Premium Apartment",
    category: "property",
    targetPrice: 850_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "aspirational",
    description:
      "A two-bedroom unit in a serviced tower near a TOD station. Trading land for a commute you get back.",
    priceNote: "User-defined target. Service charges and parking are not included.",
  },
  {
    id: "prop-rumah-1m",
    name: "Rumah Rp1 Miliar",
    category: "property",
    targetPrice: 1_000_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "The Rp1 miliar house — a real milestone in Jabodetabek, and comfortable space in most other cities.",
    priceNote: "User-defined target. What Rp1 miliar buys varies enormously by city.",
  },
  {
    id: "prop-rumah-2m",
    name: "Rumah Rp2 Miliar",
    category: "property",
    targetPrice: 2_000_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "Established neighbourhood, real land area, room for the family to grow into rather than out of.",
    priceNote: "User-defined target — adjust to your own city and land size.",
  },
  {
    id: "prop-villa-bali",
    name: "Villa in Bali",
    category: "property",
    targetPrice: 3_500_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://www.indonesia.travel/gb/en/destinations/bali-nusa-tenggara/bali",
    location: "User-defined / estimated target",
    lastUpdated: "2026-08-24",
    tier: "luxury",
    description:
      "A private villa with a pool, somewhere between Canggu and Ubud. Half a home, half a rental business.",
    priceNote:
      "Estimated target. Leasehold and freehold pricing differ sharply, and foreign-ownership rules apply.",
  },
  {
    id: "prop-luxury-jakarta",
    name: "Luxury House in Jakarta",
    category: "property",
    targetPrice: 6_000_000_000,
    priceType: "estimated",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined / estimated target",
    lastUpdated: "2026-08-24",
    tier: "luxury",
    description:
      "A house in one of Jakarta's established southern neighbourhoods. Land price does most of the work here.",
    priceNote: "Estimated target. Prime Jakarta land prices vary by street, not just by district.",
  },
  {
    id: "prop-dream-house-10m",
    name: "Dream House Rp10 Miliar",
    category: "property",
    targetPrice: 10_000_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "dream",
    description:
      "The house you draw on a napkin. No compromises on location, land or the room nobody needs.",
    priceNote: "User-defined target — this one is meant to be edited into your own number.",
  },
  {
    id: "prop-custom",
    name: "Custom Dream Property",
    category: "property",
    targetPrice: 1_500_000_000,
    priceType: "user-defined",
    currency: "IDR",
    officialSource: "https://www.bi.go.id/id/publikasi/laporan/Pages/SHPR-Triwulan-I-2025.aspx",
    location: "User-defined target",
    lastUpdated: "2026-08-24",
    tier: "premium",
    description:
      "A blank property target. Put in the real listing price of the place you are actually saving for.",
    priceNote: "User-defined target. Set it to whatever you are genuinely working toward.",
  },
];
