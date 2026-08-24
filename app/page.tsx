import Link from "next/link";
import { Hero } from "@/components/layout/Hero";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { WealthInput } from "@/components/dashboard/WealthInput";
import { HomeCatalog } from "@/components/catalog/HomeCatalog";
import { HomeProgress } from "@/components/dashboard/HomeProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Homepage. Section order follows the product spec exactly:
 * hero → wealth → catalog → progress → ladder → milestones → how it works.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="wealth" className="mx-auto max-w-7xl scroll-mt-20 px-5 sm:px-8">
        <WealthInput />
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8">
        <SectionHeading
          eyebrow="Step two"
          title="What do you dream about?"
          description="Researched prices from official sources where they exist, clearly labelled estimates where they don't. Everything stays editable."
          action={
            <Link
              href="/dreams"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-100"
            >
              Open full catalog →
            </Link>
          }
        />
        <HomeCatalog />
      </section>

      <HomeProgress />

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, no account"
          description="Nothing here needs a login. Your numbers are stored in this browser and nowhere else."
        />
        <HowItWorks />
      </section>
    </>
  );
}
