import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "@/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          const newQty = existing.quantity + 1;
          if (newQty > existing.stock) return; // respect stock limit
          set({
            items: items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        const item = get().items.find((i) => i.productId === productId);
        if (item && quantity > item.stock) return;
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      version: 1,
    }
  )
);
