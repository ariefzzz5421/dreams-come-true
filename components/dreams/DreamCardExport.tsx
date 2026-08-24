"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X } from "lucide-react";
import { DreamVisual } from "@/components/ui/DreamVisual";
import { formatDateID, formatPercent, formatRupiah, todayISO } from "@/lib/format";
import type { ResolvedDream } from "@/components/providers/DreamProvider";

type Preset = "square" | "story";

const PRESETS: Record<Preset, { width: number; height: number; label: string; ratio: string }> = {
  square: { width: 1080, height: 1080, label: "1:1 · Post", ratio: "1080 × 1080" },
  story: { width: 1080, height: 1920, label: "9:16 · Story", ratio: "1080 × 1920" },
};

/**
 * Shareable PNG export.
 *
 * The card is rendered off-screen at full pixel size rather than scaled up from
 * the on-screen version, so text stays crisp at 1080px. Two presets cover the
 * places people actually share: a square post and a 9:16 story.
 *
 * At 100% the card switches to a distinct achievement design.
 */
export function DreamCardExport({
  dream,
  onClose,
}: {
  dream: ResolvedDream;
  onClose: () => void;
}) {
  const [preset, setPreset] = useState<Preset>("square");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const size = PRESETS[preset];

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: size.width,
        height: size.height,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#07090f",
      });
      const link = document.createElement("a");
      const slug = dream.item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      link.download = `dreams-come-true-${slug}-${preset}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("Could not generate the image. Try again, or use a different browser.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink-950/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <p className="label-xs mb-0">Download card</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live preview, CSS-scaled down from the true export dimensions. */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-white/10">
          <div
            className="relative w-full"
            style={{ aspectRatio: `${size.width} / ${size.height}` }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: size.width,
                height: size.height,
                // Scale the true-size canvas down to whatever width the modal got.
                transform: `scale(calc(min(100vw - 2rem, 28rem) / ${size.width}))`,
              }}
            >
              <ExportCanvas dream={dream} preset={preset} />
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {(Object.keys(PRESETS) as Preset[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreset(key)}
              aria-pressed={preset === key}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                preset === key
                  ? "border-gold-400/45 bg-gold-400/10 text-gold-100"
                  : "border-white/10 text-white/55 hover:text-white"
              }`}
            >
              {PRESETS[key].label}
              <span className="mt-0.5 block text-[10px] font-normal text-white/35">
                {PRESETS[key].ratio}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={download}
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-300 to-gold-500 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:from-gold-200 hover:to-gold-400 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {busy ? "Generating…" : "Download PNG"}
        </button>

        {error && <p className="mt-3 text-center text-xs text-red-300">{error}</p>}
        <p className="mt-3 text-center text-[11px] text-white/30">
          Sized for Instagram, WhatsApp, Discord and X.
        </p>
      </div>

      {/* The real export target: full pixel size, positioned off-screen. */}
      <div className="pointer-events-none fixed left-[-20000px] top-0" aria-hidden>
        <div ref={cardRef} style={{ width: size.width, height: size.height }}>
          <ExportCanvas dream={dream} preset={preset} />
        </div>
      </div>
    </div>
  );
}

/**
 * The card itself. Uses inline styles throughout because html-to-image
 * serialises computed styles, and inline values survive that round-trip most
 * reliably across browsers.
 */
