import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ServiceFields } from '../../ServiceFields';
import { createEmptyDrafts } from '../../RequestState';
import { requestExamples } from '../../requestExamples';
import { makeform } from '../../forms/makeform';

afterEach(cleanup);
describe('MAKEFORM', () => {
    it('renders the seven designed fields and the exact service options', () => {
        render(
            <ServiceFields
                definition={makeform}
                draft={createEmptyDrafts().makeform}
                onChange={vi.fn()}
            />,
        );
        expect(screen.getAllByRole('textbox')).toHaveLength(6);
        fireEvent.click(screen.getByRole('combobox', { name: 'Service type' }));
        expect(
            screen.getAllByRole('option').map((option) => option.textContent),
        ).toEqual([
            'Website',
            'Mobile app',
            'UI/UX',
            'AI/ML',
            'Cloud',
            'Other',
        ]);
        expect(
            screen.queryByRole('option', { name: /consultation/i }),
        ).toBeNull();
    });
    it('requires only the four starred detail fields', () => {
        expect(
            Object.keys(makeform.validate(createEmptyDrafts().makeform)),
        ).toEqual([
            'details.serviceType',
            'details.title',
            'details.supportNeeded',
            'details.beneficiaries',
        ]);
    });
    it('preserves the complete example, trims values and excludes unknown or empty properties', () => {
        const sample = requestExamples.makeform;
        const contact = {
            ...sample.requester,
            organization: sample.requester.organization,
        };
        const draft = { ...createEmptyDrafts().makeform, ...sample.details };
        expect(makeform.buildRequest(contact, true, draft)).toEqual(sample);
        const payload = makeform.buildRequest(contact, true, {
            ...draft,
            title: '  Website  ',
            resourcesBudget: '',
            unexpected: 'discard',
        } as typeof draft);
        expect(payload.details.title).toBe('Website');
        expect(payload.details).not.toHaveProperty('unexpected');
        expect(payload.details).not.toHaveProperty('resourcesBudget');
    });
});
