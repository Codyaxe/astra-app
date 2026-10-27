import type { Service, ServiceRequest } from './types';

/** Fictional examples for the backend handoff and contract checks. */
export const requestExamples = {
    makeform: {
        service: 'makeform',
        requester: {
            fullName: 'Alex Reyes',
            email: 'alex@example.com',
            type: 'campus_organization',
            organization: 'Campus Innovation Club',
        },
        consent: true,
        details: {
            serviceType: 'website',
            title: 'Website for our organization',
            supportNeeded:
                'A website with information about our organization and upcoming activities.',
            beneficiaries:
                'Students looking for campus activities and registration information.',
            preferredTimeline: 'November 2026; flexible',
            resourcesBudget:
                'Logo and content available; hosting costs to discuss.',
            materialsOrLinks: 'https://example.com/project-brief',
        },
    },
    upshift: {
        service: 'upshift',
        requester: {
            fullName: 'Bea Santos',
            email: 'bea@example.com',
            type: 'astra_member',
            organization: 'ASTRA Developers',
        },
        consent: true,
        details: {
            learningSupportType: 'mentorship',
            topic: 'React and API integration',
            experienceLevel: 'beginner',
            preferredFormat: 'online',
            goal: 'Learn to structure our first React project and handle API responses.',
            participants: 'A team of four students',
            preferredSchedule: 'A weekend in November',
        },
    },
    linkup: {
        service: 'linkup',
        requester: {
            fullName: 'Carlo Lim',
            email: 'carlo@example.com',
            type: 'external_partner',
            organization: 'Community Learning Network',
        },
        consent: true,
        details: {
            partnershipType: 'event',
            organizationName: 'Community Learning Network',
            organizationUrl: 'https://example.com/community',
            proposal:
                'A joint introductory web development workshop for student organizations.',
            contributions:
                'Venue, publicity, registration support and volunteers.',
            collaborationPeriod: 'December 2026; date to agree',
            proposalLink: 'https://example.com/workshop-proposal',
        },
    },
    reign: {
        service: 'reign',
        requester: {
            fullName: 'Dani Cruz',
            email: 'dani@example.com',
            type: 'astra_member',
        },
        consent: true,
        details: {
            intent: 'find_teammates',
            opportunityName: 'Campus Innovation Challenge',
            opportunityUrl: 'https://example.com/challenge',
            skills: 'Frontend development and UI design',
            eligibility: 'Students',
            assistanceNeeded: 'find_teammates',
            registrationDeadline: '2027-01-10',
            teamStatus: 'need_teammates',
        },
    },
} satisfies { [S in Service]: Extract<ServiceRequest, { service: S }> };
