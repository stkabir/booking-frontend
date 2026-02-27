import { useState } from 'react';

interface BookingFormProps {
  itemType: 'hotel' | 'tour' | 'transfer';
  itemName: string;
  itemPrice: number;
  itemSlug: string;
  childPrice?: number;
}

export default function BookingForm({
  itemType,
  itemName,
  itemPrice,
  itemSlug,
  childPrice,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    // Dates
    startDate: '',
    endDate: '',
    pickupTime: '',

    // Guests
    adults: 1,
    children: 0,

    // Customer Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',

    // Special
    specialRequests: '',
    flightNumber: '',
  });

  const [nights, setNights] = useState(1);
  const [subtotal, setSubtotal] = useState(itemPrice);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(itemPrice);
  const [promoCode, setPromoCode] = useState('');

  // Calculate totals
  const calculateTotals = () => {
    let calculatedSubtotal = 0;

    if (itemType === 'hotel') {
      // Calculate nights
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        calculatedSubtotal = itemPrice * diffDays;
      }
    } else if (itemType === 'tour') {
      calculatedSubtotal =
        itemPrice * formData.adults + (childPrice || 0) * formData.children;
    } else if (itemType === 'transfer') {
      calculatedSubtotal = itemPrice;
    }

    setSubtotal(calculatedSubtotal);

    // Calculate tax (16% IVA)
    const calculatedTax = calculatedSubtotal * 0.16;
    setTax(calculatedTax);

    // Calculate total
    const calculatedTotal = calculatedSubtotal + calculatedTax - discount;
    setTotal(calculatedTotal);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = () => {
    // Simular aplicación de código promocional
    if (promoCode.toUpperCase() === 'VERANO2026') {
      setDiscount(subtotal * 0.15);
      alert('¡Código aplicado! 15% de descuento');
    } else {
      alert('Código promocional inválido');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!formData.startDate) {
      alert('Por favor selecciona una fecha');
      return;
    }

    // Prepare booking data
    const bookingData = {
      ...formData,
      itemType,
      itemSlug,
      itemName,
      subtotal,
      discount,
      tax,
      total,
      nights: itemType === 'hotel' ? nights : undefined,
    };

    console.log('Booking Data:', bookingData);

    // Redirect to checkout page with data
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/checkout';
  };

  // Recalculate when relevant fields change
  useState(() => {
    calculateTotals();
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dates Section */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
          Fechas
        </h3>

        {itemType === 'hotel' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Check-in *</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="input input-bordered"
                value={formData.startDate}
                onChange={handleInputChange}
                onBlur={calculateTotals}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Check-out *</span>
              </label>
              <input
                type="date"
                name="endDate"
                className="input input-bordered"
                value={formData.endDate}
                onChange={handleInputChange}
                onBlur={calculateTotals}
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </>
        )}

        {itemType === 'tour' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Fecha del Tour *</span>
            </label>
            <input
              type="date"
              name="startDate"
              className="input input-bordered"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {itemType === 'transfer' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Fecha del Traslado *</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="input input-bordered"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Hora de Recogida *</span>
              </label>
              <input
                type="time"
                name="pickupTime"
                className="input input-bordered"
                value={formData.pickupTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Número de Vuelo</span>
              </label>
              <input
                type="text"
                name="flightNumber"
                placeholder="AA1234"
                className="input input-bordered"
                value={formData.flightNumber}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Guests Section */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
          Huéspedes
        </h3>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Adultos *</span>
          </label>
          <select
            name="adults"
            className="select select-bordered"
            value={formData.adults}
            onChange={(e) => {
              handleInputChange(e);
              calculateTotals();
            }}
            required
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Adulto' : 'Adultos'}
              </option>
            ))}
          </select>
        </div>

        {itemType === 'tour' && childPrice && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Niños</span>
            </label>
            <select
              name="children"
              className="select select-bordered"
              value={formData.children}
              onChange={(e) => {
                handleInputChange(e);
                calculateTotals();
              }}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Niño' : 'Niños'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Customer Info Section */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
          Datos de Contacto
        </h3>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nombre Completo *</span>
          </label>
          <input
            type="text"
            name="customerName"
            placeholder="Juan Pérez"
            className="input input-bordered"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Email *</span>
          </label>
          <input
            type="email"
            name="customerEmail"
            placeholder="juan@ejemplo.com"
            className="input input-bordered"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Teléfono *</span>
          </label>
          <input
            type="tel"
            name="customerPhone"
            placeholder="+52 998 123 4567"
            className="input input-bordered"
            value={formData.customerPhone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Peticiones Especiales</span>
          </label>
          <textarea
            name="specialRequests"
            placeholder="¿Alguna solicitud especial?"
            className="textarea textarea-bordered"
            rows={3}
            value={formData.specialRequests}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Promo Code */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Código Promocional</span>
        </label>
        <div className="join">
          <input
            type="text"
            placeholder="VERANO2026"
            className="input input-bordered join-item flex-1"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary join-item"
            onClick={handleApplyPromo}
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="divider"></div>

      {/* Price Summary */}
      <div className="space-y-3 bg-base-200 p-5 rounded-2xl">
        <h3 className="font-bold mb-3">Resumen de Precio</h3>

        {itemType === 'hotel' && (
          <div className="flex justify-between text-sm">
            <span>
              ${itemPrice.toLocaleString('es-MX')} x {nights} {nights === 1 ? 'noche' : 'noches'}
            </span>
            <span>${(itemPrice * nights).toLocaleString('es-MX')}</span>
          </div>
        )}

        {itemType === 'tour' && (
          <>
            <div className="flex justify-between text-sm">
              <span>{formData.adults} Adultos</span>
              <span>${(itemPrice * formData.adults).toLocaleString('es-MX')}</span>
            </div>
            {formData.children > 0 && childPrice && (
              <div className="flex justify-between text-sm">
                <span>{formData.children} Niños</span>
                <span>${(childPrice * formData.children).toLocaleString('es-MX')}</span>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-MX')}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Descuento</span>
            <span>-${discount.toLocaleString('es-MX')}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Impuestos (16%)</span>
          <span>${tax.toLocaleString('es-MX')}</span>
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span className="price-gradient">${total.toLocaleString('es-MX')} MXN</span>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary btn-block btn-lg rounded-xl">
        Continuar al Pago →
      </button>

      <p className="text-xs text-center text-base-content/60">
        Al continuar, aceptas nuestros{' '}
        <a href="/terms" className="underline hover:text-primary">términos y condiciones</a>
      </p>
    </form>
  );
}
