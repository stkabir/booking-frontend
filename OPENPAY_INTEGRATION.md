# Integración Openpay - Guía Completa

## 📋 Resumen

Openpay es la pasarela de pagos de BBVA México. Implementaremos:
- **Backend**: API REST para crear cargos y gestionar pagos
- **Frontend**: Formulario de pago con tokenización segura (PCI Compliance)

## 🔗 Documentación Oficial
- SDK PHP: https://github.com/open-pay/openpay-php
- JS Tokenizer: https://docs.openpay.mx/docs/tokenizacion.html
- API Reference: https://docs.openpay.mx/docs/api/

---

## 🚀 PASO 1: Backend (booking-api-idayvuelta)

### 1.1 Instalar SDK de Openpay

```bash
cd C:\laragon\www\booking\booking-api-idayvuelta
composer require openpay/sdk:dev-master
```

### 1.2 Configurar Variables de Entorno (`.env`)

```env
# Openpay Configuration
OPENPAY_MODE=sandbox  # Cambiar a 'production' en producción
OPENPAY_MERCHANT_ID=your_merchant_id_here
OPENPAY_PRIVATE_KEY=sk_your_private_key_here
OPENPAY_PUBLIC_KEY=pk_your_public_key_here
OPENPAY_LOCATION=MX  # México
```

### 1.3 Crear Configuración de Openpay

**Archivo: `config/openpay.php`**

```php
<?php

return [
    'mode' => env('OPENPAY_MODE', 'sandbox'),
    'merchant_id' => env('OPENPAY_MERCHANT_ID'),
    'private_key' => env('OPENPAY_PRIVATE_KEY'),
    'public_key' => env('OPENPAY_PUBLIC_KEY'),
    'location' => env('OPENPAY_LOCATION', 'MX'),
    
    'urls' => [
        'sandbox' => 'https://sandbox-api.openpay.mx/v1/',
        'production' => 'https://api.openpay.mx/v1/',
    ],
];
```

### 1.4 Crear Modelo Payment

**Archivo: `app/Models/Payment.php`**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'amount',
        'currency',
        'payment_method',
        'openpay_id',
        'status',
        'description',
        'error_message',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REFUNDED = 'refunded';

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### 1.5 Crear Migración de Payments

```bash
php artisan make:migration create_payments_table
```

**Archivo: `database/migrations/xxxx_create_payments_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('MXN');
            $table->string('payment_method')->default('card');
            $table->string('openpay_id')->nullable(); // ID de transacción en Openpay
            $table->string('status')->default('pending');
            $table->text('description')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('openpay_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
```

### 1.6 Crear Servicio de Openpay

**Archivo: `app/Services/OpenpayService.php`**

```php
<?php

namespace App\Services;

use Openpay;
use OpenpayApiError;
use OpenpayApiAuthError;
use OpenpayApiRequestError;
use Illuminate\Support\Facades\Log;

class OpenpayService
{
    private $openpay;

    public function __construct()
    {
        $mode = config('openpay.mode', 'sandbox');
        $merchantId = config('openpay.merchant_id');
        $privateKey = config('openpay.private_key');
        $location = config('openpay.location', 'MX');

        $this->openpay = Openpay::getInstance($merchantId, $privateKey, $location);
        
        // Forzar sandbox si es modo prueba
        if ($mode === 'sandbox') {
            Openpay::setProductionMode(false);
        } else {
            Openpay::setProductionMode(true);
        }
    }

    /**
     * Crear un cargo con token
     */
    public function createCharge(string $token, float $amount, string $description, array $metadata = [], array $customer = []): array
    {
        try {
            $chargeData = [
                'source_id' => $token,
                'method' => 'card',
                'amount' => number_format($amount, 2, '.', ''),
                'currency' => 'MXN',
                'description' => $description,
                'order_id' => $metadata['order_id'] ?? uniqid('order_'),
                'device_session_id' => $metadata['device_session_id'] ?? null,
            ];

            // Agregar datos del cliente (opcional pero recomendado)
            if (!empty($customer)) {
                $chargeData['customer'] = [
                    'name' => $customer['name'] ?? '',
                    'last_name' => $customer['last_name'] ?? '',
                    'phone_number' => $customer['phone'] ?? '',
                    'email' => $customer['email'] ?? '',
                ];
            }

            $charge = $this->openpay->charges->create($chargeData);

            return [
                'success' => true,
                'id' => $charge->id,
                'status' => $charge->status,
                'amount' => $charge->amount,
                'authorization' => $charge->authorization ?? null,
                'message' => 'Pago procesado exitosamente',
            ];

        } catch (OpenpayApiRequestError $e) {
            Log::error('Openpay Request Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'error_code' => $e->getErrorCode(),
            ];
        } catch (OpenpayApiAuthError $e) {
            Log::error('Openpay Auth Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Error de autenticación con Openpay',
            ];
        } catch (\Exception $e) {
            Log::error('Openpay General Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Error al procesar el pago: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Obtener detalles de un cargo
     */
    public function getCharge(string $chargeId): ?object
    {
        try {
            return $this->openpay->charges->get($chargeId);
        } catch (\Exception $e) {
            Log::error('Openpay Get Charge Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Reembolsar un cargo
     */
    public function refundCharge(string $chargeId, ?float $amount = null, ?string $description = null): array
    {
        try {
            $refundData = [
                'description' => $description ?? 'Reembolso',
            ];

            if ($amount) {
                $refundData['amount'] = number_format($amount, 2, '.', '');
            }

            $refund = $this->openpay->charges->refund($chargeId, $refundData);

            return [
                'success' => true,
                'id' => $refund->id,
                'message' => 'Reembolso procesado exitosamente',
            ];
        } catch (\Exception $e) {
            Log::error('Openpay Refund Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
```

