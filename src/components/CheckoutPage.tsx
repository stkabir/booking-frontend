import { useState, useEffect } from 'react';
import { api, type BookingResponse } from '../lib/api';

function InlineBanner({ type, message, onDismiss }: { type: 'success' | 'error'; message: string; onDismiss?: () => void }) {
  const colors = type === 'success'
    ? 'bg-success/10 border-success/30 text-success'
    : 'bg-error/10 border-error/30 text-error';
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${colors}`} role="alert">
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
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface BookingData {
  startDate: string;
  endDate: string;
  pickupTime: string;
  adults: number;
  children: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  flightNumber: string;
  itemType: 'hotel' | 'tour' | 'transfer';
  itemId: number;
  itemSlug: string;
  itemName: string;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  tax: number;
  total: number;
  nights?: number;
}

function ConfirmationScreen({ booking, itemName }: { booking: BookingResponse; itemName: string }) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
      <p className="text-base-content/60 mb-8">Hemos recibido tu solicitud de reserva. Te enviaremos los detalles a tu correo.</p>

      {/* Booking Number */}
      <div className="card bg-primary/5 border border-primary/20 mb-6">
        <div className="card-body py-5">
          <p className="text-xs text-base-content/50 uppercase tracking-widest mb-1">Número de Reserva</p>
          <p className="text-3xl font-bold font-mono tracking-wider text-primary">{booking.booking_number}</p>
          <p className="text-xs text-base-content/50 mt-1">Guarda este número para consultar tu reserva</p>
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-base-100 shadow-sm border border-base-200 text-left mb-6">
        <div className="card-body p-6 space-y-3">
          <h2 className="font-bold text-lg mb-1">Resumen</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <p className="text-base-content/50">Servicio</p>
              <p className="font-semibold">{itemName}</p>
            </div>
            <div>
              <p className="text-base-content/50">Cliente</p>
              <p className="font-semibold">{booking.customer_name}</p>
            </div>
            <div>
              <p className="text-base-content/50">Email</p>
              <p className="font-semibold">{booking.customer_email}</p>
            </div>
            <div>
              <p className="text-base-content/50">Fecha</p>
              <p className="font-semibold">{formatDate(booking.start_date)}</p>
            </div>
            <div>
              <p className="text-base-content/50">Total</p>
              <p className="font-bold text-primary">${booking.total.toLocaleString('es-MX')} MXN</p>
            </div>
            <div>
              <p className="text-base-content/50">Estado</p>
              <span className="badge badge-warning badge-sm capitalize">{booking.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="alert bg-info/8 border border-info/20 rounded-2xl text-left mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">
          Recibirás un correo de confirmación en <strong>{booking.customer_email}</strong>. Si no lo ves, revisa tu carpeta de spam.
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`/bookings?number=${booking.booking_number}`} className="btn btn-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ver mi reserva
        </a>
        <a href="/" className="btn btn-ghost">Volver al inicio</a>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'oxxo'>('card');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      try {
        setBookingData(JSON.parse(storedData));
      } catch {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setNotification({ type: 'error', message: 'Debes aceptar los términos y condiciones para continuar.' });
      return;
    }

    if (!bookingData) return;

    setLoading(true);
    setNotification(null);

    try {
      const booking = await api.createBooking({
        bookable_type: bookingData.itemType,
        bookable_id: bookingData.itemId,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        start_date: bookingData.startDate,
        end_date: bookingData.itemType === 'hotel' ? bookingData.endDate : null,
        pickup_time: bookingData.itemType === 'transfer' ? bookingData.pickupTime : null,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        payment_method: paymentMethod,
        promo_code: bookingData.promoCode || null,
        special_requests: bookingData.specialRequests || null,
        flight_number: bookingData.flightNumber || null,
      });

      localStorage.removeItem('bookingData');
      setConfirmedBooking(booking);
    } catch (error: any) {
      const message = error?.errors
        ? Object.values(error.errors).flat().join('. ')
        : error?.message || 'Hubo un error al crear la reserva. Por favor intenta nuevamente.';
      setNotification({ type: 'error', message });
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return <ConfirmationScreen booking={confirmedBooking} itemName={bookingData?.itemName ?? ''} />;
  }

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Cargando información de reserva...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Notification Banner */}
      {notification && (
        <div className="mb-6">
          <InlineBanner
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm mb-8">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li>
            <a href={`/${bookingData.itemType}s`}>
              {bookingData.itemType === 'hotel' ? 'Hoteles' : bookingData.itemType === 'tour' ? 'Tours' : 'Traslados'}
            </a>
          </li>
          <li><a href={`/${bookingData.itemType}s/${bookingData.itemSlug}`}>{bookingData.itemName}</a></li>
          <li className="font-semibold">Checkout</li>
        </ul>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Finalizar Reserva</h1>
        <p className="text-base-content/60">Revisa tu información y completa tu reserva de forma segura</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Booking Summary */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <h2 className="font-bold text-xl mb-4">Resumen de Reserva</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-24 w-24 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shrink-0">
                      {bookingData.itemType === 'hotel' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      )}
                      {bookingData.itemType === 'tour' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      )}
                      {bookingData.itemType === 'transfer' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{bookingData.itemName}</h3>
                      <div className="badge badge-primary mt-1 capitalize">{bookingData.itemType}</div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingData.itemType === 'hotel' && (
                      <>
                        <div>
                          <p className="text-sm text-base-content/70">Check-in</p>
                          <p className="font-semibold">{formatDate(bookingData.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Check-out</p>
                          <p className="font-semibold">{formatDate(bookingData.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Noches</p>
                          <p className="font-semibold">{bookingData.nights} {bookingData.nights === 1 ? 'noche' : 'noches'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Huéspedes</p>
                          <p className="font-semibold">{bookingData.adults} adultos</p>
                        </div>
                      </>
                    )}
                    {bookingData.itemType === 'tour' && (
                      <>
                        <div>
                          <p className="text-sm text-base-content/70">Fecha del Tour</p>
                          <p className="font-semibold">{formatDate(bookingData.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Participantes</p>
                          <p className="font-semibold">
                            {bookingData.adults} adultos{bookingData.children > 0 && `, ${bookingData.children} niños`}
                          </p>
                        </div>
                      </>
                    )}
                    {bookingData.itemType === 'transfer' && (
                      <>
                        <div>
                          <p className="text-sm text-base-content/70">Fecha</p>
                          <p className="font-semibold">{formatDate(bookingData.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Hora de Recogida</p>
                          <p className="font-semibold">{bookingData.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Pasajeros</p>
                          <p className="font-semibold">{bookingData.adults}</p>
                        </div>
                        {bookingData.flightNumber && (
                          <div>
                            <p className="text-sm text-base-content/70">Número de Vuelo</p>
                            <p className="font-semibold">{bookingData.flightNumber}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {bookingData.specialRequests && (
                    <>
                      <div className="divider"></div>
                      <div>
                        <p className="text-sm text-base-content/70 mb-1">Peticiones Especiales</p>
                        <p className="text-sm">{bookingData.specialRequests}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <h2 className="font-bold text-xl mb-4">Información de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-base-content/70">Nombre Completo</p>
                    <p className="font-semibold">{bookingData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Email</p>
                    <p className="font-semibold">{bookingData.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Teléfono</p>
                    <p className="font-semibold">{bookingData.customerPhone}</p>
                  </div>
                </div>
                <div className="alert alert-info mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm">Te enviaremos la confirmación a {bookingData.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <h2 className="font-bold text-xl mb-4">Método de Pago</h2>
                <div className="space-y-3">
                  {([
                    { value: 'card', label: 'Tarjeta de Crédito / Débito', sub: 'Visa, Mastercard, American Express', badge: ['VISA', 'MC', 'AMEX'] },
                    { value: 'paypal', label: 'PayPal', sub: 'Paga de forma segura con tu cuenta PayPal', badge: ['PayPal'] },
                    { value: 'oxxo', label: 'OXXO', sub: 'Paga en efectivo en cualquier tienda OXXO', badge: ['OXXO'] },
                  ] as const).map(({ value, label, sub, badge }) => (
                    <label key={value} className="cursor-pointer block">
                      <div className={`p-4 border-2 rounded-2xl transition-all ${paymentMethod === value ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-base-300'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            className="radio radio-primary radio-sm"
                            value={value}
                            checked={paymentMethod === value}
                            onChange={() => setPaymentMethod(value)}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-xs text-base-content/60">{sub}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {badge.map(b => <span key={b} className="badge badge-outline badge-sm font-bold">{b}</span>)}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="alert bg-warning/10 border border-warning/25 rounded-2xl mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs">La integración de pasarela de pago está en desarrollo. La reserva se registra pero el cobro no se procesa aún.</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="label-text">
                  Acepto los{' '}
                  <a href="/terms" className="link link-primary">términos y condiciones</a>{' '}
                  y la{' '}
                  <a href="/privacy" className="link link-primary">política de privacidad</a>
                </span>
              </label>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-sm border border-base-200 sticky top-24">
              <div className="card-body p-6">
                <h2 className="font-bold text-lg mb-4">Resumen de Precio</h2>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Subtotal</span>
                    <span>${bookingData.subtotal.toLocaleString('es-MX')} MXN</span>
                  </div>
                  {bookingData.discount > 0 && (
                    <div className="flex justify-between text-sm text-success font-medium">
                      <span>Descuento{bookingData.promoCode ? ` (${bookingData.promoCode})` : ''}</span>
                      <span>-${bookingData.discount.toLocaleString('es-MX')} MXN</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">IVA (16%)</span>
                    <span>${bookingData.tax.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="border-t border-base-200 pt-3 mt-1">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="price-gradient">${bookingData.total.toLocaleString('es-MX')} MXN</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg rounded-xl mt-5"
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Confirmando reserva...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Confirmar Reserva
                    </>
                  )}
                </button>

                {!agreedToTerms && (
                  <p className="text-xs text-center text-base-content/50 mt-2">Acepta los términos para continuar</p>
                )}

                <div className="divider my-4"></div>

                <ul className="space-y-2">
                  {['Reserva 100% segura', 'Cancelación gratuita 24h', 'Confirmación inmediata'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-base-content/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="alert bg-info/8 border border-info/20 rounded-2xl mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 text-info shrink-0" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-xs">
                    ¿Necesitas ayuda?{' '}
                    <a href="tel:+529981234567" className="link link-primary font-semibold">Llámanos</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
