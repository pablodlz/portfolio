# Diagramas do dossiê

Fontes [mermaid](https://mermaid.js.org) dos fluxogramas da página `/omni-pentest`, e o SVG
correspondente em `public/omni-pentest/diagramas/`.

| fonte | onde entra na página |
| --- | --- |
| `mapa.mmd` | abertura (`#visao`) — a figura 1, o sistema inteiro |
| `nucleo.mmd` | §&nbsp;03 método |
| `firewall.mmd` | §&nbsp;05 firewall |
| `conhecimento.mmd` | §&nbsp;06 conhecimento |
| `caminho-do-ataque.mmd` | §&nbsp;08 arquitetura |
| `achado-ao-relatorio.mmd` | §&nbsp;08 arquitetura |

**A máquina de fases não tem diagrama aqui de propósito.** O §&nbsp;02 já a desenha em HTML
(`.o-flow`, em `OmniPhases.astro`): a mesma corrente, mas nativa — acompanha o tema, quebra sozinha e
continua legível em 340px, coisa que uma tira de 1490px não faz. Ter as duas seria a mesma figura
duas vezes, com a pior das duas ocupando o celular.

## Por que pré-renderizado, e não mermaid no cliente

O site serve uma CSP estrita (o Astro calcula os hashes no build), então **não há como carregar o
mermaid no navegador**: nem script externo, nem script inline não-hasheado. A saída é renderizar
**uma vez**, aqui, e versionar o SVG resultante — que é estático, leve e não custa nenhuma
dependência de runtime.

## Regras de conteúdo

O repositório da plataforma é **privado**. Estes diagramas descrevem **como o sistema funciona** e
nunca:

- caminho de arquivo, nome de módulo, de classe ou de serviço interno;
- identificador de spec, de hook ou de ferramenta interna;
- nome de programa ou de alvo real.

Onde o README interno nomeia um componente, aqui entra **o papel dele**. É a mesma topologia com o
vocabulário do produto.

## Como re-renderizar

```sh
node diagrams/render.mjs
```

O script é **de autoria, não de build** — o CI nunca o executa, e por isso o site não ganha nenhuma
dependência nova (o que exigiria um ADR). Ele precisa de três coisas na máquina de quem renderiza, e
todas são sobrescrevíveis por variável de ambiente se o caminho mudar:

| variável | padrão | o que é |
| --- | --- | --- |
| `CHROMIUM_BIN` | `/usr/bin/chromium` | o navegador que renderiza |
| `MERMAID_JS` | cópia local do `mermaid.min.js` (v11) | a biblioteca |
| `PLAYWRIGHT_CORE` | `playwright-core` do cache do `npx` | só para dirigir o Chromium |

Depois de renderizar, **confira no navegador em 390px e em 1280px** que nenhum rótulo estoura a caixa.

### A largura natural é a variável mais cara

A figura na página **sempre aparece inteira** — encolhe até caber na coluna, em qualquer largura, e
nunca rola de lado (`Fig.astro`). A consequência para quem desenha é direta: **a largura natural do
diagrama é o divisor da legibilidade no celular**. A coluna útil de um telefone de 390px dá ~358px,
então um mapa de 800px chega lá a 45% (texto de ~6,7px) e um de 1440px, a 25% (~3,7px).

Na prática: **prefira empilhar a alargar**. Um `flowchart TB` estreito e alto se lê num telefone; o
mesmo conteúdo espalhado na horizontal, não. Onde a largura for inevitável, conte com a saída que a
legenda oferece — a figura inteira é link para o arquivo original.

### As três decisões que não são cosméticas

- **`htmlLabels: false`, nos dois níveis do config.** Com rótulo em HTML o mermaid emite
  `<foreignObject>`, que **não renderiza** quando o SVG é servido dentro de um `<img>` — é a diferença
  entre o diagrama e um retângulo vazio. Declarar só dentro de `flowchart` **não basta**: o mermaid 11
  ignora e volta ao HTML (dá para conferir com `grep foreignObject` na saída — tem que dar zero).
- **A pilha de fontes começa por `DejaVu Sans`** (a do ambiente de render). A caixa é dimensionada
  pela métrica de quem renderiza, então começar pela família mais larga faz quem cair no `system-ui`
  ganhar folga em vez de estouro.
- **`wrappingWidth: 460`.** As quebras são autorais: cada `<br/>` no `.mmd` separa uma ideia da
  seguinte. No padrão (200px) o mermaid rebobina por cima e parte frases no meio — o mapa fica mais
  alto sem dizer mais nada. Em compensação, **mantenha cada linha do `.mmd` abaixo de ~55 caracteres**;
  acima disso ela quebra sozinha de novo.

Sem rótulo em HTML o mermaid desenha até o retângulo como curva, com 15 casas decimais por ponto — o
mapa sai com 188 kB de dígitos que ninguém vê. O script arredonda `d`/`transform` para duas casas
(subpixel em qualquer tela) no fim, e isso corta ~45%.
