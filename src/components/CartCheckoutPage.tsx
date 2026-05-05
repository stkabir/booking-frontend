import { useState, useEffect } from 'react';
import { api, type BookingResponse } from '../lib/api';
import type { CartItem } from './CartProvider';

interface CartCheckoutData {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

function InlineBanner({ type, message }: { type: 'success' | 'error'; message: string }) {
  const cls = type === 'success'
    ? 'bg-green-50 border-2 border-green-300 text-green-700'
    : 'bg-red-50 border-2 border-red-300 text-red-700';
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${cls}`} role="alert">
      {type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      <span className="flex-1">{message}</span>
    </div>
  );
}

function Spinner({ sm }: { sm?: boolean }) {
  const size = sm ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <svg className={`animate-spin shrink-0 ${size}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const sectionCls = 'bg-white border-2 border-neutral shadow-pop rounded-2xl';

export default function CartCheckoutPage() {
  const [cartData, setCartData] = useState<CartCheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingResponse[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cartCheckout');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartData({
          items: parsed.items || [],
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          specialRequests: '',
        });
      } catch {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartData) return;

    setLoading(true);
    setNotification(null);

    try {
      const bookings: BookingResponse[] = [];

      // Create bookings for each cart item
      for (const item of cartData.items) {
        const booking = await api.createBooking({
          bookable_type: item.type,
          bookable_id: item.itemId,
          customer_name: cartData.customerName,
          customer_email: cartData.customerEmail,
          customer_phone: cartData.customerPhone,
          start_date: item.startDate,
          end_date: item.endDate || null,
          pickup_time: item.pickupTime || null,
          adults: item.adults,
          children: item.children,
          payment_method: 'card',
          promo_code: null,
          special_requests: cartData.specialRequests || null,
        });
        bookings.push(booking);
      }

      // Clear cart and cart checkout
      localStorage.removeItem('cartCheckout');
      localStorage.removeItem('booking_cart');
      setConfirmedBookings(bookings);
    } catch (error: any) {
      const message = error?.errors
        ? Object.values(error.errors).flat().join('. ')
        : error?.message || 'Hubo un error al procesar la reserva. Por favor intenta nuevamente.';
      setNotification({ type: 'error', message });
      setLoading(false);
    }
  };

  if (confirmedBookings.length > 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-400 shadow-[4px_4px_0px_0px_#1E293B] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-green-500 border-2 border-neutral shadow-pop-sm rounded-full px-4 py-1 text-white text-xs font-black uppercase tracking-widest mb-4">
          ✓ Reservas Confirmadas
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-neutral leading-none tracking-tight mb-3">¡Reservas Completadas!</h1>
        <p className="text-neutral/55 mb-8">Tus reservas han sido registradas exitosamente.</p>

        <div className={`${sectionCls} p-6 text-left mb-6`}>
          <h2 className="font-black text-lg text-neutral mb-4">Números de Reserva</h2>
          <div className="space-y-2">
            {confirmedBookings.map((booking, idx) => (
              <div key={booking.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-neutral/60">Reserva #{idx + 1}</span>
                <span className="font-black font-mono text-violet-600">{booking.booking_number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/bookings"
            className="inline-flex items-center justify-center gap-2 h-11 bg-violet-500 text-white font-black px-6 rounded-full border-2 border-neutral shadow-pop-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150"
          >
            Ver mis reservas
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 font-bold text-neutral/60 hover:text-neutral border-2 border-transparent hover:border-neutral/20 rounded-full transition-all"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Spinner />
        <p className="mt-4 text-neutral/55 font-medium">Cargando carrito...</p>
      </div>
    );
  }

  const total = cartData.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {notification && (
        <div className="mb-6">
          <InlineBanner type={notification.type} message={notification.message} />
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-black text-neutral leading-none tracking-tight mb-2">Finalizar Compra</h1>
      <p className="text-neutral/55 mb-8">Completa tus datos para procesar las reservas</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Items Summary */}
        <div className={`${sectionCls} p-6`}>
          <h2 className="font-black text-xl text-neutral mb-5">Resumen del Carrito ({cartData.items.length} items)</h2>
          <div className="space-y-3">
            {cartData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="w-10 h-10 rounded-lg bg-violet-100 border-2 border-violet-300 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.type === 'hotel' && <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                    {item.type === 'tour' && <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                    {item.type === 'transfer' && <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />}
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral text-sm">{item.name}</p>
                  <p className="text-xs text-neutral/50">
                    {new Date(item.startDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`}
                    {' • '}
                    {item.adults} adultos{item.children > 0 && ` + ${item.children} niños`}
                  </p>
                </div>
                <span className="font-black text-violet-600">${item.total.toLocaleString('es-MX')} MXN</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-slate-100">
            <span className="text-neutral/60 font-medium">Total a pagar</span>
            <span className="font-black text-2xl text-neutral">${total.toLocaleString('es-MX')} MXN</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className={`${sectionCls} p-6`}>
          <h2 className="font-black text-xl text-neutral mb-5">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                value={cartData.customerName}
                onChange={(e) => setCartData({ ...cartData, customerName: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                value={cartData.customerEmail}
                onChange={(e) => setCartData({ ...cartData, customerEmail: e.target.value })}
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                value={cartData.customerPhone}
                onChange={(e) => setCartData({ ...cartData, customerPhone: e.target.value })}
                placeholder="+52 998 123 4567"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                Peticiones Especiales
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors resize-none"
                value={cartData.specialRequests}
                onChange={(e) => setCartData({ ...cartData, specialRequests: e.target.value })}
                placeholder="¿Alguna solicitud especial para tus reservas?"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-violet-500 text-white font-black rounded-full border-2 border-neutral shadow-pop-sm
                     flex items-center justify-center gap-2
                     hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
        >
          {loading ? (
            <>
              <Spinner sm />
              Procesando reservas...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Confirmar y Pagar ${total.toLocaleString('es-MX')} MXN
            </>
          )}
        </button>
      </form>
    </div>
  );
}
