/**
 * Pré-renderiza os `.mmd` deste diretório em SVG estático, offline.
 *
 * Por que offline: a página é servida sob uma CSP estrita (hashes calculados no
 * build), então não há como rodar mermaid no navegador do visitante. E trazer
 * mermaid como dependência do site exigiria um ADR novo (ADR-0001..0006) —
 * o custo não se paga por sete figuras que mudam de ano em ano.
 *
 * Uso:  node diagrams/render.mjs
 * Requer: chromium do sistema + playwright-core (ambos já presentes na máquina
 * de build; ver diagrams/README.md se o caminho tiver mudado).
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public', 'omni-pentest', 'diagramas');
const MERMAID = process.env.MERMAID_JS ?? '/tmp/claude-1002/-home-pablo-Omni-Pentest/50c9e5b6-84d6-4d94-9a76-1e54a0835293/scratchpad/mermaid.min.js';
const CHROMIUM = process.env.CHROMIUM_BIN ?? '/usr/bin/chromium';
const PLAYWRIGHT = process.env.PLAYWRIGHT_CORE
  ?? '/home/pablo/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs';

/**
 * O tema. Espelha os tokens do site (fundo #0d0e11, borda #34373d, laranja
 * #ff5024) porque as figuras ficam sobre uma placa escura nos DOIS temas da
 * página — como a captura do console, são um "aparelho", não texto corrido.
 *
 * `htmlLabels: false` é OBRIGATÓRIO: com rótulos em HTML o mermaid emite
 * <foreignObject>, que simplesmente não renderiza quando o SVG é servido
 * dentro de um <img>. A fonte começa por DejaVu Sans (a que existe aqui) de
 * propósito: a caixa é dimensionada pela métrica de quem renderiza, então
 * quem cair no fallback do sistema ganha folga em vez de estouro.
 */
const CONFIG = {
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'strict',
  // `htmlLabels` precisa aparecer NOS DOIS níveis: só dentro de `flowchart` o
  // mermaid 11 ignora e volta a emitir <foreignObject> (verificado no SVG).
  htmlLabels: false,
  markdownAutoWrap: false,
  // `wrappingWidth` alto porque as quebras são AUTORAIS: cada `<br/>` no .mmd
  // separa uma ideia da seguinte. No padrão (200px) o mermaid rebobina por cima
  // disso e parte frases no meio, o que alonga o mapa sem informar nada.
  flowchart: { curve: 'linear', htmlLabels: false, padding: 12, useMaxWidth: false, wrappingWidth: 460 },
  themeVariables: {
    fontFamily: "'DejaVu Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: '15px',
    // Neutros QUENTES, espelhando tokens.css (--bg #0e0d0c, --border-strong
    // #3a3631). A paleta de fábrica do mermaid é cinza-azulada e denuncia o
    // azul na hora que a figura pousa sobre a placa quente da página.
    lineColor: '#6f685e',
    primaryColor: '#1b1a18',
    primaryTextColor: '#eae7e2',
    primaryBorderColor: '#3a3631',
    background: 'transparent',
  },
};

const { chromium } = await import(PLAYWRIGHT);

const sources = (await readdir(HERE)).filter((f) => f.endsWith('.mmd')).sort();
if (sources.length === 0) throw new Error('nenhum .mmd encontrado em ' + HERE);

await mkdir(OUT, { recursive: true });

const lib = await readFile(MERMAID, 'utf8');
const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage();
await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
await page.addScriptTag({ content: lib });

for (const file of sources) {
  const code = await readFile(join(HERE, file), 'utf8');
  const svg = await page.evaluate(
    async ([code, config, id]) => {
      // eslint-disable-next-line no-undef
      mermaid.initialize(config);
      // eslint-disable-next-line no-undef
      const { svg } = await mermaid.render(id, code);
      return svg;
    },
    [code, CONFIG, 'd' + file.replace(/\W/g, '')],
  );
  const name = file.replace(/\.mmd$/, '.svg');
  // Sem rótulo em HTML o mermaid desenha até o retângulo como curva, e cospe
  // 15 casas decimais em cada ponto — um mapa vira 188 kB de dígitos que
  // ninguém enxerga. Duas casas é subpixel em qualquer tela; corta ~60%.
  const lean = svg.replace(/ (d|transform)="([^"]*)"/g, (m, attr, val) =>
    ` ${attr}="${val.replace(/-?\d+\.\d{3,}/g, (n) => String(Math.round(Number(n) * 100) / 100))}"`,
  );
  // O <img> não herda estilo da página: o SVG precisa carregar a própria
  // fonte-fallback e nunca depender de CSS externo. O mermaid já embute um
  // <style>; aqui só garantimos o cabeçalho XML e um respiro nas bordas.
  await writeFile(join(OUT, name), '<?xml version="1.0" encoding="UTF-8"?>\n' + lean + '\n', 'utf8');
  const dims = /viewBox="([^"]+)"/.exec(lean)?.[1] ?? '?';
  console.log(`${name.padEnd(30)} viewBox=${dims}  ${(lean.length / 1024).toFixed(0)} kB`);
}

await browser.close();
console.log(`\n${sources.length} diagramas em ${OUT}`);
