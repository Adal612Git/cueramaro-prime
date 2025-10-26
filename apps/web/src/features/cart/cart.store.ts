import { create } from 'zustand';
import type { Product } from '../../lib/api';

export type CartItem = { product: Product; kg: number; price?: number };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  remove: (index) => set((s) => ({ items: s.items.filter((_, i) => i !== index) })),
  clear: () => set({ items: [] }),
}));
