export const WHATSAPP_NUMBER = '59170123456';

export function getWhatsAppUrl(whatsapp: string | undefined): string {
  if (!whatsapp) return '#';
  return `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
}
