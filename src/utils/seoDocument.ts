import { SEO_DEFAULT, TAB_SEO, SITE_NAME, tabCanonical } from '../constants/seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** SPA 탭 전환 시 title / description / canonical / OG 갱신 */
export function applyTabSeo(tab: string) {
  if (tab === 'admin') return;

  const seo = TAB_SEO[tab] ?? {
    title: SEO_DEFAULT.title,
    description: SEO_DEFAULT.description,
  };

  document.title = seo.title;
  upsertMeta('name', 'description', seo.description);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', tabCanonical(tab));
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertLink('canonical', tabCanonical(tab));

  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', SEO_DEFAULT.locale);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:image', SEO_DEFAULT.ogImage);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:image', SEO_DEFAULT.ogImage);
}
