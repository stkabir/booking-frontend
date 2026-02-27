const API_URL = "http://localhost:8000/api";
async function fetchAPI(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
const api = {
  // Hotels
  async getHotels() {
    return fetchAPI("/hotels");
  },
  async getHotel(slug) {
    return fetchAPI(`/hotels/${slug}`);
  },
  async getFeaturedHotels() {
    return fetchAPI("/hotels?featured=1");
  },
  // Tours
  async getTours() {
    return fetchAPI("/tours");
  },
  async getTour(slug) {
    return fetchAPI(`/tours/${slug}`);
  },
  async getFeaturedTours() {
    return fetchAPI("/tours?featured=1");
  },
  // Transfers
  async getTransfers() {
    return fetchAPI("/transfers");
  },
  async getTransfer(slug) {
    return fetchAPI(`/transfers/${slug}`);
  },
  async getFeaturedTransfers() {
    return fetchAPI("/transfers?featured=1");
  },
  // Banners
  async getBanners(position = "home") {
    return fetchAPI(`/banners?position=${position}`);
  }
};

export { api as a };
