import type { Role, DeviceType, RepairStatus, BuybackStatus, OrderStatus } from "@prisma/client";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  avatarUrl: string | null;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Repairs ─────────────────────────────────────────────────────────────────

export interface RepairRequest {
  deviceType: DeviceType;
  deviceModel: string;
  issue: string;
  description?: string;
}

export interface RepairWithUser {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceModel: string;
  issue: string;
  description: string | null;
  estimatedPrice: number | null;
  finalPrice: number | null;
  status: RepairStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

// ─── Buybacks ────────────────────────────────────────────────────────────────

export interface BuybackRequest {
  deviceType: DeviceType;
  deviceModel: string;
  serialNumber: string; // IMEI or serial number for unique device identification
  condition: string;
  description?: string;
}

export interface PriceEstimate {
  min: number;
  max: number;
  estimated: number;
}

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

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  repairs: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  buybacks: {
    total: number;
    pending: number;
    accepted: number;
  };
  users: {
    total: number;
    newThisMonth: number;
  };
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

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
