// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/**
 * Deploy alvo: GitHub Pages *project page*.
 * Para migrar p/ domínio próprio ou user page, basta trocar as duas
 * constantes abaixo (ex.: SITE = 'https://pablogalerani.dev', BASE = '/').
 */
const SITE = 'https://pablodlz.github.io';
const BASE = '/portfolio';

// O script de tema roda inline no <head> (evita flash de tema errado).
// Seu hash SHA-256 é calculado aqui e adicionado à CSP — sem 'unsafe-inline'.
const themeInit = readFileSync(new URL('./src/scripts/theme-init.js', import.meta.url), 'utf8').trim();
const themeInitHash = `sha256-${createHash('sha256').update(themeInit, 'utf8').digest('base64')}`;

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // CSS crítico inline (hasheado pela CSP do Astro) — elimina requests
    // render-blocking; validado: style-src recebe os hashes no build.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Sem assets em data: URI (fontes pequenas viravam data:font/... e a
      // CSP font-src 'self' bloqueia — e afrouxá-la seria pior que 1 request).
      assetsInlineLimit: 0,
    },
  },
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "base-uri 'none'",
        "form-action 'self'",
        // frame-ancestors NÃO entra: browsers ignoram (e logam erro) quando a
        // diretiva vem via <meta>. Anti-clickjacking real exige header de
        // servidor, que o GitHub Pages não permite — ver specs/security.md.
        "object-src 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'"],
        hashes: [themeInitHash],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
});
