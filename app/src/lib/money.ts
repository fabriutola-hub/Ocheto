/** Precios en centavos de Bs. Ej: 2800 -> "Bs 28.00" */
export function formatCents(cents: number): string {
  return `Bs ${(cents / 100).toFixed(2)}`;
}

/** Formato legado sin decimales: 2800 -> "Bs 28" */
export function formatCentsShort(cents: number): string {
  const bs = cents / 100;
  const rounded = Number.isInteger(bs) ? String(bs) : bs.toFixed(2);
  return `Bs ${rounded}`;
}

export function centsToDisplay(cents: number): number {
  return cents / 100;
}
