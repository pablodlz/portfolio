# Seção 1 — Hero

**Propósito.** Em <10s: quem é, o que faz, onde, e como contatar (US-01). Estabelece a
identidade visual (terminal + verde + minimal).

**Dados.** `profile.fullName`, `profile.headline`, `profile.role`, `profile.company`,
`profile.location`, `profile.contact.{email,github,linkedin}`, `about.summary` (1ª frase
como subtítulo), `about.easterEgg.content`.

**Layout.** 2 colunas ≥960px (texto à esquerda, terminal à direita — Portline); empilha
em mobile (terminal abaixo, nunca acima dos CTAs). Atmosfera: grid fino + glow radial.

- Eyebrow mono com dot `--ok` pulsando (reduced-motion: estático): `SOC ANALYST @ CLAVIS — ATIVO`.
- H1 = `fullName` com gradiente de texto; palavra "Galerani" ou linha 2 pode receber `--accent` (decidir no visual QA).
- Sub: headline + 1ª frase do summary em `--text-2`.
- CTAs: `Contato` (primary → âncora #contato), `GitHub` e `LinkedIn` (secondary, externos com noopener). *(CTA Currículo: TODO-C1 — fora até haver PDF.)*
- **Terminal (easter egg):** janela `Terminal` com as linhas de `about.easterEgg.content`
  renderizadas como texto (o base64 aparece como no LinkedIn — quem decodificar acha o
  flag: parte da graça, é público e intencional). Prompt final com cursor `_` piscando.
  `aria-label="Terminal decorativo com easter egg"`; conteúdo em `<pre>` acessível.

**Estados/A11y.** Foto de perfil NÃO aparece no hero (fica no Sobre) — hero é tipográfico.
Skip-link "Pular para o conteúdo" antes da nav. H1 único na página.

**Animação.** Reveal em cascata (eyebrow→h1→sub→CTAs→terminal, 60ms stagger); linhas do
terminal "digitam" via animação CSS de reveal por linha (sem JS extra), cursor pisca.
