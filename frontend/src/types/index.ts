// ─── Device Types ────────────────────────────────────────────────────────────

export type DeviceType = "PHONE" | "PC" | "LAPTOP" | "CONSOLE" | "TABLET" | "OTHER";

// ─── Shop ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  stock: number;
  images: string[];
  published: boolean;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// ─── Repair Pricing ───────────────────────────────────────────────────────────

export const REPAIR_PRICES: Record<DeviceType, Record<string, { min: number; max: number }>> = {
  PHONE: {
    "Display tauschen":      { min: 49,  max: 199 },
    "Akku tauschen":         { min: 29,  max: 79  },
    "Ladeanschluss reparieren": { min: 39, max: 99 },
    "Kamera reparieren":     { min: 59,  max: 149 },
    "Wasserschaden":         { min: 49,  max: 199 },
    "Nicht einschaltbar":    { min: 39,  max: 149 },
    "Sonstiges":             { min: 29,  max: 199 },
  },
  PC: {
    "Display tauschen":      { min: 99,  max: 349 },
    "Mainboard defekt":      { min: 149, max: 499 },
    "Netzteil tauschen":     { min: 59,  max: 199 },
    "Datenverlust":          { min: 99,  max: 399 },
    "Viren entfernen":       { min: 49,  max: 99  },
    "Windows neu aufsetzen": { min: 49,  max: 129 },
    "Sonstiges":             { min: 49,  max: 299 },
  },
  LAPTOP: {
    "Display tauschen":      { min: 99,  max: 299 },
    "Akku tauschen":         { min: 49,  max: 149 },
    "Tastatur tauschen":     { min: 49,  max: 149 },
    "Mainboard defekt":      { min: 149, max: 499 },
    "Lüfter reinigen":       { min: 39,  max: 79  },
    "Sonstiges":             { min: 49,  max: 299 },
  },
  CONSOLE: {
    "HDMI-Port reparieren":  { min: 69,  max: 149 },
    "Disc-Laufwerk defekt":  { min: 59,  max: 129 },
    "Überhitzung / Lüfter":  { min: 39,  max: 99  },
    "Controller reparieren": { min: 29,  max: 79  },
    "Sonstiges":             { min: 39,  max: 199 },
  },
  TABLET: {
    "Display tauschen":      { min: 79,  max: 249 },
    "Akku tauschen":         { min: 49,  max: 99  },
    "Sonstiges":             { min: 39,  max: 199 },
  },
  OTHER: {
    "Sonstiges":             { min: 29,  max: 299 },
  },
};

export const BUYBACK_MULTIPLIERS: Record<string, number> = {
  "Wie neu":        0.55,
  "Sehr gut":       0.45,
  "Gut":            0.35,
  "Akzeptabel":     0.20,
  "Defekt":         0.08,
};
