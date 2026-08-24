import type { CatalogItem } from "@/lib/types";

/**
 * Food & experience milestones.
 *
 * Restaurants change menus and prices constantly, and tasting menus are usually
 * quoted before service charge and tax. So every figure here is a researched
 * per-person estimate, not a booking price, and the headline target is simply
 * `price per person × people` — the quantity is adjustable on every card.
 */

interface ExperienceSeed {
  id: string;
  name: string;
  venue: string;
  city: string;
  pricePerPerson: number;
  defaultPeople: number;
  officialSource: string;
  description: string;
  tier: CatalogItem["tier"];
  priceNote?: string;
}

const seeds: ExperienceSeed[] = [
  {
    id: "food-premium-steak",
    name: "Premium Steak Dinner",
    venue: "Wolfgang's Steakhouse Jakarta",
    city: "Jakarta",
    pricePerPerson: 1_400_000,
    defaultPeople: 2,
    officialSource: "https://wolfgangssteakhouse.co.id/",
    tier: "entry",
    description:
      "Dry-aged USDA prime, served on a 260°C plate. The steakhouse benchmark in Jakarta.",
    priceNote: "Estimated per person for a shared porterhouse with sides, before service and tax.",
  },
  {
    id: "food-omakase",
    name: "Japanese Omakase",
    venue: "Sushi Hiro",
    city: "Jakarta",
    pricePerPerson: 1_500_000,
    defaultPeople: 2,
    officialSource: "https://www.sushihiro.id/",
    tier: "entry",
    description:
      "Counter seating, no menu, and whatever the chef judges best that day. Reserve well in advance.",
    priceNote: "Estimated mid-tier omakase course. Jakarta omakase spans roughly Rp1 jt – Rp4,5 jt.",
  },
  {
    id: "food-tasting-menu",
    name: "Fine Dining Tasting Menu",
    venue: "August",
    city: "Jakarta",
    pricePerPerson: 1_800_000,
    defaultPeople: 2,
    officialSource: "https://www.augustjkt.com/",
    tier: "aspirational",
    description:
      "A single set menu that changes with the season. Indonesian produce treated with real intent.",
    priceNote: "Estimated from published tasting-menu range of roughly Rp1,8 jt – Rp3,5 jt per person.",
  },
  {
    id: "food-rooftop-dinner",
    name: "Rooftop Dinner in Jakarta",
    venue: "SKYE Bar & Restaurant",
    city: "Jakarta",
    pricePerPerson: 900_000,
    defaultPeople: 2,
    officialSource: "https://ismaya.com/brands/skye",
    tier: "entry",
    description:
      "Dinner 56 floors above Thamrin. You are paying for the view, and it is worth it once.",
    priceNote: "Estimated per person for dinner with drinks, before service and tax.",
  },
  {
    id: "food-chefs-table",
    name: "Chef's Table Experience",
    venue: "Namaaz Dining",
    city: "Jakarta",
    pricePerPerson: 2_000_000,
    defaultPeople: 2,
    officialSource: "https://www.namaazdining.com/",
    tier: "aspirational",
    description:
      "Molecular Indonesian cooking across a long, deliberately theatrical sequence of courses.",
    priceNote: "Estimated per person for the full course sequence. Verify the current menu and price.",
  },
  {
    id: "food-luxury-brunch",
    name: "Luxury Hotel Brunch",
    venue: "Grand Hyatt Jakarta",
    city: "Jakarta",
    pricePerPerson: 750_000,
    defaultPeople: 2,
    officialSource: "https://www.hyatt.com/grand-hyatt/en-US/jktgh-grand-hyatt-jakarta",
    tier: "entry",
    description:
      "Sunday brunch done properly — seafood on ice, a carving station, and three hours of nowhere to be.",
    priceNote: "Estimated per person. Free-flow packages cost more.",
  },
  {
    id: "food-premium-seafood",
    name: "Premium Seafood Dinner",
    venue: "Plataran Menteng",
    city: "Jakarta",
    pricePerPerson: 850_000,
    defaultPeople: 2,
    officialSource: "https://plataran.com/plataran-menteng/",
    tier: "entry",
    description:
      "Indonesian seafood in a colonial-era heritage building. The version of home cooking you cannot do at home.",
    priceNote: "Estimated per person for a seafood-led dinner, before service and tax.",
  },
  {
    id: "food-afternoon-tea",
    name: "Afternoon Tea at a Luxury Hotel",
    venue: "Mandarin Oriental Jakarta",
    city: "Jakarta",
    pricePerPerson: 550_000,
    defaultPeople: 2,
    officialSource: "https://www.mandarinoriental.com/en/jakarta/thamrin",
    tier: "entry",
    description:
      "Three tiers, a pot of proper tea, and the most affordable way to spend an afternoon inside a five-star hotel.",
    priceNote: "Estimated per person for a standard afternoon tea set.",
  },
  {
    id: "food-bali-cliff-dinner",
    name: "Bali Clifftop Dinner",
    venue: "Henshin at The Westin Jakarta / Bali clifftop venues",
    city: "Bali",
    pricePerPerson: 1_600_000,
    defaultPeople: 2,
    officialSource: "https://www.marriott.com/en-us/hotels/jktwi-the-westin-jakarta/overview/",
    tier: "aspirational",
    description:
      "Nikkei cooking with the Indian Ocean below. The dinner people plan an entire Bali trip around.",
    priceNote: "Estimated per person for a set dinner. Confirm the venue is operating before booking.",
  },
  {
    id: "food-michelin-abroad",
    name: "Michelin-Star Dining Abroad",
    venue: "Singapore or Tokyo Michelin-listed restaurant",
    city: "Overseas",
    pricePerPerson: 4_500_000,
    defaultPeople: 2,
    officialSource: "https://guide.michelin.com/en/",
    tier: "premium",
    description:
      "One meal, one star, one long-remembered evening. Excludes the flights that get you there.",
    priceNote:
      "Estimated per person for the meal only. Travel and accommodation are separate dreams.",
  },
];

export const food: CatalogItem[] = seeds.map((seed) => ({
  id: seed.id,
  name: seed.name,
  brand: seed.venue,
  category: "food",
  targetPrice: seed.pricePerPerson * seed.defaultPeople,
  priceType: "estimated",
  currency: "IDR",
  officialSource: seed.officialSource,
  location: `${seed.city} · ${seed.defaultPeople} people`,
  lastUpdated: "2026-08-24",
  tier: seed.tier,
  description: seed.description,
  priceNote: seed.priceNote,
  experience: {
    venue: seed.venue,
    city: seed.city,
    pricePerPerson: seed.pricePerPerson,
    defaultPeople: seed.defaultPeople,
  },
}));
