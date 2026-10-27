import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactFields, ConsentField } from '../CommonFields';
import { RequestStateProvider, useRequestState } from '../RequestState';
import { SubmissionReceiptView } from '../SubmissionReceiptView';
import { validateContact } from '../formModel';

afterEach(cleanup);

describe('shared request controls', () => {
    it('labels the contact fields and associates server errors with the correct input', () => {
        const onChange = vi.fn();
        render(
            <ContactFields
                value={{
                    fullName: '',
                    email: '',
                    organization: '',
                    type: 'student',
                }}
                onChange={onChange}
                errors={{ 'requester.email': 'Check this email.' }}
            />,
        );
        const email = screen.getByRole('textbox', { name: 'Email address' });
        expect(email.getAttribute('aria-invalid')).toBe('true');
        expect(
            document.getElementById(email.getAttribute('aria-describedby')!)
                ?.textContent,
        ).toBe('Check this email.');
        fireEvent.change(email, { target: { value: 'alex@example.com' } });
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'alex@example.com' }),
        );
        fireEvent.click(screen.getByRole('combobox', { name: 'I am a…' }));
        expect(screen.getAllByRole('option')).toHaveLength(7);
        expect(
            screen.queryByRole('option', { name: 'Choose an option' }),
        ).toBeNull();
    });

    it('requires an explicit consent action and retains the full acknowledgement', () => {
        const onChange = vi.fn();
        render(<ConsentField checked={false} onChange={onChange} />);
        const checkbox = screen.getByRole('checkbox', {
            name: /submission does not guarantee acceptance/,
        });
        expect((checkbox as HTMLInputElement).required).toBe(true);
        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('checks name, email, requester type and consent without imposing membership', () => {
        expect(
            validateContact(
                {
                    fullName: '',
                    email: 'invalid',
                    organization: '',
                    type: 'student',
                },
                false,
            ),
        ).toHaveProperty('requester.email');
        expect(
            validateContact(
                {
                    fullName: 'Alex',
                    email: 'alex@example.com',
                    organization: '',
                    type: 'external_partner',
                },
                true,
            ),
        ).toEqual({});
    });

    it('keeps service drafts independent in memory and clears them for a new request', () => {
        function Harness() {
            const state = useRequestState();
            return (
                <>
                    <button
                        onClick={() =>
                            state.updateDetail(
                                'makeform',
                                'title',
                                'Our website',
                            )
                        }
                    >
                        Edit build
                    </button>
                    <button
                        onClick={() =>
                            state.updateDetail('upshift', 'topic', 'React')
                        }
                    >
                        Edit learning
                    </button>
                    <button onClick={state.reset}>Reset</button>
                    <output>
                        {state.drafts.makeform.title}|
                        {state.drafts.upshift.topic}
                    </output>
                </>
            );
        }
        const storage = vi.spyOn(Storage.prototype, 'setItem');
        render(
            <RequestStateProvider>
                <Harness />
            </RequestStateProvider>,
        );
        fireEvent.click(screen.getByText('Edit build'));
        fireEvent.click(screen.getByText('Edit learning'));
        expect(screen.getByRole('status').textContent).toBe(
            'Our website|React',
        );
        fireEvent.click(screen.getByText('Reset'));
        expect(screen.getByRole('status').textContent).toBe('|');
        expect(storage).not.toHaveBeenCalled();
        storage.mockRestore();
    });

    it('shows an honest demo receipt and offers a new request without a tracking link', () => {
        const start = vi.fn();
        render(
            <MemoryRouter>
                <SubmissionReceiptView
                    receipt={{
                        mode: 'demo',
                        referenceNumber: 'DEMO-12345678',
                        submittedAt: '2026-10-27T06:00:00Z',
                        confirmationEmailSent: false,
                    }}
                    onStartAnother={start}
                />
            </MemoryRouter>,
        );
        expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
            'Demo request received',
        );
        expect(
            screen.getByText(
                /No request was saved and no confirmation email was sent/,
            ),
        ).toBeDefined();
        expect(screen.queryByRole('link', { name: /track/i })).toBeNull();
        fireEvent.click(
            screen.getByRole('button', { name: 'Start another request' }),
        );
        expect(start).toHaveBeenCalledOnce();
    });
});