### 1.7 Crear Controller de Pagos

**Archivo: `app/Http/Controllers/Api/PaymentController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\OpenpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    private $openpayService;

    public function __construct(OpenpayService $openpayService)
    {
        $this->openpayService = $openpayService;
    }

    /**
     * Procesar pago con tarjeta (token de Openpay)
     */
    public function processCardPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'token' => 'required|string',
            'device_session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $order = Order::findOrFail($request->order_id);
            
            // Verificar que la orden esté pendiente
            if ($order->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'La orden ya ha sido pagada o cancelada',
                ], 400);
            }

            // Crear registro de pago
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => auth()->id(),
                'amount' => $order->total,
                'currency' => 'MXN',
                'payment_method' => 'card',
                'status' => Payment::STATUS_PENDING,
                'description' => "Pago orden #{$order->id}",
            ]);

            // Procesar pago en Openpay
            $result = $this->openpayService->createCharge(
                token: $request->token,
                amount: $order->total,
                description: "Pago orden #{$order->id}",
                metadata: [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'device_session_id' => $request->device_session_id,
                ],
                customer: [
                    'name' => $request->input('customer.name', $order->customer_name ?? ''),
                    'last_name' => $request->input('customer.last_name', $order->customer_last_name ?? ''),
                    'email' => $request->input('customer.email', $order->customer_email ?? ''),
                    'phone' => $request->input('customer.phone', $order->customer_phone ?? ''),
                ]
            );

            if ($result['success']) {
                // Actualizar pago
                $payment->update([
                    'openpay_id' => $result['id'],
                    'status' => Payment::STATUS_COMPLETED,
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'authorization' => $result['authorization'],
                        'openpay_response' => $result,
                    ]),
                ]);

                // Actualizar orden
                $order->update([
                    'status' => 'paid',
                    'payment_id' => $payment->id,
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Pago procesado exitosamente',
                    'payment_id' => $payment->id,
                    'authorization' => $result['authorization'],
                ]);
            } else {
                // Pago fallido
                $payment->update([
                    'status' => Payment::STATUS_FAILED,
                    'error_message' => $result['error'],
                ]);

                DB::commit();

                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'error_code' => $result['error_code'] ?? null,
                ], 400);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener configuración de Openpay para frontend
     */
    public function getConfig()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'merchant_id' => config('openpay.merchant_id'),
                'public_key' => config('openpay.public_key'),
                'mode' => config('openpay.mode', 'sandbox'),
                'location' => config('openpay.location', 'MX'),
            ],
        ]);
    }

    /**
     * Obtener detalles de un pago
     */
    public function show(Payment $payment)
    {
        // Verificar que el usuario tenga acceso a este pago
        if ($payment->user_id && $payment->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $payment->load('order'),
        ]);
    }
}
```

### 1.8 Agregar Rutas de API

**Archivo: `routes/api.php` (agregar al final)**

```php
<?php

use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

// ... rutas existentes ...

// Openpay Payment Routes
Route::prefix('payments')->group(function () {
    // Config pública (para inicializar Openpay.js)
    Route::get('/config', [PaymentController::class, 'getConfig']);
    
    // Procesar pago (requiere autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/process', [PaymentController::class, 'processCardPayment']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
    });
});
```

### 1.9 Crear Seeder de Configuración (Opcional)

```bash
php artisan make:seeder OpenpayConfigSeeder
```

