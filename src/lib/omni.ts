/**
 * Conteúdo da página do Omni Pentest (/omni-pentest).
 *
 * ✍️ O nome do produto é **Omni Pentest**, sem hífen. O hífen existe só no
 * identificador técnico — o repositório e a rota (`/omni-pentest`) — e não deve
 * vazar para texto lido por gente. Onde o nome não pode quebrar de linha (chip,
 * rodapé, menu), use o espaço inquebrável `&#160;`.
 *
 * Mesmo padrão de `Nav.astro`/`Footer.astro`: conteúdo de página vive no código,
 * tipado — `data/linkedin.json` continua sendo APENAS a exportação curada do
 * LinkedIn (ADR-0004) e não é contaminado por um projeto que não vive lá.
 *
 * ⚠️ O repositório do Omni-Pentest é PRIVADO. Nada aqui pode expor código,
 * caminho de arquivo, nome de módulo interno ou identificador de spec: esta
 * página descreve COMO funciona, nunca COM O QUÊ foi feito.
 *
 * Campos cujo nome termina em `Html` (ou documentados como tal) contêm marcação
 * inline (`<b>`, `<em>`) e PRECISAM ser renderizados com `set:html`.
 */

/** Versão retratada nesta página — ver `SNAPSHOT` (nota de honestidade no rodapé). */
export const OMNI_VERSION = '6.56.2';
/** Mês/ano do retrato. A plataforma segue evoluindo entre atualizações da página. */
export const OMNI_SNAPSHOT = 'julho de 2026';

export interface Stat {
  value: string;
  unit?: string;
  label: string;
}

/** Os números que abrem a página — todos verificáveis na plataforma. */
export const STATS: Stat[] = [
  { value: '489', unit: 'mil', label: 'documentos de segurança consultados antes de cada exploração' },
  { value: '140', unit: '+', label: 'ferramentas ofensivas sob um único comando' },
  { value: '10', label: 'portões de validação que todo achado atravessa' },
  { value: '10', unit: '/10', label: 'a única nota que abre um relatório — e quem a calcula é o código' },
  { value: '0', label: 'relatórios enviados sem aprovação humana' },
  { value: 'CPU', unit: '-only', label: 'sem placa de vídeo: autômatos pequenos, solucionador minúsculo' },
];

export interface MapBlock {
  n: string;
  title: string;
  desc: string;
  href: string;
}

/** O mapa do sistema — cada bloco aponta para a seção que o detalha. */
export const MAP_BLOCKS: MapBlock[] = [
  {
    n: '01',
    title: 'Percepção',
    desc: 'Reconstrói a superfície do alvo — inclusive o que o cliente publica sem perceber.',
    href: '#fases',
  },
  {
    n: '02',
    title: 'Raciocínio',
    desc: 'Aprende uma teoria formal do alvo e deduz o bug da estrutura dela.',
    href: '#metodo',
  },
  {
    n: '03',
    title: 'Conhecimento',
    desc: 'Uma base de ~489 mil documentos consultada antes de agir, a cada passo.',
    href: '#conhecimento',
  },
  {
    n: '04',
    title: 'Arsenal',
    desc: 'Mais de 140 ferramentas, todas atrás do portão de escopo.',
    href: '#arsenal',
  },
  {
    n: '05',
    title: 'Firewall',
    desc: 'Dez portões e um juiz adversarial. O padrão é descartar.',
    href: '#firewall',
  },
  {
    n: '06',
    title: 'Aprendizado',
    desc: 'O que o programa respondeu de verdade vira prioridade da próxima caça.',
    href: '#operador',
  },
  {
    n: '07',
    title: 'Console',
    desc: 'O portfólio inteiro num painel — e a decisão continua sendo humana.',
    href: '#console',
  },
];

/* ============================================================
   §02 — a caça, do recon ao report
   ============================================================ */

export interface Phase {
  /** Rótulo curto usado na tira de fluxo. */
  code: string;
  name: string;
  /** HTML inline. */
  what: string;
  /** Aprofundamento — HTML inline; cada item vira um parágrafo. */
  deep: string[];
}

