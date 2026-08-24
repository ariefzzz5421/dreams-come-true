"use client";

import { motion } from "framer-motion";
import { formatPercent } from "@/lib/format";
import type { ProgressResult } from "@/lib/progress";

/**
 * The app's signature progress bar.
 *
 * The fill is clamped to 100% so an over-target dream doesn't overflow its track,
 * while the label keeps showing the true ratio (417% stays 417%).
 */

const TONE_TEXT: Record<ProgressResult["status"]["tone"], string> = {
  muted: "text-white/45",
  progress: "text-white/70",
  close: "text-gold-200",
  unlocked: "text-emerald-300",
};

const TONE_FILL: Record<ProgressResult["status"]["tone"], string> = {
  muted: "from-white/25 to-white/40",
  progress: "from-gold-500/70 to-gold-300",
  close: "from-gold-400 to-gold-200",
  unlocked: "from-emerald-500 to-emerald-300",
};

export function ProgressBar({
  progress,
  size = "md",
  showLabel = true,
  hidden = false,
  animate = true,
}: {
  progress: ProgressResult;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  /** When numbers are hidden the percentage is masked but the bar still moves. */
  hidden?: boolean;
  animate?: boolean;
}) {
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  const tone = progress.status.tone;

  return (
    <div className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-full bg-white/[0.07] ${height}`}
        role="progressbar"
        aria-valuenow={Math.round(progress.clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatPercent(progress.percent)} of target`}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${TONE_FILL[tone]}`}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${progress.clamped}%` }}
          transition={{ duration: animate ? 0.9 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
        {progress.reached && (
          <div className="pointer-events-none absolute inset-0 animate-shimmer rounded-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%)] bg-[length:200%_100%]" />
        )}
      </div>

      {showLabel && (
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <span className={`text-xs ${TONE_TEXT[tone]}`}>{progress.status.label}</span>
          <span className={`tnum text-sm font-semibold ${TONE_TEXT[tone]}`}>
            {hidden ? "••%" : formatPercent(progress.percent)}
          </span>
        </div>
      )}
    </div>
  );
}
