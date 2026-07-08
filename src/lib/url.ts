/** Helpers de URL respeitando o base path do GitHub Pages (REQ-N02). */

/** "/img/x.png" → "/portfolio/img/x.png" (nunca hardcodar o base). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