**Archivo: `database/seeders/OpenpayConfigSeeder.php`**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OpenpayConfigSeeder extends Seeder
{
    public function run(): void
    {
        // Agregar credenciales de sandbox para pruebas
        // En producción, estas deben venir de variables de entorno
        
        $this->command->info('Openpay Config:');
        $this->command->info('Asegúrate de configurar OPENPAY_MERCHANT_ID y OPENPAY_PRIVATE_KEY en .env');
        $this->command->info('Obtén tus credenciales en: https://sandbox-dashboard.openpay.mx');
    }
}
```

### 1.10 Ejecutar Migraciones

```bash
php artisan migrate
```

---

## 🎨 PASO 2: Frontend (booking-frontend)

### 2.1 Crear Componente de Pago con Openpay

**Archivo: `src/components/payment/OpenpayForm.tsx`**

```tsx
import { useState, useEffect, useRef } from 'react';

interface OpenpayConfig {
  merchant_id: string;
  public_key: string;
  mode: 'sandbox' | 'production';
}

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

// Tipos para Openpay.js
declare global {
  interface Window {
    Openpay?: {
      setId: (id: string) => void;
      setApiKey: (key: string) => void;
      setSandboxMode: (sandbox: boolean) => void;
      token: {
        extractFormAndCreate: (
          formId: string,
          callback: (response: any) => void
        ) => void;
      };
      deviceData: {
        setup: (formId: string, hiddenFieldId: string) => string;
      };
    };
  }
}

