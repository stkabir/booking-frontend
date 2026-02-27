import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';

function BookingForm({
  itemType,
  itemName,
  itemPrice,
  itemSlug,
  childPrice
}) {
  const [formData, setFormData] = useState({
    // Dates
    startDate: "",
    endDate: "",
    pickupTime: "",
    // Guests
    adults: 1,
    children: 0,
    // Customer Info
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    // Special
    specialRequests: "",
    flightNumber: ""
  });
  const [nights, setNights] = useState(1);
  const [subtotal, setSubtotal] = useState(itemPrice);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(itemPrice);
  const [promoCode, setPromoCode] = useState("");
  const calculateTotals = () => {
    let calculatedSubtotal = 0;
    if (itemType === "hotel") {
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        setNights(diffDays);
        calculatedSubtotal = itemPrice * diffDays;
      }
    } else if (itemType === "tour") {
      calculatedSubtotal = itemPrice * formData.adults + (childPrice || 0) * formData.children;
    } else if (itemType === "transfer") {
      calculatedSubtotal = itemPrice;
    }
    setSubtotal(calculatedSubtotal);
    const calculatedTax = calculatedSubtotal * 0.16;
    setTax(calculatedTax);
    const calculatedTotal = calculatedSubtotal + calculatedTax - discount;
    setTotal(calculatedTotal);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "VERANO2026") {
      setDiscount(subtotal * 0.15);
      alert("¡Código aplicado! 15% de descuento");
    } else {
      alert("Código promocional inválido");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    if (!formData.startDate) {
      alert("Por favor selecciona una fecha");
      return;
    }
    const bookingData = {
      ...formData,
      itemType,
      itemSlug,
      itemName,
      subtotal,
      discount,
      tax,
      total,
      nights: itemType === "hotel" ? nights : void 0
    };
    console.log("Booking Data:", bookingData);
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    window.location.href = "/checkout";
  };
  useState(() => {
    calculateTotals();
  });
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold", children: "1" }),
        "Fechas"
      ] }),
      itemType === "hotel" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Check-in *" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "startDate",
              className: "input input-bordered",
              value: formData.startDate,
              onChange: handleInputChange,
              onBlur: calculateTotals,
              required: true,
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Check-out *" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "endDate",
              className: "input input-bordered",
              value: formData.endDate,
              onChange: handleInputChange,
              onBlur: calculateTotals,
              required: true,
              min: formData.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          )
        ] })
      ] }),
      itemType === "tour" && /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Fecha del Tour *" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            name: "startDate",
            className: "input input-bordered",
            value: formData.startDate,
            onChange: handleInputChange,
            required: true,
            min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
          }
        )
      ] }),
      itemType === "transfer" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Fecha del Traslado *" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "startDate",
              className: "input input-bordered",
              value: formData.startDate,
              onChange: handleInputChange,
              required: true,
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Hora de Recogida *" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              name: "pickupTime",
              className: "input input-bordered",
              value: formData.pickupTime,
              onChange: handleInputChange,
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Número de Vuelo" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "flightNumber",
              placeholder: "AA1234",
              className: "input input-bordered",
              value: formData.flightNumber,
              onChange: handleInputChange
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold", children: "2" }),
        "Huéspedes"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Adultos *" }) }),
        /* @__PURE__ */ jsx(
          "select",
          {
            name: "adults",
            className: "select select-bordered",
            value: formData.adults,
            onChange: (e) => {
              handleInputChange(e);
              calculateTotals();
            },
            required: true,
            children: [1, 2, 3, 4, 5, 6].map((num) => /* @__PURE__ */ jsxs("option", { value: num, children: [
              num,
              " ",
              num === 1 ? "Adulto" : "Adultos"
            ] }, num))
          }
        )
      ] }),
      itemType === "tour" && childPrice && /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Niños" }) }),
        /* @__PURE__ */ jsx(
          "select",
          {
            name: "children",
            className: "select select-bordered",
            value: formData.children,
            onChange: (e) => {
              handleInputChange(e);
              calculateTotals();
            },
            children: [0, 1, 2, 3, 4].map((num) => /* @__PURE__ */ jsxs("option", { value: num, children: [
              num,
              " ",
              num === 1 ? "Niño" : "Niños"
            ] }, num))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold", children: "3" }),
        "Datos de Contacto"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Nombre Completo *" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "customerName",
            placeholder: "Juan Pérez",
            className: "input input-bordered",
            value: formData.customerName,
            onChange: handleInputChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Email *" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            name: "customerEmail",
            placeholder: "juan@ejemplo.com",
            className: "input input-bordered",
            value: formData.customerEmail,
            onChange: handleInputChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Teléfono *" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            name: "customerPhone",
            placeholder: "+52 998 123 4567",
            className: "input input-bordered",
            value: formData.customerPhone,
            onChange: handleInputChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Peticiones Especiales" }) }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "specialRequests",
            placeholder: "¿Alguna solicitud especial?",
            className: "textarea textarea-bordered",
            rows: 3,
            value: formData.specialRequests,
            onChange: handleInputChange
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
      /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text font-semibold", children: "Código Promocional" }) }),
      /* @__PURE__ */ jsxs("div", { className: "join", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "VERANO2026",
            className: "input input-bordered join-item flex-1",
            value: promoCode,
            onChange: (e) => setPromoCode(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-primary join-item",
            onClick: handleApplyPromo,
            children: "Aplicar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "divider" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 bg-base-200 p-5 rounded-2xl", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold mb-3", children: "Resumen de Precio" }),
      itemType === "hotel" && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          itemPrice.toLocaleString("es-MX"),
          " x ",
          nights,
          " ",
          nights === 1 ? "noche" : "noches"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          (itemPrice * nights).toLocaleString("es-MX")
        ] })
      ] }),
      itemType === "tour" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            formData.adults,
            " Adultos"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            (itemPrice * formData.adults).toLocaleString("es-MX")
          ] })
        ] }),
        formData.children > 0 && childPrice && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            formData.children,
            " Niños"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            (childPrice * formData.children).toLocaleString("es-MX")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          subtotal.toLocaleString("es-MX")
        ] })
      ] }),
      discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-success", children: [
        /* @__PURE__ */ jsx("span", { children: "Descuento" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "-$",
          discount.toLocaleString("es-MX")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: "Impuestos (16%)" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          tax.toLocaleString("es-MX")
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divider my-2" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-bold text-xl", children: [
        /* @__PURE__ */ jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxs("span", { className: "price-gradient", children: [
          "$",
          total.toLocaleString("es-MX"),
          " MXN"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary btn-block btn-lg rounded-xl", children: "Continuar al Pago →" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-base-content/60", children: [
      "Al continuar, aceptas nuestros",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/terms", className: "underline hover:text-primary", children: "términos y condiciones" })
    ] })
  ] });
}

export { BookingForm as B };
