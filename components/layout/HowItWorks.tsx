import { Coins, Download, Heart, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Coins,
    title: "Enter what you have",
    body: "One number, or a breakdown across cash, bank, investments and crypto. It stays on your device.",
  },
  {
    icon: Heart,
    title: "Pick your dreams",
    body: "Researched motorcycles, cars, watches, trips, dinners, banking tiers and property — or invent your own.",
  },
  {
    icon: TrendingUp,
    title: "See the distance",
    body: "Every dream gets a live progress bar, an amount still needed, and a place on your ladder.",
  },
  {
    icon: Download,
    title: "Take it with you",
    body: "Export any dream as a card sized for Instagram, WhatsApp, Discord or X.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/[0.08] text-gold-200">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="tnum font-display text-2xl font-semibold text-white/[0.08]">
                0{index + 1}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{step.body}</p>
          </div>
        );
      })}
    </div>
  );
}
