/**
 * Schemas Zod de data/linkedin.json — contrato normativo em specs/content-model.md.
 * Dado inválido DERRUBA o build (parse em data.ts). Não afrouxar sem editar o spec.
 */
import { z } from 'astro/zod';

const YearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'esperado "YYYY-MM"');
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'esperado "YYYY-MM-DD"');

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
  languages: z.array(z.object({ name: z.string().min(1), level: z.string().min(1) })),
  socials: z.array(
    z.object({ name: z.string().min(1), handle: z.string().min(1), url: z.string().url() }),
  ),
  resume: z.string().regex(/\.pdf$/),
});

export const About = z.object({
  summary: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  experiencia: z.array(z.string().min(1)),
  conhecimento: z.array(z.string().min(1)),
  habilidades: z.array(z.string().min(1)),
  certificacoesEmAndamento: z.array(
    z.object({ name: z.string().min(1), status: z.enum(['concluída', 'em andamento']) }),
  ),
  metasFuturas: z.array(z.string().min(1)),
  easterEgg: z.object({ description: z.string(), content: z.array(z.string()) }),
});

export const ExperienceItem = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  employmentType: z.string().min(1),
  location: z.string().nullable(),
  workplace: z.string().nullable(),
  startDate: YearMonth,
  endDate: YearMonth.nullable(),
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
  displayTotal: z.string().min(1),
  items: z.array(CertificationItem).min(1),
  downloadedDocuments: z.object({
    folder: z.literal('img/certificados/linkedin/'),
    count: z.number().int(),
    files: z.array(CertDocFile).min(1),
  }),
});

export const RepoCertificate = z.object({
  file: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  hours: z.string().optional(),
  date: z.string().min(1),
  verifyUrl: z.string().url().nullable(),
  verifyCode: z.string().optional(),
});

export const Project = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  contributors: z.array(z.string()),
  skills: z.array(z.string()),
  relatedPublications: z.array(z.string()),
});

export const SpeakingItem = z.object({
  title: z.string().min(1),
  event: z.string().min(1),
  host: z.string().min(1),
  date: YearMonth,
  coSpeaker: z.string().optional(),
  publication: z.string().optional(),
});

export const PublicationCategory = z.enum([
  'certification',
  'achievement',
  'career',
  'speaking',
  'research',
  'lab',
]);

export const Publication = z.object({
  id: z.string().regex(/^\d+$/),
  urn: z.string().startsWith('urn:li:activity:'),
  permalink: z.string().url().startsWith('https://www.linkedin.com/'),
  date: IsoDate,
  category: PublicationCategory,
  type: z.string(),
  featured: z.boolean(),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().startsWith('img/linkedin/'),
  // Literal "downloaded": garante em build que nunca hotlinkamos o LinkedIn.
  imageStatus: z.literal('downloaded'),
  mediaCount: z.number().int().optional(),
  engagement: z.object({
    reactions: z.number().int().nullable(),
    comments: z.number().int().nullable(),
    shares: z.number().int().nullable(),
  }),
});

export const Recommendation = z.object({
  author: z.string().min(1),
  authorTitle: z.string(),
  relationship: z.string(),
  text: z.string().min(1),
});

export const LinkedInData = z
  .object({
    profile: Profile,
    about: About,
    topSkills: z.array(z.string().min(1)).min(1),
    skills: z.array(
      z.object({
        name: z.string().min(1),
        endorsements: z.number().int().nullable(),
        context: z.string(),
      }),
    ),
    experience: z.array(ExperienceItem).min(1),
    education: z.array(EducationItem).min(1),
    certifications: Certifications,
    certificateImagesInRepo: z.array(RepoCertificate),
    projects: z.array(Project),
    speaking: z.array(SpeakingItem),
    courses: z.array(
      z.object({ title: z.string(), type: z.string(), institution: z.string() }),
    ),
    recommendationsReceived: z.object({
      total: z.number().int(),
      highlighted: z.array(Recommendation),
    }),
    publications: z.array(Publication).min(1),
  })
  .passthrough();

export type TLinkedInData = z.infer<typeof LinkedInData>;
export type TExperienceItem = z.infer<typeof ExperienceItem>;
export type TEducationItem = z.infer<typeof EducationItem>;
export type TPublication = z.infer<typeof Publication>;
export type TCertDocFile = z.infer<typeof CertDocFile>;
export type TRepoCertificate = z.infer<typeof RepoCertificate>;
export type TProject = z.infer<typeof Project>;
export type TSpeakingItem = z.infer<typeof SpeakingItem>;
export type TPublicationCategory = z.infer<typeof PublicationCategory>;
