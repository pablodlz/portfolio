/**
 * Fonte única de dados tipados (ADR-0004). Importa data/linkedin.json,
 * valida com Zod (build QUEBRA se divergir — REQ-F02) e faz as validações
 * cruzadas de specs/content-model.md (imagens existem, URNs resolvem).
 */
import type { ImageMetadata } from 'astro';
import raw from '../../data/linkedin.json';
import { LinkedInData } from './schema';
import { issuerOf } from './certs';

export const data = LinkedInData.parse(raw);

/* ---------- imagens (originais em img/ — única cópia, ADR-0004) ---------- */

type ImgModule = { default: ImageMetadata };

const certImageModules = import.meta.glob<ImgModule>(
  '../../img/certificados/linkedin/*.{jpg,png}',
  { eager: true },
);
const repoCertImageModules = import.meta.glob<ImgModule>(
  '../../img/certificados/*.png',
  { eager: true },
);
const pubImageModules = import.meta.glob<ImgModule>('../../img/linkedin/*.jpg', {
  eager: true,
});

function byBasename(mods: Record<string, ImgModule>): Map<string, ImageMetadata> {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(mods)) {
    map.set(path.split('/').pop()!, mod.default);
  }
  return map;
}

const certImgs = byBasename(certImageModules);
const repoCertImgs = byBasename(repoCertImageModules);
const pubImgs = byBasename(pubImageModules);

/* ---------- validações cruzadas (falham o build) ---------- */

for (const f of data.certifications.downloadedDocuments.files) {
  if (!certImgs.has(f.file)) {
    throw new Error(`linkedin.json referencia certificado inexistente: img/certificados/linkedin/${f.file}`);
  }
  issuerOf(f.file); // lança se não mapeado
}

if (data.certifications.downloadedDocuments.count !== data.certifications.downloadedDocuments.files.length) {
  throw new Error(
    `downloadedDocuments.count (${data.certifications.downloadedDocuments.count}) != files.length (${data.certifications.downloadedDocuments.files.length})`,
  );
}

for (const c of data.certificateImagesInRepo) {
  const base = c.file.split('/').pop()!;
  if (!repoCertImgs.has(base)) {
    throw new Error(`linkedin.json referencia certificado inexistente: ${c.file}`);
  }
}

const urns = new Set(data.publications.map((p) => p.urn));
for (const proj of data.projects) {
  for (const rel of proj.relatedPublications) {
    if (!urns.has(rel)) {
      throw new Error(`projects "${proj.name}" referencia publicação inexistente: ${rel}`);
    }
  }
}

for (const p of data.publications) {
  const base = p.image.split('/').pop()!;
  if (!pubImgs.has(base)) {
    throw new Error(`publicação ${p.id} referencia capa inexistente: ${p.image}`);
  }
}

/* ---------- acessores tipados ---------- */

export function certImage(file: string): ImageMetadata {
  return certImgs.get(file)!; // existência garantida acima
}
export function repoCertImage(path: string): ImageMetadata {
  return repoCertImgs.get(path.split('/').pop()!)!;
}
export function pubImage(path: string): ImageMetadata {
  return pubImgs.get(path.split('/').pop()!)!;
}

export function publicationByUrn(urn: string) {
  return data.publications.find((p) => p.urn === urn)!;
}

/** E-mail ofuscado (REQ-F07): partes invertidas para montagem via JS acessível. */
export function obfuscatedEmail(): { u: string; d: string } {
  const [user, domain] = data.profile.contact.email.split('@');
  return {
    u: [...user!].reverse().join(''),
    d: [...domain!].reverse().join(''),
  };
}
