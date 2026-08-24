"use client";

import Link from "next/link";
import { useDreams } from "@/components/providers/DreamProvider";
import { DreamLadder } from "@/components/dreams/DreamLadder";
import { DreamPortfolio } from "@/components/dashboard/DreamPortfolio";
import { WealthMilestones } from "@/components/dashboard/WealthMilestones";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The homepage's progress block. Renders nothing dream-specific until the user
 * has actually picked something, so the empty state stays clean rather than
 * showing a row of zeroed-out widgets.
 */
export function HomeProgress() {
  const { dreams, hydrated } = useDreams();

  return (
    <>
      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8">
        <SectionHeading
          eyebrow="Step three"
          title="Your dream progress"
          description="Every dream you pick, measured against the money you have right now."
          action={
            dreams.length > 0 ? (
              <Link
                href="/my-dreams"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-100"
              >
                Manage my dreams →
              </Link>
            ) : undefined
          }
        />
        <DreamPortfolio />
      </section>

      {hydrated && dreams.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
          <DreamLadder />
        </section>
      )}

      <section className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        <WealthMilestones />
      </section>
    </>
  );
}
