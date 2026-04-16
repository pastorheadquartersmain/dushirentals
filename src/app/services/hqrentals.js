/**
 * HQ Rentals API service.
 * Fetches live vehicle data from the WordPress HQ Rentals plugin.
 */

const HQ_BASE = 'https://dushirentalscuracao.com/wp-json/hqrentals/shortcodes';

let vehicleCache = null;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeVehicle(raw) {
  return {
    id: raw.id || raw.vehicle_type_id || slugify(raw.name || ''),
    name: raw.name || raw.vehicle_name || '',
    category: raw.category || raw.vehicle_class || '',
    slug: slugify(raw.category || raw.vehicle_class || raw.name || ''),
    pricePerDay: parseFloat(raw.price_per_day || raw.rate || raw.daily_rate || 0),
    image: raw.image_url || raw.image || raw.featured_image || '',
    images: raw.images || (raw.image_url ? [raw.image_url] : []),
    seats: parseInt(raw.seats || raw.passengers || 0, 10),
    bags: parseInt(raw.bags || raw.luggage || 0, 10),
    transmission: raw.transmission || 'Automatic',
    doors: parseInt(raw.doors || 4, 10),
    ac: raw.ac !== false,
    description: raw.description || raw.content || '',
    features: raw.features || [],
    permalink: raw.permalink || raw.booking_url || '',
  };
}

export async function fetchVehicleTypes() {
  if (vehicleCache) return vehicleCache;

  try {
    const res = await fetch(`${HQ_BASE}/vehicle-types`);
    if (!res.ok) throw new Error(`HQ API ${res.status}`);

    const data = await res.json();
    const vehicles = Array.isArray(data) ? data : data?.vehicles || data?.data || [];
    vehicleCache = vehicles.map(normalizeVehicle);
    return vehicleCache;
  } catch (err) {
    console.error('HQ Rentals API error:', err);
    return [];
  }
}

export async function fetchVehicleBySlug(slug) {
  const vehicles = await fetchVehicleTypes();
  return vehicles.find(v => v.slug === slug) || null;
}

export async function fetchVehiclesByCategory(categorySlug) {
  const vehicles = await fetchVehicleTypes();
  return vehicles.filter(v => v.slug === categorySlug);
}

export function getBookingFormUrl() {
  return `${HQ_BASE}/bookingform`;
}

export function clearCache() {
  vehicleCache = null;
}
