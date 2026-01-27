// src/schemas/profile.schema.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════
const ImpactStatSchema = z.object({
  id: z.string(),
  value: z.string(),
  unit: z.string(),
  label: z.string(),
  detail: z.string(),
  icon: z.string().optional(),
});

const HeroSchema = z.object({
  name: z.string(),
  headline: z.string(),
  tagline: z.string(),
  location: z.string(),
  impactStats: z.array(ImpactStatSchema).min(3).max(4),
  ctaLinks: z.array(z.object({
    label: z.string(),
    href: z.string().url(),
    icon: z.string(),
  })),
});

// ═══════════════════════════════════════════════════════════
// HIGHLIGHT SECTION (Award)
// ═══════════════════════════════════════════════════════════
const HighlightSchema = z.object({
  title: z.string(),
  category: z.string(),
  context: z.string(),
  description: z.string(),
  mediaUrl: z.string().url().optional(),
});

// ═══════════════════════════════════════════════════════════
// EXPERIENCE TIMELINE
// ═══════════════════════════════════════════════════════════
const MetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const EmploymentTypeEnum = z.enum([
  'full-time',
  'part-time',
  'contract',
  'internship',
  'freelance',
  'apprenticeship',
]);

const CareerLevelEnum = z.enum([
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'principal',
  'executive',
]);

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  employmentType: EmploymentTypeEnum.optional().default('full-time'),
  careerLevel: CareerLevelEnum.optional(),
  isEarlyCareer: z.boolean().optional().default(false),
  summary: z.string(),
  deepDive: z.object({
    context: z.string(),
    technicalHighlights: z.array(z.string()),
    leadershipHighlights: z.array(z.string()).optional(),
    metrics: z.array(MetricSchema),
  }),
  tags: z.array(z.string()),
});

// ═══════════════════════════════════════════════════════════
// PHILOSOPHY CARDS
// ═══════════════════════════════════════════════════════════
const PhilosophySchema = z.object({
  id: z.string(),
  title: z.string(),
  belief: z.string(),
  source: z.object({
    author: z.string(),
    work: z.string(),
  }).optional(),
});

// ═══════════════════════════════════════════════════════════
// SKILLS VISUALIZATION
// ═══════════════════════════════════════════════════════════
const SkillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(5),
    highlight: z.boolean().default(false),
  })),
});

// ═══════════════════════════════════════════════════════════
// EDUCATION (Academic Background - Array)
// ═══════════════════════════════════════════════════════════
const EducationTypeEnum = z.enum([
  'bachelor',
  'master',
  'doctorate',
  'associate',
  'certificate',
  'bootcamp',
  'self-taught',
  'other',
]);

const EducationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  focus: z.string(),
  type: EducationTypeEnum,
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  transferableInsight: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

// Legacy single-entry schema for backwards compatibility
const RootsSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  focus: z.string(),
  transferableInsight: z.string(),
});

// ═══════════════════════════════════════════════════════════
// VOLUNTEERING
// ═══════════════════════════════════════════════════════════
const VolunteeringSchema = z.object({
  id: z.string(),
  organization: z.string(),
  role: z.string(),
  period: z.object({
    start: z.string(),
    end: z.string().nullable(),
  }),
  description: z.string(),
  impact: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// ═══════════════════════════════════════════════════════════
// META (Build Info) - Enhanced for Gas Town
// ═══════════════════════════════════════════════════════════
const GasTownRoleSchema = z.object({
  name: z.string(),
  emoji: z.string(),
  description: z.string(),
});

const GasTownSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  roles: z.array(GasTownRoleSchema),
});

const PolecatSchema = z.object({
  name: z.string(),
  beads: z.number(),
  focus: z.array(z.string()),
});

const TimelineMilestoneSchema = z.object({
  time: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  highlight: z.boolean().optional(),
  beadsMerged: z.number().optional(),
});

const BuildStatsSchema = z.object({
  beads: z.number(),
  agents: z.number(),
  commits: z.number(),
  duration: z.string(),
});

const AgenticMetaSchema = z.object({
  buildTimestamp: z.string().datetime(),
  bundleSize: z.string(),
  sourceUrl: z.string().url(),
  lighthouseScore: z.number().optional(),
  // Legacy agents field (optional for backwards compatibility)
  agents: z.array(z.object({
    name: z.string(),
    contribution: z.string(),
  })).optional(),
  // Enhanced Gas Town fields
  gasTown: GasTownSchema.optional(),
  polecats: z.array(PolecatSchema).optional(),
  timeline: z.array(TimelineMilestoneSchema).optional(),
  stats: BuildStatsSchema.optional(),
});

// ═══════════════════════════════════════════════════════════
// MASTER EXPORT
// ═══════════════════════════════════════════════════════════
export const ProfileSchema = z.object({
  hero: HeroSchema,
  highlight: HighlightSchema,
  experience: z.array(ExperienceSchema),
  philosophy: z.array(PhilosophySchema).min(2).max(4),
  skills: z.array(SkillCategorySchema),
  // Education: supports both legacy single-entry (roots) and new array format
  roots: RootsSchema.optional(),
  education: z.array(EducationSchema).optional(),
  // Volunteering: new section for volunteer work
  volunteering: z.array(VolunteeringSchema).optional(),
  meta: AgenticMetaSchema,
}).refine(
  (data) => data.roots !== undefined || (data.education !== undefined && data.education.length > 0),
  { message: 'Either roots (legacy) or education array must be provided' }
);

export type Profile = z.infer<typeof ProfileSchema>;

// Export individual schemas for use in components
export {
  EducationSchema,
  EducationTypeEnum,
  VolunteeringSchema,
  EmploymentTypeEnum,
  CareerLevelEnum,
  GasTownSchema,
  PolecatSchema,
  TimelineMilestoneSchema,
  BuildStatsSchema,
  AgenticMetaSchema,
};

// Export inferred types
export type Education = z.infer<typeof EducationSchema>;
export type Volunteering = z.infer<typeof VolunteeringSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type EducationType = z.infer<typeof EducationTypeEnum>;
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;
export type CareerLevel = z.infer<typeof CareerLevelEnum>;
export type GasTown = z.infer<typeof GasTownSchema>;
export type Polecat = z.infer<typeof PolecatSchema>;
export type TimelineMilestone = z.infer<typeof TimelineMilestoneSchema>;
export type BuildStats = z.infer<typeof BuildStatsSchema>;
export type AgenticMeta = z.infer<typeof AgenticMetaSchema>;