export const PHASES: Phase[] = [
  {
    code: 'RECON',
    name: 'Recon',
    what: 'Enumera a superfície — e onde o alvo publica o próprio código no navegador, o agente <b>o lê</b>: reconstrói o fonte, extrai o contrato de API tipado e mapeia as rotas que nenhum crawler alcança.',
    deep: [
      'Enumeração de subdomínios, sondagem HTTP, impressão digital da stack e detecção de firewall de aplicação, tudo pelo arsenal.',
      'Onde há mapa de código publicado no cliente, o agente reconstrói o <b>fonte original</b>, extrai o <b>contrato de API tipado</b> (método × rota) e mapeia a <b>superfície invisível</b> — <em>/admin</em>, <em>/internal</em>, <em>/debug</em> — mais os pontos de entrada perigosos do JavaScript. Complementa com leitura de HTML, OpenAPI, GraphQL, aplicações de página única e pacotes móveis.',
      'Nada de arquivo bruto no contexto do modelo: só o mapa compacto da superfície.',
      'É o recon, também, que <b>abre</b> a classe de ataque a IA: a injeção de prompt só entra na fila quando a superfície observada carrega evidência real de IA — um campo de <em>prompt</em>, um endpoint de completions. Sem evidência, a célula continua fechada; nunca é semeada no escuro.',
    ],
  },
  {
    code: 'FILTER',
    name: 'Filtro',
    what: 'Corta tudo que está fora do escopo autorizado. A decisão é do código, nunca do modelo, e falha fechada. O que sobra é priorizado pelo que tende a pagar.',
    deep: [
      'O escopo é um portão determinístico fora do alcance do modelo. Nenhuma persuasão, nenhum <em>prompt</em>, nenhuma alucinação atravessa: o que não está explicitamente autorizado não sai da máquina.',
    ],
  },
  {
    code: 'DISCOVERY',
    name: 'Descoberta',
    what: 'Monta o modelo do alvo — entidades, papéis e as regras que ele promete cumprir — e enumera a matriz de autorização inteira.',
    deep: [
      'O <b>modelo cognitivo</b> infere entidades, papéis e invariantes a partir dos diferenciais entre identidades (<em>"o usuário só lê o próprio pedido"</em>, <em>"este campo é somente leitura"</em>) — e, ao confirmar uma fraqueza, projeta essa suposição sobre todo o modelo para achar <b>todos</b> os lugares onde ela se repete.',
      'Em paralelo, monta a <b>matriz de autorização completa</b> — quem × o quê × qual instância × qual operação, com as rotas alternativas —, para que nenhuma célula de controle de acesso fique esquecida.',
      'E, lendo só o esquema visível de fora, deduz <b>qual operação produz o identificador que outra consome</b> e sintetiza a sequência legítima de vários passos que torna a célula alcançável — em vez de exigir que o operador monte o estado à mão.',
    ],
  },
  {
    code: 'EXPLOIT',
    name: 'Exploração',
    what: 'Aprende a máquina de estados do alvo e a confronta com propriedades de segurança. Cada contraexemplo é um caminho de ataque deduzido, com o passo a passo exato.',
    deep: [
      'Aplicações web e APIs <b>são</b> máquinas de estado — login, checkout, assistentes de várias etapas, segundo fator. O Cartógrafo aprende essa máquina interrogando o alvo e a verifica contra propriedades de segurança: <em>"nunca alcançar pedido-confirmado sem passar por pagamento-aprovado"</em>.',
      'Complementam o núcleo os <b>oráculos metamórficos</b> (relações que não podem quebrar), o <b>corante</b> (um marcador benigno rastreado até onde reaparece) e a <b>síntese simbólica</b> (que resolve o input exato de um desvio em vez de adivinhar).',
      'E o input não é um chute único: o mesmo corpo vira um <b>espaço componível</b> — reescrito entre formatos e passado por cadeias de codificação em camadas, porque o desvio que nenhuma transformação sozinha revela costuma aparecer depois de duas.',
    ],
  },
  {
    code: 'VALIDATION',
    name: 'Validação',
    what: 'O funil de dez portões, o juiz adversarial e a reprodução ponta a ponta. O padrão é descartar.',
    deep: [
      'Todo candidato entra pela mesma porta, venha do Cartógrafo, da matriz de autorização ou de um oráculo. Nada pula o firewall.',
    ],
  },
  {
    code: 'REPORT',
    name: 'Relatório',
    what: 'Gera o artefato pronto para a plataforma — e nunca o envia sozinho. O desfecho real realimenta o aprendizado.',
    deep: [
      'A cada veredito do firewall, um volante de aprendizado registra qual técnica pagou em qual contexto — priores que afiam a próxima caça.',
    ],
  },
];

/** O que impede a caça de terminar sozinha (o Modo Profundo). */
export const DEEP_MODE = {
  title: 'E por que o alvo não se esgota',
  lead: 'No <b>Modo Profundo</b> — o padrão — o alvo nunca se esgota sozinho. A caça só termina por decisão do <b>operador</b> (parar ou trocar de alvo) ou pelo <b>orçamento de tokens</b>. <em>"Não compensa mais"</em> é julgamento humano, não do agente.',
  body: [
    'Cada célula de cobertura carrega um <b>nível de profundidade</b> reabrível; quando a fila de hipóteses zera, um motor de re-hipótese gira a próxima lente em vez de encerrar. "Esgotado" é propriedade da <b>estratégia</b>, nunca do alvo.',
    'A varredura rasa e finita, que de fato declara cobertura esgotada, é a exceção explícita.',
  ],
};

/* ============================================================
   §03 — o diferencial
   ============================================================ */

export interface ParadigmRow {
  question: string;
  generate: string;
  deduce: string;
}

/** Gerar-e-testar × modelar-e-deduzir, lado a lado. */
export const PARADIGM: ParadigmRow[] = [
  {
    question: 'De onde vem a hipótese',
    generate: 'De um catálogo de payloads conhecidos.',
    deduce: 'Da estrutura de um modelo formal aprendido do alvo.',
  },
  {
    question: 'O que é testado',
    generate: 'Uma requisição isolada, contra a resposta imediata.',
    deduce: 'Uma propriedade que o alvo prometeu cumprir, contra todo o espaço de execuções.',
  },
  {
    question: 'Quando falha',
    generate: 'Tenta a variação seguinte. Empírico, guloso e raso.',
    deduce: 'O contraexemplo já vem com o passo a passo exato que quebra a propriedade.',
  },
  {
    question: 'Que classe alcança',
    generate: 'O que uma única resposta consegue revelar.',
    deduce: 'Bypass de autenticação, quebra de fluxo, falha de lógica de vários passos.',
  },
  {
    question: 'Quem julga o achado',
    generate: 'O próprio modelo que o produziu.',
    deduce: 'Um firewall determinístico que o modelo não alcança.',
  },
];

export interface Capability {
  name: string;
  tag: string;
  /** HTML inline. */
  what: string;
}

/** Os motores de dedução — o que separa a plataforma de um scanner. */
export const CAPABILITIES: Capability[] = [
  {
    name: 'Cartógrafo de Estados',
    tag: 'o eixo',
    what: 'Aprende a máquina de estados por trás de login, checkout e aprovações — interrogando o alvo, quando autorizado —, depois a verifica contra o que ela jamais poderia permitir. Cada violação encontrada é um bypass de autenticação ou de fluxo: <b>provado, não chutado</b>.',
  },
  {
    name: 'Blueprint do alvo',
    tag: 'percepção',
    what: 'Reconstrói o código original que a aplicação publica no navegador e dele extrai o contrato de API tipado — incluindo as rotas administrativas e internas que nenhum crawler enxerga.',
  },
  {
    name: 'Modelo cognitivo',
    tag: 'percepção',
    what: 'Infere as regras implícitas do produto ("só o dono lê o próprio pedido", "este campo é somente leitura") e, ao confirmar uma falha, projeta essa suposição sobre todo o resto para achar cada lugar onde ela se repete. Uma lente de modelagem de ameaças amplia as hipóteses por componente para as classes que pagam.',
  },
  {
    name: 'Corante',
    tag: 'percepção',
    what: 'Injeta um marcador inofensivo e rastreia onde ele reaparece — outra tela, outro usuário, outro canal. É como se encontra injeção armazenada e vazamento entre clientes.',
  },
  {
    name: 'Matriz de autorização',
    tag: 'dedução',
    what: 'Enumera a combinação inteira de quem × o quê × qual instância × qual operação — com rotas alternativas e um oráculo diferencial contra o sucesso fantasma — e ainda deduz a sequência legítima de passos necessária para alcançar cada célula.',
  },
  {
    name: 'Oráculos metamórficos',
    tag: 'dedução',
    what: 'Relações que jamais podem quebrar entre duas execuções — comprar e estornar volta ao saldo original, um cupom não vale duas vezes, o total é a soma dos itens. É assim que se acha falha de lógica sem ter um gabarito.',
  },
  {
    name: 'Síntese simbólica',
    tag: 'dedução',
    what: 'Quando o caminho existe mas o filtro barra, um solucionador matemático calcula a entrada exata que passa — em vez de adivinhar variações. E o corpo da requisição vira um espaço componível: reescrito entre formatos e passado por cadeias de codificação em camadas, porque o desvio que nenhuma transformação sozinha revela costuma aparecer depois de duas.',
  },
  {
    name: 'Volante de veredito',
    tag: 'aprendizado',
    what: 'Aprende dos rótulos limpos do firewall quais técnicas pagam em cada contexto e funde isso no planejamento — mas só promove uma regra forte depois de confirmá-la em <b>ao menos dois programas distintos</b>, para não sobreajustar a um alvo. O que aprendeu vira instinto legível, que o operador pode auditar e curar.',
  },
];

