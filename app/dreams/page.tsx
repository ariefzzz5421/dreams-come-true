import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Dream Catalog — Dreams Come True",
  description:
    "Motorcycles, cars, watches, travel, dining, banking milestones and property — with researched Indonesian pricing.",
};

export default function DreamsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <SectionHeading
        eyebrow="Dream catalog"
        title="What do you dream about?"
        description="Eight categories, all priced in Rupiah. Every card shows where its price came from and when it was last checked."
      />
      <CatalogBrowser />
    </div>
  );
}
