# Content Model — schemas Zod e mapeamento seção→dados

Fonte única: [`data/linkedin.json`](../data/linkedin.json). Este documento define o
contrato de tipos que `src/lib/schema.ts` implementa. **O build falha se o JSON não
bater** (`schema.parse` em `src/lib/data.ts`, ADR-0004).

Princípios:
- Schemas validam **o que o site consome**; campos extras do JSON são tolerados
  (`.passthrough()` no objeto raiz) para não quebrar quando o Pablo enriquecer os dados.
- Strings de conteúdo passam por `z.string().min(1)` — vazio é erro, não fallback.
- Nada de defaults inventados: campo opcional ausente ⇒ elemento não renderiza.

## Schemas (contrato)

```ts
// src/lib/schema.ts (espelho normativo — implementação deve ser idêntica em semântica)
import { z } from 'astro/zod';

const YearMonth = z.string().regex(/^\d{4}-\d{2}$/);        // "2025-10"
const IsoDate  = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);   // "2026-07-06"

export const Profile = z.object({
  fullName: z.string().min(1),
  shortName: z.string().min(1),
  headline: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  openToWork: z.boolean(),
  followers: z.number().int().nonnegative(),
  profileUrl: z.string().url(),
  profileImageLocal: z.string().min(1),
  contact: z.object({
    email: z.string().email(),
    github: z.string().url(),
    githubUser: z.string().min(1),
    website: z.string().url(),
    linkedin: z.string().url(),
  }),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
});

export const About = z.object({
  summary: z.string().min(1),
  experiencia: z.array(z.string().min(1)),
  conhecimento: z.array(z.string().min(1)),
  habilidades: z.array(z.string().min(1)),
  certificacoesEmAndamento: z.array(z.object({
    name: z.string(), status: z.enum(['concluída', 'em andamento']),
  })),
  metasFuturas: z.array(z.string()),
  easterEgg: z.object({ description: z.string(), content: z.array(z.string()) }),
});

export const ExperienceItem = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  employmentType: z.string(),
  location: z.string().nullable(),
  workplace: z.string().nullable(),
  startDate: YearMonth,
  endDate: YearMonth.nullable(),   // null = atual
  current: z.boolean(),
  bullets: z.array(z.string().min(1)).min(1),
  skills: z.array(z.string()),
});

export const EducationItem = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startYear: z.number().int(),
  endYear: z.number().int(),
  description: z.string(),
  skills: z.array(z.string()),
});

export const CertificationItem = z.object({
  issuer: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  credentialUrl: z.string().url().nullable(),
  validationNumber: z.string().optional(),
  validUntil: IsoDate.optional(),
});

export const CertDocFile = z.object({
  file: z.string().regex(/^licert-\d{2}-[a-z0-9-]+\.(jpg|png)$/),
  title: z.string().min(1),
  lowRes: z.boolean(),
});

export const Certifications = z.object({
  totalOnLinkedIn: z.number().int(),
  items: z.array(CertificationItem).min(1),
  downloadedDocuments: z.object({
    folder: z.literal('img/certificados/linkedin/'),
    count: z.number().int(),
    files: z.array(CertDocFile).min(1),
  }),
});

export const RepoCertificate = z.object({
  file: z.string().min(1),           // "img/certificados/1.png"
  title: z.string().min(1),
  issuer: z.string().min(1),
  hours: z.string().optional(),
  date: z.string(),                  // "2022-07" | "2023-08-26" (exibida como veio)
  verifyUrl: z.string().url().nullable(),
  verifyCode: z.string().optional(),
});

export const Project = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  contributors: z.array(z.string()),
  skills: z.array(z.string()),
  relatedPublications: z.array(z.string()),   // URNs -> publications[].urn
});

export const SpeakingItem = z.object({
  title: z.string().min(1), event: z.string().min(1), host: z.string().min(1),
  date: YearMonth, coSpeaker: z.string().optional(), publication: z.string().optional(),
});

export const Publication = z.object({
  id: z.string().regex(/^\d+$/),
  urn: z.string().startsWith('urn:li:activity:'),
  permalink: z.string().url().startsWith('https://www.linkedin.com/'),
  date: IsoDate,
  category: z.enum(['certification', 'achievement', 'career', 'speaking', 'research', 'lab']),
  type: z.string(),
  featured: z.boolean(),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().startsWith('img/linkedin/'),
  imageStatus: z.literal('downloaded'),   // garante que nunca hotlinkamos
  mediaCount: z.number().int().optional(),
  engagement: z.object({
    reactions: z.number().int().nullable(),
    comments: z.number().int().nullable(),
    shares: z.number().int().nullable(),
  }),
});

export const Recommendation = z.object({
  author: z.string().min(1), authorTitle: z.string(), relationship: z.string(),
  text: z.string().min(1),
});

export const LinkedInData = z.object({
  profile: Profile,
  about: About,
  topSkills: z.array(z.string()).min(1),
  skills: z.array(z.object({ name: z.string(), endorsements: z.number().nullable(), context: z.string() })),
  experience: z.array(ExperienceItem).min(1),
  education: z.array(EducationItem).min(1),
  certifications: Certifications,
  certificateImagesInRepo: z.array(RepoCertificate),
  projects: z.array(Project),
  speaking: z.array(SpeakingItem),
  courses: z.array(z.object({ title: z.string(), type: z.string(), institution: z.string() })),
  recommendationsReceived: z.object({ total: z.number().int(), highlighted: z.array(Recommendation) }),
  publications: z.array(Publication).min(1),
}).passthrough();  // _meta, volunteering etc. tolerados
```

