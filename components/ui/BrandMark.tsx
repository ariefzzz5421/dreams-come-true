/**
 * Brand wordmarks.
 *
 * Official brand logo files are copyrighted and most manufacturer sites do not
 * permit hotlinking, so rather than pull in third-party copies this renders a
 * neutral typographic mark per brand: the brand's own name, set in the app's
 * type, on a tinted chip. The card always links out to the official source, which
 * is where the real branding lives.
 */

const BRAND_TINTS: Record<string, string> = {
  honda: "from-red-500/25 to-red-500/5 text-red-100 ring-red-400/25",
  yamaha: "from-blue-500/25 to-blue-500/5 text-blue-100 ring-blue-400/25",
  toyota: "from-red-400/25 to-red-400/5 text-red-100 ring-red-300/25",
  bmw: "from-sky-400/25 to-sky-400/5 text-sky-100 ring-sky-300/25",
  rolex: "from-emerald-500/25 to-emerald-500/5 text-emerald-100 ring-emerald-400/25",
  omega: "from-amber-400/25 to-amber-400/5 text-amber-100 ring-amber-300/25",
  tudor: "from-rose-500/25 to-rose-500/5 text-rose-100 ring-rose-400/25",
  tagheuer: "from-cyan-400/25 to-cyan-400/5 text-cyan-100 ring-cyan-300/25",
  longines: "from-indigo-400/25 to-indigo-400/5 text-indigo-100 ring-indigo-300/25",
  tissot: "from-slate-300/25 to-slate-300/5 text-slate-100 ring-slate-200/25",
  seiko: "from-zinc-300/25 to-zinc-300/5 text-zinc-100 ring-zinc-200/25",
  bca: "from-blue-400/25 to-blue-400/5 text-blue-100 ring-blue-300/25",
  mandiri: "from-yellow-400/25 to-yellow-400/5 text-yellow-100 ring-yellow-300/25",
  bni: "from-orange-400/25 to-orange-400/5 text-orange-100 ring-orange-300/25",
  bri: "from-sky-500/25 to-sky-500/5 text-sky-100 ring-sky-400/25",
  cimb: "from-red-500/25 to-red-500/5 text-red-100 ring-red-400/25",
  dbs: "from-rose-500/25 to-rose-500/5 text-rose-100 ring-rose-400/25",
  ocbc: "from-red-400/25 to-red-400/5 text-red-100 ring-red-300/25",
  hsbc: "from-red-600/25 to-red-600/5 text-red-100 ring-red-500/25",
};

const DEFAULT_TINT = "from-white/15 to-white/5 text-white/80 ring-white/20";

export function BrandMark({
  logo,
  label,
  className = "",
}: {
  logo?: string;
  label?: string;
  className?: string;
}) {
  const text = label ?? logo;
  if (!text) return null;
  const tint = (logo && BRAND_TINTS[logo]) || DEFAULT_TINT;

  return (
    <span
      className={`inline-flex items-center rounded-md bg-gradient-to-br px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ${tint} ${className}`}
    >
      {text}
    </span>
  );
}
