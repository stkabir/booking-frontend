import { useState, useEffect } from 'react';
import { api, type BookingResponse } from '../lib/api';
import { useCartStore, type CartItem } from '../store/cartStore';

const sectionCls = 'bg-white border-2 border-neutral shadow-pop rounded-2xl';

interface ContactData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

function InlineBanner({ type, message, onDismiss }: { type: 'success' | 'error'; message: string; onDismiss?: () => void }) {
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

function Spinner({ sm, lg }: { sm?: boolean; lg?: boolean }) {
  const size = lg ? 'h-10 w-10' : sm ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <svg className={`animate-spin shrink-0 ${size}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ConfirmationScreen({ booking, itemName }: { booking: BookingResponse; itemName: string }) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-400 shadow-[4px_4px_0px_0px_#1E293B] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 bg-green-500 border-2 border-neutral shadow-pop-sm rounded-full px-4 py-1 text-white text-xs font-black uppercase tracking-widest mb-4">
        ✓ Reserva Confirmada
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-neutral leading-none tracking-tight mb-3">¡Reserva Confirmada!</h1>
      <p className="text-neutral/55 mb-8">Hemos recibido tu solicitud. Te enviaremos los detalles a tu correo.</p>

      {/* Booking Number */}
      <div className={`${sectionCls} mb-6 p-6`}>
        <p className="text-xs font-black uppercase tracking-widest text-neutral/40 mb-2">Número de Reserva</p>
        <p className="text-3xl font-black font-mono tracking-wider price-gradient">{booking.booking_number}</p>
        <p className="text-xs text-neutral/40 mt-2">Guarda este número para consultar tu reserva</p>
      </div>

      {/* Summary */}
      <div className={`${sectionCls} text-left mb-6 p-6`}>
        <h2 className="font-black text-lg text-neutral mb-4">Resumen</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <p className="text-neutral/45 font-medium">Servicio</p>
            <p className="font-black text-neutral mt-0.5">{itemName}</p>
          </div>
          <div>
            <p className="text-neutral/45 font-medium">Cliente</p>
            <p className="font-black text-neutral mt-0.5">{booking.customer_name}</p>
          </div>
          <div>
            <p className="text-neutral/45 font-medium">Email</p>
            <p className="font-black text-neutral mt-0.5">{booking.customer_email}</p>
          </div>
          <div>
            <p className="text-neutral/45 font-medium">Fecha</p>
            <p className="font-black text-neutral mt-0.5">{formatDate(booking.start_date)}</p>
          </div>
          <div>
            <p className="text-neutral/45 font-medium">Total</p>
            <p className="font-black price-gradient mt-0.5">${booking.total.toLocaleString('es-MX')} MXN</p>
          </div>
          <div>
            <p className="text-neutral/45 font-medium">Estado</p>
            <span className="inline-flex items-center mt-0.5 text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-amber-300 bg-amber-100 text-amber-700 capitalize">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white border-2 border-primary/20 rounded-2xl p-4 text-left mb-8 flex items-start gap-3">
        <div className="w-8 h-8 bg-primary/10 border-2 border-primary/30 rounded-xl flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-neutral/65">
          Recibirás un correo de confirmación en <strong className="text-neutral">{booking.customer_email}</strong>. Si no lo ves, revisa tu carpeta de spam.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`/bookings?number=${booking.booking_number}`}
          className="inline-flex items-center justify-center gap-2 h-11 bg-violet-500 text-white font-black px-6 rounded-full border-2 border-neutral shadow-pop-sm
                     hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ver mi reserva
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

export default function CheckoutPage() {
  // Cart from Zustand
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Contact form state
  const [contactData, setContactData] = useState<ContactData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'oxxo'>('card');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingResponse[]>([]);

  // OpenPay states
  const [openpayLoaded, setOpenpayLoaded] = useState(false);
  const [openpayConfig, setOpenpayConfig] = useState<{ merchant_id: string; public_key: string; mode: string } | null>(null);
  const [cardData, setCardData] = useState({
    card_number: '',
    holder_name: '',
    expiration_month: '',
    expiration_year: '',
    cvv2: '',
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      window.location.href = '/';
    }
  }, [cartItems]);

  // Load OpenPay.js and config
  useEffect(() => {
    if (paymentMethod !== 'card') return;

    const loadOpenPay = async () => {
      try {
        // Get config from backend
        const config = await api.getOpenPayConfig();
        setOpenpayConfig(config);

        // Load OpenPay.js script
        if (!document.getElementById('openpay-script')) {
          const script = document.createElement('script');
          script.id = 'openpay-script';
          script.src = 'https://js.openpay.mx/v1/openpay.js';
          script.onload = () => {
            // Initialize OpenPay
            if ((window as any).OpenPay) {
              const OpenPay = (window as any).OpenPay;
              OpenPay.setId(config.merchant_id);
              OpenPay.setApiKey(config.public_key);
              OpenPay.setSandboxMode(config.mode === 'sandbox');
              setOpenpayLoaded(true);
            }
          };
          document.body.appendChild(script);
        } else {
          setOpenpayLoaded(true);
        }
      } catch (err) {
        console.error('Error loading OpenPay:', err);
      }
    };

    loadOpenPay();
  }, [paymentMethod]);

  const validateContact = (): boolean => {
    const errors: Record<string, string> = {};
    if (!contactData.customerName.trim()) errors.customerName = 'Ingresa tu nombre completo';
    if (!contactData.customerEmail.trim()) {
      errors.customerEmail = 'Ingresa tu correo electrónico';
    } else if (!/\S+@\S+\.\S+/.test(contactData.customerEmail)) {
      errors.customerEmail = 'El correo no parece válido';
    }
    if (!contactData.customerPhone.trim()) errors.customerPhone = 'Ingresa tu número de teléfono';

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
    if (contactErrors[name]) {
      setContactErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setNotification({ type: 'error', message: 'Debes aceptar los términos y condiciones para continuar.' });
      return;
    }

    if (!validateContact()) {
      setNotification({ type: 'error', message: 'Completa los datos de contacto.' });
      return;
    }

    if (cartItems.length === 0) return;

    // Validate card data if paying with card
    if (paymentMethod === 'card') {
      if (!cardData.card_number || !cardData.holder_name || !cardData.expiration_month || !cardData.expiration_year || !cardData.cvv2) {
        setNotification({ type: 'error', message: 'Completa todos los datos de la tarjeta.' });
        return;
      }
      if (!openpayLoaded) {
        setNotification({ type: 'error', message: 'OpenPay no está listo. Intenta nuevamente.' });
        return;
      }
    }

    setLoading(true);
    setNotification(null);

    try {
      const bookings: BookingResponse[] = [];

      // Create bookings for each cart item
      for (const item of cartItems) {
        const booking = await api.createBooking({
          bookable_type: item.type,
          bookable_id: item.itemId,
          customer_name: contactData.customerName,
          customer_email: contactData.customerEmail,
          customer_phone: contactData.customerPhone,
          start_date: item.startDate,
          end_date: item.type === 'hotel' ? item.endDate : null,
          pickup_time: item.type === 'transfer' ? item.pickupTime : null,
          adults: item.adults,
          children: item.children || 0,
          payment_method: paymentMethod,
          promo_code: null,
          special_requests: contactData.specialRequests || null,
        });
        bookings.push(booking);
      }

      // Process payment for the first booking if card is selected
      if (paymentMethod === 'card' && bookings.length > 0) {
        setProcessingPayment(true);

        const OpenPay = (window as any).OpenPay;
        const deviceSessionId = OpenPay.deviceData.setup();

        const tokenResponse = await new Promise<{ data: { id: string } }>((resolve, reject) => {
          OpenPay.token.create({
            card_number: cardData.card_number.replace(/\s/g, ''),
            holder_name: cardData.holder_name,
            expiration_year: cardData.expiration_year,
            expiration_month: cardData.expiration_month,
            cvv2: cardData.cvv2,
          },
          (response: any) => resolve(response),
          (error: any) => reject(error)
          );
        });

        const cardToken = tokenResponse.data.id;

        const paymentResult = await api.processPayment({
          order_id: bookings[0].id,
          token: cardToken,
          device_session_id: deviceSessionId,
          customer: {
            name: contactData.customerName.split(' ')[0] || '',
            last_name: contactData.customerName.split(' ').slice(1).join(' ') || '',
            email: contactData.customerEmail,
            phone: contactData.customerPhone,
          },
        });

        if (!paymentResult.success) {
          throw new Error(paymentResult.message || 'Error al procesar el pago');
        }

        setProcessingPayment(false);
      }

      clearCart();
      setConfirmedBookings(bookings);
    } catch (error: any) {
      const message = error?.errors
        ? Object.values(error.errors).flat().join('. ')
        : error?.message || 'Hubo un error al procesar la reserva. Por favor intenta nuevamente.';
      setNotification({ type: 'error', message });
      setLoading(false);
      setProcessingPayment(false);
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
        <h1 className="text-3xl md:text-4xl font-black text-neutral leading-none tracking-tight mb-3">¡Reservas Confirmadas!</h1>
        <p className="text-neutral/55 mb-8">Hemos recibido tus solicitudes. Te enviaremos los detalles a tu correo.</p>

        <div className={`${sectionCls} mb-6 p-6`}>
          <p className="text-xs font-black uppercase tracking-widest text-neutral/40 mb-2">Números de Reserva</p>
          <div className="space-y-2">
            {confirmedBookings.map((booking) => (
              <p key={booking.id} className="text-xl font-black font-mono tracking-wider price-gradient">{booking.booking_number}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/bookings" className="inline-flex items-center justify-center gap-2 h-11 bg-violet-500 text-white font-black px-6 rounded-full border-2 border-neutral shadow-pop-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150">
            Ver mis reservas
          </a>
          <a href="/" className="inline-flex items-center justify-center h-11 px-6 font-bold text-neutral/60 hover:text-neutral border-2 border-transparent hover:border-neutral/20 rounded-full transition-all">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Spinner lg />
          <p className="mt-4 text-neutral/55 font-medium">Cargando información de reserva...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const itemTypeIcon = {
    hotel: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    tour: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {notification && (
        <div className="mb-6">
          <InlineBanner type={notification.type} message={notification.message} onDismiss={() => setNotification(null)} />
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold text-neutral/45 mb-8">
        <a href="/" className="hover:text-primary transition-colors">Inicio</a>
        <span>›</span>
        <span className="text-neutral">Checkout</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-neutral leading-none tracking-tight mb-2">Finalizar Reserva</h1>
        <p className="text-neutral/55">Revisa tu información y completa tu reserva de forma segura</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Cart Items */}
            <div className={`${sectionCls} p-6`}>
              <h2 className="font-black text-xl text-neutral mb-5">Resumen del Carrito ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="border-b-2 border-neutral/10 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-linear-to-br from-violet-400 to-pink-400 border-2 border-neutral shadow-pop-sm rounded-xl flex items-center justify-center text-white shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={itemTypeIcon[item.type]} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-neutral">{item.name}</h3>
                        <span className="inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full border-2 border-neutral shadow-pop-sm bg-primary text-white capitalize">
                          {item.type}
                        </span>
                        <div className="mt-2 text-sm text-neutral/60">
                          <p>Fecha: {formatDate(item.startDate)}{item.endDate ? ` - ${formatDate(item.endDate)}` : ''}</p>
                          <p>{item.adults} adultos{item.children ? `, ${item.children} niños` : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-neutral">${item.total.toLocaleString('es-MX')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information Form */}
            <div className={`${sectionCls} p-6`}>
              <h2 className="font-black text-xl text-neutral mb-5">Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={contactData.customerName}
                    onChange={handleContactChange}
                    placeholder="Juan García"
                    className={`w-full px-4 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none transition-all ${
                      contactErrors.customerName ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'
                    }`}
                  />
                  {contactErrors.customerName && <p className="text-red-500 text-xs mt-1">{contactErrors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={contactData.customerEmail}
                    onChange={handleContactChange}
                    placeholder="tu@correo.com"
                    className={`w-full px-4 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none transition-all ${
                      contactErrors.customerEmail ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'
                    }`}
                  />
                  {contactErrors.customerEmail && <p className="text-red-500 text-xs mt-1">{contactErrors.customerEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={contactData.customerPhone}
                    onChange={handleContactChange}
                    placeholder="+52 998 123 4567"
                    className={`w-full px-4 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none transition-all ${
                      contactErrors.customerPhone ? 'border-red-400' : 'border-slate-200 focus:border-violet-500'
                    }`}
                  />
                  {contactErrors.customerPhone && <p className="text-red-500 text-xs mt-1">{contactErrors.customerPhone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1">Peticiones Especiales</label>
                  <textarea
                    name="specialRequests"
                    value={contactData.specialRequests}
                    onChange={handleContactChange}
                    placeholder="Dietas especiales, accesibilidad, cumpleaños..."
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-violet-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={`${sectionCls} p-6`}>
              <h2 className="font-black text-xl text-neutral mb-5">Método de Pago</h2>
              <div className="space-y-3">
                {([
                  { value: 'card', label: 'Tarjeta de Crédito / Débito', sub: 'Visa, Mastercard, American Express', badge: ['VISA', 'MC', 'AMEX'] },
                  { value: 'paypal', label: 'PayPal', sub: 'Paga de forma segura con tu cuenta PayPal', badge: ['PayPal'] },
                  { value: 'oxxo', label: 'OXXO', sub: 'Paga en efectivo en cualquier tienda OXXO', badge: ['OXXO'] },
                ] as const).map(({ value, label, sub, badge }) => (
                  <label key={value} className="cursor-pointer block">
                    <div className={`p-4 border-2 rounded-2xl transition-all ${paymentMethod === value ? 'border-violet-500 bg-violet-50 shadow-[3px_3px_0px_0px_#8B5CF6]' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          className="w-4 h-4 accent-violet-500"
                          value={value}
                          checked={paymentMethod === value}
                          onChange={() => setPaymentMethod(value)}
                        />
                        <div className="flex-1">
                          <p className="font-black text-sm text-neutral">{label}</p>
                          <p className="text-xs text-neutral/50 mt-0.5">{sub}</p>
                        </div>
                        <div className="flex gap-1.5">
                          {badge.map(b => (
                            <span key={b} className="text-xs font-black px-2 py-0.5 rounded-full border-2 border-neutral/20 text-neutral/60">{b}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {/* OpenPay Card Form */}
              {paymentMethod === 'card' && (
                <div className="mt-5 space-y-4">
                  {!openpayLoaded && (
                    <div className="flex items-center gap-2 text-sm text-neutral/60">
                      <Spinner sm />
                      <span>Cargando OpenPay...</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="4111111111111111"
                        className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                        value={cardData.card_number}
                        onChange={(e) => setCardData({ ...cardData, card_number: e.target.value })}
                        maxLength={19}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="JUAN PEREZ"
                        className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors uppercase"
                        value={cardData.holder_name}
                        onChange={(e) => setCardData({ ...cardData, holder_name: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                        Mes (MM)
                      </label>
                      <input
                        type="text"
                        placeholder="12"
                        className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                        value={cardData.expiration_month}
                        onChange={(e) => setCardData({ ...cardData, expiration_month: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                        Año (YY)
                      </label>
                      <input
                        type="text"
                        placeholder="27"
                        className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                        value={cardData.expiration_year}
                        onChange={(e) => setCardData({ ...cardData, expiration_year: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral/40 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl font-medium text-neutral focus:border-violet-500 focus:outline-none transition-colors"
                        value={cardData.cvv2}
                        onChange={(e) => setCardData({ ...cardData, cvv2: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        maxLength={4}
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center gap-2 text-xs text-neutral/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Pago seguro con OpenPay</span>
                      </div>
                    </div>
                  </div>

                  {openpayConfig?.mode === 'sandbox' && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                      <strong>Modo Sandbox:</strong> Usa tarjeta de prueba 4111111111111111, cualquier fecha futura y CVV 123.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms-checkbox"
                className="w-5 h-5 mt-0.5 accent-violet-500 rounded border-2 border-slate-300 shrink-0"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms-checkbox" className="text-sm text-neutral/65 cursor-pointer leading-relaxed">
                Acepto los{' '}
                <a href="/terms" className="underline text-violet-600 hover:text-violet-700 transition-colors font-semibold">términos y condiciones</a>{' '}
                y la{' '}
                <a href="/privacy" className="underline text-violet-600 hover:text-violet-700 transition-colors font-semibold">política de privacidad</a>
              </label>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className={`${sectionCls} p-6 sticky top-24`}>
              <h2 className="font-black text-lg text-neutral mb-5">Resumen de Precio</h2>
              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-neutral/55">{item.name}</span>
                    <span className="font-bold text-neutral">${item.total.toLocaleString('es-MX')} MXN</span>
                  </div>
                ))}
                <div className="border-t-2 border-neutral/10 pt-3 mt-1">
                  <div className="flex justify-between font-black text-xl items-baseline">
                    <span className="text-neutral">Total</span>
                    <span className="price-gradient">${cartItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('es-MX')} MXN</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-violet-500 text-white font-black rounded-full border-2 border-neutral shadow-pop-sm
                           flex items-center justify-center gap-2 mt-5
                           hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop transition-all duration-150
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                disabled={loading || !agreedToTerms}
              >
                {processingPayment ? (
                  <>
                    <Spinner sm />
                    Procesando pago...
                  </>
                ) : loading ? (
                  <>
                    <Spinner sm />
                    {paymentMethod === 'card' ? 'Creando reserva...' : 'Confirmando reserva...'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {paymentMethod === 'card' ? `Pagar $${cartItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('es-MX')} MXN` : 'Confirmar Reserva'}
                  </>
                )}
              </button>

              {!agreedToTerms && (
                <p className="text-xs text-center text-neutral/40 mt-2">Acepta los términos para continuar</p>
              )}

              <div className="border-t-2 border-neutral/10 my-4" />

              <ul className="space-y-2">
                {['Reserva 100% segura', 'Cancelación gratuita 24h', 'Confirmación inmediata'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-neutral/55 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-white border-2 border-primary/20 rounded-xl p-3 mt-4 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/10 border-2 border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-neutral/55">
                  ¿Necesitas ayuda?{' '}
                  <a href="tel:+529981234567" className="underline text-violet-600 hover:text-violet-700 font-semibold">Llámanos</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
