"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDreams } from "@/components/providers/DreamProvider";

const LINKS = [
  { href: "/dreams", label: "Dreams" },
  { href: "/journey", label: "My Journey" },
  { href: "/milestones", label: "Milestones" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();
  const { state, setPreference, dreams, hydrated } = useDreams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever navigation happens.
  useEffect(() => setOpen(false), [pathname]);

  const hidden = state.preferences.hideNumbers;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink-950/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 text-[13px] font-bold text-ink-950 shadow-glow">
            D
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-white sm:text-base">
            Dreams Come True
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm transition ${
                  active ? "text-gold-200" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreference("hideNumbers", !hidden)}
            aria-pressed={hidden}
            title={hidden ? "Show my numbers" : "Hide my numbers"}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-gold-400/40 hover:text-gold-200 sm:inline-flex"
          >
            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{hidden ? "Show my numbers" : "Hide my numbers"}</span>
          </button>

          <Link
            href="/my-dreams"
            className="inline-flex items-center gap-2 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-sm font-medium text-gold-100 transition hover:border-gold-300/60 hover:bg-gold-400/15"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">My Dreams</span>
            {hydrated && dreams.length > 0 && (
              <span className="tnum rounded-full bg-gold-300 px-1.5 text-[11px] font-bold text-ink-950">
                {dreams.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-2 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setPreference("hideNumbers", !hidden)}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm text-white/75 transition hover:bg-white/5"
            >
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {hidden ? "Show my numbers" : "Hide my numbers"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