/** A nota que fecha o §03. HTML inline. */
export const CAPABILITIES_NOTE =
  'Cada motor de raciocínio é <b>domínio puro</b> e apenas <b>propõe</b> candidatos melhores — o firewall permanece o único juiz. E todo o desenho é <b>CPU-only</b>, compacto, sem placa de vídeo: autômatos pequenos, solucionador minúsculo, aritmética barata. A inteligência mora em álgebra e lógica, não em computação pesada.';

/* ============================================================
   §04 — o Operador Sintético
   ============================================================ */

export interface OperatorFn {
  title: string;
  /** HTML inline. */
  solves: string;
  /** Aprofundamento — HTML inline. */
  deep: string[];
}

/** As funções que normalmente exigiriam um caçador sênior humano. */
export const OPERATOR_FNS: OperatorFn[] = [
  {
    title: 'Aprende do mundo real',
    solves: 'O desfecho de cada relatório — pago, duplicado, informativo, recusado — vira dado. Uma triagem interna <b>prevê</b> esse desfecho antes do envio e aponta o que falta para o relatório sobreviver.',
    deep: [
      'É o que converte bug <em>achado</em> em bug <b>pago</b>: o dado-verdade vem da plataforma, não da opinião do modelo sobre si mesmo.',
    ],
  },
  {
    title: 'Escolhe onde caçar',
    solves: 'Um otimizador de portfólio rankeia os programas por retorno esperado ajustado a vantagem e variância; um radar prioriza o programa <b>fresco e menos disputado</b> — o antídoto número um contra o relatório duplicado.',
    deep: [],
  },
  {
    title: 'Não anda em círculos',
    solves: 'Uma árvore de caça explícita, somada a uma estimativa de dificuldade, poda o <b>galho</b> intratável — nunca o alvo. Quando a fila de hipóteses zera, o sistema gira uma lente nova em vez de declarar vitória.',
    deep: [
      'No Modo Profundo a caça <b>nunca conclui "tentei de tudo"</b>: só três saídas encerram — o operador para, o operador troca de alvo, ou o orçamento de tokens estoura.',
      'Um gatilho estrutural consulta o dono determinístico da decisão e, quando o catálogo por célula seca para a superfície observada — ou um host é caracterizado estéril —, <b>escala para expandir</b>, apontando os hosts que nunca foram examinados. O espaço é vasto; a caça só ainda não os viu.',
      'E o que já foi gasto <b>fica legível</b>: o registro de hipóteses guarda a identidade de cada pista (degrau, lente, ativo, classe), não um código opaco — o agente relê a escada que já subiu em vez de re-propor à mão o que o código já descartou.',
    ],
  },
  {
    title: 'Coordena sem um chefe de IA',
    solves: 'Vários trabalhadores especializados — recon, autorização, injeção, lógica — atuam em paralelo sobre um quadro compartilhado, priorizados por <b>código determinístico</b>. Não por um supervisor de linguagem natural.',
    deep: [
      'Cada trabalhador escreve todo achado <b>pelo mesmo firewall</b>, e a fronteira de coordenação nunca vira um chefe-modelo. É a diferença que o mercado não tem: todos coordenam via modelo de linguagem.',
    ],
  },
  {
    title: 'Encadeia rumo ao objetivo',
    solves: 'Liga achados isolados em cadeias dirigidas a um alvo concreto — tomada de conta, exposição de dados pessoais. <b>Cadeia paga de três a dez vezes</b> o que a peça solta paga.',
    deep: [
      'Um motor de análise de fluxo de dados sobre o fonte recuperável semeia vetores novos, e o grafo de ataque evolui de detecção para cadeias com objetivo declarado.',
    ],
  },
  {
    title: 'Se questiona',
    solves: 'Uma retrospectiva pergunta <em>"por que não ganhamos?"</em> sobre o dado real e <b>propõe</b> mudanças — que só entram com aprovação. Nunca auto-implementa.',
    deep: [],
  },
];

/** A fronteira que fecha o §04. HTML inline. */
export const OPERATOR_NOTE =
  'A fronteira é sagrada: essas camadas <b>propõem e medem</b>. Quem <b>autoriza</b> continua sendo o código determinístico — o cálculo de valor de informação, a política de caça profunda, o firewall — e o operador. O Operador Sintético fecha ao máximo a lacuna da autonomia total sem jamais terceirizar o julgamento ao modelo.';

/* ============================================================
   §05 — o firewall de validação
   ============================================================ */

export interface Outcome {
  key: string;
  means: string;
  who: string;
  tone: 'win' | 'hold' | 'drop';
}

