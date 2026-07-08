# Seção 9 — Contato

**Propósito.** Conversão: recrutador sai daqui com um canal aberto. Sem backend, sem
terceiros — `mailto:` + perfis.

**Dados.** `profile.contact.{email, github, linkedin}`, `profile.location`.

**Layout.** Seção curta, centrada, com atmosfera (glow sutil como o hero, fechamento
visual): h2 "Vamos conversar?" + linha de apoio (derivada do summary/role — texto de UI,
não conteúdo inventado sobre o Pablo: "Aberto a trocar ideias sobre SOC, AppSec e
segurança ofensiva."), 3 ações:
- **E-mail** (Button primary): montado via JS acessível (REQ-F07/security.md): o HTML
  carrega `data-u`/`data-d` (partes invertidas); script compõe `mailto:` no clique e
  também injeta o endereço legível no botão após load (bots de HTML cru não veem).
  `<noscript>`: e-mail com entidades HTML + "(substitua [arroba])".
- **GitHub** e **LinkedIn** (secondary, noopener).
Linha final mono discreta: localização + "UTC−3".

**A11y.** Botão de e-mail é `<a>` real após hidratação (href preenchido), não `<button>`
fake; foco visível; textos dos links explícitos.

**Animação.** Reveal padrão.
