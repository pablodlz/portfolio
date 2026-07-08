/**
 * terminal.ts — terminal interativo do hero: uma simulação de ambiente
 * pentest estilo Kali, client-side e sem dependências. Nada aqui executa
 * de verdade (é um "easter egg gigante" que demonstra repertório técnico);
 * as respostas deixam isso claro pelo contexto. Tudo é lazy: nenhuma
 * animação roda até o usuário digitar. Respeita prefers-reduced-motion.
 */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

interface TermData {
  name: string;
  role: string;
  company: string;
  headline: string;
  location: string;
  bio: string;
  github: string;
  ghUser: string;
  linkedin: string;
  socials: { name: string; url: string }[];
  skills: string[];
  experience: { title: string; org: string; range: string }[];
  education: { degree: string; field: string; org: string; years: string }[];
  projects: { name: string; cat: string }[];
  certs: string;
  certDocs: number;
  pubs: number;
  talks: number;
  resume: string;
  mail: { u: string; d: string };
}

type Cat = 'sys' | 'net' | 'pentest' | 'web' | 'linux' | 'me' | 'fun';

interface Ctx {
  args: string[];
  raw: string;
  td: TermData;
  print: (text?: string, cls?: string) => HTMLElement;
  link: (label: string, href: string, download?: boolean) => void;
  anim: (lines: { t: string; cls?: string; d?: number }[]) => Promise<void>;
  progress: (label: string, ms: number) => Promise<void>;
  clear: () => void;
  unlock: (name: string, text: string) => void;
  run: (line: string) => Promise<void>;
  cwd: () => string;
  cd: (dir: string) => string;
  fs: FsDir;
}

interface Cmd {
  cat: Cat;
  desc: string;
  usage?: string;
  man?: string[];
  hidden?: boolean;
  // unknown: handlers de uma linha frequentemente retornam o valor de print()
  // (um HTMLElement) — o retorno é descartado; só o efeito colateral importa.
  run: (ctx: Ctx) => unknown;
}

type FsNode = string[] | FsDir;
interface FsDir {
  [name: string]: FsNode;
}