/** Os cinco destinos possíveis de um achado. */
export const OUTCOMES: Outcome[] = [
  {
    key: 'Confirmado',
    means: 'Passou nos dez portões com nota máxima. É o único que abre um relatório.',
    who: 'o operador aprova o envio',
    tone: 'win',
  },
  {
    key: 'Aguardando o operador',
    means: 'O mecanismo está provado; falta uma prova que exige um recurso que só o operador tem — uma segunda conta, a sessão de uma vítima.',
    who: 'o operador',
    tone: 'hold',
  },
  {
    key: 'Escalando',
    means: 'O mecanismo está de pé e ainda há caminho para aprofundar sozinho.',
    who: 'o próprio agente',
    tone: 'hold',
  },
  {
    key: 'Absorvido',
    means: 'Outro achado já cobre a mesma causa raiz. Nunca vira dois relatórios.',
    who: 'ninguém — dedução automática',
    tone: 'drop',
  },
  {
    key: 'Descartado',
    means: 'Não é bug.',
    who: 'ninguém',
    tone: 'drop',
  },
];

/** A pergunta que parte o descarte em duas filas. HTML inline. */
export const UNLOCK = {
  title: '"Quem destrava este achado?"',
  lead: 'Um descarte não é sempre "sem bug". E a pergunta que separa os casos não é <em>"quão bom é este achado?"</em> — é <b>"quem destrava este achado?"</b>, a única acionável. Ela parte a antiga fila única em duas.',
  rows: [
    {
      k: 'A fila do operador',
      v: 'Um achado <b>confirmado</b>, com mecanismo provado por evidência estruturada, cuja única prova faltante exige um recurso que <b>só o operador tem</b>: uma conta ou a sessão de uma vítima.',
    },
    {
      k: 'A fila do agente',
      v: 'Um achado rebaixado por evidência incompleta que o <b>próprio agente ainda consegue completar</b> sozinho.',
    },
  ],
  tail: 'Antes as duas moravam no mesmo lugar, e o operador não conseguia responder <em>"o que depende de MIM?"</em> — nove achados esperando por ele ficavam soterrados sob vinte e três que esperavam o agente, e este relia a fila inteira toda sessão para re-falhar pelo mesmo motivo. Nenhum dos dois é beco sem saída: a caça trata ambos como pista. E o rigor fica intacto — o veredito segue sendo descarte e a nota segue abaixo de dez, então <b>jamais</b> vira relatório ou envio automático.',
};

export interface ReportStage {
  n: string;
  name: string;
  what: string;
}

/** O ciclo de report — eixo ORTOGONAL à camada física do achado. */
export const REPORT_STAGES: ReportStage[] = [
  { n: '00', name: 'Não elegível', what: 'O veredito do firewall não abre relatório.' },
  { n: '01', name: 'Imaturo', what: 'Confirmado, mas ainda falta o que o relatório precisa carregar.' },
  { n: '02', name: 'A reportar', what: 'Pronto para virar artefato.' },
  { n: '03', name: 'Rascunhado', what: 'O artefato existe, aguardando revisão humana.' },
  { n: '04', name: 'Reportado', what: 'Enviado — por um humano que aprovou.' },
  { n: '05', name: 'Fechado', what: 'A plataforma respondeu. O veredito vira subcategoria.' },
];

export const PLATFORM_VERDICTS = [
  'pago',
  'resolvido',
  'duplicado',
  'informativo',
  'inválido',
  'não reproduzível',
];

/** Por que os dois eixos existem separados. HTML inline. */
export const AXES_NOTE =
  'Um achado pode estar <b>confirmado</b> e ainda <b>imaturo</b> no relatório; pode estar <b>descartado</b> e mesmo assim ter fechado com dinheiro — foi exatamente o que aconteceu com um bounty pago desta instalação. É por isso que o ciclo existe como eixo próprio, em vez de virar mais um valor de camada.';

export interface CascadeStep {
  n: string;
  name: string;
  what: string;
}

/** A cascata de derivação de severidade — 5 degraus, o que mordeu fica marcado. */
export const SEVERITY_CASCADE: CascadeStep[] = [
  { n: '1', name: 'Vetor bruto', what: 'O vetor CVSS montado a partir da evidência, e só dela.' },
  { n: '2', name: 'Teto de leitura', what: 'Achado somente de leitura para em Alto. Crítico exige manipular, editar ou apagar.' },
  { n: '3', name: 'Banda da classe', what: 'Teto e piso por classe de vulnerabilidade, pela taxonomia de referência.' },
  { n: '4', name: 'Âncora do programa', what: 'A tabela do alvo só <b>rebaixa</b>. Um programa pão-duro não vira a régua dos outros.' },
  { n: '5', name: 'Piso de validade', what: 'O que sobrevive ao funil não pode cair abaixo do piso da própria classe.' },
];

/** As três amarras da derivação. HTML inline. */
export const SEVERITY_NOTE =
  'Validade e magnitude são eixos separados: o firewall decide <b>se o bug é real</b> (a nota recomputada), e um derivador determinístico decide <b>quanto ele vale</b>. Toda elevação tem de ser <b>paga com artefato</b> — escopo alterado, confidencialidade ou integridade altas só saem de prova estruturada, nunca da prosa do modelo. E é ortogonal ao veredito: deriva apenas no sobrevivente, jamais transforma um descarte em relatório.';

export interface Hardener {
  name: string;
  what: string;
}

/** Os três reforços que endurecem a saída. */
export const HARDENERS: Hardener[] = [
  {
    name: 'Juiz adversarial',
    what: 'Um diálogo entre cético e defensor tenta derrubar o próprio achado antes que ele vire relatório — e a razão da derrubada é propagada, não engolida.',
  },
  {
    name: 'Dedup por causa raiz',
    what: 'Garante que o mesmo bug nunca vire dois relatórios. É exatamente a duplicata que a triagem das plataformas penaliza.',
  },
  {
    name: 'Sanitização da saída',
    what: 'O rascunho nunca vaza caminho de arquivo, nome de ferramenta interna ou identificador do ambiente do operador — preservando, claro, os caminhos do <b>alvo</b> numa prova de conceito.',
  },
];

/* ============================================================
   §06 — a base de conhecimento
   ============================================================ */

export interface Source {
  name: string;
  what: string;
}

export const KNOWLEDGE_SOURCES: Source[] = [
  { name: 'CVE / NVD', what: 'o catálogo de vulnerabilidades conhecidas' },
  { name: 'CISA KEV', what: 'as que estão sendo exploradas agora, no mundo real' },
  { name: 'EPSS', what: 'a probabilidade de exploração de cada uma' },
  { name: 'ExploitDB & PoCs', what: 'a prova de conceito que já existe' },
  { name: 'Nuclei', what: 'as assinaturas de detecção da comunidade' },
  { name: 'Relatos do HackerOne', what: 'como bugs reais foram achados e pagos' },
  { name: 'OWASP & PortSwigger', what: 'a técnica canônica de cada classe' },
];

