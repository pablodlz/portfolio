/**
 * Conteúdo da página do Omni-Pentest (/omni-pentest).
 *
 * Mesmo padrão de `Nav.astro`/`Footer.astro`: conteúdo de página vive no código,
 * tipado — `data/linkedin.json` continua sendo APENAS a exportação curada do
 * LinkedIn (ADR-0004) e não é contaminado por um projeto que não vive lá.
 *
 * ⚠️ O repositório do Omni-Pentest é PRIVADO. Nada aqui pode expor código,
 * caminho de arquivo, nome de módulo interno ou identificador de spec: esta
 * página descreve COMO funciona, nunca COM O QUÊ foi feito.
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
  { value: '0', label: 'relatórios enviados sem aprovação humana' },
];

export interface MapBlock {
  n: string;
  title: string;
  desc: string;
  href: string;
  tone: 'perc' | 'core' | 'know' | 'tool' | 'gate' | 'learn' | 'view';
}

/** O mapa do sistema — cada bloco aponta para a seção que o detalha. */
export const MAP_BLOCKS: MapBlock[] = [
  {
    n: '01',
    title: 'Percepção',
    desc: 'Reconstrói a superfície do alvo — inclusive o que o cliente publica sem perceber.',
    href: '#fases',
    tone: 'perc',
  },
  {
    n: '02',
    title: 'Raciocínio',
    desc: 'Aprende uma teoria formal do alvo e deduz o bug da estrutura dela.',
    href: '#diferencial',
    tone: 'core',
  },
  {
    n: '03',
    title: 'Conhecimento',
    desc: 'Uma base de ~489 mil documentos consultada antes de agir, a cada passo.',
    href: '#conhecimento',
    tone: 'know',
  },
  {
    n: '04',
    title: 'Arsenal',
    desc: 'Mais de 140 ferramentas, todas atrás do portão de escopo.',
    href: '#arsenal',
    tone: 'tool',
  },
  {
    n: '05',
    title: 'Firewall',
    desc: 'Dez portões e um juiz adversarial. O padrão é descartar.',
    href: '#firewall',
    tone: 'gate',
  },
  {
    n: '06',
    title: 'Aprendizado',
    desc: 'O que o programa respondeu de verdade vira prioridade da próxima caça.',
    href: '#operador',
    tone: 'learn',
  },
  {
    n: '07',
    title: 'Console',
    desc: 'O portfólio inteiro num painel — e a decisão continua sendo humana.',
    href: '#console',
    tone: 'view',
  },
];

export interface Phase {
  name: string;
  what: string;
}

export const PHASES: Phase[] = [
  {
    name: 'Recon',
    what: 'Enumera a superfície — e onde o alvo publica o próprio código no navegador, o agente o lê: reconstrói o fonte, extrai o contrato de API e mapeia as rotas que nenhum crawler alcança.',
  },
  {
    name: 'Filtro',
    what: 'Corta tudo que está fora do escopo autorizado. A decisão é do código, nunca do modelo, e falha fechada.',
  },
  {
    name: 'Descoberta',
    what: 'Monta o modelo do alvo — entidades, papéis e as regras que ele promete cumprir — e enumera a matriz de autorização inteira.',
  },
  {
    name: 'Exploração',
    what: 'Aprende a máquina de estados do alvo e a confronta com propriedades de segurança. Cada contraexemplo é um caminho de ataque deduzido, com o passo a passo exato.',
  },
  {
    name: 'Validação',
    what: 'O funil de dez portões, o juiz adversarial e a reprodução ponta a ponta. O padrão é descartar.',
  },
  {
    name: 'Relatório',
    what: 'Gera o artefato pronto para a plataforma — e nunca o envia sozinho. O desfecho real realimenta o aprendizado.',
  },
];

export interface Capability {
  name: string;
  tag: string;
  what: string;
}

