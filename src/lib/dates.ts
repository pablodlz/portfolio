/** Formatação de datas pt-BR, determinística (sem depender de locale do runtime). */

const MESES_CURTOS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
] as const;

/** "2025-10" → "out 2025" */
export function formatYearMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const nome = MESES_CURTOS[(m ?? 1) - 1];
  if (!nome || !y) throw new Error(`Data YYYY-MM inválida: "${ym}"`);
  return `${nome} ${y}`;
}

/** "2025-10" + null + current → "out 2025 — atual" */
export function formatRange(start: string, end: string | null, current: boolean): string {
  const fim = current || end === null ? 'atual' : formatYearMonth(end);
  return `${formatYearMonth(start)} — ${fim}`;
}

/** "2026-07-06" → "6 de jul de 2026" */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const nome = MESES_CURTOS[(m ?? 1) - 1];
  if (!nome || !y || !d) throw new Error(`Data ISO inválida: "${iso}"`);
  return `${d} de ${nome} de ${y}`;
}

/** Duração aproximada "out 2025 — atual" em meses, para exibição ("· 10 meses"). */
export function monthsBetween(start: string, end: string | null, now = new Date()): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end
    ? end.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  return Math.max(1, (ey! - sy!) * 12 + (em! - sm!) + 1);
}
