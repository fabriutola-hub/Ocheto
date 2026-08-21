import type { Location } from '@/types';

export const LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Ocheto Illampu',
    address: 'Av. Illampu cerca a la Esquina Santa Cruz, Hotel Berlina',
    city: 'La Paz, Bolivia',
    hours: [
      { day: 'Lun - Jue', time: '7:00 — 21:00' },
      { day: 'Vie - Sáb', time: '7:00 — 23:00' },
      { day: 'Domingo', time: '8:00 — 22:00' },
    ],
    phone: '+591 2 1234567',
    whatsapp: '+591 70123456',
    mapUrl: 'https://maps.google.com/?q=Av+Illampu+La+Paz',
    image: '/assets/wallaper_1.webp',
    features: ['WiFi', 'Para llevar', 'Terraza', 'Eventos'],
  },
  {
    id: 'loc2',
    name: 'Ocheto Oruro',
    address: 'C. Oruro entre C. Murillo y Mariscal Santa Cruz (A media cuadra de Correos)',
    city: 'La Paz, Bolivia',
    hours: [
      { day: 'Lun - Vie', time: '7:00 — 22:00' },
      { day: 'Sáb - Dom', time: '8:00 — 23:00' },
    ],
    phone: '+591 2 7654321',
    whatsapp: '+591 70987654',
    mapUrl: 'https://maps.google.com/?q=C+Oruro+La+Paz',
    image: '/assets/wallaper_2.webp',
    features: ['WiFi', 'Coworking', 'Catering', 'Pet-friendly'],
  },
  {
    id: 'loc3',
    name: 'Ocheto Federico Zuazo',
    address: 'C. Federico Zuazo casi esq. Reyes Ortiz',
    city: 'La Paz, Bolivia',
    hours: [
      { day: 'Lun - Vie', time: '7:00 — 22:00' },
      { day: 'Sáb - Dom', time: '8:00 — 23:00' },
    ],
    phone: '+591 2 2345678',
    whatsapp: '+591 70234567',
    mapUrl: 'https://maps.google.com/?q=Federico+Zuazo+La+Paz',
    image: '/assets/wallaper_1.webp',
    features: ['WiFi', 'Para llevar', 'Terraza', 'Eventos'],
  },
];
