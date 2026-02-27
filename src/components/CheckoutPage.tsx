import { useState, useEffect } from 'react';

interface BookingData {
  // Dates
  startDate: string;
  endDate: string;
  pickupTime: string;

  // Guests
  adults: number;
  children: number;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Special
  specialRequests: string;
  flightNumber: string;

  // Booking Details
  itemType: 'hotel' | 'tour' | 'transfer';
  itemSlug: string;
  itemName: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  nights?: number;
}

export default function CheckoutPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'oxxo'>('card');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    // Retrieve booking data from localStorage
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBookingData(data);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        window.location.href = '/';
      }
    } else {
      // Redirect to home if no booking data
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with Stripe or payment gateway
      // For now, simulate a successful booking
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear booking data
      localStorage.removeItem('bookingData');

      // Redirect to confirmation page
      alert('¡Reserva confirmada! Recibirás un email con los detalles.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Hubo un error procesando el pago. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm mb-8">
        <ul>
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href={`/${bookingData.itemType}s`}>
              {bookingData.itemType === 'hotel' && 'Hoteles'}
              {bookingData.itemType === 'tour' && 'Tours'}
              {bookingData.itemType === 'transfer' && 'Traslados'}
            </a>
          </li>
          <li>
            <a href={`/${bookingData.itemType}s/${bookingData.itemSlug}`}>
              {bookingData.itemName}
            </a>
          </li>
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
                  {/* Item Details */}
                  <div className="flex items-start gap-4">
                    <div className="h-24 w-24 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                      {bookingData.itemType === 'hotel' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      )}
                      {bookingData.itemType === 'tour' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                      )}
                      {bookingData.itemType === 'transfer' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{bookingData.itemName}</h3>
                      <div className="badge badge-primary mt-1 capitalize">
                        {bookingData.itemType}
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Booking Details */}
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
                          <p className="font-semibold">
                            {bookingData.nights} {bookingData.nights === 1 ? 'noche' : 'noches'}
                          </p>
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
                            {bookingData.adults} adultos
                            {bookingData.children > 0 && `, ${bookingData.children} niños`}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-sm">
                    Te enviaremos la confirmación de reserva a {bookingData.customerEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <h2 className="font-bold text-xl mb-4">Método de Pago</h2>

                <div className="space-y-3">
                  {/* Card Payment */}
                  <label className="cursor-pointer block">
                    <div
                      className={`p-4 border-2 rounded-2xl transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-base-200 hover:border-base-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          className="radio radio-primary radio-sm"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Tarjeta de Crédito / Débito</p>
                          <p className="text-xs text-base-content/60">Visa, Mastercard, American Express</p>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="badge badge-outline badge-sm font-bold">VISA</span>
                          <span className="badge badge-outline badge-sm font-bold">MC</span>
                          <span className="badge badge-outline badge-sm font-bold">AMEX</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className="cursor-pointer block">
                    <div
                      className={`p-4 border-2 rounded-2xl transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-primary bg-primary/5'
                          : 'border-base-200 hover:border-base-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          className="radio radio-primary radio-sm"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">PayPal</p>
                          <p className="text-xs text-base-content/60">Paga de forma segura con tu cuenta PayPal</p>
                        </div>
                        <span className="badge badge-primary badge-sm">PayPal</span>
                      </div>
                    </div>
                  </label>

                  {/* OXXO */}
                  <label className="cursor-pointer block">
                    <div
                      className={`p-4 border-2 rounded-2xl transition-all ${
                        paymentMethod === 'oxxo'
                          ? 'border-primary bg-primary/5'
                          : 'border-base-200 hover:border-base-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          className="radio radio-primary radio-sm"
                          value="oxxo"
                          checked={paymentMethod === 'oxxo'}
                          onChange={() => setPaymentMethod('oxxo')}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">OXXO</p>
                          <p className="text-xs text-base-content/60">Paga en efectivo en cualquier tienda OXXO</p>
                        </div>
                        <span className="badge badge-warning badge-sm">OXXO</span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="alert bg-warning/10 border border-warning/25 rounded-2xl mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-warning shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-xs">La integración de pagos está en desarrollo. Por ahora es solo una simulación.</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
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
                  <a href="/terms" className="link link-primary">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="/privacy" className="link link-primary">
                    política de privacidad
                  </a>
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
                      <span>Descuento aplicado</span>
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
                      <span className="price-gradient">
                        ${bookingData.total.toLocaleString('es-MX')} MXN
                      </span>
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
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Confirmar y Pagar
                    </>
                  )}
                </button>

                {!agreedToTerms && (
                  <p className="text-xs text-center text-base-content/50 mt-2">Acepta los términos para continuar</p>
                )}

                <div className="divider my-4"></div>

                {/* Security Badges */}
                <ul className="space-y-2">
                  {[
                    'Pago 100% seguro SSL',
                    'Cancelación gratuita 24h',
                    'Confirmación inmediata por email',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-base-content/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="alert bg-info/8 border border-info/20 rounded-2xl mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 text-info shrink-0" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
