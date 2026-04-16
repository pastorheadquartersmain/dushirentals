/**
 * WordPress REST API service stub.
 * Currently returns static JSON. Ready for WP REST API swap.
 */
import fleetData from '../data/fleet.json';
import testimonialsData from '../data/testimonials.json';
import faqData from '../data/faq.json';

const WP_BASE_URL = 'https://dushirentalscuracao.com/wp-json/wp/v2';

export async function fetchFleet() {
  // Future: return fetch(`${WP_BASE_URL}/fleet`).then(r => r.json());
  return Promise.resolve(fleetData);
}

export async function fetchTestimonials() {
  // Future: return fetch(`${WP_BASE_URL}/testimonials`).then(r => r.json());
  return Promise.resolve(testimonialsData);
}

export async function fetchFAQs() {
  // Future: return fetch(`${WP_BASE_URL}/faq`).then(r => r.json());
  return Promise.resolve(faqData);
}

export function getBookingUrl(vehicleId = '') {
  const base = 'https://dushirentalscuracao.com/booking/';
  return vehicleId ? `${base}?vehicle=${vehicleId}` : base;
}