export interface KnowledgeBehaviour {
  name: string;
  /** HTML inline. */
  what: string;
}

/** Como a base é montada e consultada. */
export const KNOWLEDGE_HOW: KnowledgeBehaviour[] = [
  {
    name: 'Correlação instantânea',
    what: 'Um índice relacional liga <b>CVE ↔ CWE ↔ ExploitDB ↔ prova de conceito ↔ assinatura ↔ probabilidade ↔ exploração ativa</b> em tempo constante. De um identificador saem todos os outros, sem varredura.',
  },
  {
    name: 'Busca progressiva',
    what: 'Índice → contexto → detalhe. Começa por uma lista curta e só aprofunda no que é relevante, economizando o contexto do modelo para o que importa.',
  },
  {
    name: 'Todas as fontes, sempre',
    what: 'A recuperação é <b>balanceada por fonte</b>: cada busca traz ao menos um resultado de <em>cada</em> fonte relevante. Uma fatia fica reservada por fonte para que nenhuma seja engolida pela truncagem — mesmo com o acervo dominado numericamente por CVEs.',
  },
  {
    name: 'Priorização que importa',
    what: 'Bônus para o que está sendo explorado agora e para a probabilidade alta; penalidade para prova de conceito antiga; reforço quando três ou mais fontes concordam. O que é <b>realmente</b> explorável sobe ao topo.',
  },
  {
    name: 'Dentro do processo',
    what: 'A engine vive no mesmo processo do agente: resposta em sub-segundo, sem subprocesso por consulta. <b>16 corpora</b>, cerca de 489 mil documentos.',
  },
];

/** A regra que governa toda exploração. HTML inline. */
export const GOLDEN_RULE = {
  title: 'Conhecimento antes de qualquer exploração',
  body: 'O agente nunca dispara uma ferramenta ofensiva sem antes perguntar à base o que já se sabe sobre aquela stack — e a consulta é <b>estrutural</b>: a cada nó da caça e a cada caminho que falha, a re-consulta corretiva (<em>a falha é a melhor consulta</em>) vem embutida no fluxo. Não depende de o agente lembrar de perguntar: um portão barra a exploração que não consultou.',
};

/* ============================================================
   §07 — o ecossistema de ferramentas
   ============================================================ */

export interface ArsenalItem {
  name: string;
  role: string;
  count?: string;
}

export const ARSENAL: ArsenalItem[] = [
  {
    name: 'Núcleo próprio',
    count: '90 ferramentas',
    role: 'Estado da caça, achados, cobertura, validação, relatório, correlação de vulnerabilidades, reconhecimento próprio, o painel do operador e todos os motores de raciocínio. Leitura e escrita controlada: mutação só por serviços validados, nunca escrita crua.',
  },
  {
    name: 'Arsenal ofensivo',
    count: '~127 ferramentas',
    role: 'Treze categorias — reconhecimento, web, exploração, nuvem, inteligência de fontes abertas, forense —, executadas sob demanda.',
  },
  {
    name: 'Proxy de interceptação',
    role: 'Manipulação HTTP fina e a prova ponta a ponta do lado da vítima.',
  },
  {
    name: 'Repositórios públicos',
    role: 'Reconhecimento de código exposto e provas de conceito já publicadas.',
  },
];

export interface ToolGroup {
  name: string;
  /** HTML inline. */
  what: string;
}

/** As 90 ferramentas próprias, por função. */
export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: 'O núcleo da caça',
    what: 'Estado, achados, cobertura, validação, relatório e correlação de vulnerabilidades — mais o <b>reconhecimento próprio</b>, que não depende de ferramenta externa: JavaScript, HTML, OpenAPI, GraphQL, móvel, página única e mapa de código.',
  },
  {
    name: 'Ler a superfície observada',
    what: 'Uma lente de consulta fatia a superfície persistida com uma mini-linguagem de busca e colapsa endpoints duplicados. Um roteador rotula cada trecho com as classes que os nomes de parâmetro insinuam e ranqueia o sinal por classe. E uma triagem visual lê os screenshots que o próprio agente capturou, rotula cada tela, poda as mortas e semeia as promissoras como <b>hipótese</b>. Tudo somente leitura: um rótulo nunca vira achado.',
  },
  {
    name: 'Transformar sinal externo em hipótese',
    what: 'A saída crua de um scanner de assinaturas é absorvida e cada acerto vira <b>hipótese rotulada na fila</b>, que atravessa os dez portões. Jamais vira achado direto: é a cobertura ampla de um scanner <em>sem</em> a fábrica de duplicatas.',
  },
  {
    name: 'Sondar ativamente sem inventar bug',
    what: 'O mesmo canal, em modo de sondagem, provoca a superfície observada e só semeia a anomalia que <b>desvia de uma linha de base medida</b> — um erro constante não conta —, com deduplicação contra células já trabalhadas.',
  },
  {
    name: 'A base de alvos e sua cadência',
    what: 'Enumera programas elegíveis e cria as sessões que o radar ranqueia; expande um intervalo de rede em hosts concretos declarados no escopo; e aperta ou afrouxa quão frequente o recon noturno revarre um alvo quente — a superfície nova entra por delta, sem re-apresentar o velho.',
  },
  {
    name: 'Chegar onde o bug que paga mora',
    what: 'Um bootstrap de sessão atravessa um login <b>declarativo</b> — receita de vários passos, segundo fator por aplicativo, código por e-mail ou link mágico — e carrega a sessão para a superfície logada, onde mora o bug que paga. Credenciais vêm da configuração do operador, nunca dos argumentos, e a credencial viva é redigida na fronteira.',
  },
  {
    name: 'O grafo de escalada de privilégio',
    what: 'Busca de caminho <b>transitiva entre principais</b> rumo a uma joia da coroa — administração entre clientes, dados pessoais —, compondo relações de autorização observadas em cadeias que sonda nenhuma revela. Cada salto é hipótese que atravessa os dez portões, nunca achado.',
  },
  {
    name: 'A caça que não para sozinha',
    what: 'A persistência de caça profunda e o seu gêmeo somente leitura, que mostra o movimento que a espiral escolheria <b>sem</b> gravar nada — o painel vê a fronteira decidir sem envenenar a deduplicação da caça viva.',
  },
  {
    name: 'O loop de resultado',
    what: 'O veredito da plataforma vira registro; o ledger devolve o que cada relatório trouxe de volta e o que pagou, dizendo se aquele registro <b>junta</b> com um achado em disco — um pago sob rótulo que nenhum alvo casa é contado e inanexável. E a triagem sintética prevê o veredito antes do envio.',
  },
  {
    name: 'A plataforma se descrevendo',
    what: 'O arsenal descreve a si mesmo a partir do próprio catálogo (sem segunda lista para dessincronizar), com sondagem viva do arsenal externo. O censo do conhecimento conta o que a base contém por consulta direta, em modo somente leitura, e confronta o registro de uso com a sessão mais nova: <b>obsolescência é medida, não carimbada</b>. A memória entre alvos indexa lições, detectores e custo por classe — e mede quantos registros ficaram fora do catálogo, marcando e explicando, jamais renomeando dado sagrado.',
  },
  {
    name: 'A linha do tempo e os artefatos',
    what: 'O diário da caça é a única evidência <b>temporal</b> da plataforma: quando um achado nasceu, quando o portão de escopo barrou um ativo, o que o operador anotou. Decodifica os quatro formatos de registro que convivem e <b>conta</b> o que não decodifica, em vez de descartar em silêncio. Ao lado, o índice de artefatos lista o que se anexa ao relatório — e um arquivo vetorial nunca é classificado como imagem, porque é documento scriptável vindo do alvo.',
  },
  {
    name: 'O vocabulário com dono único',
    what: 'Cinco lugares escreviam a classe da vulnerabilidade em ortografias diferentes e ninguém era dono: <b>55 grafias para 170 lições</b>, e o único bounty pago arquivado sob um nome que nenhum achado usava — então o cálculo de retorno nunca via o dinheiro. Um resolvedor único dobra <b>grafia</b> na leitura, jamais semântica: unificar duas escritas do mesmo termo é ortografia; dobrar um guarda-chuva numa instância seria inventar equivalência, então isso viaja num degrau <em>relacionado</em>, rotulado. Zero dado é reescrito.',
  },
];

