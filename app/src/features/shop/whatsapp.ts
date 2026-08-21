import { WHATSAPP_NUMBER } from '@/shared/constants';

/** Genera la URL de WhatsApp con mensaje prellenado (máx. 400 caracteres). */
export function buildWhatsAppProductUrl(name: string, priceCents?: number): string {
  const base = `Hola Ocheto, me interesa: ${name}`;
  const text =
    priceCents !== undefined && priceCents > 0
      ? `${base} - Bs ${(priceCents / 100).toFixed(2)}`
      : base;
  const encoded = encodeURIComponent(text);
  if (encoded.length > 400) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(base)}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
