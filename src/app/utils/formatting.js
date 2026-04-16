/**
 * Formatting utilities
 */

export function formatPrice(amount) {
  return `$${amount}`;
}

export function formatPricePerDay(amount) {
  return `$${amount}/day`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || `${singular}s`);
}