export default function OpenpayForm({
  orderId,
  amount,
  currency = 'MXN',
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<OpenpayConfig | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Cargar configuración de Openpay
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/payments/config');
        const data = await response.json();
        if (data.success) {
          setConfig(data.data);
        }
      } catch (err) {
        onError('No se pudo cargar la configuración de pagos');
      }
    };
    loadConfig();
  }, [onError]);

  // Inicializar Openpay.js
  useEffect(() => {
    if (!config) return;

    // Cargar script de Openpay
    const script = document.createElement('script');
    script.src = 'https://js.openpay.mx/openpay.v1.min.js';
    script.onload = () => {
      if (window.Openpay) {
        window.Openpay.setId(config.merchant_id);
        window.Openpay.setApiKey(config.public_key);
        window.Openpay.setSandboxMode(config.mode === 'sandbox');
        
        // Inicializar device session
        if (formRef.current) {
          window.Openpay.deviceData.setup('payment-form', 'device_session_id');
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!window.Openpay || !formRef.current) {
      onError('Error al inicializar el sistema de pagos');
      setIsLoading(false);
      return;
    }

    // Crear token de tarjeta
    window.Openpay.token.extractFormAndCreate('payment-form', async (response: any) => {
      if (response.error) {
        setErrors({ card: response.message });
        setIsLoading(false);
        return;
      }

      const token = response.data.id;
      const deviceSessionId = (
        document.getElementById('device_session_id') as HTMLInputElement
      )?.value;

      // Enviar token al backend
      try {
        const paymentResponse = await fetch('/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            token,
            device_session_id: deviceSessionId,
            customer: {
              name: (document.getElementById('holder_name') as HTMLInputElement)?.value,
            },
          }),
        });

        const result = await paymentResponse.json();

        if (result.success) {
          onSuccess(result.payment_id);
        } else {
          setErrors({ payment: result.message });
          onError(result.message);
        }
      } catch (err) {
        onError('Error al procesar el pago');
      } finally {
        setIsLoading(false);
      }
    });
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{0,2})/, '$1/$2')
      .slice(0, 5);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Pagar ${amount.toFixed(2)} {currency}
      </h3>

      <form ref={formRef} id="payment-form" onSubmit={handleSubmit}>
        {/* Device Session ID (hidden) */}
        <input type="hidden" id="device_session_id" name="device_session_id" />

        {/* Nombre del titular */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del titular
          </label>
          <input
            type="text"
            id="holder_name"
            name="holder_name"
            data-openpay-card="holder_name"
            placeholder="NOMBRE APELLIDO"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Número de tarjeta */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta
          </label>
          <input
            type="text"
            id="card_number"
            name="card_number"
            data-openpay-card="card_number"
            placeholder="4111 1111 1111 1111"
            onChange={(e) => {
              e.target.value = formatCardNumber(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
            maxLength={19}
            required
          />
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de expiración
            </label>
            <input
              type="text"
              id="expiration_month"
              name="expiration_month"
              data-openpay-card="expiration_month"
              placeholder="MM/AA"
              onChange={(e) => {
                e.target.value = formatExpiry(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv2"
              name="cvv2"
              data-openpay-card="cvv2"
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
              maxLength={4}
              required
            />
          </div>
        </div>

        {/* Errores */}
        {errors.card && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.card}
          </div>
        )}
        {errors.payment && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.payment}
          </div>
        )}

        {/* Botón de pago */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
        </button>

        {/* Seguridad */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          🔒 Pago seguro procesado por Openpay (BBVA)
          <br />
          Tu información está protegida con encriptación SSL
        </p>
      </form>
    </div>
  );
}
```

### 2.2 Crear Hook para Pagos

**Archivo: `src/hooks/useOpenpay.ts`**

```typescript
import { useState, useCallback } from 'react';

interface UseOpenpayReturn {
  processPayment: (orderId: string, token: string, deviceSessionId: string) => Promise<any>;
  isProcessing: boolean;
  error: string | null;
}

export function useOpenpay(): UseOpenpayReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (
    orderId: string,
    token: string,
    deviceSessionId: string
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          token,
          device_session_id: deviceSessionId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error al procesar el pago');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processPayment, isProcessing, error };
}
```

### 2.3 Ejemplo de Uso en Checkout

**Archivo: `src/components/checkout/CheckoutPage.tsx`** (ejemplo)

```tsx
import { useState } from 'react';
import OpenpayForm from '../payment/OpenpayForm';

export default function CheckoutPage({ orderId, amount }: { orderId: string; amount: number }) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const handleSuccess = (paymentId: string) => {
    setPaymentStatus('success');
    // Redirigir a página de confirmación
    window.location.href = `/checkout/success?payment=${paymentId}`;
  };

  const handleError = (error: string) => {
    setPaymentStatus('error');
    console.error('Payment error:', error);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Finalizar compra</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen de orden */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="font-bold mb-4">Resumen</h2>
          <p>Orden: #{orderId}</p>
          <p className="text-xl font-bold text-amber-600">
            Total: ${amount.toFixed(2)} MXN
          </p>
        </div>

        {/* Formulario de pago */}
        <div>
          {paymentStatus === 'pending' && (
            <OpenpayForm
              orderId={orderId}
              amount={amount}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}
          
          {paymentStatus === 'success' && (
            <div className="p-6 bg-green-100 text-green-800 rounded-lg">
              ✅ ¡Pago procesado exitosamente!
            </div>
          )}
          
          {paymentStatus === 'error' && (
            <div className="p-6 bg-red-100 text-red-800 rounded-lg">
              ❌ Error en el pago. Intenta de nuevo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 PASO 3: Tarjetas de Prueba (Sandbox)

| Tarjeta | Número | CVV | Expiración | Resultado |
|---------|--------|-----|------------|-----------|
| Visa Aprobada | 4111111111111111 | 123 | Cualquiera futura | Éxito |
| Visa Rechazada | 4000000000000002 | 123 | Cualquiera futura | Fallo |
| Mastercard Aprobada | 5555555555554444 | 123 | Cualquiera futura | Éxito |
| Mastercard Rechazada | 5555555555555557 | 123 | Cualquiera futura | Fallo |

---

## 📋 Checklist de Implementación

### Backend:
- [ ] Instalar SDK con `composer require openpay/sdk`
- [ ] Crear cuenta en [Openpay Sandbox](https://sandbox-dashboard.openpay.mx)
- [ ] Agregar credenciales al `.env`
- [ ] Crear migración de payments
- [ ] Crear modelo `Payment.php`
- [ ] Crear servicio `OpenpayService.php`
- [ ] Crear controller `PaymentController.php`
- [ ] Agregar rutas en `api.php`
- [ ] Ejecutar `php artisan migrate`
- [ ] Configurar CORS si es necesario

### Frontend:
- [ ] Crear componente `OpenpayForm.tsx`
- [ ] Crear hook `useOpenpay.ts`
- [ ] Agregar tipos de TypeScript para Openpay.js
- [ ] Implementar en página de checkout
- [ ] Probar con tarjetas de sandbox

### Producción:
- [ ] Cambiar `OPENPAY_MODE=production`
- [ ] Actualizar credenciales de producción
- [ ] Activar webhook para notificaciones (opcional)
- [ ] Configurar SSL obligatorio

---

## 🔗 Recursos Adicionales

- [Dashboard Sandbox](https://sandbox-dashboard.openpay.mx)
- [Dashboard Producción](https://dashboard.openpay.mx)
- [Documentación Openpay](https://docs.openpay.mx)
- [GitHub SDK PHP](https://github.com/open-pay/openpay-php)
