/** Полный публичный адрес сайта, включая base path GitHub Pages. */
export function siteRoot() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kodbuster.github.io/KodBuster_ru_v2/").trim();
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function pageUrl(pathname = "/") {
  const root = siteRoot();
  const path = pathname.replace(/^\/+/, "");
  return path ? `${root}${path}` : root;
}
