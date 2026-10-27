/**
 * Canonical Currency Formatter for Wateen Book
 * 
 * Strict Money Guardrail:
 * - All financial values are stored and calculated as INTEGER CENTS / SUBUNITS.
 * - Zero IEEE 754 float arithmetic in financial domains.
 * - Formats consistently to Algerian Dinars (DZD / د.ج / DA).
 */

export interface FormatDzdOptions {
  /** If true, returns 'Free' / 'Gratuit' / 'مجاني' when cents === 0 */
  showFreeLabel?: boolean;
  /** Active locale language */
  locale?: "fr" | "ar" | "en";
  /** Custom suffix override, defaults to standard DZD / DA */
  suffix?: string;
}

/**
 * Converts integer cents to major DZD units using integer arithmetic.
 * e.g., 250000 cents -> 2500 DZD
 */
export function centsToDzd(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents / 100);
}

/**
 * Formats integer cents into localized Algerian DZD currency string.
 *
 * @param cents Amount in integer cents (e.g. 250000 for 2500 DZD)
 * @param options FormatDzdOptions
 * @returns Formatted currency string (e.g. "2 500 DZD" or "Gratuit")
 */
export function formatDzd(cents: number, options: FormatDzdOptions = {}): string {
  const { showFreeLabel = false, locale = "fr", suffix } = options;

  if (cents <= 0 && showFreeLabel) {
    if (locale === "ar") return "مجاني";
    if (locale === "en") return "Free";
    return "Gratuit";
  }

  const majorUnits = centsToDzd(cents);
  const formattedNumber = new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(majorUnits);

  if (suffix) {
    return `${formattedNumber} ${suffix}`;
  }

  if (locale === "ar") {
    return `${formattedNumber} د.ج`;
  }
  if (locale === "en") {
    return `${formattedNumber} DZD`;
  }
  return `${formattedNumber} DA`;
}

export default formatDzd;
