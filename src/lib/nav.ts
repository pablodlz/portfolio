/**
 * As seções da home, em ordem de página — fonte única do menu.
 *
 * O Nav e o Footer mantinham cada um a sua cópia e elas derivaram: o Nav ficou
 * sem `#formacao` e `#projetos`, então no celular — onde o menu É a navegação,
 * porque `.nav-links` some abaixo de 760px — não havia como chegar em Projetos.
 * Uma lista só, importada pelos dois.
 *
 * Toda entrada aqui precisa de uma `<section id>` correspondente na home.
 */
export interface SectionLink {
  href: string;
  label: string;
}

export const SECTION_LINKS: SectionLink[] = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#skills', label: 'Skills' },
  { href: '#experiencia', label: 'Experiência' },
  { href: '#formacao', label: 'Formação' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#certificacoes', label: 'Certificações' },
  { href: '#publicacoes', label: 'Publicações' },
  { href: '#contato', label: 'Contato' },
];
