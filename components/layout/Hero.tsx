"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLES = [
  "Honda PCX", "BMW", "Rolex", "Japan", "Fine Dining", "BCA Prioritas",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Two soft washes and a hairline arc, nothing heavier. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-30%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[130px]" />
        <div className="absolute right-[8%] top-[10%] h-[320px] w-[320px] rounded-full bg-indigo-400/[0.06] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.07] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-gold-200">
            <Sparkles className="h-3 w-3" />
            Built for Indonesia · in Rupiah
          </div>

          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Dreams{" "}
            <span className="gold-text">Come True</span>
          </h1>

          <p className="mt-6 font-display text-xl leading-snug text-white/70 sm:text-2xl">
            How close are you to the life you imagine?
          </p>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/45 sm:text-base">
            Track your money, possessions, experiences and financial milestones — then see
            how close you are to making each dream real.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#wealth"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-300 to-gold-500 px-7 py-4 text-sm font-semibold text-ink-950 shadow-glow transition hover:from-gold-200 hover:to-gold-400"
            >
              Start My Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dreams"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white/85 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Explore Dreams
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-14 border-t border-white/[0.08] pt-6"
        >
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto text-sm text-white/35 sm:flex-wrap">
            {EXAMPLES.map((example, index) => (
              <span key={example} className="flex shrink-0 items-center gap-3">
                <span className="whitespace-nowrap">{example}</span>
                {index < EXAMPLES.length - 1 && (
                  <span className="text-gold-400/40" aria-hidden>•</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
