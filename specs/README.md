# specs/ — Fonte da verdade (Spec-Driven Development)

Portfólio profissional de **Pablo de Souza Galerani** — SOC Analyst @ Clavis.

## Metodologia

Este projeto segue **SDD (Spec-Driven Development)**: os documentos desta pasta são a
fonte da verdade; o código em `src/` é **derivado** deles, nunca o contrário. Mudança de
comportamento começa por editar o spec correspondente, depois o código. Os specs são
"living docs" — versionados junto do código, atualizados quando decisões mudam.

A especificação-mãe que originou tudo é [`../PORTFOLIO_BUILD_PROMPT.md`](../PORTFOLIO_BUILD_PROMPT.md).

## Índice

| Documento | Conteúdo |
|---|---|
| [product-requirements.md](product-requirements.md) | PRD: objetivo, público, escopo, requisitos EARS, user stories, metas de sucesso |
| [architecture.md](architecture.md) | ADRs numerados (stack, CSS, animação, dados, deploy), árvore de pastas, fluxo de build |
| [content-model.md](content-model.md) | Schemas Zod de `data/linkedin.json` + mapeamento seção→dados + validação em build |
| [design-system.md](design-system.md) | Tokens finais (dark/light, tipografia, espaçamento, motion) — espelho de `../design-system/MASTER.md` |
| [security.md](security.md) | Threat model STRIDE + controles + checklist verificável |
| [sections/](sections/) | Um spec curto por seção do site (10 seções) |
| [tasks.md](tasks.md) | Plano de implementação faseado com checkboxes, rastreado aos specs |

## Regras de ouro

1. **Conteúdo**: todo texto do site vem de [`../data/linkedin.json`](../data/linkedin.json). Nada é inventado. Lacuna vira `TODO` no spec + pergunta ao Pablo.
2. **Design**: tokens de [`design-system.md`](design-system.md) (conciliação: brief do Pablo > refs coletadas > skill `ui-ux-pro-max`). UMA cor de acento; secundárias só em badges de status.
3. **Segurança**: nenhum controle de [`security.md`](security.md) é opcional. Zero recursos de terceiros em runtime.
4. **Plataforma**: saída 100% estática, GitHub Pages project page (`base: '/portfolio'`).

## Insumos preservados (não mover, não editar)

- `data/` — conteúdo (linkedin.json) e direção de design (design-references.*)
- `img/` — foto, 44 certificados LinkedIn, 8 certificados antigos, 11 capas de posts
- `legacy/` — site antigo (referência histórica; **não** é insumo de design/código)
