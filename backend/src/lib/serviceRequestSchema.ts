import { z } from 'zod';

const blankToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const text = z.string().trim().min(1);
const optText = z.preprocess(blankToUndefined, z.string().trim().optional());
const optUrl = z.preprocess(blankToUndefined, z.string().trim().url().optional());
const optDate = z.preprocess(
  blankToUndefined,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional()
);
const optEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(blankToUndefined, z.enum(values).optional());

const requester = z.object({
  fullName: text,
  email: z.string().trim().email(),
  organization: optText,
  type: z.enum([
    'student',
    'astra_member',
    'campus_organization',
    'college',
    'community_group',
    'external_partner',
    'other',
  ]),
});

const makeformDetails = z.object({
  serviceType: z.enum(['website', 'mobile_app', 'ui_ux', 'ai_ml', 'cloud', 'other']),
  title: text,
  supportNeeded: text,
  beneficiaries: text,
  preferredTimeline: optText,
  resourcesBudget: optText,
  materialsOrLinks: optText,
});

const upshiftDetails = z.object({
  learningSupportType: z.enum([
    'technical_consultation',
    'mentorship',
    'workshop',
    'career_talk',
    'thesis',
    'other',
  ]),
  topic: text,
  experienceLevel: optEnum(['beginner', 'intermediate', 'advanced', 'not_sure'] as const),
  preferredFormat: optEnum(['online', 'in_person', 'hybrid'] as const),
  goal: text,
  participants: optText,
  preferredSchedule: optText,
});

const linkupDetails = z.object({
  partnershipType: z.enum([
    'event',
    'sponsorship',
    'technical_collaboration',
    'organization_partnership',
    'resource_sharing',
    'app_perks',
    'other',
  ]),
  organizationName: text,
  organizationUrl: optUrl,
  proposal: text,
  contributions: text,
  collaborationPeriod: optText,
  proposalLink: optUrl,
});

const reignDetails = z.object({
  intent: z.enum([
    'share_opportunity',
    'find_competition',
    'find_teammates',
    'participation_support',
  ]),
  opportunityName: optText,
  opportunityUrl: optUrl,
  skills: optText,
  eligibility: optText,
  assistanceNeeded: optEnum(
    ['share', 'find_teammates', 'guidance', 'team_coordination', 'other'] as const
  ),
  registrationDeadline: optDate,
  teamStatus: optEnum(
    ['individual', 'team_formed', 'need_teammates', 'not_applicable'] as const
  ),
});

const base = { requester, consent: z.literal(true) };

export const serviceRequestSchema = z.discriminatedUnion('service', [
  z.object({ service: z.literal('makeform'), ...base, details: makeformDetails }),
  z.object({ service: z.literal('upshift'), ...base, details: upshiftDetails }),
  z.object({ service: z.literal('linkup'), ...base, details: linkupDetails }),
  z.object({ service: z.literal('reign'), ...base, details: reignDetails }),
]);