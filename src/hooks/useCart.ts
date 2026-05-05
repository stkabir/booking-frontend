import { useState, useEffect, useCallback } from 'react';

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
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const CART_KEY = 'booking_cart';

export function useCart() {
  const [cart, setCart] = useState<CartState>({ items: [], isOpen: false });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCart(prev => ({ ...prev, items: parsed.items || [] }));
      } catch {
        console.error('Error parsing cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify({ items: cart.items }));
    }
  }, [cart.items, isLoaded]);

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'addedAt'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.type}-${item.itemId}-${Date.now()}`,
      addedAt: Date.now(),
    };
    setCart(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      isOpen: true,
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart(prev => ({ ...prev, items: [] }));
  }, []);

  const openCart = useCallback(() => {
    setCart(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeCart = useCallback(() => {
    setCart(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleCart = useCallback(() => {
    setCart(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const itemCount = cart.items.length;
  const total = cart.items.reduce((sum, item) => sum + item.total, 0);

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    isLoaded,
    itemCount,
    total,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}
