import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: 'hotel' | 'tour' | 'transfer';
  itemId: number;
  name: string;
  slug: string;
  image?: string;
  startDate: string;
  endDate?: string;
  pickupTime?: string;
  adults: number;
  children: number;
  pricePerUnit: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  nights?: number;
  duration?: string;
  destination?: string;
  vehicleType?: string;
  fromLocation?: string;
  toLocation?: string;
  addedAt: number; // Timestamp when item was added
}

const CART_EXPIRATION_DAYS = 2;
const CART_EXPIRATION_MS = CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  removeExpiredItems: () => void;
  // Computed
  itemCount: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: `${item.type}-${item.itemId}-${Date.now()}`,
          addedAt: Date.now(),
        };
        set((state) => ({
          items: [...state.items, newItem],
          isOpen: true,
        }));
      },

      removeExpiredItems: () => {
        const now = Date.now();
        set((state) => ({
          items: state.items.filter((item) => now - item.addedAt < CART_EXPIRATION_MS),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () => get().items.length,
      total: () => get().items.reduce((sum, item) => sum + item.total, 0),
    }),
    {
      name: 'booking-cart-storage',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            // Remove expired items on rehydrate
            const now = Date.now();
            const validItems = state.items.filter((item) => now - item.addedAt < CART_EXPIRATION_MS);
            if (validItems.length !== state.items.length) {
              state.items = validItems;
            }
          }
        };
      },
    }
  )
);