/** O que atravessa a fronteira até o modelo. HTML inline. */
export const ARSENAL_NOTE =
  'O trabalho pesado — aprender o autômato, resolver o input, enumerar a matriz — roda em código. Ao modelo vai sempre um <b>resumo compacto</b> com uma alça para buscar o detalhe, nunca o estado inteiro nem o corpo bruto de uma resposta do alvo.';

/* ============================================================
   §08 — arquitetura e fronteiras de confiança
   ============================================================ */

export interface Invariant {
  n: string;
  title: string;
  /** HTML inline. */
  what: string;
}

/** Os três invariantes que o desenho inteiro respeita. */
export const ARCH_INVARIANTS: Invariant[] = [
  {
    n: '01',
    title: 'O alvo é hostil',
    what: 'A resposta dele volta para o contexto do agente — então <b>nunca chega crua</b>. Entra como resumo, com o corpo original guardado atrás de uma alça.',
  },
  {
    n: '02',
    title: 'Os controles críticos vivem fora do alcance do modelo',
    what: 'Escopo, validação e aprovação são código determinístico. <b>O agente propõe; o código autoriza.</b> Nenhum <em>prompt</em> move essa fronteira.',
  },
  {
    n: '03',
    title: 'Cada segredo fica isolado',
    what: 'A credencial vive no adaptador que a usa, e <b>nenhum componente vê o segredo de outro</b>. A fronteira devolve presença — um sim ou não —, jamais o valor.',
  },
];

export interface PathStep {
  n: string;
  name: string;
  /** HTML inline. */
  what: string;
  kind: 'human' | 'ctrl' | 'agent' | 'hostile';
}

/** O caminho do ataque — e quem autoriza cada passo. */
export const ATTACK_PATH: PathStep[] = [
  { n: '1', name: 'Operador', what: 'Autoriza o escopo. É a única fonte de autorização.', kind: 'human' },
  { n: '2', name: 'Agente', what: 'Consulta o conhecimento antes de agir e propõe uma ação.', kind: 'agent' },
  { n: '3', name: 'Portão de escopo', what: '<b>Falha fechada</b>, fora do alcance do modelo. O que não foi autorizado não passa.', kind: 'ctrl' },
  { n: '4', name: 'Arsenal', what: 'Só recebe o que foi autorizado. É daqui que sai o tráfego de ataque.', kind: 'ctrl' },
  { n: '5', name: 'Alvo', what: 'Hostil por definição. Tudo que ele devolve é conteúdo controlado pelo atacante.', kind: 'hostile' },
  { n: '6', name: 'De volta ao contexto', what: 'Resumo, nunca o corpo bruto. É o que impede a resposta do alvo de dirigir o agente.', kind: 'agent' },
];

/** Os stores locais que nunca cruzam a fronteira do host. HTML inline. */
export const ARCH_STORES_NOTE =
  'Fora do caminho crítico, o agente alimenta três registros locais — o gradiente de cobertura, o contexto da sessão (credenciais, dados sensíveis, achados) e o diário de eventos. <b>Todos dentro da fronteira do host, nenhum atravessando para fora.</b>';

export interface Layer {
  name: string;
  role: string;
}

/**
 * As seis camadas, descritas CONCEITUALMENTE — sem caminho de arquivo, que o
 * repositório é privado.
 */
export const ARCH_LAYERS: Layer[] = [
  { name: 'Fundação', role: 'Configuração, caminhos e segredos por um único resolvedor. Zero caminho absoluto no código.' },
  { name: 'Entidades', role: 'O achado, o contexto da sessão, o registro de cobertura — o vocabulário do domínio.' },
  { name: 'Domínio', role: 'Regras puras: escopo, cobertura, validação, achados. Mais a percepção, a dedução e o planejamento.' },
  { name: 'Aplicação', role: 'A raiz de composição, o orquestrador, a máquina de fases e a fila de vários alvos.' },
  { name: 'Infraestrutura', role: 'Os adaptadores: conhecimento, arsenal, provedores de modelo, solucionador, persistência, relatório, observabilidade.' },
  { name: 'Entradas', role: 'O servidor de ferramentas e as linhas de comando finas — nada de regra de negócio aqui.' },
];

