/**
 * Rupiah formatting helpers.
 *
 * Rule for the whole app: numbers live in state as raw integers and are only
 * ever formatted at render time. Nothing downstream of these helpers parses a
 * formatted string back into a number except `parseRupiah`.
 */

const ID = "id-ID";

/** `150000000` -> `Rp150.000.000` */
export function formatRupiah(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return `Rp${new Intl.NumberFormat(ID, { maximumFractionDigits: 0 }).format(safe)}`;
}

/** Digits only, no `Rp` prefix — for use inside text inputs. */
export function formatNumberID(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat(ID, { maximumFractionDigits: 0 }).format(safe);
}

/** Strips everything that isn't a digit, so `Rp1.000.000` -> `1000000`. */
export function parseRupiah(input: string): number {
  const digits = input.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Compact Indonesian shorthand: `36000000` -> `Rp36 jt`, `1500000000` -> `Rp1,5 M`.
 * Used where a full number would break a layout (ladder rungs, chips, sparklines).
 */
export function formatCompactRupiah(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safe);
  const sign = safe < 0 ? "-" : "";
  const trim = (n: number) =>
    n.toFixed(n < 10 && !Number.isInteger(n) ? 1 : 0).replace(".", ",");

  if (abs >= 1_000_000_000_000) return `${sign}Rp${trim(abs / 1_000_000_000_000)} T`;
  if (abs >= 1_000_000_000) return `${sign}Rp${trim(abs / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${sign}Rp${trim(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp${trim(abs / 1_000)} rb`;
  return `${sign}Rp${Math.round(abs)}`;
}

/** Replaces every digit with a bullet, keeping separators, for screen-sharing. */
export function maskRupiah(value: number): string {
  return formatRupiah(value).replace(/\d/g, "•");
}

/** Single entry point for money in the UI so `hideNumbers` can never be missed. */
export function displayRupiah(value: number, hidden: boolean): string {
  return hidden ? maskRupiah(value) : formatRupiah(value);
}

export function displayCompactRupiah(value: number, hidden: boolean): string {
  return hidden ? formatCompactRupiah(value).replace(/\d/g, "•") : formatCompactRupiah(value);
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return "0%";
  const rounded = Number(value.toFixed(decimals));
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(decimals).replace(".", ",")}%`;
}

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** `2026-08-23` -> `23 Agustus 2026`. Safe against invalid input. */
export function formatDateID(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

/** `40` -> `3 tahun 4 bulan`. */
export function formatMonthsAsDuration(totalMonths: number): string {
  if (!Number.isFinite(totalMonths) || totalMonths <= 0) return "Sudah tercapai";
  const months = Math.ceil(totalMonths);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} bulan`;
  if (rest === 0) return `${years} tahun`;
  return `${years} tahun ${rest} bulan`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
