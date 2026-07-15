export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  longDescription?: string;
  price: number;
  image: string;
  images?: string[];
  color: string;
  tags: string[];
  origin?: string;
  roast?: 'light' | 'medium' | 'medium-dark' | 'dark';
  notes?: string[];
  caffeine?: 'normal' | 'high' | 'low' | 'none';
  temperature?: 'hot' | 'iced' | 'both';
  bestseller?: boolean;
  new?: boolean;
  vegan?: boolean;
}

export type ProductCategory = 'cafe' | 'specialty' | 'sin_cafe' | 'frio' | 'panaderia' | 'especialidades' | 'beans' | 'merch';

export interface MenuItem {
  id: string;
  category: ProductCategory;
  items: Product[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  favorite?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: { day: string; time: string }[];
  phone: string;
  whatsapp?: string;
  mapUrl: string;
  image: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  milk?: string;
  extras?: string[];
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