### Validações cruzadas (em `data.ts`, após o parse)

1. Todo `publications[].image` deve existir no glob de `img/linkedin/*.jpg` — senão, build falha.
2. Todo `certifications.downloadedDocuments.files[].file` deve existir em `img/certificados/linkedin/` — senão, build falha.
3. Todo `projects[].relatedPublications[]` deve resolver para um `publications[].urn` — senão, build falha.
4. `downloadedDocuments.count === files.length`.

## Mapeamento seção → dados (resumo; detalhe em `sections/*.md`)

| # | Seção | Fonte no JSON |
|---|---|---|
| 1 | Hero | `profile.*` (nome, headline, contact), `about.summary` (recorte), `about.easterEgg` |
| 2 | Sobre | `about.summary/experiencia/conhecimento/habilidades`, `topSkills`, `profile.languages`, `recommendationsReceived.highlighted` |
| 3 | Skills | `about.conhecimento` + `skills` agrupados por domínio (SOC, AppSec/DevSecOps, Ofensiva, Frameworks & Base) |
| 4 | Experiência | `experience[]` (timeline; `current` ⇒ badge `--ok`) |
| 5 | Formação | `education[]` (destaque Acadi-TI e Fatec) + `about.certificacoesEmAndamento`/`metasFuturas` |
| 6 | Projetos & Pesquisa | `projects[]` + `speaking[]` (links via `relatedPublications`→`publications`) |
| 7 | Certificações | `certifications.items/downloadedDocuments.files` + `certificateImagesInRepo` (+contadores) |
| 8 | Publicações | `publications[]` (capas locais `img/linkedin/<id>.jpg`; link p/ `permalink`) |
| 9 | Contato | `profile.contact` (mailto ofuscado, GitHub, LinkedIn) |
| 10 | Footer | `profile.contact.github` (repo), ano automático, link security.txt |

### Agrupamento de skills (derivação determinística, sem inventar)

Domínios fixos definidos aqui (não no código de seção):
- **SOC & Defesa**: itens de `about.experiencia` (SIEM, triagem, playbooks, tickets/SLA) + skills `Security Operations Center`, `SIEM`, `Security Monitoring`, `Segurança da informação`.
- **AppSec & DevSecOps**: `about.conhecimento[0]` (SSDLC, STRIDE, SAST/DAST/SCA/IaC) e `[1]` (CI/CD, Python) + skills `AppSec`, `SSDLC`, `Pipeline CI/CD`.
- **Segurança Ofensiva**: `about.conhecimento[3]` (Pentest, CTFs, Labs) + skills `Offensive Security`.
- **Frameworks & Base**: `about.conhecimento[2]` (OWASP, NIST, MITRE ATT&CK), `[4]` (Redes, Linux, Hardware), `[5]` (ML aplicado) + skills `Linux`, `Python`, `Machine Learning`.

## TODOs de conteúdo (perguntar ao Pablo — não preencher sozinho)

- **TODO-C1**: PDF de currículo curado para o CTA "Currículo" do hero (ver PRD §3).
- **TODO-C2**: emissor exato de licert-20/21/28/42/43/44 (nota em `certifications.note`) — exibidos com issuer "—" (título apenas) até confirmação.
- **TODO-C3**: `certifications.note` fala em 24 no LinkedIn e 30 itens listados; o card de contadores usa números derivados dos arrays (`items.length`, `files.length`), nunca literais.
