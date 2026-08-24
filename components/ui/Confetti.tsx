"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * A restrained celebration: a handful of thin gold ribbons, once, then gone.
 * Respects `prefers-reduced-motion` by simply not rendering.
 */
export function Confetti({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [active]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        delay: (index % 9) * 0.14,
        duration: 2.2 + ((index % 5) * 0.28),
        hue: index % 3,
      })),
    [],
  );

  if (!visible) return null;

  const tones = ["bg-gold-300", "bg-gold-100", "bg-emerald-300"];

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`absolute top-0 h-3 w-[3px] rounded-full ${tones[piece.hue]} animate-confetti-fall`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}
