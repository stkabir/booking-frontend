import { useCartStore } from '../store/cartStore';

export default function CartNavButton() {
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) => state.items.length);

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-primary/8 text-neutral hover:text-primary transition-colors"
      aria-label={`Carrito (${itemCount} items)`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
