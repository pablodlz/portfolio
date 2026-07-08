# Política de Segurança

Este repositório contém o site estático do portfólio de **Pablo de Souza Galerani**
(https://pablodlz.github.io/portfolio/). Segurança é o tema do site — reportes são
bem-vindos e levados a sério.

## Como reportar uma vulnerabilidade

- **E-mail:** pablogalerani@gmail.com (assunto sugerido: `[SEC] portfolio`)
- Ou abra um **Security Advisory** privado aqui no GitHub (preferível a issue pública).
- Contato também publicado em [`/.well-known/security.txt`](https://pablodlz.github.io/portfolio/.well-known/security.txt) (RFC 9116).

Inclua: descrição, passo a passo de reprodução e impacto estimado. Responderei em até
**7 dias** com triagem inicial.

## Escopo

- O site publicado em `pablodlz.github.io/portfolio` e o código deste repositório
  (HTML/CSS/JS gerados, workflow de CI/CD, cadeia de dependências).
- **Fora de escopo:** a infraestrutura do GitHub Pages/GitHub.com (reporte à
  [GitHub](https://bounty.github.com/)), e os sites de terceiros linkados.

## Postura (resumo)

- Site 100% estático, sem backend, sem coleta de dados, sem cookies, sem analytics.
- CSP restritiva via `<meta>`; zero recursos de terceiros; dependências auditadas em CI
  (`npm audit`, Dependabot). Detalhes e limitações documentados em
  [`specs/security.md`](specs/security.md) e no [README](README.md).

## Divulgação

Divulgação coordenada: peço prazo razoável para correção antes de publicação. Créditos
ao pesquisador serão dados no changelog/commit, se desejado.
