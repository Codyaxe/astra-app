import { defineService } from '../formModel';

export const makeform = defineService('makeform', 'Share your idea', [
    {
        name: 'serviceType',
        label: 'Service type',
        kind: 'select',
        required: true,
        fullWidth: true,
        placeholder: 'Choose a service type',
        options: [
            { value: 'website', label: 'Website' },
            { value: 'mobile_app', label: 'Mobile app' },
            { value: 'ui_ux', label: 'UI/UX' },
            { value: 'ai_ml', label: 'AI/ML' },
            { value: 'cloud', label: 'Cloud' },
            { value: 'other', label: 'Other' },
        ],
    },
    {
        name: 'title',
        label: 'Project or request title',
        required: true,
        fullWidth: true,
        placeholder: 'Give your idea a clear, short title',
    },
    {
        name: 'supportNeeded',
        label: 'What support do you need?',
        kind: 'textarea',
        required: true,
        fullWidth: true,
        placeholder: 'Describe the need, proposed scope, and how we can help.',
    },
    {
        name: 'beneficiaries',
        label: 'Who will benefit, and how?',
        kind: 'textarea',
        required: true,
        fullWidth: true,
        placeholder: 'Tell us about the people and impact behind your idea.',
    },
    {
        name: 'preferredTimeline',
        label: 'Preferred timeline',
        placeholder: 'A target date, or flexible',
    },
    {
        name: 'resourcesBudget',
        label: 'Available resources / budget',
        placeholder: 'What is available? It’s okay if unsure.',
    },
    {
        name: 'materialsOrLinks',
        label: 'Existing materials or links',
        fullWidth: true,
        placeholder: 'Links to references or current work',
    },
]);
