import { create } from 'zustand';

export type ProductId = string | number;

export type CartItem = {
  id: string;
  productId: ProductId;
  nombre: string;
  precioPorKg: number;
  cantidadKg: number;
  subtotal: number;
};

export type CartState = {
  items: CartItem[];
  total: number;
};

type CartActions = {
  addItem: (input: { productId: ProductId; nombre: string; precioPorKg: number; cantidadKg?: number }) => void;
  removeItem: (rowId: string) => void;
  clear: () => void;
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => acc + item.subtotal, 0);

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export const useCartStore = create<CartState & CartActions>((set) => ({
  items: [],
  total: 0,
  addItem: ({ productId, nombre, precioPorKg, cantidadKg = 1 }) =>
    set((state) => {
      const newItem: CartItem = {
        id: createId(),
        productId,
        nombre,
        precioPorKg,
        cantidadKg,
        subtotal: Number((precioPorKg * cantidadKg).toFixed(2)),
      };
      const items = [...state.items, newItem];
      return { items, total: Number(calculateTotal(items).toFixed(2)) };
    }),
  removeItem: (rowId) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== rowId);
      return { items, total: Number(calculateTotal(items).toFixed(2)) };
    }),
  clear: () => set({ items: [], total: 0 }),
}));
