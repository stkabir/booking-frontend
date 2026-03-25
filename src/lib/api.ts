const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  // Handle various API response shapes: plain array, { data: [] }, { data: {} }, { results: [] }
  if (Array.isArray(data)) return data;
  if (data?.data !== undefined && data?.data !== null) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return data;
}

export interface Hotel {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string;
  state: string | null;
  country: string;
  stars: number;
  price_per_night: number;
  amenities: string[] | null;
  is_active: boolean;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface Tour {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  highlights: string | null;
  destination: string;
  duration: string;
  max_people: number;
  price_adult: number;
  price_child: number | null;
  included: string[] | null;
  not_included: string[] | null;
  itinerary: any | null;
  meeting_point: string | null;
  difficulty_level: string;
  is_active: boolean;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface Transfer {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  from_location: string;
  to_location: string;
  type: string;
  vehicle_type: string;
  max_passengers: number;
  price: number;
  is_private: boolean;
  features: string[] | null;
  is_active: boolean;
  featured: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  position: string;
  order: number;
  is_active: boolean;
}

export interface BookingPayload {
  bookable_type: 'hotel' | 'tour' | 'transfer';
  bookable_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date?: string | null;
  pickup_time?: string | null;
  adults: number;
  children?: number;
  payment_method: 'card' | 'paypal' | 'oxxo';
  promo_code?: string | null;
  special_requests?: string | null;
  flight_number?: string | null;
}

export interface BookingResponse {
  id: number;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bookable_type: string;
  bookable_id: number;
  bookable?: { name: string; slug: string };
  start_date: string;
  end_date: string | null;
  pickup_time: string | null;
  adults: number;
  children: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  special_requests: string | null;
  flight_number: string | null;
  created_at: string;
}

// API Functions
export const api = {
  // Hotels
  async getHotels(): Promise<Hotel[]> {
    return fetchAPI('/hotels');
  },

  async getHotel(slug: string): Promise<Hotel> {
    return fetchAPI(`/hotels/${slug}`);
  },

  async getFeaturedHotels(): Promise<Hotel[]> {
    return fetchAPI('/hotels?featured=1');
  },

  // Tours
  async getTours(): Promise<Tour[]> {
    return fetchAPI('/tours');
  },

  async getTour(slug: string): Promise<Tour> {
    return fetchAPI(`/tours/${slug}`);
  },

  async getFeaturedTours(): Promise<Tour[]> {
    return fetchAPI('/tours?featured=1');
  },

  // Transfers
  async getTransfers(): Promise<Transfer[]> {
    return fetchAPI('/transfers');
  },

  async getTransfer(slug: string): Promise<Transfer> {
    return fetchAPI(`/transfers/${slug}`);
  },

  async getFeaturedTransfers(): Promise<Transfer[]> {
    return fetchAPI('/transfers?featured=1');
  },

  // Banners
  async getBanners(position: string = 'home'): Promise<Banner[]> {
    return fetchAPI(`/banners?position=${position}`);
  },

  // Bookings
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      const err: any = new Error(data.message || 'Error al crear la reserva');
      err.errors = data.errors;
      err.status = response.status;
      throw err;
    }
    return data?.data ?? data;
  },

  async getBooking(bookingNumber: string): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/bookings/${bookingNumber}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error('Reserva no encontrada');
    const data = await response.json();
    return data?.data ?? data;
  },
};