/** A regra estrutural, verificada por lint no CI. HTML inline. */
export const ARCH_NOTE =
  'O domínio conversa com o exterior <b>só através de portas</b>; a infraestrutura as implementa; e o domínio <b>nunca</b> importa infraestrutura — garantido por lint no processo de integração contínua, não por disciplina. Toda a fiação vive numa <b>única raiz de composição</b>, e os provedores de modelo são intercambiáveis.';

/* ============================================================
   §09 — operado dentro do harness
   ============================================================ */

export interface HarnessFact {
  k: string;
  /** HTML inline. */
  v: string;
}

export const HARNESS: HarnessFact[] = [
  {
    k: 'Skills',
    v: 'Um comando conduz a caça inteira: playbook por fase, heurísticas de operador e armadilhas de ferramenta — <b>versionados</b>, não improvisados a cada sessão.',
  },
  {
    k: 'O modelo propõe, o código autoriza',
    v: 'Validação, escopo e guardrails são determinísticos e ficam <b>fora do alcance do modelo</b>.',
  },
  {
    k: 'Multi-provedor com fallback',
    v: 'Provedores diferentes roteados <b>por papel</b> — abstração num, extração noutro. Se um cai, o próximo assume sem interromper a caça.',
  },
  {
    k: 'Hooks',
    v: 'O guardrail que roda <b>mesmo se o agente esquecer</b>. Três no harness, um no commit.',
  },
];

/**
 * O comando que abre uma caça — bloco de terminal.
 * O corpo é `white-space: pre` numa coluna estreita: linha acima de ~40 caracteres
 * deixa um scrollbar permanente no desktop. Mantenha curtas.
 */
export const HARNESS_TERM = {
  prompt: '›',
  cmd: '/bounty <alvo>',
  lines: [
    'escopo autorizado · 47 ativos',
    'conhecimento antes de cada exploit',
    'modo profundo: só o operador encerra',
  ],
};

export interface Hook {
  when: string;
  name: string;
  /** HTML inline. */
  what: string;
}

export const HOOKS: Hook[] = [
  {
    when: 'antes da ferramenta',
    name: 'Escopo',
    what: 'Gateia <b>toda</b> chamada ao arsenal pelo ativo que ela <em>alcança</em>, não pelo que ela menciona — um payload ou um domínio de colaborador passam. Chamada fora do escopo é bloqueada <b>antes de sair da máquina</b>.',
  },
  {
    when: 'antes da ferramenta',
    name: 'Conhecimento',
    what: 'Barra uma exploração que não consultou a base antes. A regra de ouro deixa de ser exortação e vira portão.',
  },
  {
    when: 'ao fim do turno',
    name: 'Continuidade',
    what: 'Devolve o <b>próximo movimento concreto</b> em vez de deixar a caça profunda terminar sozinha — e nunca um "escalar, perguntar ou parar".',
  },
  {
    when: 'no commit',
    name: 'Sincronia de documentação',
    what: 'Fora do harness: roda em todo commit, mantendo documentação e código em sincronia. O que muda, propaga.',
  },
];

/* ============================================================
   §10 — o Operator Console
   ============================================================ */

export interface ConsolePage {
  name: string;
  answers: string;
}

export const CONSOLE_PAGES: ConsolePage[] = [
  { name: 'Operações', answers: 'Qual é a postura do portfólio agora?' },
  { name: 'Alvos', answers: 'O que existe em cada programa?' },
  { name: 'Achados', answers: 'O que eu tenho, e em que pé está?' },
  { name: 'Firewall', answers: 'Por que este achado morreu?' },
  { name: 'Caça', answers: 'O que foi feito, e quando?' },
  { name: 'Cadeias', answers: 'Quem alcança um objetivo de alto impacto?' },
  { name: 'Reconhecimento', answers: 'Que superfície nova apareceu?' },
  { name: 'Relatórios', answers: 'O que está pronto para sair?' },
  { name: 'Arsenal', answers: 'O que a plataforma sabe fazer?' },
  { name: 'Configuração', answers: 'Com que instalação eu estou caçando?' },
];

export interface ConsoleDetail {
  title: string;
  /** HTML inline; cada item vira um parágrafo. */
  body: string[];
}

