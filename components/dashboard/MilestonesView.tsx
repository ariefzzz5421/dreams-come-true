"use client";

import { WealthMilestones } from "./WealthMilestones";
import { SavingsSimulator } from "./SavingsSimulator";
import { WealthInput } from "./WealthInput";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MilestonesView() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <SectionHeading
        eyebrow="Wealth journey"
        title="Milestones"
        description="A generic ladder that starts at Rp1 juta, because momentum matters more than the size of the number."
      />
      <div className="space-y-8">
        <WealthMilestones />
        <SavingsSimulator />
        <WealthInput />
      </div>
    </div>
  );
}
