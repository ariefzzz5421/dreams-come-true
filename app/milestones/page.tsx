import type { Metadata } from "next";
import { MilestonesView } from "@/components/dashboard/MilestonesView";

export const metadata: Metadata = {
  title: "Wealth Milestones — Dreams Come True",
  description: "From Rp1 juta to Rp100 miliar — see exactly where you are on the ladder.",
};

export default function MilestonesPage() {
  return <MilestonesView />;
}
