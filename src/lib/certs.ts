/**
 * Mapeamento estático arquivo→emissor da galeria de certificações
 * (specs/sections/07-certifications.md). Tabela rastreável, não heurística.
 * Emissores não confirmados (TODO-C2 do content-model) ficam em 'Outros'.
 */

export const ISSUER_GROUPS = [
  'Clavis',
  'Acadi-TI',
  'Fortinet',
  'Cisco',
  'Google/Coursera',
  'DIO',
  'Santander',
  'KnowBe4',
  'Alura/FIAP',
  'MEC',
  'Bradesco',
  'Fatec',
  'IFPR',
  'RedScan',
  'OWASP',
  'Outros',
] as const;

export type IssuerGroup = (typeof ISSUER_GROUPS)[number];

/** licert-NN → grupo de emissor. Derivado dos títulos do próprio linkedin.json. */
const BY_NUMBER: Record<string, IssuerGroup> = {
  '01': 'Clavis',
  '02': 'Clavis',
  '03': 'Clavis',
  '04': 'IFPR',
  '05': 'KnowBe4',
  '06': 'KnowBe4',
  '07': 'KnowBe4',
  '08': 'Santander',
  '09': 'Santander',
  '10': 'DIO',
  '11': 'DIO',
  '12': 'DIO',
  '13': 'RedScan',
  '14': 'Alura/FIAP',
  '15': 'Alura/FIAP',
  '16': 'Alura/FIAP',
  '17': 'MEC',
  '18': 'MEC',
  '19': 'Bradesco',
  '20': 'Outros', // TODO-C2: emissor não confirmado
  '21': 'Outros', // TODO-C2
  '22': 'Google/Coursera',
  '23': 'Google/Coursera',
  '24': 'Google/Coursera',
  '25': 'Fortinet',
  '26': 'Fortinet',
  '27': 'Fortinet',
  '28': 'Outros', // TODO-C2
  '29': 'Acadi-TI',
  '30': 'Outros', // TODO-C2 (placa de conclusão)
  '31': 'Acadi-TI',
  '32': 'OWASP',
  '33': 'Cisco',
  '34': 'Cisco',
  '35': 'Cisco',
  '36': 'Fatec', // confirmado por inspeção visual do documento (diploma Fatec Ourinhos)
  '37': 'Fatec',
  '38': 'Fatec',
  '39': 'Outros', // TODO-C2 (badge)
  '40': 'Outros', // TODO-C2
  '41': 'Outros', // TODO-C2
  '42': 'Outros', // TODO-C2
  '43': 'Outros', // TODO-C2
  '44': 'Outros', // TODO-C2
};

export function issuerOf(file: string): IssuerGroup {
  const m = /^licert-(\d{2})-/.exec(file);
  const group = m ? BY_NUMBER[m[1]!] : undefined;
  if (!group) {
    throw new Error(`certs.ts: arquivo de certificado sem emissor mapeado: "${file}"`);
  }
  return group;
}
