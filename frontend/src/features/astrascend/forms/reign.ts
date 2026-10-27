import { defineService, type FieldDefinition } from '../formModel';
import type { ReignDetails } from '../types';

const fields: readonly (FieldDefinition & { name: keyof ReignDetails })[] = [
    {
        name: 'intent',
        label: 'What would you like to do?',
        kind: 'select',
        required: true,
        fullWidth: true,
        placeholder: 'Choose what you would like to do',
        options: [
            { value: 'share_opportunity', label: 'Share an opportunity' },
            { value: 'find_competition', label: 'Find a competition' },
            { value: 'find_teammates', label: 'Find teammates' },
            {
                value: 'participation_support',
                label: 'Request participation support',
            },
        ],
    },
    {
        name: 'opportunityName',
        label: 'Opportunity or competition name',
        placeholder: 'Name',
    },
    {
        name: 'opportunityUrl',
        label: 'Opportunity link or official announcement',
        kind: 'url',
        placeholder: 'https://',
    },
    {
        name: 'skills',
        label: 'Field or skills involved',
        placeholder: 'e.g. Web, AI, cybersecurity',
    },
    {
        name: 'eligibility',
        label: 'Who is eligible to participate?',
        placeholder: 'Students, members, open to all',
    },
    {
        name: 'assistanceNeeded',
        label: 'Assistance needed',
        kind: 'select',
        options: [
            { value: 'share', label: 'Share' },
            { value: 'find_teammates', label: 'Find teammates' },
            { value: 'guidance', label: 'Guidance' },
            { value: 'team_coordination', label: 'Team coordination' },
            { value: 'other', label: 'Other' },
        ],
    },
    {
        name: 'registrationDeadline',
        label: 'Registration deadline',
        kind: 'date',
    },
    {
        name: 'teamStatus',
        label: 'Team status',
        kind: 'select',
        fullWidth: true,
        options: [
            { value: 'individual', label: 'Individual' },
            { value: 'team_formed', label: 'Team formed' },
            { value: 'need_teammates', label: 'Need teammates' },
            { value: 'not_applicable', label: 'Not applicable' },
        ],
    },
];

export const reign = defineService(
    'reign',
    'Opportunities',
    fields,
    (draft) => {
        if (!draft.intent) return ['intent'];
        if (draft.intent === 'find_competition')
            return ['intent', 'skills', 'eligibility', 'assistanceNeeded'];
        if (draft.intent === 'share_opportunity')
            return fields
                .filter((field) => field.name !== 'teamStatus')
                .map((field) => field.name);
        return fields.map((field) => field.name);
    },
);
