import { defineService } from '../formModel';

export const linkup = defineService('linkup', 'Propose a collaboration', [
    {
        name: 'partnershipType',
        label: 'What kind of partnership are you proposing?',
        kind: 'select',
        required: true,
        fullWidth: true,
        placeholder: 'Choose a partnership type',
        options: [
            { value: 'event', label: 'Event' },
            { value: 'sponsorship', label: 'Sponsorship' },
            {
                value: 'technical_collaboration',
                label: 'Technical collaboration',
            },
            { value: 'organization_partnership', label: 'Org partnership' },
            { value: 'resource_sharing', label: 'Resource sharing' },
            { value: 'app_perks', label: 'App perks' },
            { value: 'other', label: 'Other' },
        ],
    },
    {
        name: 'organizationName',
        label: 'Organization or company name',
        required: true,
        placeholder: 'Name',
    },
    {
        name: 'organizationUrl',
        label: 'Organization website or official page',
        kind: 'url',
        placeholder: 'https://',
    },
    {
        name: 'proposal',
        label: 'Tell us about your proposal',
        kind: 'textarea',
        required: true,
        fullWidth: true,
        placeholder: 'Purpose, activities, and intended beneficiaries',
    },
    {
        name: 'contributions',
        label: 'What can your organization contribute?',
        kind: 'textarea',
        required: true,
        fullWidth: true,
        placeholder: 'Funding, expertise, venue, perks, equipment…',
    },
    {
        name: 'collaborationPeriod',
        label: 'Proposed date or collaboration period',
        placeholder: 'A target date or range',
    },
    {
        name: 'proposalLink',
        label: 'Additional documents or proposal link',
        kind: 'url',
        placeholder: 'Link to files',
    },
]);
