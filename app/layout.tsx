import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { DreamProvider } from "@/components/providers/DreamProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Dreams Come True — How close are you to the life you imagine?",
  description:
    "Track your money, possessions, experiences and financial milestones, then see how close you are to making each dream real. Built for Indonesia, in Rupiah.",
  keywords: [
    "financial goals", "Indonesia", "Rupiah", "dream tracker",
    "net worth", "savings goal", "wealth milestones",
  ],
  openGraph: {
    title: "Dreams Come True",
    description: "How close are you to the life you imagine?",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">
        <DreamProvider>
          <div className="flex min-h-dvh flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </DreamProvider>
      </body>
    </html>
  );
}
