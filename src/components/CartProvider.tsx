import { useEffect, useState, type ReactNode } from 'react';
import { useCartStore } from '../store/cartStore';
import CartDrawer from './CartDrawer';

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
}

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const updateItem = useCartStore((state) => state.updateItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const itemCount = items.length;
  const total = items.reduce((sum, item) => sum + item.total, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <>
      {children}

      {/* Cart Drawer */}
      {mounted && (
        <CartDrawer
          isOpen={isOpen}
          items={items}
          total={total}
          onClose={closeCart}
          onRemove={removeItem}
          onCheckout={goToCheckout}
        />
      )}
    </>
  );
}
