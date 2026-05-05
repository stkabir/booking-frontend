import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const itemTypeLabels = {
  hotel: { label: 'Hotel', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'bg-violet-100 text-violet-700 border-violet-300' },
  tour: { label: 'Tour', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  transfer: { label: 'Traslado', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-amber-100 text-amber-700 border-amber-300' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export default function CartDrawer({ isOpen, items, total, onClose, onRemove, onCheckout }: CartDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Count transfer items for WhatsApp promo
  const transferCount = items.filter((item) => item.type === 'transfer').length;

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-2xl z-50 transition-all duration-300 ease-out ${
          isOpen ? 'right-0 opacity-100' : '-right-[400px] opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 border-2 border-violet-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="font-black text-lg text-neutral">Tu Carrito</h2>
              <p className="text-xs text-neutral/50">{items.length} {items.length === 1 ? 'servicio' : 'servicios'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-neutral/60 hover:text-neutral transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-neutral/60 font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-neutral/40 mt-1">Agrega servicios para comenzar</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-violet-500 text-white font-bold rounded-full text-sm hover:bg-violet-600 transition-colors"
              >
                Explorar servicios
              </button>
            </div>
          ) : (
            items.map((item) => {
              const typeInfo = itemTypeLabels[item.type];
              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-slate-200 rounded-xl p-3 relative group hover:border-violet-300 transition-colors"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={typeInfo.icon} />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-8">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${typeInfo.color} mb-1`}>
                        {typeInfo.label}
                      </span>
                      <h3 className="font-bold text-neutral text-sm leading-tight truncate">{item.name}</h3>

                      {/* Details */}
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral/50 mt-1">
                        <span>{formatDate(item.startDate)}</span>
                        {item.endDate && <span>→ {formatDate(item.endDate)}</span>}
                        {item.nights && <span>({item.nights} noches)</span>}
                        {item.duration && <span>({item.duration})</span>}
                        {item.pickupTime && <span>{item.pickupTime}</span>}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral/60 mt-1">
                        <span>{item.adults} adultos</span>
                        {item.children > 0 && <span>+ {item.children} niños</span>}
                      </div>

                      {/* Price */}
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <span className="font-black text-violet-600">${item.total.toLocaleString('es-MX')} MXN</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Promo for 4+ Transfers */}
        {transferCount >= 4 && (
          <div className="mx-4 mb-4 bg-green-50 border-2 border-green-400 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-800 text-sm">¿Tienes {transferCount} traslados?</p>
                <p className="text-green-700 text-xs mt-1">Cotiza por WhatsApp y obtén <strong>precio preferencial</strong> para grupos.</p>
                <a
                  href={`https://wa.me/529981234567?text=Hola, tengo ${transferCount} traslados en mi carrito y quiero cotizar con precio preferencial`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-700 hover:text-green-800 underline"
                >
                  Cotizar por WhatsApp →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-slate-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral/60 font-medium">Total</span>
              <span className="font-black text-2xl text-neutral">${total.toLocaleString('es-MX')} MXN</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full h-12 bg-violet-500 text-white font-black rounded-full border-2 border-neutral shadow-pop-sm
                         flex items-center justify-center gap-2
                         hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Proceder al pago
            </button>
            <button
              onClick={onClose}
              className="w-full h-10 text-neutral/60 font-medium hover:text-neutral transition-colors text-sm"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
