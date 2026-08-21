export interface BranchMenuItem {
  name: string;
  description?: string;
  price: number | { regular: number; grande: number };
}

export interface BranchMenuSection {
  title: string;
  subtitle?: string;
  items: BranchMenuItem[];
}

export interface BranchMenu {
  id: string;
  name: string;
  slug: string;
  locationId: string;
  sections: BranchMenuSection[];
}

export const BRANCH_MENUS: BranchMenu[] = [
  {
    id: 'federico-suazo',
    name: 'Federico Suazo',
    slug: 'federico-suazo',
    locationId: 'loc3',
    sections: [
      {
        title: 'Bebidas Calientes',
        subtitle: 'Con Café (Regular)',
        items: [
          { name: 'Espresso Simple', description: '1 oz. - 30ml.', price: 12 },
          { name: 'Espresso Doble', description: '2 oz. - 60ml.', price: 14 },
          { name: 'Americano', price: 15 },
          { name: 'Capuccino', price: 19 },
          { name: 'Capuccino Vienés', description: 'Con Crema Batida', price: 24 },
          { name: 'Latte Mocca', description: 'con Chocolate', price: 24 },
          { name: 'Latte Ocheto', description: 'con Dulce de Leche', price: 24 },
          { name: 'Latte Vainilla', price: 24 },
          { name: 'Latte Vainilla y Canela', price: 24 },
          { name: 'Latte Coco', price: 24 },
          { name: 'Latte Caramelo', price: 24 },
          { name: 'Flat White', description: 'Bebida con más Café', price: 23 },
          { name: 'Latte Baileys', description: 'con Licor de Crema de Whisky', price: 34 },
          { name: 'Capuccino Irlandés', description: 'Estilo Irlandés con Whisky', price: 31 },
        ],
      },
      {
        title: 'Bebidas Calientes',
        subtitle: 'Sin Café (Con Leche ó Agua - Regular)',
        items: [
          { name: 'Chocolate Caliente', price: 19 },
          { name: 'Chocolate con Crema', price: 23 },
          { name: 'Latte Chai sin Café', price: 19 },
          { name: 'Té o Mate', price: 13 },
        ],
      },
      {
        title: 'Matcha',
        subtitle: 'Té Verde • Leche - Regular',
        items: [
          { name: 'Latte Matcha', price: 24 },
          { name: 'Latte frío Matcha', price: 23 },
          { name: 'Frappé Matcha', price: 25 },
        ],
      },
      {
        title: 'Adicional / Nuevo en Tienda',
        items: [
          { name: 'Crema Extra', description: 'Para cualquier bebida o postre', price: 6 },
          { name: 'Muffin Chocolate', description: 'Nuevo en Tienda', price: 13 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Frapuccinos — Con Café • Crema Batida • Hielo Picado',
        items: [
          { name: 'Frappuccino', price: 22 },
          { name: 'Frappuccino Mocca', description: 'con Chocolate', price: 24 },
          { name: 'Frappuccino Ocheto', description: 'con Dulce de Leche', price: 24 },
          { name: 'Frappuccino Oreo', price: 25 },
          { name: 'Frappuccino Baileys', description: 'Licor de Crema de Whisky', price: 36 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Frappés sin Café — Sin Café • Hielo Picado',
        items: [
          { name: 'Frappé o Jugo en Agua', description: 'Fruta de Temporada', price: 19 },
          { name: 'Frappé con Leche', description: 'Fruta de Temporada + Crema Batida', price: 22 },
          { name: 'Smoothie Frutos Rojos', description: 'Combinación de Frutos Rojos, Yogur, Leche + Crema Batida', price: 24 },
          { name: 'Frappé Chai', description: 'Bebida a Base de Té Chai Sin Café', price: 24 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Ice Lattes — Con café • Cubos de Hielo',
        items: [
          { name: 'Americano frío', price: 19 },
          { name: 'Latte frío', price: 20 },
          { name: 'Caramel Macchiato Vainilla', price: 23 },
          { name: 'Latte frío Mocca', description: 'con Chocolate', price: 23 },
          { name: 'Latte frío Ocheto', description: 'con Dulce de Leche', price: 23 },
          { name: 'Latte frío Vainilla', price: 23 },
          { name: 'Latte frío Coco', price: 23 },
          { name: 'Latte frío Caramelo', price: 23 },
          { name: 'Latte frío Chai', description: 'Base de Té Chai Sin Café', price: 23 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Malteadas — Con Base de Helado • Café',
        items: [
          { name: 'Affogato', description: 'Helado de Vainilla cubierto con Café Espresso caliente', price: 21 },
          { name: 'Malteada de Café', price: 25 },
          { name: 'Malteada de Oreo', description: 'Con Café / Sin Café', price: 27 },
        ],
      },
      {
        title: 'Repostería',
        subtitle: 'Dulce',
        items: [
          { name: 'Galleta Ocheto', description: 'Masa de vainilla con chips de chocolate', price: 13 },
          { name: 'Galleta Red Velvet', description: 'Con Chispas de Chocolate Blanco y Rellena de Dulce de Leche', price: 13 },
          { name: 'Galleta de Avena', description: 'Con Chispas de Chocolate sin Harinas', price: 13 },
          { name: 'Rollo de Canela', price: 16 },
          { name: 'Pie de Manzana', price: 16 },
          { name: 'Brownie de Chocolate', price: 16 },
          { name: 'Pie de Manzana con Helado', price: 23 },
          { name: 'Brownie de Chocolate con Helado', price: 23 },
          { name: 'Croissant de Chocolate', price: 16 },
          { name: 'Torta Ocheto', description: 'Relleno y cobertura de Ganache de Chocolate', price: 25 },
          { name: 'Osomisú', description: 'Tiramisú al estilo Ocheto', price: 25 },
          { name: 'Osolemon Pie', description: 'Marquesa cremosa de limón', price: 25 },
        ],
      },
      {
        title: 'Repostería',
        subtitle: 'Salado',
        items: [
          { name: 'Croissant de Queso', price: 16 },
          { name: 'Croissant de Jamón y Queso', price: 16 },
          { name: 'Empanada 3 quesos', description: 'Con un toque de albahaca', price: 10 },
          { name: 'Empanada de Jamón y Queso', price: 10 },
          { name: 'Cuñapé', price: 10 },
        ],
      },
    ],
  },
  {
    id: 'oruro-illampu',
    name: 'Oruro & Illampu',
    slug: 'oruro-illampu',
    locationId: 'loc1',
    sections: [
      {
        title: 'Bebidas Calientes',
        subtitle: 'Con Café (Regular / Grande)',
        items: [
          { name: 'Espresso Simple', description: '1 oz. - 30ml.', price: 10 },
          { name: 'Espresso Doble', description: '2 oz. - 60ml.', price: 12 },
          { name: 'Americano', price: { regular: 14, grande: 19 } },
          { name: 'Capuccino', price: { regular: 16, grande: 21 } },
          { name: 'Capuccino Vienés', description: 'Con Crema Batida', price: { regular: 20, grande: 25 } },
          { name: 'Latte Mocca', description: 'con Chocolate', price: { regular: 20, grande: 25 } },
          { name: 'Latte Ocheto', description: 'con Dulce de Leche', price: { regular: 20, grande: 25 } },
          { name: 'Latte Vainilla', price: { regular: 20, grande: 25 } },
          { name: 'Latte Vainilla y Canela', price: { regular: 20, grande: 25 } },
          { name: 'Latte Coco', price: { regular: 20, grande: 25 } },
          { name: 'Latte Caramelo', price: { regular: 20, grande: 25 } },
          { name: 'Flat White', description: 'Bebida con más café', price: { regular: 20, grande: 25 } },
          { name: 'Latte Baileys', description: 'con Licor de Crema de Whisky', price: { regular: 29, grande: 34 } },
          { name: 'Capuccino Irlandés', description: 'Estilo Irlandés con Whisky', price: { regular: 26, grande: 31 } },
        ],
      },
      {
        title: 'Bebidas Calientes',
        subtitle: 'Sin Café (Con Leche ó Agua)',
        items: [
          { name: 'Chocolate Caliente', price: { regular: 16, grande: 21 } },
          { name: 'Chocolate con Crema', price: { regular: 19, grande: 24 } },
          { name: 'Latte Chai sin Café', price: { regular: 19, grande: 24 } },
          { name: 'Té o Mate', price: 11 },
        ],
      },
      {
        title: 'Matcha',
        subtitle: 'Té Verde • Leche',
        items: [
          { name: 'Latte Matcha', price: { regular: 20, grande: 25 } },
          { name: 'Latte frío Matcha', price: 19 },
          { name: 'Frappé Matcha', price: 21 },
        ],
      },
      {
        title: 'Adicional / Nuevo en Tienda',
        items: [
          { name: 'Crema Extra', description: 'Para cualquier bebida', price: 5 },
          { name: 'Muffin Chocolate', description: 'Nuevo en Tienda', price: 11 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Frapuccinos — Con Café • Crema Batida • Hielo Picado',
        items: [
          { name: 'Frappuccino', price: 18 },
          { name: 'Frappuccino Mocca', description: 'con Chocolate', price: 20 },
          { name: 'Frappuccino Ocheto', description: 'con Dulce de Leche', price: 20 },
          { name: 'Frappuccino Oreo', price: 21 },
          { name: 'Frappuccino Baileys', description: 'con Licor de Crema de Whisky', price: 32 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Frappés sin Café — Sin Café • Hielo Picado',
        items: [
          { name: 'Frappé o Jugo en Agua', description: 'Fruta de Temporada', price: 16 },
          { name: 'Frappé con Leche', description: 'Fruta de Temporada + Crema Batida', price: 18 },
          { name: 'Smoothie Frutos Rojos', description: 'Combinación de Frutos Rojos, Yogur, Leche + Crema Batida', price: 20 },
          { name: 'Frappé Chai', description: 'Bebida a Base de Té Chai Sin Café', price: 20 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Ice Lattes — Con café • Cubos de Hielo',
        items: [
          { name: 'Americano frío', price: 16 },
          { name: 'Latte frío', price: 17 },
          { name: 'Caramel Macchiato Vainilla', price: 19 },
          { name: 'Latte frío Mocca', description: 'con Chocolate', price: 19 },
          { name: 'Latte frío Ocheto', description: 'con Dulce de Leche', price: 19 },
          { name: 'Latte frío Vainilla', price: 19 },
          { name: 'Latte frío Coco', price: 19 },
          { name: 'Latte frío Caramelo', price: 19 },
          { name: 'Latte frío Chai', price: 19 },
        ],
      },
      {
        title: 'Bebidas Frías',
        subtitle: 'Malteadas — Con Base de Helado',
        items: [
          { name: 'Affogato', description: 'Helado de Vainilla cubierto con Café Espresso caliente', price: 17 },
          { name: 'Malteada de Café', price: 21 },
          { name: 'Malteada de Oreo', description: 'Con Café / Sin Café', price: 23 },
        ],
      },
      {
        title: 'Repostería',
        subtitle: 'Dulce',
        items: [
          { name: 'Galleta Ocheto', description: 'Masa de vainilla con chips de chocolate', price: 11 },
          { name: 'Galleta Red Velvet', description: 'Con Chispas de Chocolate Blanco y Rellena de Dulce de Leche', price: 11 },
          { name: 'Galleta de Avena', description: 'Con Chispas de Chocolate sin Harinas', price: 11 },
          { name: 'Rollo de Canela', price: 13 },
          { name: 'Pie de Manzana', price: 13 },
          { name: 'Brownie de Chocolate', price: 13 },
          { name: 'Pie de Manzana con Helado', price: 19 },
          { name: 'Brownie de Chocolate con Helado', price: 19 },
          { name: 'Croissant de Chocolate', price: 13 },
          { name: 'Osomisú', description: 'Tiramisú al estilo Ocheto', price: 22 },
        ],
      },
      {
        title: 'Repostería',
        subtitle: 'Salado',
        items: [
          { name: 'Croissant de Queso', price: 13 },
          { name: 'Croissant de Jamón y Queso', price: 13 },
          { name: 'Empanada 3 quesos', description: 'Con un toque de albahaca', price: 8 },
          { name: 'Empanada de Jamón y Queso', price: 8 },
          { name: 'Cuñapé', price: 8 },
        ],
      },
    ],
  },
];

export const SHARED_MENU_SLUGS = ['oruro', 'illampu'] as const;

export function getBranchMenuBySlug(slug: string): BranchMenu | undefined {
  if (SHARED_MENU_SLUGS.includes(slug as typeof SHARED_MENU_SLUGS[number])) {
    return BRANCH_MENUS.find((m) => m.id === 'oruro-illampu');
  }
  return BRANCH_MENUS.find((m) => m.slug === slug);
}

export function getBranchMenuSlugs(): string[] {
  return BRANCH_MENUS.map((m) => m.slug);
}