export function initTerminal(opts: { unlock: (name: string, text: string) => void }): void {
  const form = document.querySelector<HTMLFormElement>('.t-form');
  const input = document.querySelector<HTMLInputElement>('.t-input');
  const out = document.querySelector<HTMLElement>('.t-out');
  const body = document.querySelector<HTMLElement>('.terminal-body');
  if (!form || !input || !out || !body) return;

  let td: TermData;
  try {
    td = JSON.parse(form.dataset.term ?? 'null') as TermData;
  } catch {
    return;
  }
  if (!td) return;

  /* ---------------- utilidades de saída ---------------- */
  const scroll = () => (body.scrollTop = body.scrollHeight);
  const print = (text = '', cls = ''): HTMLElement => {
    const line = document.createElement('span');
    line.className = `t-line is-live${cls ? ` ${cls}` : ''}`;
    line.textContent = text;
    out.appendChild(line);
    scroll();
    return line;
  };
  const link = (label: string, href: string, download = false): void => {
    const line = document.createElement('span');
    line.className = 't-line is-live';
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (download) a.setAttribute('download', '');
    else if (href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    line.append('→ ', a);
    out.appendChild(line);
    scroll();
  };
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, REDUCED ? 0 : ms));
  const anim = async (lines: { t: string; cls?: string; d?: number }[]): Promise<void> => {
    for (const l of lines) {
      print(l.t, l.cls);
      await sleep(l.d ?? 260);
    }
  };
  const progress = async (label: string, ms: number): Promise<void> => {
    const el = print(`${label} [                    ] 0%`);
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      const filled = '█'.repeat(i) + ' '.repeat(steps - i);
      el.textContent = `${label} [${filled}] ${Math.round((i / steps) * 100)}%`;
      scroll();
      await sleep(ms / steps);
    }
  };
  const clear = () => {
    out.textContent = '';
  };
  const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)]!;

  /* ---------------- sistema de arquivos fake ---------------- */
  const fs: FsDir = {
    'about.txt': [
      `${td.name} — ${td.role} @ ${td.company}.`,
      'Blue team de dia, labs ofensivos à noite.',
    ],
    'skills.txt': td.skills.map((s) => `• ${s}`),
    'contact.txt': ['use `contact` para os canais. e-mail montado em runtime (anti-bot).'],
    'pablodlz.sh': ['#!/bin/bash', '# execute com ./pablodlz.sh 😉'],
    'projetos': {
      'ransomware-ml.md': ['Undersampling p/ detecção de ransomware (NearMiss + Random).'],
      'ssdlc-talks.md': ['SSDLC do zero — palestras no IFPR e na Fatec.'],
    },
    'certificados': ['(50+ documentos — veja a seção Certificações ou digite `certs`)'],
    'publicacoes': [`(${td.pubs} posts — digite \`publications\`)`],
    '.flag': ['🔒 permission denied — execute ./pablodlz.sh primeiro'],
  };
  let cwdPath: string[] = [];
  const cwd = () => '~' + (cwdPath.length ? '/' + cwdPath.join('/') : '');
  const nodeAt = (parts: string[]): FsNode | null => {
    let node: FsNode = fs;
    for (const p of parts) {
      if (Array.isArray(node) || !(p in node)) return null;
      node = node[p]!;
    }
    return node;
  };
  const cd = (dir: string): string => {
    if (!dir || dir === '~' || dir === '/') {
      cwdPath = [];
      return '';
    }
    if (dir === '..') {
      cwdPath.pop();
      return '';
    }
    if (dir === '.') return '';
    const target = [...cwdPath, dir];
    const node = nodeAt(target);
    if (node && !Array.isArray(node)) {
      cwdPath = target;
      return '';
    }
    if (Array.isArray(node)) return `cd: ${dir}: não é um diretório`;
    return `cd: ${dir}: diretório não encontrado`;
  };

  /* ---------------- animações especiais ---------------- */
  async function matrix(): Promise<void> {
    if (REDUCED) {
      print('01001110 01000101 01001111', 't-accent');
      print('wake up, neo. (versão acessível, sem chuva de bits)');
      return;
    }
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶ0123456789ABCDEF';
    for (let n = 0; n < 16; n++) {
      let s = '';
      for (let j = 0; j < 44; j++)
        s += Math.random() < 0.12 ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      print(s, 't-accent');
      if (out!.children.length > 60) out!.removeChild(out!.firstChild!);
      await sleep(85);
    }
    print('wake up, neo…', 't-cmd');
  }

  const COFFEE = [
    '      ( (',
    '       ) )',
    '    ........',
    "    |      |]",
    '    \\      /',
    '     `----´',
  ];
  const cowsay = (msg: string): string[] => {
    const top = ' ' + '_'.repeat(msg.length + 2);
    const bot = ' ' + '-'.repeat(msg.length + 2);
    return [
      top,
      `< ${msg} >`,
      bot,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ];
  };
  const neofetch = (): string[] => [
    '       _____           root@kali',
    '      /  __ \\          ─────────────────────────',
    "      | |  \\/          OS......: KaliOS 3.0 (portfolio-hardened)",
    '      | |  __          Host....: GitHub Pages · static',
    '      | | |_ |         Kernel..: fake-bash 5.2-secure',
    '      | |__| |         Uptime..: desde 2020',
    "      \\______/          Shell...: pablosh · CSP strict",
    '                       Tools...: nmap, ffuf, sqlmap, nuclei… (sim)',
    '                       Trackers: 0 · Deps: mínimas',
  ];
  const BANNERS: Record<string, string[]> = {
    pablo: [
      '█▀█ ▄▀█ █▄▄ █░░ █▀█ █▀▄ █░░ ▀█',
      '█▀▀ █▀█ █▄█ █▄▄ █▄█ █▄▀ █▄▄ █▄ ── SOC · AppSec · OffSec',
    ],
    kali: [
      ' ▄ •▄  ▄▄▄· ▄▄▌  ▪  ',
      '█▌▄▌▪▐█ ▀█ ██•  ██ ',
      '▐▀▀▄·▄█▀▀█ ██▪  ▐█·',
      '▐█.█▌▐█▪ ▐▌▐█▌▐▌▐█▌',
      '·▀  ▀ ▀  ▀ .▀▀▀ ▀▀▀  the quieter you become…',
    ],
    hacker: [
      '┌─┐┬ ┬┌┐ ┌─┐┬─┐',
      '│  └┬┘├┴┐├┤ ├┬┘',
      '└─┘ ┴ └─┘└─┘┴└─  ethical only.',
    ],
    owasp: ['🛡  OWASP Top 10 · SAMM · ASVS — o mapa de quem constrói seguro.'],
  };

  /* ---------------- explicadores de web security ---------------- */
  const WEB: Record<string, string[]> = {
    xss: [
      'Cross-Site Scripting (XSS)',
      '',
      'payload comum:  <script>alert(1)</script>',
      'impacto: sequestro de sessão · roubo de credenciais · DOM takeover',
      'defesa:  escape por contexto · CSP · trusted types',
      'OWASP:   A03:2021 — Injection',
    ],
    sqli: [
      'SQL Injection',
      '',
      "payload comum:  ' OR '1'='1' -- -",
      'impacto: dump de dados · bypass de auth · RCE em casos extremos',
      'defesa:  prepared statements · ORM · least privilege',
      'OWASP:   A03:2021 — Injection',
    ],
    ssrf: [
      'Server-Side Request Forgery (SSRF)',
      '',
      'alvo clássico: http://169.254.169.254/ (metadata cloud)',
      'defesa: allowlist de destinos · bloquear IPs internos · sem redirect',
      'OWASP:  A10:2021 — SSRF',
    ],
    csrf: [
      'Cross-Site Request Forgery (CSRF)',
      '',
      'defesa: token anti-CSRF · SameSite=Lax/Strict · checar Origin',
      'OWASP:  faz parte de A01:2021 — Broken Access Control',
    ],
    ssti: [
      'Server-Side Template Injection (SSTI)',
      '',
      'teste: {{7*7}} → 49 ?  ${7*7} ?',
      'impacto: leitura de arquivos · RCE dependendo da engine',
    ],
    idor: [
      'Insecure Direct Object Reference (IDOR)',
      '',
      'ex.: /invoice?id=1002 → troque para 1003 e veja o do vizinho',
      'defesa: autorização por objeto no servidor, sempre.',
      'OWASP: A01:2021 — Broken Access Control',
    ],
    jwt: [
      'JSON Web Token',
      '',
      'ataques: alg=none · confusão HS256/RS256 · segredo fraco',
      'defesa: fixar algoritmo · validar assinatura · exp curto',
    ],
    cors: [
      'CORS mal configurado',
      '',
      "red flag: Access-Control-Allow-Origin: * + Allow-Credentials: true",
      'defesa: refletir só origens confiáveis; nunca * com credenciais',
    ],
  };

  const FORTUNES = [
    'um alerta silencioso não é um alerta resolvido.',
    'hoje é um bom dia para rodar `npm audit`.',
    'backup feito é futuro garantido — teste o restore.',
    'a vulnerabilidade que você ignora é a que te acorda às 3h.',
    'least privilege hoje, sono tranquilo amanhã.',
  ];
  const JOKES = [
    'por que o pentester atravessou a rua? testar o outro lado da DMZ.',
    'existem 10 tipos de pessoas: as que entendem binário e as que clicam no link.',
    'meu firewall e eu: negamos tudo por padrão.',
    'senha forte é como escova de dentes: não empresta e troca sempre.',
  ];
  const QUOTES = [
    '"Amateurs hack systems, professionals hack people." — Bruce Schneier',
    '"There is no patch for human stupidity." — Kevin Mitnick',
    '"The quieter you become, the more you are able to hear." — Kali',
    '"Trust, but verify." — e verifique de novo.',
  ];

  /* ---------------- man pages ---------------- */
  const MAN: Record<string, string[]> = {
    nmap: [
      'NMAP(1)                 Network Mapper                 NMAP(1)',
      '',
      'NOME    nmap — descoberta de hosts e portas',
      'USO     nmap [opções] <alvo>',
      'EX.     nmap -sV -sC scanme.nmap.org',
      'NOTA    simulação didática. na vida real: só com autorização.',
    ],
    sqlmap: [
      'SQLMAP(1)         Automated SQL Injection         SQLMAP(1)',
      '',
      'NOME    sqlmap — detecção e exploração de SQLi',
      'USO     sqlmap -u <url> --batch --dbs',
      'NOTA    poderosíssimo — e ilegal sem escopo. aqui é teatro.',
    ],
    ffuf: [
      'FFUF(1)              Fast web fuzzer                 FFUF(1)',
      '',
      'NOME    ffuf — fuzzing de conteúdo/parametros web',
      'USO     ffuf -u https://alvo/FUZZ -w wordlist.txt',
    ],
    hydra: [
      'HYDRA(1)            Login brute-forcer              HYDRA(1)',
      '',
      'NOME    hydra — brute force de autenticação',
      'USO     hydra -l user -P rockyou.txt ssh://alvo',
      'NOTA    brute force sem permissão é crime. simulação apenas.',
    ],
    hashcat: [
      'HASHCAT(1)        World\'s fastest cracker        HASHCAT(1)',
      '',
      'NOME    hashcat — recuperação de senhas por GPU',
      'USO     hashcat -m 0 hash.txt rockyou.txt',
    ],
  };

  /* ---------------- registro de comandos ---------------- */
  const reg: Record<string, Cmd> = {
    /* ---- sistema ---- */
    help: {
      cat: 'sys',
      desc: 'lista os comandos (help <cmd> mostra detalhes)',
      run: (c) => {
        if (c.args[0]) return helpFor(c.args[0], c);
        const labels: Record<Cat, string> = {
          sys: 'sistema',
          net: 'rede',
          pentest: 'pentest & recon',
          web: 'web security',
          linux: 'linux / shell',
          me: 'sobre o pablo',
          fun: 'diversão',
        };
        (Object.keys(labels) as Cat[]).forEach((cat) => {
          const names = Object.entries(reg)
            .filter(([, cmd]) => cmd.cat === cat && !cmd.hidden)
            .map(([n]) => n);
          if (!names.length) return;
          c.print(`  ${labels[cat]}`, 't-accent');
          // quebra em linhas de ~6
          for (let i = 0; i < names.length; i += 6)
            c.print('    ' + names.slice(i, i + 6).join('  '));
        });
        c.print('');
        c.print('dica: TAB completa · ↑↓ histórico · Ctrl+L limpa · `man <cmd>`', 't-accent');
      },
    },
    man: {
      cat: 'sys',
      desc: 'manual de um comando',
      usage: 'man <comando>',
      run: (c) => {
        const name = c.args[0];
        if (!name) return void c.print('o que você quer manual? ex.: man nmap', 't-warn');
        c.unlock('RTFM', 'Você leu o manual. Raro e admirável.');
        if (MAN[name]) return MAN[name]!.forEach((l) => c.print(l));
        const cmd = reg[name];
        if (cmd)
          return void [
            `${name.toUpperCase()}(1)`,
            '',
            `NOME    ${name} — ${cmd.desc}`,
            cmd.usage ? `USO     ${cmd.usage}` : 'USO     ' + name,
          ].forEach((l) => c.print(l));
        c.print(`Sem entrada de manual para ${name}.`, 't-warn');
      },
    },
    clear: { cat: 'sys', desc: 'limpa a tela', run: (c) => c.clear() },
    history: {
      cat: 'sys',
      desc: 'histórico de comandos',
      run: (c) => history.forEach((h, i) => c.print(`${String(i + 1).padStart(4)}  ${h}`)),
    },
    pwd: { cat: 'sys', desc: 'diretório atual', run: (c) => c.print(`/home/pablodlz/${c.cwd().slice(1)}`) },
    ls: {
      cat: 'sys',
      desc: 'lista o diretório',
      run: (c) => {
        const node = nodeAt(cwdPath);
        if (!node || Array.isArray(node)) return void c.print(node ? '(arquivo)' : '');
        const entries = Object.entries(node).map(([n, v]) =>
          Array.isArray(v) ? (n.endsWith('.sh') ? n + '*' : n) : n + '/',
        );
        c.print(entries.join('   '));
      },
    },
    tree: {
      cat: 'sys',
      desc: 'árvore de arquivos',
      run: (c) => {
        c.print(c.cwd());
        const walk = (node: FsDir, prefix: string): void => {
          const keys = Object.keys(node);
          keys.forEach((k, i) => {
            const last = i === keys.length - 1;
            c.print(`${prefix}${last ? '└── ' : '├── '}${k}${Array.isArray(node[k]) ? '' : '/'}`);
            const child = node[k]!;
            if (!Array.isArray(child)) walk(child, prefix + (last ? '    ' : '│   '));
          });
        };
        const cur = nodeAt(cwdPath);
        if (cur && !Array.isArray(cur)) walk(cur, '');
      },
    },
    cd: { cat: 'sys', desc: 'muda de diretório', usage: 'cd <dir>', run: (c) => { const e = c.cd(c.args[0] ?? ''); if (e) c.print(e, 't-warn'); } },
    cat: {
      cat: 'sys',
      desc: 'mostra um arquivo',
      usage: 'cat <arquivo>',
      run: (c) => {
        const name = c.args[0];
        if (!name) return void c.print('uso: cat <arquivo>', 't-warn');
        if (name === '.flag' && flagUnlocked) return void c.print(`FLAG{${td.mail.u}}`.replace(td.mail.u, decodeFlag()), 't-accent');
        const node = nodeAt([...cwdPath, name]);
        if (Array.isArray(node)) return node.forEach((l) => c.print(l));
        c.print(`cat: ${name}: arquivo não encontrado`, 't-warn');
      },
    },
    echo: { cat: 'sys', desc: 'repete o texto', run: (c) => c.print(c.args.join(' ')) },
    whoami: { cat: 'sys', desc: 'usuário atual', run: (c) => c.print('pablodlz') },
    id: { cat: 'sys', desc: 'uid/gid/grupos', run: (c) => c.print('uid=1337(pablodlz) gid=1337(blueteam) groups=soc,appsec,offsec,ctf,bugbounty') },
    groups: { cat: 'sys', desc: 'grupos do usuário', run: (c) => c.print('blueteam soc appsec offsec ctf bugbounty') },
    hostname: { cat: 'sys', desc: 'nome da máquina', run: (c) => c.print('portfolio') },
    uname: { cat: 'sys', desc: 'info do sistema', run: (c) => c.print('KaliOS 3.0-portfolio-hardened x86_64 GNU/pablosh') },
    uptime: { cat: 'sys', desc: 'tempo no ar', run: (c) => c.print(`up desde 2020, ${td.talks} palestras, 0 breaches — load average: café, café, café`) },
    date: { cat: 'sys', desc: 'data e hora', run: (c) => c.print(new Date().toString()) },
    cal: { cat: 'sys', desc: 'calendário', run: (c) => c.print('todo dia é bom dia pra aprender uma técnica nova. 🗓️') },
    env: { cat: 'sys', desc: 'variáveis de ambiente', run: (c) => ['USER=pablodlz', 'SHELL=/bin/pablosh', 'ROLE=' + td.role, 'COFFEE=always', 'SECRETS=0 (é estático!)'].forEach((l) => c.print(l)) },
    alias: { cat: 'sys', desc: 'atalhos definidos', run: (c) => Object.entries(ALIASES).forEach(([a, v]) => c.print(`alias ${a}='${v}'`)) },
    which: { cat: 'sys', desc: 'onde está o binário', run: (c) => c.print(c.args[0] && reg[c.args[0]] ? `/usr/bin/${c.args[0]}` : `which: ${c.args[0] ?? ''}: não encontrado`) },
    man_note: { cat: 'sys', desc: '', hidden: true, run: () => {} },
    sudo: {
      cat: 'sys',
      desc: 'executa como root (spoiler: não)',
      hidden: true,
      run: async (c) => {
        const rest = c.args.join(' ').toLowerCase();
        if (rest.includes('sandwich')) return void c.print('Okay. Você é o admin hoje. 🥪');
        if (rest === 'su' || rest === '-i' || rest === 'su -') return void c.print('Permission denied. Nem eu confio em estranhos. 😌', 't-warn');
        if (rest.includes('rm -rf')) return void c.print('Operação interceptada. Modo autopreservação ativado. Boa tentativa. 🧘', 't-warn');
        c.print('[sudo] senha para pablodlz: ', 't-warn');
        await sleep(650);
        c.print('Nice try. Este shell não tem root — é estático. 😏');
      },
    },
    reboot: { cat: 'sys', desc: 'reinicia (de mentira)', hidden: true, run: (c) => c.print('reiniciar um site estático? é só dar F5. 🔄') },
    shutdown: { cat: 'sys', desc: 'desliga (de mentira)', hidden: true, run: (c) => c.print('desligar a curiosidade? jamais. 💡') },
    exit: { cat: 'sys', desc: 'sai do terminal', run: (c) => c.print('não há saída. (mas o resto do portfólio te espera lá embaixo ↓)') },
    neofetch: { cat: 'sys', desc: 'infocard do sistema', run: (c) => neofetch().forEach((l) => c.print(l, 't-accent')) },
    screenfetch: { cat: 'sys', desc: 'alias visual de neofetch', run: (c) => neofetch().forEach((l) => c.print(l, 't-accent')) },

    /* ---- rede ---- */
    ifconfig: { cat: 'net', desc: 'interfaces de rede', run: (c) => ['eth0: inet 10.10.14.7  netmask 255.255.255.0', 'lo:   inet 127.0.0.1', 'tun0: inet 10.10.10.13  (VPN do lab)'].forEach((l) => c.print(l)) },
    ip: { cat: 'net', desc: 'ip addr / route', run: (c) => c.print('10.10.14.7/24 via tun0 — conectado ao lab. (fictício)') },
    ping: {
      cat: 'net',
      desc: 'testa conectividade',
      usage: 'ping <host>',
      run: async (c) => {
        const host = c.args[0] ?? 'pablodlz.github.io';
        for (let i = 0; i < 4; i++) {
          c.print(`64 bytes from ${host}: icmp_seq=${i + 1} ttl=64 time=${(0.3 + Math.random() * 0.6).toFixed(2)} ms`);
          await sleep(380);
        }
        c.print('--- sempre no ar. 0% packet loss ---', 't-accent');
      },
    },
    traceroute: { cat: 'net', desc: 'rota até o host', run: (c) => ['1  gateway (10.10.14.1)  1.2 ms', '2  ***  (a internet é um lugar misterioso)', '3  github-pages  12.4 ms'].forEach((l) => c.print(l)) },
    dig: { cat: 'net', desc: 'consulta DNS', usage: 'dig <domínio>', run: (c) => c.print(`;; ANSWER\n${c.args[0] ?? 'pablodlz.github.io'}.  300  IN  A  185.199.108.153`) },
    nslookup: { cat: 'net', desc: 'resolve DNS', run: (c) => c.print(`Address: 185.199.108.153  (${c.args[0] ?? 'pablodlz.github.io'})`) },
    host: { cat: 'net', desc: 'resolve host', run: (c) => c.print(`${c.args[0] ?? 'pablodlz.github.io'} has address 185.199.108.153`) },
    whois: { cat: 'net', desc: 'dados de domínio', run: (c) => ['Domain: pablodlz.github.io', 'Registrar: GitHub, Inc.', 'Status: no breaches on record 🙂'].forEach((l) => c.print(l)) },
    netstat: { cat: 'net', desc: 'conexões abertas', run: (c) => c.print('tcp  0  0  0.0.0.0:443  LISTEN  (https, o de sempre)') },
    ss: { cat: 'net', desc: 'sockets', run: (c) => c.print('LISTEN 0 128 *:443 — só o essencial exposto.') },
    curl: {
      cat: 'net',
      desc: 'faz uma requisição HTTP',
      usage: 'curl <url>',
      run: async (c) => {
        const url = c.args.find((a) => a.startsWith('http')) ?? 'https://pablodlz.github.io/portfolio/';
        await c.anim([{ t: `* Connected to ${url.replace(/^https?:\/\//, '').split('/')[0]}`, d: 300 }, { t: '> GET / HTTP/2', d: 200 }, { t: '< HTTP/2 200', cls: 't-accent', d: 250 }]);
        c.print('< content-security-policy: default-src \'self\'; …');
        c.print('< x-trackers: 0');
      },
    },
    wget: { cat: 'net', desc: 'baixa um arquivo', run: async (c) => { await c.progress('baixando payload de curiosidade', 900); c.print("‘curiosidade.html’ salvo — 100%"); } },
    arp: { cat: 'net', desc: 'tabela ARP', run: (c) => c.print('? (10.10.14.1) at de:ad:be:ef:00:01 [ether] on tun0') },
    route: { cat: 'net', desc: 'tabela de rotas', run: (c) => c.print('default via 10.10.14.1 dev tun0') },

    /* ---- pentest & recon ---- */
    nmap: {
      cat: 'pentest',
      desc: 'scanner de portas (simulado)',
      usage: 'nmap <alvo>',
      run: async (c) => {
        const t = c.args.find((a) => !a.startsWith('-')) ?? 'scanme.nmap.org';
        c.unlock('Recon', 'Você começou pelo reconhecimento. Fundamentos primeiro.');
        recon.add('nmap');
        await c.anim([
          { t: 'Starting Nmap 7.94 ( https://nmap.org )', d: 300 },
          { t: `Nmap scan report for ${t}`, d: 500 },
          { t: 'Host is up (0.012s latency).', d: 400 },
        ]);
        ['PORT      STATE  SERVICE   VERSION', '22/tcp    open   ssh       OpenSSH 8.9', '80/tcp    open   http      nginx 1.24', '443/tcp   open   https     nginx (ECDSA)', '8080/tcp  closed http-proxy'].forEach((l, i) => c.print(l, i === 0 ? 't-accent' : ''));
        c.print('Nmap done — 1 host up. (tudo fictício, claro)');
        maybeReconMaster(c);
      },
    },
    rustscan: { cat: 'pentest', desc: 'scan ultra-rápido', run: async (c) => { recon.add('rustscan'); await c.progress('rustscan 🦀 varrendo 65535 portas', 800); c.print('Open 22, 80, 443 → passando pro nmap…'); maybeReconMaster(c); } },
    masscan: { cat: 'pentest', desc: 'scan em massa', run: async (c) => { await c.progress('masscan a 10M pps (calma, é simulação)', 700); c.print('Discovered open port 443/tcp'); } },
    ffuf: {
      cat: 'pentest',
      desc: 'fuzzing de diretórios',
      usage: 'ffuf -u https://alvo/FUZZ',
      run: async (c) => {
        recon.add('ffuf');
        c.print('        /\'___\\  /\'___\\           /\'___\\', 't-accent');
        c.print('  v2.1.0-dev · fuzzing…');
        await c.progress(':: progresso', 1000);
        ['/admin      [Status: 200]', '/login      [Status: 200]', '/api        [Status: 401]', '/uploads    [Status: 403]', '/.git       [Status: 200]  👀'].forEach((l) => c.print(l, l.includes('.git') ? 't-accent' : ''));
        maybeReconMaster(c);
      },
    },
    gobuster: { cat: 'pentest', desc: 'brute de diretórios', run: async (c) => { recon.add('gobuster'); await c.progress('gobuster dir', 800); ['/admin (200)', '/backup (301)', '/config (403)'].forEach((l) => c.print(l)); maybeReconMaster(c); } },
    dirsearch: { cat: 'pentest', desc: 'busca de caminhos', run: async (c) => { await c.progress('dirsearch', 700); c.print('[200] /robots.txt  [200] /sitemap.xml'); } },
    feroxbuster: { cat: 'pentest', desc: 'content discovery', run: async (c) => { await c.progress('feroxbuster 🦀', 700); c.print('200  GET  /  →  /admin  /api  /assets'); } },
    subfinder: { cat: 'pentest', desc: 'enum de subdomínios', run: async (c) => { recon.add('subfinder'); await c.anim([{ t: 'subfinder enumerando…', d: 400 }]); ['www.exemplo.com', 'api.exemplo.com', 'dev.exemplo.com', 'staging.exemplo.com'].forEach((l) => c.print(l)); maybeReconMaster(c); } },
    amass: { cat: 'pentest', desc: 'mapa de superfície', run: async (c) => { await c.progress('amass enum', 900); c.print('42 subdomínios · 7 ASNs — a superfície é maior do que parece.'); } },
    assetfinder: { cat: 'pentest', desc: 'ativos de um domínio', run: (c) => ['cdn.exemplo.com', 'mail.exemplo.com', 'vpn.exemplo.com'].forEach((l) => c.print(l)) },
    httpx: { cat: 'pentest', desc: 'sonda hosts HTTP', run: (c) => c.print('https://exemplo.com [200] [nginx] [Exemplo Inc.]') },
    katana: { cat: 'pentest', desc: 'crawler', run: (c) => ['/', '/login', '/api/v1/users', '/api/v1/orders'].forEach((l) => c.print('https://exemplo.com' + l)) },
    gau: { cat: 'pentest', desc: 'URLs históricas', run: (c) => c.print('coletando de wayback/commoncrawl… 1.2k URLs (simulado)') },
    waybackurls: { cat: 'pentest', desc: 'wayback machine', run: (c) => c.print('https://exemplo.com/old/admin.php?debug=1  👀') },
    sqlmap: {
      cat: 'pentest',
      desc: 'exploração de SQLi (simulado)',
      usage: 'sqlmap -u <url>',
      run: async (c) => {
        await c.anim([
          { t: '        __H__', cls: 't-accent', d: 150 },
          { t: ' ___ ___[.]_____ ___ ___  {1.8}', d: 300 },
          { t: '[*] testing connection to the target URL', d: 400 },
          { t: "[*] parameter 'id' is vulnerable 💉", cls: 't-accent', d: 500 },
        ]);
        c.print('available databases [2]: information_schema, app_prod');
        c.print('(fictício — SQLi de verdade só com escopo assinado)');
      },
    },
    dalfox: { cat: 'pentest', desc: 'scanner de XSS', run: async (c) => { await c.progress('dalfox varrendo parâmetros', 700); c.print('[POC] reflected XSS em ?q= → <script>alert(1)</script>'); } },
    wpscan: { cat: 'pentest', desc: 'scanner WordPress', run: (c) => ['[+] WordPress 6.2 identificado', '[!] 3 plugins desatualizados', '[i] enumeração de usuários: admin, editor'].forEach((l) => c.print(l)) },
    nikto: { cat: 'pentest', desc: 'scanner web', run: async (c) => { await c.anim([{ t: '- Nikto v2.5.0', d: 300 }, { t: '+ Server: nginx', d: 300 }]); c.print('+ /admin/: possível painel exposto'); c.print('+ x-frame-options ausente'); } },
    nuclei: {
      cat: 'pentest',
      desc: 'scanner por templates',
      run: async (c) => {
        recon.add('nuclei');
        await c.anim([{ t: '[INF] nuclei — carregando 5k+ templates', d: 500 }]);
        c.print('[tech-detect] nginx, github-pages', 't-accent');
        c.print('[ssl] certificado válido, HSTS via CDN recomendado');
        c.print('[info] nenhum achado crítico — este alvo é bem-comportado 😌');
        maybeReconMaster(c);
      },
    },
    hydra: {
      cat: 'pentest',
      desc: 'brute force de login (simulado)',
      run: async (c) => {
        await c.anim([{ t: 'Hydra v9.5 — iniciando', d: 300 }, { t: '[DATA] atacando ssh://alvo:22', d: 400 }]);
        await c.progress('tentando rockyou.txt', 900);
        c.print('[22][ssh] login: admin  password: ******** (ok, no laboratório)', 't-accent');
        c.print('lembrete: brute force sem autorização é crime. isto é teatro.');
      },
    },
    hashcat: {
      cat: 'pentest',
      desc: 'quebra de hashes (simulado)',
      run: async (c) => {
        await c.anim([{ t: 'hashcat (v6.2) starting…', d: 300 }, { t: 'Initializing GPU… OpenCL', d: 400 }, { t: 'Loading wordlist: rockyou.txt', d: 400 }]);
        await c.progress('Recovering', 1000);
        c.print('5f4dcc3b5aa765d61d8327deb882cf99:password', 't-accent');
        c.print('Recovered: 1/1 (100%) — use senhas fortes, sério.');
      },
    },
    john: { cat: 'pentest', desc: 'John the Ripper', run: async (c) => { await c.progress('john --wordlist=rockyou.txt', 800); c.print('summer2024   (user_hash)'); } },
    'aircrack-ng': { cat: 'pentest', desc: 'cracking de Wi-Fi', run: (c) => c.print('KEY FOUND! [ correcthorsebatterystaple ] — no lab, com placa em modo monitor.') },
    crackmapexec: { cat: 'pentest', desc: 'AD/SMB sweep', run: (c) => c.print('SMB  10.10.10.5  [+] DOMAIN\\admin:*** (Pwn3d!) — ambiente de treino') },
    'evil-winrm': { cat: 'pentest', desc: 'shell WinRM', run: (c) => c.print('*Evil-WinRM* PS C:\\> whoami → domain\\admin (lab)') },
    impacket: { cat: 'pentest', desc: 'toolkit de rede', run: (c) => c.print('secretsdump.py, psexec.py, GetNPUsers.py… a caixa de ferramentas do AD.') },
    bloodhound: { cat: 'pentest', desc: 'grafo de AD', run: (c) => c.print('6 caminhos até Domain Admins encontrados. o grafo nunca mente.') },
    enum4linux: { cat: 'pentest', desc: 'enum SMB/Samba', run: (c) => ['[+] compartilhamentos: ADMIN$, C$, print$', '[+] usuários: guest, admin'].forEach((l) => c.print(l)) },
    responder: { cat: 'pentest', desc: 'LLMNR/NBT-NS poisoning', run: (c) => c.print('[+] captured NTLMv2 hash de VITIMA\\user — só em rede autorizada.') },
    tcpdump: { cat: 'pentest', desc: 'captura de pacotes', run: (c) => c.print('listening on tun0 — 14:03:22 IP alvo.443 > você: Flags [P.]') },
    bettercap: { cat: 'pentest', desc: 'MITM framework', run: (c) => c.print('» net.probe on — descobrindo hosts na rede (lab).') },

    /* ---- web security ---- */
    xss: { cat: 'web', desc: 'explica Cross-Site Scripting', run: (c) => WEB.xss!.forEach((l) => c.print(l)) },
    sqli: { cat: 'web', desc: 'explica SQL Injection', run: (c) => WEB.sqli!.forEach((l) => c.print(l)) },
    ssrf: { cat: 'web', desc: 'explica SSRF', run: (c) => WEB.ssrf!.forEach((l) => c.print(l)) },
    csrf: { cat: 'web', desc: 'explica CSRF', run: (c) => WEB.csrf!.forEach((l) => c.print(l)) },
    ssti: { cat: 'web', desc: 'explica SSTI', run: (c) => WEB.ssti!.forEach((l) => c.print(l)) },
    idor: { cat: 'web', desc: 'explica IDOR', run: (c) => WEB.idor!.forEach((l) => c.print(l)) },
    jwt: { cat: 'web', desc: 'ataques a JWT', run: (c) => WEB.jwt!.forEach((l) => c.print(l)) },
    cors: { cat: 'web', desc: 'CORS mal configurado', run: (c) => WEB.cors!.forEach((l) => c.print(l)) },
    burpsuite: { cat: 'web', desc: 'proxy de interceptação', run: (c) => c.print('Burp Suite — interceptando… Repeater, Intruder e Comparer no capricho. 🕸️') },
    zap: { cat: 'web', desc: 'OWASP ZAP', run: (c) => c.print('ZAP: spider + active scan — a alternativa open-source do Burp.') },

    /* ---- linux / shell (notas com personalidade) ---- */
    ...linuxNotes(),

    /* ---- sobre o pablo ---- */
    about: { cat: 'me', desc: 'quem é o Pablo', run: (c) => { c.print(td.bio); } },
    bio: { cat: 'me', desc: 'bio curta', run: (c) => c.print(`${td.name} — ${td.headline}`) },
    skills: { cat: 'me', desc: 'principais competências', run: (c) => { td.skills.forEach((s) => c.print('▸ ' + s)); c.print('detalhe completo na seção Capacidades ↓'); } },
    experience: { cat: 'me', desc: 'trajetória', run: (c) => td.experience.forEach((e) => c.print(`${e.range}  ·  ${e.title} — ${e.org}`)) },
    education: { cat: 'me', desc: 'formação', run: (c) => td.education.forEach((e) => c.print(`${e.years}  ·  ${e.degree} em ${e.field} — ${e.org}`)) },
    timeline: { cat: 'me', desc: 'linha do tempo', run: (c) => { td.experience.forEach((e) => c.print(`${e.range}  ${e.title}`)); } },
    projects: { cat: 'me', desc: 'projetos & pesquisa', run: (c) => td.projects.forEach((p) => c.print(`▸ [${p.cat}] ${p.name}`)) },
    research: { cat: 'me', desc: 'pesquisa acadêmica', run: (c) => { c.print('Undersampling p/ detecção de ransomware (NearMiss + Random).'); c.print('−41,96% no tempo de processamento mantendo a detecção.', 't-accent'); } },
    articles: { cat: 'me', desc: 'artigos', run: (c) => reg.research!.run(c) },
    publications: { cat: 'me', desc: 'posts no LinkedIn', run: (c) => { c.print(`${td.pubs} publicações — a lista rica está na seção Publicações ↓`); c.link('abrir LinkedIn', td.linkedin); } },
    certifications: { cat: 'me', desc: 'certificações', run: (c) => c.print(`${td.certs} certificações e treinamentos · ${td.certDocs} documentos comprobatórios.`) },
    certs: { cat: 'me', desc: 'certificações (alias)', run: (c) => reg.certifications!.run(c) },
    socials: { cat: 'me', desc: 'perfis externos', run: (c) => td.socials.forEach((s) => c.link(s.name, s.url)) },
    contact: { cat: 'me', desc: 'como falar comigo', run: (c) => { c.print(`e-mail: ${decodeMail()}`); c.link('LinkedIn', td.linkedin); c.link('GitHub', td.github); } },
    email: { cat: 'me', desc: 'meu e-mail', run: (c) => c.print(decodeMail()) },
    linkedin: { cat: 'me', desc: 'meu LinkedIn', run: (c) => c.link('LinkedIn — /' + 'pablodlz', td.linkedin) },
    github: { cat: 'me', desc: 'meu GitHub', run: (c) => c.link('GitHub — /' + td.ghUser, td.github) },
    hackerone: { cat: 'me', desc: 'perfil HackerOne', run: (c) => openSocial(c, 'HackerOne') },
    bugcrowd: { cat: 'me', desc: 'perfil Bugcrowd', run: (c) => openSocial(c, 'Bugcrowd') },
    htb: { cat: 'me', desc: 'Hack The Box', run: (c) => openSocial(c, 'Hack The Box') },
    letsdefend: { cat: 'me', desc: 'LetsDefend', run: (c) => openSocial(c, 'LetsDefend') },
    resume: { cat: 'me', desc: 'baixar currículo', run: (c) => c.link('curriculo-pablo-galerani.pdf', td.resume, true) },
    cv: { cat: 'me', desc: 'baixar currículo (alias)', run: (c) => reg.resume!.run(c) },

    /* ---- diversão ---- */
    coffee: { cat: 'fun', desc: 'prepara um café', run: async (c) => { for (const l of COFFEE) { c.print(l, 't-accent'); await sleep(120); } c.print('café servido. o SOC agradece. ☕'); c.unlock('Barista', 'Café servido. O turno agradece.'); } },
    hack: {
      cat: 'fun',
      desc: 'hackear algo (eticamente!)',
      usage: 'hack <alvo>',
      hidden: false,
      run: async (c) => {
        const t = c.args.join(' ') || 'mainframe';
        if (/nasa|pentagon|fbi|cia|gov/.test(t.toLowerCase())) {
          c.print('Access denied.', 't-warn');
          c.print('Nice try. 😄 Ethical hacking only.');
          c.unlock('Chapéu Branco', 'Você tentou o proibido — e o site te segurou.');
          return;
        }
        await c.anim([{ t: `[+] alvo: ${t}`, d: 300 }, { t: '[+] bypassando firewall imaginário', d: 400 }]);
        await c.progress('quebrando criptografia de mentirinha', 900);
        c.print('[✓] acesso concedido a: NADA. isto é um portfólio, não a Matrix. 😄', 't-warn');
        c.print('    hacking de verdade? só com escopo e autorização.');
      },
    },
    matrix: { cat: 'fun', desc: 'chuva de caracteres', run: async () => { await matrix(); opts.unlock('Neo', 'Você entrou na Matrix.'); } },
    cmatrix: { cat: 'fun', desc: 'alias de matrix', run: (c) => reg.matrix!.run(c) },
    fortune: { cat: 'fun', desc: 'frase de segurança', run: (c) => c.print('🥠 ' + pick(FORTUNES)) },
    joke: { cat: 'fun', desc: 'piada nerd', run: (c) => c.print(pick(JOKES)) },
    quote: { cat: 'fun', desc: 'citação de segurança', run: (c) => c.print(pick(QUOTES), 't-accent') },
    cowsay: { cat: 'fun', desc: 'a vaca fala', usage: 'cowsay <texto>', run: (c) => cowsay(c.args.join(' ') || 'stay curious, stay ethical').forEach((l) => c.print(l)) },
    banner: { cat: 'fun', desc: 'ASCII art', usage: 'banner [pablo|kali|hacker|owasp]', run: (c) => (BANNERS[c.args[0] ?? 'pablo'] ?? BANNERS.pablo!).forEach((l) => c.print(l, 't-accent')) },
    logo: { cat: 'fun', desc: 'logo em ASCII', run: (c) => BANNERS.pablo!.forEach((l) => c.print(l, 't-accent')) },
    ascii: { cat: 'fun', desc: 'arte aleatória', run: (c) => pick(Object.values(BANNERS)).forEach((l) => c.print(l, 't-accent')) },
    sl: { cat: 'fun', desc: 'o trem (você digitou errado)', run: (c) => ['🚂💨  choo choo!', '(digitou `sl` em vez de `ls`? tradição do Unix.)'].forEach((l) => c.print(l)) },
    rickroll: { cat: 'fun', desc: '???', hidden: true, run: (c) => ['🎵 Never gonna give you up', '🎵 Never gonna let you down', '🎵 Never gonna run around and desert you', '(você foi rickrollado por um SOC analyst. 😎)'].forEach((l) => c.print(l, 't-accent')) },
    party: { cat: 'fun', desc: 'festa', hidden: true, run: (c) => c.print('🎉🎊🕺💃🎈  deploy sexta? aqui a gente comemora com CI verde.') },
    rainbow: { cat: 'fun', desc: 'cores', hidden: true, run: (c) => c.print('🌈 aqui o arco-íris tem uma cor só: laranja. #ff5024') },
    dance: { cat: 'fun', desc: 'dança', hidden: true, run: (c) => c.print('┏(・o･)┛ ♪ ┗(･o･)┓ ♪') },
    secret: {
      cat: 'fun',
      desc: 'pssst',
      hidden: true,
      run: (c) => {
        c.print('viu o INCIDENT-0000 no código-fonte? aquela "chave AWS" é base64 de uma piada.', 't-accent');
        c.print('aqui não há segredos: site estático, sem backend, sem .env.');
        c.unlock('Caçador de Segredos', 'Curiosidade é a primeira skill de segurança.');
      },
    },
    easteregg: { cat: 'fun', desc: 'lista de eggs', hidden: true, run: (c) => { c.print('eggs: ./pablodlz.sh · matrix · coffee · rickroll · sudo … · hack nasa · secret'); c.print('e o comentário no código-fonte (F12). quem procura, acha. 🥚'); } },
    './pablodlz.sh': {
      cat: 'fun',
      desc: 'executa o script secreto',
      hidden: true,
      run: async (c) => {
        c.print('[+] executando pablodlz.sh …');
        await c.progress('carregando payload de simpatia', 800);
        c.print(`[+] echo "..." | base64 -d`);
        c.print(`[✓] ${decodeFlag()}`, 't-accent');
        c.print('[✓] shell access concedido. bem-vindo(a) ao time. 🏴');
        flagUnlocked = true;
        c.unlock('Shell Access', 'Você executou o script secreto do terminal.');
      },
    },
  };

  /* ---------- comandos "linux" gerados de um mapa compacto ---------- */
  function linuxNotes(): Record<string, Cmd> {
    const notes: Record<string, string> = {
      grep: 'sem stdin por aqui — mas no plantão eu vivo de `grep -Rin erro *.log`.',
      awk: 'uma linguagem inteira disfarçada de comando. respeito.',
      sed: "sed 's/bug/feature/g' — se ao menos fosse tão fácil.",
      sort: 'ordeno alertas por severidade antes do café.',
      uniq: 'dedup de IOC é meio caminho da triagem.',
      cut: 'corto campos de log como quem corta cebola: sem chorar.',
      head: 'só o topo do arquivo — as primeiras linhas contam muito.',
      tail: '`tail -f /var/log/auth.log` é meu reality show favorito.',
      less: 'menos é mais. (q pra sair, sempre esqueço.)',
      more: 'o less mais velho.',
      wc: 'conto linhas de log como quem conta ovelhas.',
      xargs: 'transformo saída em argumento — o encanador do shell.',
      chmod: 'chmod 777 é pedido de socorro. use com juízo.',
      chown: 'donos importam — em arquivos e em incidentes.',
      ps: 'processo suspeito? `ps aux | grep` e a caçada começa.',
      top: 'quem está comendo minha CPU? geralmente sou eu com 40 abas.',
      htop: 'o top, mas bonito. e com cores.',
      kill: 'encerro processos, nunca curiosidades.',
      killall: 'com muito cuidado. já derrubei o que não devia (uma vez).',
      jobs: 'meus jobs: monitorar, triar, responder, repetir.',
      watch: '`watch -n1` e eu fico hipnotizado.',
      tee: 'salvo e mostro ao mesmo tempo — o melhor dos dois mundos.',
      file: 'me diga a extensão e eu desconfio; me deixe rodar `file` e eu sei.',
      strings: 'binário estranho? `strings` conta segredos.',
      xxd: 'hexdump é onde os bugs se escondem.',
      base64: 'decodifico base64 dormindo (veja o easter egg 😉).',
      md5sum: 'md5 pra integridade rápida — pra senha, nunca.',
      sha256sum: 'sha256: o hash de quem se leva a sério.',
      chattr: '+i pra deixar o arquivo imutável. defesa em profundidade.',
      find: '`find / -perm -4000` atrás de SUID esquecido.',
      locate: 'acho arquivo mais rápido que acho minhas chaves.',
      whereis: 'onde mora o binário? o whereis sabe.',
      man: '', // real command handled above; skip
    };
    const out: Record<string, Cmd> = {};
    for (const [name, note] of Object.entries(notes)) {
      if (!note) continue;
      out[name] = { cat: 'linux', desc: note.length > 46 ? note.slice(0, 44) + '…' : note, run: (c) => c.print(note) };
    }
    return out;
  }

  /* ---------------- estado & helpers ---------------- */
  const history: string[] = [];
  let histIdx = 0;
  let busy = false;
  let booted = false;
  let flagUnlocked = false;
  const usedCmds = new Set<string>();
  const recon = new Set<string>();

  const decodeMail = (): string => {
    const rev = (s: string) => [...s].reverse().join('');
    return `${rev(td.mail.u)}@${rev(td.mail.d)}`;
  };
  const decodeFlag = (): string => `FLAG{${decodeMail()}}`;

  function openSocial(c: Ctx, name: string): void {
    const s = td.socials.find((x) => x.name === name);
    if (s) c.link(s.name, s.url);
    else c.print(`${name}: perfil não configurado`, 't-warn');
  }
  function maybeReconMaster(c: Ctx): void {
    if (recon.size >= 3) c.unlock('Recon Master', 'Três ferramentas de recon — você faz o dever de casa.');
  }
  function helpFor(name: string, c: Ctx): void {
    const cmd = reg[ALIASES[name] ?? name];
    if (!cmd) return void c.print(`help: ${name}: comando desconhecido`, 't-warn');
    c.print(`${name} — ${cmd.desc}`, 't-accent');
    if (cmd.usage) c.print(`uso: ${cmd.usage}`);
    c.print(`detalhes: man ${name}`);
  }

  const ALIASES: Record<string, string> = {
    ll: 'ls', la: 'ls', dir: 'ls',
    cls: 'clear', c: 'clear',
    h: 'help', '?': 'help',
    q: 'exit', quit: 'exit', logout: 'exit',
    'sh pablodlz.sh': './pablodlz.sh', 'bash pablodlz.sh': './pablodlz.sh', 'pablodlz.sh': './pablodlz.sh',
    fetch: 'neofetch',
    hackthebox: 'htb', 'hack the box': 'htb', h1: 'hackerone',
    curriculo: 'resume', 'currículo': 'resume',
    sobre: 'about', experiencia: 'experience', 'experiência': 'experience',
    formacao: 'education', 'formação': 'education',
    contato: 'contact', 'e-mail': 'email',
  };

  const NAMES = () => Object.keys(reg).filter((n) => !reg[n]!.hidden);
  const ALL_COMPLETIONS = () => [...NAMES(), './pablodlz.sh', 'cat about.txt', 'cat skills.txt', 'help nmap', 'man nmap'];

  // distância de edição p/ "did you mean"
  function lev(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) dp[0]![j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[m]![n]!;
  }
  function suggest(word: string): string | null {
    let best: string | null = null;
    let bestD = 3;
    for (const n of NAMES()) {
      const d = lev(word, n);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    return best;
  }

  /* ---------------- execução ---------------- */
  const ctx = (args: string[], raw: string): Ctx => ({
    args, raw, td, print, link, anim, progress, clear, unlock: opts.unlock, run: exec, cwd, cd, fs,
  });

  async function exec(rawLine: string): Promise<void> {
    const raw = rawLine.trim();
    // prompt casa com o título fixo da janela (root@kali), não o usuário do SO
    print(`root@kali:${cwd()}# ${raw}`, 't-cmd');
    if (!raw) return;
    const lower = raw.toLowerCase();
    const resolvedFull = ALIASES[lower] ?? lower;

    // comando composto por alias (ex.: "sh pablodlz.sh")
    let head = resolvedFull.split(' ')[0]!;
    let args = tokenize(raw).slice(1);
    if (ALIASES[lower] && !ALIASES[lower]!.includes(' ') === false) {
      head = ALIASES[lower]!.split(' ')[0]!;
      args = ALIASES[lower]!.split(' ').slice(1);
    }
    head = ALIASES[head] ?? head;

    const cmd = reg[head] ?? reg[resolvedFull];
    if (!cmd) {
      const s = suggest(head);
      print(`bash: ${head}: command not found`, 't-warn');
      if (s) print(`did you mean:  ${s}`);
      else print('digite "help" para ver todos os comandos.');
      return;
    }
    usedCmds.add(head);
    if (usedCmds.size === 10) opts.unlock('Explorador', 'Dez comandos diferentes. Você explora de verdade.');
    // avisa o mascote p/ reagir ao comando (visor no nmap, óculos no matrix…)
    dispatchEvent(new CustomEvent('pablodlz:term', { detail: { name: head, cat: cmd.cat } }));
    busy = true;
    input!.setAttribute('aria-busy', 'true'); // não-nulo garantido pelo guard inicial
    try {
      await cmd.run(ctx(args, raw));
    } finally {
      busy = false;
      input!.removeAttribute('aria-busy');
      scroll();
    }
  }

  function tokenize(s: string): string[] {
    return s.trim().split(/\s+/);
  }

  /* ---------------- boot sequence (primeiro foco) ---------------- */
  async function boot(): Promise<void> {
    booted = true;
    busy = true;
    const lines = [
      'Initializing Pentest Environment…',
      'Loading Recon Modules……… ok',
      'Loading Wordlists…………… ok',
      'Loading Payload Database…… ok',
      'Loading CVE Database……… ok',
      'Loading Toolchain………… ok',
    ];
    for (const l of lines) {
      print(l);
      await sleep(190);
    }
    print('Ready. digite `help` para começar.', 't-accent');
    print('');
    busy = false;
  }

  /* ---------------- ligação com o DOM ---------------- */
  const triggerBoot = (): void => {
    if (!booted) void boot();
  };
  body.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('a, button')) input.focus();
  });
  // múltiplos gatilhos → boot dispara mesmo se o focus programático falhar
  input.addEventListener('focus', triggerBoot);
  body.addEventListener('pointerdown', triggerBoot);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (busy) return;
    triggerBoot();
    const raw = input.value;
    input.value = '';
    if (raw.trim()) {
      history.push(raw.trim());
      histIdx = history.length;
    }
    void exec(raw);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (histIdx > 0) input.value = history[--histIdx] ?? '';
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (histIdx < history.length - 1) input.value = history[++histIdx] ?? '';
      else {
        histIdx = history.length;
        input.value = '';
      }
    } else if (ev.key === 'Tab') {
      ev.preventDefault();
      const cur = input.value.toLowerCase().trimStart();
      if (!cur) return;
      const matches = ALL_COMPLETIONS().filter((x) => x.startsWith(cur));
      if (matches.length === 1) input.value = matches[0]!;
      else if (matches.length > 1) {
        // completa o prefixo comum e lista opções
        const common = matches.reduce((p, s) => {
          let i = 0;
          while (i < p.length && p[i] === s[i]) i++;
          return p.slice(0, i);
        });
        if (common.length > cur.length) input.value = common;
        print(matches.slice(0, 12).join('   '), 't-accent');
      }
    } else if (ev.key === 'l' && ev.ctrlKey) {
      ev.preventDefault();
      clear();
    }
  });

  // este módulo só é importado (dinamicamente) na 1ª interação com o terminal,
  // então já sobe "bootado" e com o cursor pronto.
  void boot();
  input.focus();
}
