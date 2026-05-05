interface CartButtonProps {
  count: number;
  total: number;
  onClick: () => void;
}

export default function CartButton({ count, total, onClick }: CartButtonProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-violet-500 text-white px-4 py-3 rounded-full
                 border-2 border-neutral shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200
                 animate-in slide-in-from-bottom-2"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white">
          {count > 9 ? '9+' : count}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium opacity-80">Carrito</span>
        <span className="font-black text-sm">${total.toLocaleString('es-MX')} MXN</span>
      </div>
    </button>
  );
}
