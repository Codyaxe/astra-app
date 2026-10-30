import { defineService } from '../formModel';

export const upshift = defineService('upshift', 'Tell us what you need', [
    {
        name: 'learningSupportType',
        label: 'What type of learning support are you looking for?',
        kind: 'select',
        required: true,
        fullWidth: true,
        placeholder: 'Choose a type of learning support',
        options: [
            {
                value: 'technical_consultation',
                label: 'Technical consultation',
            },
            { value: 'mentorship', label: 'Mentorship' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'career_talk', label: 'Career talk' },
            { value: 'other', label: 'Others' },
        ],
    },
    {
        name: 'topic',
        label: 'What topic or skill would you like to focus on?',
        required: true,
        fullWidth: true,
        placeholder: 'e.g. Web development, UI/UX',
    },
    {
        name: 'experienceLevel',
        label: 'Your current experience',
        kind: 'select',
        options: [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'not_sure', label: 'Not sure yet' },
        ],
    },
    {
        name: 'preferredFormat',
        label: 'Preferred format',
        kind: 'select',
        options: [
            { value: 'online', label: 'Online' },
            { value: 'in_person', label: 'In person' },
            { value: 'hybrid', label: 'Hybrid' },
        ],
    },
    {
        name: 'goal',
        label: 'What do you hope to accomplish?',
        kind: 'textarea',
        required: true,
        fullWidth: true,
        placeholder: 'Describe your goal',
    },
    {
        name: 'participants',
        label: 'Who will participate?',
        placeholder: 'Number of people or group name',
    },
    {
        name: 'preferredSchedule',
        label: 'Preferred date or schedule',
        placeholder: 'A target date, or flexible',
    },
]);
