export const SERVICES = ['makeform', 'upshift', 'linkup', 'reign'] as const;
export type Service = (typeof SERVICES)[number];

export type RequesterType =
    | 'student'
    | 'astra_member'
    | 'campus_organization'
    | 'college'
    | 'community_group'
    | 'external_partner'
    | 'other';

export interface Requester {
    fullName: string;
    email: string;
    organization?: string;
    type: RequesterType;
}

export interface MakeformDetails {
    serviceType:
        | 'website'
        | 'mobile_app'
        | 'ui_ux'
        | 'ai_ml'
        | 'cloud'
        | 'other';
    title: string;
    supportNeeded: string;
    beneficiaries: string;
    preferredTimeline?: string;
    resourcesBudget?: string;
    materialsOrLinks?: string;
}

export interface UpshiftDetails {
    learningSupportType:
        | 'technical_consultation'
        | 'mentorship'
        | 'workshop'
        | 'career_talk'
        | 'thesis'
        | 'other';
    topic: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'not_sure';
    preferredFormat?: 'online' | 'in_person' | 'hybrid';
    goal: string;
    participants?: string;
    preferredSchedule?: string;
}

export interface LinkupDetails {
    partnershipType:
        | 'event'
        | 'sponsorship'
        | 'technical_collaboration'
        | 'organization_partnership'
        | 'resource_sharing'
        | 'app_perks'
        | 'other';
    organizationName: string;
    organizationUrl?: string;
    proposal: string;
    contributions: string;
    collaborationPeriod?: string;
    proposalLink?: string;
}

export type ReignIntent =
    | 'share_opportunity'
    | 'find_competition'
    | 'find_teammates'
    | 'participation_support';
export interface ReignDetails {
    intent: ReignIntent;
    opportunityName?: string;
    opportunityUrl?: string;
    skills?: string;
    eligibility?: string;
    assistanceNeeded?:
        | 'share'
        | 'find_teammates'
        | 'guidance'
        | 'team_coordination'
        | 'other';
    registrationDeadline?: string;
    teamStatus?:
        | 'individual'
        | 'team_formed'
        | 'need_teammates'
        | 'not_applicable';
}

export interface DetailsByService {
    makeform: MakeformDetails;
    upshift: UpshiftDetails;
    linkup: LinkupDetails;
    reign: ReignDetails;
}

export type ServiceRequest = {
    [S in Service]: {
        service: S;
        requester: Requester;
        consent: true;
        details: DetailsByService[S];
    };
}[Service];

export interface SubmissionReceipt {
    mode: 'demo' | 'live';
    referenceNumber: string;
    submittedAt: string;
    confirmationEmailSent: boolean;
}

export type FieldErrors = Record<string, string>;
export type DetailsDraft<S extends Service> = {
    [K in keyof DetailsByService[S]]-?: string;
};
export type ServiceDrafts = { [S in Service]: DetailsDraft<S> };

export function isService(value: string | null | undefined): value is Service {
    return SERVICES.some((service) => service === value);
}
