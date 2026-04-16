/**
 * WordPress REST API page fetcher.
 * Retrieves page content and strips WPBakery/Elementor shortcodes.
 */

const WP_API = 'https://dushirentalscuracao.com/wp-json/wp/v2';

const pageCache = new Map();

function stripShortcodes(html) {
  if (!html) return '';
  return html
    .replace(/\[\/?\w+[^\]]*\]/g, '')        // [shortcode] and [/shortcode]
    .replace(/<!--[\s\S]*?-->/g, '')           // HTML comments
    .replace(/<style[\s\S]*?<\/style>/gi, '')  // inline style blocks
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function htmlToText(html) {
  if (!html) return '';
  const cleaned = stripShortcodes(html);
  const div = document.createElement('div');
  div.innerHTML = cleaned;
  return div.textContent || div.innerText || '';
}

export async function fetchPage(pageId) {
  if (pageCache.has(pageId)) return pageCache.get(pageId);

  try {
    const res = await fetch(`${WP_API}/pages/${pageId}`);
    if (!res.ok) throw new Error(`WP API ${res.status}`);

    const data = await res.json();
    const page = {
      id: data.id,
      title: data.title?.rendered || '',
      contentRaw: data.content?.rendered || '',
      contentClean: stripShortcodes(data.content?.rendered || ''),
      contentText: htmlToText(data.content?.rendered || ''),
      excerpt: data.excerpt?.rendered || '',
      slug: data.slug || '',
    };

    pageCache.set(pageId, page);
    return page;
  } catch (err) {
    console.error('WP page fetch error:', err);
    return null;
  }
}

export async function fetchPageBySlug(slug) {
  try {
    const res = await fetch(`${WP_API}/pages?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(`WP API ${res.status}`);

    const data = await res.json();
    if (!data.length) return null;

    const raw = data[0];
    const page = {
      id: raw.id,
      title: raw.title?.rendered || '',
      contentRaw: raw.content?.rendered || '',
      contentClean: stripShortcodes(raw.content?.rendered || ''),
      contentText: htmlToText(raw.content?.rendered || ''),
      excerpt: raw.excerpt?.rendered || '',
      slug: raw.slug || '',
    };

    pageCache.set(raw.id, page);
    return page;
  } catch (err) {
    console.error('WP page fetch error:', err);
    return null;
  }
}

export { stripShortcodes, htmlToText };
