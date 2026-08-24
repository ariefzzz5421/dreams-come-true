import type { CatalogItem, TravelBlueprint } from "@/lib/types";
import { defaultTravelConfig, estimateTravelBudget } from "@/lib/progress";

/**
 * Travel dreams.
 *
 * A trip has no list price, so instead of inventing one each destination stores a
 * *blueprint* — researched per-person baselines for flights, a night's stay, and
 * daily food, transport and attractions, all at the "comfortable" style departing
 * Jakarta. The headline number is derived from that blueprint for two people at
 * the default trip length, and recomputed live whenever the user changes the
 * departure city, party size, length or budget style. Every total carries a 10%
 * buffer and is labelled Estimated Budget, because faking precision here would be
 * worse than being openly approximate.
 */

interface TravelSeed {
  id: string;
  name: string;
  blueprint: TravelBlueprint;
  officialSource: string;
  description: string;
  tier: CatalogItem["tier"];
}

const seeds: TravelSeed[] = [
  {
    id: "travel-bali",
    name: "Bali Luxury Escape",
    tier: "entry",
    officialSource: "https://www.indonesia.travel/gb/en/destinations/bali-nusa-tenggara/bali",
    description:
      "Five days of Ubud mornings and Bukit sunsets, with a villa good enough that you resent leaving it.",
    blueprint: {
      destination: "Bali, Indonesia",
      baseFlight: 1_500_000,
      baseAccommodationPerNight: 900_000,
      baseFoodPerDay: 400_000,
      baseLocalTransportPerDay: 200_000,
      baseAttractionsPerDay: 250_000,
      defaultDays: 5,
    },
  },
  {
    id: "travel-labuan-bajo",
    name: "Labuan Bajo & Komodo",
    tier: "entry",
    officialSource: "https://www.indonesia.travel/gb/en/destinations/bali-nusa-tenggara/labuan-bajo",
    description:
      "A liveaboard through Komodo National Park. Padar at sunrise, manta rays before lunch.",
    blueprint: {
      destination: "Labuan Bajo, Nusa Tenggara Timur",
      baseFlight: 2_500_000,
      baseAccommodationPerNight: 1_200_000,
      baseFoodPerDay: 400_000,
      baseLocalTransportPerDay: 500_000,
      baseAttractionsPerDay: 700_000,
      defaultDays: 4,
    },
  },
  {
    id: "travel-raja-ampat",
    name: "Raja Ampat",
    tier: "aspirational",
    officialSource: "https://www.indonesia.travel/gb/en/destinations/maluku-papua/raja-ampat",
    description:
      "The most biodiverse reef on Earth, and one of the hardest places in Indonesia to reach. Worth every connection.",
    blueprint: {
      destination: "Raja Ampat, Papua Barat Daya",
      baseFlight: 5_000_000,
      baseAccommodationPerNight: 1_800_000,
      baseFoodPerDay: 500_000,
      baseLocalTransportPerDay: 800_000,
      baseAttractionsPerDay: 900_000,
      defaultDays: 6,
    },
  },
  {
    id: "travel-singapore",
    name: "Singapore Weekend",
    tier: "entry",
    officialSource: "https://www.visitsingapore.com/en_id/",
    description:
      "The easiest first stamp. Four days of food, museums and a skyline that resets your standards.",
    blueprint: {
      destination: "Singapore",
      baseFlight: 2_800_000,
      baseAccommodationPerNight: 1_400_000,
      baseFoodPerDay: 500_000,
      baseLocalTransportPerDay: 150_000,
      baseAttractionsPerDay: 400_000,
      defaultDays: 4,
      visaNote: "Visa-free for Indonesian passport holders.",
    },
  },
  {
    id: "travel-japan",
    name: "Japan",
    tier: "aspirational",
    officialSource: "https://www.japan.travel/en/",
    description:
      "Tokyo, Kyoto and a shinkansen between them. The trip most Indonesians put at the top of the list.",
    blueprint: {
      destination: "Japan",
      baseFlight: 8_500_000,
      baseAccommodationPerNight: 1_300_000,
      baseFoodPerDay: 600_000,
      baseLocalTransportPerDay: 300_000,
      baseAttractionsPerDay: 350_000,
      defaultDays: 7,
      visaNote: "Visa required for Indonesian passport holders; e-visa available.",
    },
  },
  {
    id: "travel-south-korea",
    name: "South Korea",
    tier: "aspirational",
    officialSource: "https://english.visitkorea.or.kr/",
    description:
      "Seoul in autumn, Busan by rail, and more walking than you expect. Six days is the honest minimum.",
    blueprint: {
      destination: "South Korea",
      baseFlight: 7_500_000,
      baseAccommodationPerNight: 1_100_000,
      baseFoodPerDay: 500_000,
      baseLocalTransportPerDay: 250_000,
      baseAttractionsPerDay: 300_000,
      defaultDays: 6,
      visaNote: "Visa required for Indonesian passport holders; K-ETA may apply.",
    },
  },
  {
    id: "travel-dubai",
    name: "Dubai",
    tier: "premium",
    officialSource: "https://www.visitdubai.com/",
    description:
      "Desert, skyscrapers and a service standard that recalibrates what 'premium' means to you.",
    blueprint: {
      destination: "Dubai, United Arab Emirates",
      baseFlight: 8_000_000,
      baseAccommodationPerNight: 1_600_000,
      baseFoodPerDay: 700_000,
      baseLocalTransportPerDay: 300_000,
      baseAttractionsPerDay: 700_000,
      defaultDays: 5,
      visaNote: "Visa on arrival or e-visa for Indonesian passport holders.",
    },
  },
  {
    id: "travel-switzerland",
    name: "Switzerland",
    tier: "premium",
    officialSource: "https://www.myswitzerland.com/en/",
    description:
      "Eight days of trains through the Alps. Expensive in a way that is entirely, visibly justified.",
    blueprint: {
      destination: "Switzerland",
      baseFlight: 14_000_000,
      baseAccommodationPerNight: 2_200_000,
      baseFoodPerDay: 900_000,
      baseLocalTransportPerDay: 600_000,
      baseAttractionsPerDay: 600_000,
      defaultDays: 8,
      visaNote: "Schengen visa required for Indonesian passport holders.",
    },
  },
  {
    id: "travel-iceland",
    name: "Iceland",
    tier: "luxury",
    officialSource: "https://www.visiticeland.com/",
    description:
      "The Ring Road, glacier lagoons and the aurora if the sky cooperates. A trip you plan a year ahead.",
    blueprint: {
      destination: "Iceland",
      baseFlight: 16_000_000,
      baseAccommodationPerNight: 2_400_000,
      baseFoodPerDay: 950_000,
      baseLocalTransportPerDay: 900_000,
      baseAttractionsPerDay: 700_000,
      defaultDays: 8,
      visaNote: "Schengen visa required for Indonesian passport holders.",
    },
  },
  {
    id: "travel-new-york",
    name: "New York",
    tier: "luxury",
    officialSource: "https://www.nyctourism.com/",
    description:
      "A week in the city everything else is measured against. Long flight, longer days, no regrets.",
    blueprint: {
      destination: "New York, United States",
      baseFlight: 15_000_000,
      baseAccommodationPerNight: 2_600_000,
      baseFoodPerDay: 900_000,
      baseLocalTransportPerDay: 300_000,
      baseAttractionsPerDay: 600_000,
      defaultDays: 7,
      visaNote: "B1/B2 visa required for Indonesian passport holders; interview needed.",
    },
  },
];

export const travel: CatalogItem[] = seeds.map((seed) => ({
  id: seed.id,
  name: seed.name,
  category: "travel",
  // Headline figure = the blueprint priced for the default trip shape. Editing
  // the trip in the UI recalculates this rather than overwriting a fixed price.
  targetPrice: estimateTravelBudget(seed.blueprint, defaultTravelConfig(seed.blueprint)).total,
  priceType: "estimated",
  currency: "IDR",
  officialSource: seed.officialSource,
  location: `${seed.blueprint.defaultDays} days · 2 people · from Jakarta`,
  lastUpdated: "2026-08-24",
  tier: seed.tier,
  description: seed.description,
  travel: seed.blueprint,
  priceNote:
    "Estimated budget: flights, stay, food, local transport, attractions and a 10% buffer. Adjust the trip to recalculate.",
}));
