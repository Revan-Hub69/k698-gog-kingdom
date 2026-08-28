/**
 * Parse power input in any format and return raw integer value.
 * Examples:
 *   "8.5"     → 8,500,000,000 (treated as B)
 *   "8,5"     → 8,500,000,000
 *   "8.5b"    → 8,500,000,000
 *   "8500"    → 8,500,000,000 (treated as M: 8500M = 8.5B)
 *   "8500m"   → 8,500,000,000
 *   "8500000" → 8,500,000,000 (treated as K: 8500000K ≈ 8.5B)
 *   "8500000000" → 8,500,000,000 (raw)
 *   "9.5B"    → 9,500,000,000
 */
export function parsePower(s: string): number {
  if (!s) return 0;
  const trimmed = s.trim().replace(/\s/g, '');
  if (!trimmed) return 0;

  const lower = trimmed.toLowerCase();
  let multiplier = 0; // 0 = auto
  let numStr = trimmed;

  if (lower.endsWith('b')) { multiplier = 1e9; numStr = trimmed.slice(0, -1); }
  else if (lower.endsWith('m')) { multiplier = 1e6; numStr = trimmed.slice(0, -1); }
  else if (lower.endsWith('k')) { multiplier = 1e3; numStr = trimmed.slice(0, -1); }

  // Normalize separators
  const dotCount = (numStr.match(/\./g) || []).length;
  const commaCount = (numStr.match(/,/g) || []).length;
  let normalized = numStr;

  if (dotCount > 1) {
    normalized = numStr.replace(/\./g, '').replace(',', '.');
  } else if (commaCount > 1) {
    normalized = numStr.replace(/,/g, '');
  } else if (dotCount === 1 && commaCount === 1) {
    const lastDot = numStr.lastIndexOf('.');
    const lastComma = numStr.lastIndexOf(',');
    normalized = lastDot > lastComma
      ? numStr.replace(/,/g, '')
      : numStr.replace(/\./g, '').replace(',', '.');
  } else if (commaCount === 1) {
    const parts = numStr.split(',');
    normalized = parts[1]?.length === 3 ? numStr.replace(',', '') : numStr.replace(',', '.');
  }

  const n = parseFloat(normalized);
  if (isNaN(n) || n <= 0) return 0;

  if (multiplier > 0) return Math.round(n * multiplier);

  // Auto-scale: assume power is in 1-20B range
  if (n < 100)          return Math.round(n * 1e9);   // 8.5 → 8.5B
  if (n < 100_000)      return Math.round(n * 1e6);   // 8500 → 8.5B
  if (n < 100_000_000)  return Math.round(n * 1e3);   // 8500000 → 8.5B
  return Math.round(n);                                 // 8500000000 → raw
}

export function formatPower(n: number): string {
  if (!n || n <= 0) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K';
  return n.toLocaleString();
}
