# Seção 7 — Certificações

**Propósito.** Evidência visual e verificável do volume de qualificação (US-04). A seção
mais rica em interação: contadores, filtro, galeria, lightbox.

**Dados.**
- Galeria principal: `certifications.downloadedDocuments.files[]` (44 imagens em
  `img/certificados/linkedin/`), com `lowRes` por item.
- Certificados antigos: `certificateImagesInRepo[]` (8 PNGs, com `verifyUrl`/`verifyCode`, horas, data).
- Contadores derivados: `files.length` (44 documentos), `certifications.items.length`
  (30 certificações mapeadas), `totalOnLinkedIn` (24 no LinkedIn) — exibir
  "44 documentos · 30+ certificações e treinamentos" (números computados, REQ do content-model).
- Filtro por emissor: derivado de `items[].issuer` normalizado (Clavis, KnowBe4,
  Santander, DIO, Alura, MEC, Bradesco, Google/Coursera, Fortinet, Cisco, Acadi-TI,
  Fatec/eventos, Outros). Mapeamento arquivo→emissor por prefixo/título definido em
  `src/lib/certs.ts` (tabela estática rastreável — não heurística em runtime).

**Layout.**
- Header: contadores como 3 stats (número grande Space Grotesk + label mono).
- Barra de filtros: botões pill (`aria-pressed`), "Todos" default + emissores com contagem.
- Grid responsivo de miniaturas (`<Image>` 300px, lazy, aspect fixo 4:3 com
  `object-fit: cover`): título no hover/focus (overlay) e badge pequena do emissor.
  Itens `lowRes`: badge neutra "baixa resolução".
- Bloco "Certificados verificáveis" (os 8 antigos): cards menores com título, emissor,
  horas, data e link "Verificar ↗" quando `verifyUrl` (+ `verifyCode` visível em mono).
- **Lightbox** (REQ-F05): `<dialog>` nativo; imagem ampliada (max 90vw/85vh; se `lowRes`,
  `max-width: 480px` para não borrar), título + emissor, botão fechar, navegação ←/→
  dentro do filtro ativo. Foco preso (nativo do dialog), `Esc` fecha, scroll da página travado.

**Progressive enhancement.** Sem JS: grid inteiro visível (filtros escondidos via
`hidden` removido por JS; miniaturas viram links para a imagem original).

**A11y.** Botões de filtro com `aria-pressed`; dialog com `aria-labelledby`; alt = título
do certificado; contraste do overlay ≥ 4.5:1.

**Animação.** Fade curto na troca de filtro (reduced-motion: sem fade). Lightbox: fade+scale 150ms.