/** Os motores de dedução — o que separa a plataforma de um scanner. */
export const CAPABILITIES: Capability[] = [
  {
    name: 'Cartógrafo de Estados',
    tag: 'o eixo',
    what: 'Aprende a máquina de estados por trás de login, checkout e aprovações, depois a verifica contra o que ela jamais poderia permitir. Cada violação encontrada é um bypass de autenticação ou de fluxo — provado, não chutado.',
  },
  {
    name: 'Blueprint do alvo',
    tag: 'percepção',
    what: 'Reconstrói o código original que a aplicação publica no navegador e dele extrai o contrato de API tipado — incluindo as rotas administrativas e internas que nenhum crawler enxerga.',
  },
  {
    name: 'Modelo cognitivo',
    tag: 'percepção',
    what: 'Infere as regras implícitas do produto ("só o dono lê o próprio pedido") e, ao confirmar uma falha, projeta essa suposição sobre todo o resto para achar cada lugar onde ela se repete.',
  },
  {
    name: 'Corante',
    tag: 'percepção',
    what: 'Injeta um marcador inofensivo e rastreia onde ele reaparece — outra tela, outro usuário, outro canal. É como se encontra injeção armazenada e vazamento entre clientes.',
  },
  {
    name: 'Matriz de autorização',
    tag: 'dedução',
    what: 'Enumera a combinação inteira de quem × o quê × qual instância × qual operação, e ainda deduz a sequência legítima de passos necessária para alcançar cada célula — a que só seria testável montando o estado à mão.',
  },
  {
    name: 'Oráculos metamórficos',
    tag: 'dedução',
    what: 'Relações que jamais podem quebrar entre duas execuções — comprar e estornar volta ao saldo original, um cupom não vale duas vezes. É assim que se acha falha de lógica sem ter um gabarito.',
  },
  {
    name: 'Síntese simbólica',
    tag: 'dedução',
    what: 'Quando o caminho existe mas o filtro barra, um solucionador matemático calcula a entrada exata que passa — em vez de adivinhar variações.',
  },
];

export interface OperatorFn {
  title: string;
  solves: string;
}

/** As funções que normalmente exigiriam um caçador sênior humano. */
export const OPERATOR_FNS: OperatorFn[] = [
  {
    title: 'Aprende do mundo real',
    solves: 'O desfecho de cada relatório — pago, duplicado, recusado — vira dado. Uma triagem interna prevê esse desfecho antes do envio e aponta o que falta para o relatório sobreviver.',
  },
  {
    title: 'Escolhe onde caçar',
    solves: 'Rankeia os programas por retorno esperado e prioriza os menos disputados — o antídoto número um contra o relatório duplicado.',
  },
  {
    title: 'Não anda em círculos',
    solves: 'Uma árvore de caça explícita poda o caminho sem saída, nunca o alvo. Quando a fila de hipóteses zera, o sistema gira uma lente nova em vez de declarar vitória.',
  },
  {
    title: 'Coordena sem um chefe de IA',
    solves: 'Vários trabalhadores especializados atuam em paralelo sobre um quadro compartilhado, priorizados por código determinístico — não por um supervisor de linguagem natural.',
  },
  {
    title: 'Encadeia rumo ao objetivo',
    solves: 'Liga achados isolados em cadeias que alcançam um alvo concreto — tomada de conta, exposição de dados pessoais. Cadeia paga múltiplas vezes o que a peça solta paga.',
  },
  {
    title: 'Se questiona',
    solves: 'Uma retrospectiva pergunta "por que não ganhamos?" sobre o dado real e propõe mudanças — que só entram com aprovação.',
  },
];

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

export interface ArsenalItem {
  name: string;
  role: string;
  count?: string;
}

export const ARSENAL: ArsenalItem[] = [
  {
    name: 'Núcleo próprio',
    count: '90 ferramentas',
    role: 'Estado da caça, achados, cobertura, validação, relatório, correlação de vulnerabilidades, reconhecimento próprio e todos os motores de raciocínio.',
  },
  {
    name: 'Arsenal ofensivo',
    count: '~127 ferramentas',
    role: 'Treze categorias — reconhecimento, web, exploração, nuvem, inteligência de fontes abertas, forense —, acionadas sob demanda.',
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
