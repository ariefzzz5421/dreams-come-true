import type { Metadata } from "next";
import { JourneyDashboard } from "@/components/dashboard/JourneyDashboard";

export const metadata: Metadata = {
  title: "My Journey — Dreams Come True",
  description: "Your liquid money, owned assets, estimated net worth and dream progress in one view.",
};

export default function JourneyPage() {
  return <JourneyDashboard />;
}