function ExportCanvas({ dream, preset }: { dream: ResolvedDream; preset: Preset }) {
  const story = preset === "story";
  const { item, target, progress, selection } = dream;
  const achieved = dream.achieved;
  const current = Math.max(0, target - progress.remaining);
  const scale = story ? 1.18 : 1;

  return (
    <div
      style={{
        width: story ? 1080 : 1080,
        height: story ? 1920 : 1080,
        background: achieved
          ? "linear-gradient(155deg,#0d1512 0%,#07090f 55%,#120f07 100%)"
          : "linear-gradient(155deg,#0f1420 0%,#07090f 60%,#100c06 100%)",
        color: "#ffffff",
        fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: story ? "110px 90px" : "80px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: achieved
            ? "radial-gradient(70% 50% at 50% 0%, rgba(52,211,153,0.16), transparent 70%)"
            : "radial-gradient(70% 50% at 20% 0%, rgba(216,171,82,0.16), transparent 70%)",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40 * scale, height: 40 * scale, borderRadius: 10,
            background: "linear-gradient(135deg,#e4c47c,#a97324)",
            color: "#07090f", fontWeight: 800, fontSize: 20 * scale,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          D
        </div>
        <span
          style={{
            fontSize: 20 * scale, letterSpacing: "0.24em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 600,
          }}
        >
          Dreams Come True
        </span>
      </div>

      {/* Pushes the content block toward the optical centre of each format. */}
      <div style={{ flex: story ? 0.85 : 0.5 }} />

      {achieved ? (
        <div style={{ position: "relative" }}>
          <p
            style={{
              fontSize: 26 * scale, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#6ee7b7", fontWeight: 700, margin: 0,
            }}
          >
            Dream Unlocked
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: (story ? 96 : 84) * 1, fontWeight: 700, lineHeight: 1.03,
              margin: "28px 0 0", letterSpacing: "-0.02em",
            }}
          >
            {item.name}
          </h2>
          {item.variant && (
            <p style={{ fontSize: 26 * scale, color: "rgba(255,255,255,0.4)", margin: "14px 0 0" }}>
              {item.variant}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 56 * scale }}>
            <span
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: 130 * scale, fontWeight: 700, color: "#6ee7b7", lineHeight: 1,
              }}
            >
              100%
            </span>
            <span
              style={{
                fontSize: 30 * scale, letterSpacing: "0.24em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600,
              }}
            >
              Achieved
            </span>
          </div>

          <div
            style={{
              height: 14, borderRadius: 999, marginTop: 44 * scale,
              background: "linear-gradient(90deg,#10b981,#6ee7b7)",
            }}
          />

          <p style={{ fontSize: 30 * scale, color: "rgba(255,255,255,0.75)", margin: `${40 * scale}px 0 0`, letterSpacing: "0.08em" }}>
            {formatDateID(selection.achievedAt ?? todayISO()).toUpperCase()}
          </p>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 34 * scale }}>
            <div style={{ width: 150 * scale, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
              <DreamVisual item={item} aspect="" className="h-[110px] w-full" />
            </div>
            <div>
              {item.brand && (
                <p
                  style={{
                    fontSize: 22 * scale, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 600,
                  }}
                >
                  {item.brand}
                </p>
              )}
              <p
                style={{
                  fontSize: 22 * scale, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#e4c47c", margin: "12px 0 0", fontWeight: 600,
                }}
              >
                My dream progress
              </p>
            </div>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: story ? 92 : 80, fontWeight: 700, lineHeight: 1.04,
              margin: 0, letterSpacing: "-0.02em",
            }}
          >
            {item.name}
          </h2>

          <div style={{ marginTop: 56 * scale }}>
            <p
              style={{
                fontSize: 44 * scale, fontWeight: 600, margin: 0,
                color: "rgba(255,255,255,0.92)", fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatRupiah(current)}
            </p>
            <div
              style={{
                height: 2, width: 220 * scale, background: "rgba(255,255,255,0.2)",
                margin: `${18 * scale}px 0`,
              }}
            />
            <p
              style={{
                fontSize: 44 * scale, fontWeight: 600, margin: 0,
                color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatRupiah(target)}
            </p>
          </div>

          <p
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: 116 * scale, fontWeight: 700, margin: `${44 * scale}px 0 0`,
              lineHeight: 1,
              background: "linear-gradient(135deg,#f8eed6,#d8ab52)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent", color: "#e4c47c",
            }}
          >
            {formatPercent(progress.percent)}
          </p>

          <div
            style={{
              height: 14, borderRadius: 999, background: "rgba(255,255,255,0.09)",
              marginTop: 34 * scale, overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%", width: `${progress.clamped}%`, borderRadius: 999,
                background: "linear-gradient(90deg,#a97324,#e4c47c)",
              }}
            />
          </div>

          <p
            style={{
              fontSize: 32 * scale, color: "rgba(255,255,255,0.6)",
              margin: `${34 * scale}px 0 0`, fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatRupiah(progress.remaining)} to go
          </p>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          position: "relative", display: "flex", justifyContent: "space-between",
          alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 34 * scale,
        }}
      >
        <span style={{ fontSize: 24 * scale, color: "rgba(255,255,255,0.35)" }}>
          {formatDateID(todayISO())}
        </span>
        <span
          style={{
            fontSize: 24 * scale, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)", fontWeight: 600,
          }}
        >
          Dreams Come True
        </span>
      </div>
    </div>
  );
}
