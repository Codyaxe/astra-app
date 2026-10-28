import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AstrascendLayout } from '../components/AstrascendLayout';
import { LandingPage } from '../pages/LandingPage';
import {
    LegacyServiceRedirect,
    RequestPage,
    SuccessPage,
} from '../pages/RequestPage';
import * as integration from '../submission/requestIntegration';
import { requestExamples } from '../submission/requestExamples';
import type { Service, ServiceRequest, SubmissionReceipt } from '../forms/types';
import { definitions } from '../forms/services';
import { requesterOptions } from '../forms/formModel';

const receipt: SubmissionReceipt = {
    mode: 'demo',
    referenceNumber: 'DEMO-1234ABCD',
    submittedAt: '2026-10-27T12:00:00Z',
    confirmationEmailSent: false,
};
function open(path = '/astrascend/request') {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/astrascend" element={<AstrascendLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="request" element={<RequestPage />} />
                    <Route path="request/success" element={<SuccessPage />} />
                    <Route
                        path="service/:serviceId"
                        element={<LegacyServiceRedirect />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>,
    );
}
function change(name: string, value: string) {
    const field = document.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (!field) throw new Error(`Missing field: ${name}`);
    if (field.type === 'hidden') {
        const trigger = field.parentElement?.querySelector('[role="combobox"]');
        const options =
            name === 'type'
                ? requesterOptions
                : Object.values(definitions).flatMap((definition) =>
                      definition.fields
                          .filter((item) => item.name === name)
                          .flatMap((item) => item.options || []),
                  );
        const option = options.find((item) => item.value === value);
        if (!trigger || !option)
            throw new Error(`Missing choice: ${name}=${value}`);
        fireEvent.click(trigger);
        fireEvent.click(screen.getByRole('option', { name: option.label }));
    } else fireEvent.change(field, { target: { value } });
}
function fill(request: ServiceRequest) {
    for (const [name, value] of Object.entries(request.requester))
        change(name, value);
    for (const [name, value] of Object.entries(request.details))
        change(name, value);
    fireEvent.click(screen.getByRole('checkbox'));
}

beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('scrollY', 0);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('public request flow', () => {
    it.each<Service>(['makeform', 'upshift', 'linkup', 'reign'])(
        'submits the complete %s payload and opens a labeled receipt',
        async (service) => {
            const submit = vi
                .spyOn(integration, 'submitServiceRequest')
                .mockResolvedValue(receipt);
            open(`/astrascend/request?service=${service}`);
            expect(
                (
                    screen.getByRole('radio', {
                        name: new RegExp(service, 'i'),
                    }) as HTMLInputElement
                ).checked,
            ).toBe(true);
            fill(requestExamples[service]);
            fireEvent.click(
                screen.getByRole('button', { name: 'Submit my request ↗' }),
            );
            await screen.findByRole('heading', {
                name: 'Demo request received',
            });
            expect(submit).toHaveBeenCalledExactlyOnceWith(
                requestExamples[service],
            );
            expect(screen.getByLabelText('Reference number').textContent).toBe(
                receipt.referenceNumber,
            );
            expect(
                screen.getByText(
                    /No request was saved and no confirmation email was sent/,
                ),
            ).toBeDefined();
            fireEvent.click(
                screen.getByRole('button', { name: 'Start another request' }),
            );
            expect(
                (screen.getByLabelText(/Full name/) as HTMLInputElement).value,
            ).toBe('');
        },
    );
    it('retains common contact and independent drafts when switching categories', () => {
        open();
        change('fullName', 'Test Requester');
        change('title', 'Remember this idea');
        fireEvent.click(screen.getByRole('radio', { name: /UPSHIFT/ }));
        change('topic', 'Remember this topic');
        expect(
            (screen.getByLabelText(/Full name/) as HTMLInputElement).value,
        ).toBe('Test Requester');
        fireEvent.click(screen.getByRole('radio', { name: /MAKEFORM/ }));
        expect(
            (
                screen.getByLabelText(
                    /Project or request title/,
                ) as HTMLInputElement
            ).value,
        ).toBe('Remember this idea');
        fireEvent.click(screen.getByRole('radio', { name: /UPSHIFT/ }));
        expect(
            (screen.getByLabelText(/topic/i) as HTMLInputElement).value,
        ).toBe('Remember this topic');
        expect(localStorage.length).toBe(0);
    });
    it('preserves entered answers and focuses the first invalid field', () => {
        const submit = vi.spyOn(integration, 'submitServiceRequest');
        open();
        change('title', 'Keep my answer');
        fireEvent.click(
            screen.getByRole('button', { name: 'Submit my request ↗' }),
        );
        expect(screen.getByRole('alert').textContent).toContain(
            'highlighted fields',
        );
        expect(document.activeElement).toBe(screen.getByLabelText(/Full name/));
        expect(
            (
                screen.getByLabelText(
                    /Project or request title/,
                ) as HTMLInputElement
            ).value,
        ).toBe('Keep my answer');
        expect(submit).not.toHaveBeenCalled();
        change('fullName', 'A');
        expect(document.activeElement).toBe(screen.getByLabelText(/Full name/));
    });
    it('prevents duplicate requests while pending and lets the user retry a normalized failure', async () => {
        let reject!: (error: Error) => void;
        const submit = vi
            .spyOn(integration, 'submitServiceRequest')
            .mockImplementationOnce(
                () =>
                    new Promise((_, fail) => {
                        reject = fail;
                    }),
            )
            .mockResolvedValue(receipt);
        open();
        fill(requestExamples.makeform);
        const button = screen.getByRole('button', {
            name: 'Submit my request ↗',
        });
        fireEvent.click(button);
        fireEvent.click(button);
        expect(submit).toHaveBeenCalledTimes(1);
        expect(
            (
                screen.getByRole('button', {
                    name: 'Submitting demo…',
                }) as HTMLButtonElement
            ).disabled,
        ).toBe(true);
        expect(
            screen.getByRole('radio', { name: /UPSHIFT/ }).matches(':disabled'),
        ).toBe(true);
        await act(async () =>
            reject(
                new integration.SubmissionError(
                    'Please retry the demo.',
                    'network',
                ),
            ),
        );
        expect(screen.getByRole('alert').textContent).toBe(
            'Please retry the demo.',
        );
        expect(
            (screen.getByLabelText(/Full name/) as HTMLInputElement).value,
        ).toBe(requestExamples.makeform.requester.fullName);
        fireEvent.click(
            screen.getByRole('button', { name: 'Submit my request ↗' }),
        );
        await screen.findByRole('heading', { name: 'Demo request received' });
        expect(submit).toHaveBeenCalledTimes(2);
    });
    it('returns a direct receipt visit to the form', () => {
        open('/astrascend/request/success');
        expect(
            screen.getByRole('heading', {
                name: 'Tell us what you have in mind.',
            }),
        ).toBeDefined();
        expect(screen.queryByLabelText('Reference number')).toBeNull();
    });
    it.each([
        ['makeform', 'MAKEFORM'],
        ['upshift', 'UPSHIFT'],
        ['linkup', 'LINKUP'],
        ['reign', 'REIGN'],
        ['ascent', 'REIGN'],
    ])('redirects legacy %s to %s', (legacy, current) => {
        open(`/astrascend/service/${legacy}`);
        expect(
            (
                screen.getByRole('radio', {
                    name: new RegExp(current),
                }) as HTMLInputElement
            ).checked,
        ).toBe(true);
    });
    it('returns unknown legacy services to the public landing page', () => {
        open('/astrascend/service/unknown');
        expect(
            screen.getByRole('heading', { name: /Great ideas/ }),
        ).toBeDefined();
    });
    it('connects all landing actions and excludes deferred navigation', () => {
        open('/astrascend');
        expect(
            screen
                .getByRole('link', { name: 'Explore opportunities' })
                .getAttribute('href'),
        ).toBe('/astrascend/request?service=reign');
        expect(
            screen.queryByRole('link', { name: 'Opportunities' }),
        ).toBeNull();
        expect(screen.queryByRole('link', { name: /Track/ })).toBeNull();
        const discordLinks = screen.getAllByRole('link', {
            name: 'Join ASTRA Developers on Discord (opens in a new tab)',
        });
        expect(discordLinks).toHaveLength(2);
        for (const link of discordLinks) {
            expect(link.getAttribute('href')).toBe(
                'https://discord.gg/NRvkKxkNxG',
            );
            expect(link.getAttribute('target')).toBe('_blank');
            expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        }
        expect(
            screen
                .getByRole('link', { name: 'Community' })
                .getAttribute('href'),
        ).toBe('/astrascend#community');
        expect(screen.queryByText('Invite link coming soon')).toBeNull();
        expect(screen.getByText('Coming soon')).toBeDefined();
    });
    it('hides the floating theme control away from the top and restores keyboard access on return', () => {
        const removeListener = vi.spyOn(window, 'removeEventListener');
        const view = open('/astrascend');
        const toggle = screen.getByRole('switch', { name: 'Dark mode' });
        expect(document.querySelector('header')?.contains(toggle)).toBe(false);
        expect(toggle.tabIndex).toBe(0);
        vi.stubGlobal('scrollY', 160);
        fireEvent.scroll(window);
        expect(screen.queryByRole('switch', { name: 'Dark mode' })).toBeNull();
        expect(toggle.tabIndex).toBe(-1);
        vi.stubGlobal('scrollY', 80);
        fireEvent.scroll(window);
        expect(screen.queryByRole('switch', { name: 'Dark mode' })).toBeNull();
        vi.stubGlobal('scrollY', 12);
        fireEvent.scroll(window);
        expect(screen.getByRole('switch', { name: 'Dark mode' })).toBe(toggle);
        expect(toggle.tabIndex).toBe(0);
        view.unmount();
        expect(removeListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
        );
    });
    it('closes the hamburger navigation with Escape, outside interaction, and route selection', () => {
        open('/astrascend');
        const menu = screen.getByRole('button', { name: 'Open navigation' });
        fireEvent.click(menu);
        expect(
            screen
                .getByRole('button', { name: 'Close navigation' })
                .getAttribute('aria-expanded'),
        ).toBe('true');
        fireEvent.keyDown(screen.getByRole('link', { name: 'Services' }), {
            key: 'Escape',
        });
        expect(menu.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(menu);
        fireEvent.click(menu);
        fireEvent.pointerDown(
            screen.getByRole('heading', { name: /Great ideas/ }),
        );
        expect(menu.getAttribute('aria-expanded')).toBe('false');
        fireEvent.click(menu);
        fireEvent.click(screen.getByRole('link', { name: 'Start a request' }));
        expect(
            screen.getByRole('heading', {
                name: 'Tell us what you have in mind.',
            }),
        ).toBeDefined();
        expect(menu.getAttribute('aria-expanded')).toBe('false');
    });
    it('keeps appearance state scoped and persists only the theme choice', async () => {
        const original = document.documentElement.getAttribute('style');
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({
                matches: true,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        );
        open();
        expect(
            document.querySelector('.astrascend')?.getAttribute('data-theme'),
        ).toBe('dark');
        const toggle = screen.getByRole('switch', { name: 'Dark mode' });
        expect(toggle.getAttribute('aria-checked')).toBe('true');
        fireEvent.click(toggle);
        await waitFor(() =>
            expect(
                document
                    .querySelector('.astrascend')
                    ?.getAttribute('data-theme'),
            ).toBe('light'),
        );
        expect(toggle.getAttribute('aria-checked')).toBe('false');
        expect(localStorage.getItem('astrascend-theme')).toBe('light');
        fireEvent.click(toggle);
        await waitFor(() =>
            expect(
                document
                    .querySelector('.astrascend')
                    ?.getAttribute('data-theme'),
            ).toBe('dark'),
        );
        expect(toggle.getAttribute('aria-checked')).toBe('true');
        expect(localStorage.getItem('astrascend-theme')).toBe('dark');
        expect(localStorage.length).toBe(1);
        expect(document.documentElement.getAttribute('style')).toBe(original);
        vi.unstubAllGlobals();
    });
});
