import { useState, useEffect } from 'react';

interface BookingFormProps {
  itemType: 'hotel' | 'tour' | 'transfer';
  itemId: number;
  itemName: string;
  itemPrice: number;
  itemSlug: string;
  childPrice?: number;
}

type PromoState = 'idle' | 'success' | 'error';

function StepperField({
  label,
  value,
  min,
  max,
  onDecrement,
  onIncrement,
  description,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-base-200/70 rounded-xl border border-base-300/50">
      <div>
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs text-base-content/50 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border-2 border-base-300 flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 hover:border-primary hover:text-primary disabled:cursor-not-allowed"
          aria-label={`Reducir ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="w-7 text-center font-bold text-lg tabular-nums">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 hover:bg-primary/90 disabled:cursor-not-allowed shadow-sm"
          aria-label={`Aumentar ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-error text-xs mt-1 flex items-center gap-1 animate-[fadeSlideIn_0.2s_ease]">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {message}
    </p>
  );
}

function InlineBanner({ type, message, onDismiss }: { type: 'success' | 'error'; message: string; onDismiss?: () => void }) {
  const colors = type === 'success'
    ? 'bg-success/10 border-success/30 text-success'
    : 'bg-error/10 border-error/30 text-error';
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium animate-[fadeSlideIn_0.25s_ease] ${colors}`}>
      {type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

export default function BookingForm({
  itemType,
  itemId,
  itemName,
  itemPrice,
  itemSlug,
  childPrice,
}: BookingFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupTime: '',
    adults: 1,
    children: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    flightNumber: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoState, setPromoState] = useState<PromoState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Derived price calculations (no stale state) ──
  const nights = (() => {
    if (itemType === 'hotel' && formData.startDate && formData.endDate) {
      const diff = new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime();
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 1;
  })();

  const subtotal = (() => {
    if (itemType === 'hotel') {
      return formData.startDate && formData.endDate ? itemPrice * nights : itemPrice;
    }
    if (itemType === 'tour') {
      return itemPrice * formData.adults + (childPrice || 0) * formData.children;
    }
    return itemPrice;
  })();

  const tax = subtotal * 0.16;
  const discountAmount = promoState === 'success' ? subtotal * 0.15 : 0;
  const total = subtotal + tax - discountAmount;

  // Clear promo discount if subtotal changes
  useEffect(() => {
    if (promoState === 'success') setPromoState('idle');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const adjustGuests = (type: 'adults' | 'children', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, Math.min(type === 'adults' ? 10 : 6, prev[type] + delta)),
    }));
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === 'VERANO2026') {
      setPromoState('success');
    } else {
      setPromoState('error');
    }
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.customerName.trim()) e.customerName = 'Ingresa tu nombre completo';
    if (!formData.customerEmail.trim()) {
      e.customerEmail = 'Ingresa tu correo electrónico';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      e.customerEmail = 'El correo no parece válido';
    }
    if (!formData.customerPhone.trim()) e.customerPhone = 'Ingresa tu número de teléfono';
    if (!formData.startDate) e.startDate = 'Selecciona una fecha';
    if (itemType === 'hotel' && !formData.endDate) e.endDate = 'Selecciona la fecha de salida';
    if (itemType === 'transfer' && !formData.pickupTime) e.pickupTime = 'Indica la hora de recogida';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error field
      setTimeout(() => {
        const el = document.querySelector('[data-has-error="true"]');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        ...formData,
        itemType,
        itemId,
        itemSlug,
        itemName,
        subtotal,
        discount: discountAmount,
        promoCode: promoState === 'success' ? promoCode : null,
        tax,
        total,
        nights: itemType === 'hotel' ? nights : undefined,
      };
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      window.location.href = '/checkout';
    } catch {
      setIsSubmitting(false);
      setSubmitError('Hubo un problema. Por favor intenta de nuevo.');
    }
  };

  const stepClass = "w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold shadow-sm";
  const inputClass = (field: string) =>
    `input input-bordered w-full transition-shadow focus:shadow-[0_0_0_3px_rgba(8,145,178,0.15)] ${errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* ── Step 1: Fecha ── */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2 text-base">
          <span className={stepClass}>1</span>
          {itemType === 'hotel' ? 'Fechas de Estadía' : itemType === 'transfer' ? 'Fecha y Hora' : 'Fecha del Tour'}
        </h3>

        {itemType === 'hotel' && (
          <div className="grid grid-cols-2 gap-3">
            <div data-has-error={!!errors.startDate || undefined}>
              <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Llegada *</span></label>
              <input type="date" name="startDate" className={inputClass('startDate')}
                value={formData.startDate} onChange={handleInput} min={today} />
              <FieldError message={errors.startDate} />
            </div>
            <div data-has-error={!!errors.endDate || undefined}>
              <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Salida *</span></label>
              <input type="date" name="endDate" className={inputClass('endDate')}
                value={formData.endDate} onChange={handleInput} min={formData.startDate || today} />
              <FieldError message={errors.endDate} />
            </div>
          </div>
        )}

        {itemType === 'tour' && (
          <div data-has-error={!!errors.startDate || undefined}>
            <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Fecha *</span></label>
            <input type="date" name="startDate" className={inputClass('startDate')}
              value={formData.startDate} onChange={handleInput} min={today} />
            <FieldError message={errors.startDate} />
          </div>
        )}

        {itemType === 'transfer' && (
          <div className="space-y-3">
            <div data-has-error={!!errors.startDate || undefined}>
              <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Fecha *</span></label>
              <input type="date" name="startDate" className={inputClass('startDate')}
                value={formData.startDate} onChange={handleInput} min={today} />
              <FieldError message={errors.startDate} />
            </div>
            <div data-has-error={!!errors.pickupTime || undefined}>
              <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Hora de Recogida *</span></label>
              <input type="time" name="pickupTime" className={inputClass('pickupTime')}
                value={formData.pickupTime} onChange={handleInput} />
              <FieldError message={errors.pickupTime} />
            </div>
            <div>
              <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Número de Vuelo <span className="font-normal opacity-60">(opcional)</span></span></label>
              <input type="text" name="flightNumber" placeholder="Ej: AM1234"
                className="input input-bordered w-full" value={formData.flightNumber} onChange={handleInput} />
            </div>
          </div>
        )}

        {/* Nights badge */}
        {itemType === 'hotel' && formData.startDate && formData.endDate && nights > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold animate-[fadeSlideIn_0.2s_ease]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {nights} {nights === 1 ? 'noche' : 'noches'}
          </div>
        )}
      </div>

      {/* ── Step 2: Personas ── */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2 text-base">
          <span className={stepClass}>2</span>
          {itemType === 'transfer' ? 'Pasajeros' : 'Personas'}
        </h3>

        <StepperField
          label="Adultos"
          description={itemType === 'tour' ? `$${itemPrice.toLocaleString('es-MX')} c/u` : undefined}
          value={formData.adults}
          min={1}
          max={10}
          onDecrement={() => adjustGuests('adults', -1)}
          onIncrement={() => adjustGuests('adults', 1)}
        />

        {itemType === 'tour' && childPrice && (
          <StepperField
            label="Niños"
            description={`$${childPrice.toLocaleString('es-MX')} c/u`}
            value={formData.children}
            min={0}
            max={6}
            onDecrement={() => adjustGuests('children', -1)}
            onIncrement={() => adjustGuests('children', 1)}
          />
        )}
      </div>

      {/* ── Step 3: Datos de Contacto ── */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2 text-base">
          <span className={stepClass}>3</span>
          Datos de Contacto
        </h3>

        <div data-has-error={!!errors.customerName || undefined}>
          <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Nombre Completo *</span></label>
          <input type="text" name="customerName" placeholder="Juan García"
            className={inputClass('customerName')} value={formData.customerName} onChange={handleInput} />
          <FieldError message={errors.customerName} />
        </div>

        <div data-has-error={!!errors.customerEmail || undefined}>
          <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Correo Electrónico *</span></label>
          <input type="email" name="customerEmail" placeholder="tu@correo.com"
            className={inputClass('customerEmail')} value={formData.customerEmail} onChange={handleInput} />
          <FieldError message={errors.customerEmail} />
        </div>

        <div data-has-error={!!errors.customerPhone || undefined}>
          <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Teléfono *</span></label>
          <input type="tel" name="customerPhone" placeholder="+52 998 123 4567"
            className={inputClass('customerPhone')} value={formData.customerPhone} onChange={handleInput} />
          <FieldError message={errors.customerPhone} />
        </div>

        <div>
          <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Peticiones Especiales <span className="font-normal opacity-60">(opcional)</span></span></label>
          <textarea name="specialRequests" placeholder="Dietas especiales, accesibilidad, cumpleaños..."
            className="textarea textarea-bordered w-full resize-none" rows={2}
            value={formData.specialRequests} onChange={handleInput} />
        </div>
      </div>

      {/* ── Código Promocional ── */}
      <div className="space-y-2">
        <label className="label pb-1"><span className="label-text text-xs font-semibold text-base-content/70">Código Promocional</span></label>
        <div className="join w-full">
          <input
            type="text"
            placeholder="Ej: VERANO2026"
            className={`input input-bordered join-item flex-1 uppercase tracking-widest text-sm ${promoState === 'error' ? 'input-error' : promoState === 'success' ? 'input-success' : ''}`}
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              if (promoState !== 'idle') setPromoState('idle');
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
          />
          <button type="button" className="btn btn-primary join-item px-5" onClick={handleApplyPromo}>
            Aplicar
          </button>
        </div>
        {promoState === 'success' && (
          <InlineBanner type="success" message="¡Código aplicado! 15% de descuento" onDismiss={() => setPromoState('idle')} />
        )}
        {promoState === 'error' && (
          <InlineBanner type="error" message="Código inválido. Verifica e intenta de nuevo." onDismiss={() => setPromoState('idle')} />
        )}
      </div>

      <div className="divider my-1"></div>

      {/* ── Resumen de Precio ── */}
      <div className="bg-base-200/60 rounded-2xl p-5 space-y-2.5 border border-base-300/40">
        <h3 className="font-bold text-sm mb-3 text-base-content/80 uppercase tracking-wide">Resumen</h3>

        {itemType === 'hotel' && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">${itemPrice.toLocaleString('es-MX')} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
            <span className="font-medium">${(itemPrice * nights).toLocaleString('es-MX')}</span>
          </div>
        )}

        {itemType === 'tour' && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">{formData.adults} {formData.adults === 1 ? 'Adulto' : 'Adultos'} × ${itemPrice.toLocaleString('es-MX')}</span>
              <span className="font-medium">${(itemPrice * formData.adults).toLocaleString('es-MX')}</span>
            </div>
            {formData.children > 0 && childPrice && (
              <div className="flex justify-between text-sm">
                <span className="text-base-content/70">{formData.children} {formData.children === 1 ? 'Niño' : 'Niños'} × ${childPrice.toLocaleString('es-MX')}</span>
                <span className="font-medium">${(childPrice * formData.children).toLocaleString('es-MX')}</span>
              </div>
            )}
          </>
        )}

        {itemType === 'transfer' && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Traslado</span>
            <span className="font-medium">${itemPrice.toLocaleString('es-MX')}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-base-content/60">
          <span>IVA (16%)</span>
          <span>+${tax.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-success font-semibold animate-[fadeSlideIn_0.2s_ease]">
            <span>Descuento (15%)</span>
            <span>−${discountAmount.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
          </div>
        )}

        <div className="border-t border-base-300/60 pt-3 mt-1 flex justify-between items-baseline">
          <span className="font-bold">Total</span>
          <span className="text-2xl font-bold price-gradient tabular-nums">
            ${total.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            <span className="text-xs font-normal text-base-content/50 ml-1">MXN</span>
          </span>
        </div>
      </div>

      {/* Submit error */}
      {submitError && <InlineBanner type="error" message={submitError} onDismiss={() => setSubmitError('')} />}

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-block btn-lg rounded-xl shadow-md active:scale-[0.98] transition-transform disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Procesando...
          </>
        ) : (
          <>
            Continuar al Pago
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>

      <p className="text-xs text-center text-base-content/50">
        Al continuar aceptas nuestros{' '}
        <a href="/terms" className="underline hover:text-primary transition-colors">términos y condiciones</a>
      </p>
    </form>
  );
}