/** O que cada painel mostra — o aprofundamento do §10. */
export const CONSOLE_DETAILS: ConsoleDetail[] = [
  {
    title: 'Operações — a postura num relance',
    body: [
      'Junta quatro leituras num só painel: indicadores, superfície nova pelo recon noturno, distribuição de camadas, medidor de cobertura, pipeline de fases, principais alvos, mapa de calor plataforma × severidade, o quadro de retorno esperado e a fila do que precisa de ação.',
      'Duas peças carregam a pergunta que o painel existe para responder: <b>"aguardando o operador"</b> e <b>"escalando"</b> são contadores <b>separados</b> — então <em>"o que depende de MIM?"</em> se lê num relance, em vez de sair de uma leitura à mão de uma pasta polissêmica.',
      'Ao lado, o pipeline de relatório é o eixo ortogonal: quantos estão imaturos, prontos, rascunhados, reportados e fechados — com o veredito da plataforma pintando cada segmento.',
    ],
  },
  {
    title: 'Achados — a cor conta o desfecho',
    body: [
      'O achado fechado deixa de ser mais uma linha escura: o bloco inteiro ganha a cor do desfecho — verde para pago, violeta para duplicado, vermelho para negado — e o valor pago sai em verde vivo dentro de um anel. De sete desfechos, um replica, e é o que o olho deve achar primeiro.',
      'Esse anel <b>pula a coluna de severidade</b> de propósito: ali o verde somaria com o âmbar da criticidade num tom que não é nenhum dos dois. A régua é <b>uma cor por pergunta</b>.',
      'O estágio de relatório fecha a tabela como coluna própria, cada estágio com seu glifo, herdando a cor do bloco quando há uma e neutro quando não há. O mesmo eixo vira filtro, ao lado do corte por plataforma — que é uma <b>lista</b>, não uma fileira de chips: um filtro tem um dono, e é <em>tri-state</em> (é × não é) em qualquer um deles.',
    ],
  },
  {
    title: 'O card de diagnóstico — "por que isto não é Crítico?"',
    body: [
      'Abrir um achado não abre o texto do relatório: abre um <b>card de diagnóstico</b> — o glifo de severidade com o CVSS derivado, a linha de metadados, a reprodução numerada e a espinha de trocas HTTP com as marcas entre identidades. Vale a regra <em>mostrar ou omitir</em>: o que o achado não carrega aparece como <b>ausente</b>, nunca inventado.',
      'A severidade vem com a <b>cascata inteira</b> e o degrau que de fato mordeu marcado — respondendo <em>"por que isto não é Crítico?"</em> em vez de só declarar a banda. Quando nenhum limite moveu nada (<b>99 dos 144 achados</b>), o painel diz isso, em vez de insinuar uma regra que não agiu.',
      'Somado sobre o portfólio, o mesmo cálculo vira <b>fila de trabalho</b>: confidencialidade e disponibilidade altas não conquistadas em 144 de 144; privilégio nenhum requerido em 80. Cada linha nomeia o artefato que falta capturar para a classe inteira subir um degrau.',
    ],
  },
  {
    title: 'Cadeias — quem alcança um objetivo',
    body: [
      'O detalhe do alvo ganha o painel de cadeia de morte: caminhos que alcançam um objetivo de alto impacto, com o passo confirmado em dourado e o faltante tracejado, mais as diretivas que fechariam cada cadeia. É projeção <b>somente leitura</b> — o console mostra o plano, nunca avança a caça.',
      'Acima dele, o portfólio inteiro numa chamada: a matriz alvo × objetivo diz que <b>7 de 40</b> alvos alcançam um objetivo, e uma coluna separa a linha zerada por <em>caça</em> da zerada por <em>tabela</em> — porque "sem caminho" tem duas causas muito diferentes.',
      'Qual delas é, o painel de vocabulário responde: <b>19 dos 144</b> achados carregam um tipo que as tabelas de escalada nunca mencionam — órfão não é achado fraco, é um nó de onde o encadeamento não parte nem chega. E dos mais de 56 mil vetores pendentes, só <b>333</b> são passo candidato; o resto é marcador de pipeline.',
    ],
  },
  {
    title: 'O quadro de retorno esperado — a cascata que reproduz o número',
    body: [
      'Clicar numa linha do quadro de <em>onde caçar agora</em> abre a cascata multiplicativa: <b>retorno × probabilidade de ganhar × frescor × prior de mercado × peso da fonte − custo estimado</b>. Cada fator como número, e os fatores publicados <b>reproduzem</b> o valor final.',
      'É o que mostra que uma vantagem zerada num quadro todo frio não é um empate medido: é o <b>prior uniforme</b> respondendo sobre zero observações. E, acima do quadro, quantos acertos cada junção realmente faz — porque um registro com 38 linhas e <b>zero</b> acertos é uma chave errada, não uma história vazia, e as duas pedem respostas opostas.',
    ],
  },
  {
    title: 'O relatório sai do app — e nada é submetido',
    body: [
      'Do card, o relatório sai por cópia: o corpo exatamente como persistido, ou um bloco resumido só com os campos que o achado carrega. <b>Nenhum dos dois submete nada.</b>',
    ],
  },
  {
    title: 'Configuração — a instalação com que você está caçando',
    body: [
      'Mostra onde cada registro resolveu de fato e se uma variável de ambiente o moveu do padrão; a política que o núcleo impõe — parada dura por tokens, redação de saída, técnicas bloqueadas; e quais integrações estão cabeadas: <b>presença, nunca o valor</b> do segredo.',
      'E deixou de ser só legível: os botões do engajamento e os slots de credencial são <b>editáveis</b>, validados por um dono único do que é configurável e do que é valor legal — chave fora da lista não é editável — e gravados por uma escrita cirúrgica e atômica que preserva comentário, ordem e permissão do arquivo.',
      'O segredo <b>entra e nunca volta</b>: a fronteira devolve booleano, jamais valor. E a necessidade de reiniciar é <b>medida</b> contra um retrato do momento em que subiu, não carimbada em toda linha. O painel também mede a <b>configuração morta</b> — a chave preenchida sob uma grafia que consumidor nenhum lê, que é pior que a chave faltando: a faltando você percebe.',
    ],
  },
];

/** A ficha técnica do console. */
export const CONSOLE_SPEC: HarnessFact[] = [
  { k: 'Natureza', v: 'Um cliente fino sobre a superfície de ferramentas: lê e escreve <b>só</b> pelas tools validadas. O núcleo segue o dono único do estado e do firewall, e a interface nunca vira segundo dono.' },
  { k: 'Execução', v: 'Local, no laço de retorno. Zero dependências de pacote — nada de CDN.' },
  { k: 'Estética', v: 'Quase preto com um único acento dourado, padrão de mesa de operações. Tudo desenhado à mão em vetor e CSS.' },
  { k: 'Escrita', v: 'Toda escrita passa pelo firewall. O painel mostra o plano; nunca avança a caça.' },
];

/* ============================================================
   §11 — garantias
   ============================================================ */

export interface Guarantee {
  title: string;
  what: string;
}

/** As garantias que não dependem do bom comportamento do modelo. */
export const GUARANTEES: Guarantee[] = [
  {
    title: 'Escopo falha fechado',
    what: 'Nenhuma ferramenta alcança um alvo que o operador não autorizou. A decisão é de código determinístico, fora do alcance do modelo — e o critério é o que a chamada de fato alcança, não o que ela menciona.',
  },
  {
    title: 'Aprovação humana obrigatória',
    what: 'Nada é enviado a nenhuma plataforma de bug bounty sem um humano aprovar. Não existe modo automático.',
  },
  {
    title: 'O padrão é descartar',
    what: 'Um achado só vira relatório com nota máxima e todos os portões aprovados. A nota é recalculada pelo código — o que o modelo acha que merece é ignorado.',
  },
  {
    title: 'A gravidade é calculada',
    what: 'A criticidade não é escolhida: é derivada da evidência, e cada elevação precisa ser paga com uma prova estruturada. Achado somente de leitura não vira crítico.',
  },
];

/** O aviso de uso — o mesmo que abre o repositório. */
export const AUTHORIZED_USE =
  'Ferramenta de segurança ofensiva para pentest e bug bounty <b>em escopo permitido</b>. Quem opera é responsável por só testar o que tem autorização para testar.';
