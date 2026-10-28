import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestExamples } from '../submission/requestExamples';
import {
    normalizeSubmissionError,
    SubmissionError,
    submitServiceRequest,
} from '../submission/requestIntegration';
import { SERVICES, type ServiceRequest } from '../forms/types';

afterEach(() => vi.restoreAllMocks());

function jsonResponse(body: unknown, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

describe('ASTRAscend submission boundary', () => {
    it.each(SERVICES)(
        'posts the %s request to the backend and returns a live receipt',
        async (service) => {
            const fetchSpy = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValue(
                    jsonResponse(
                        { id: 'abc123', referenceNumber: 'ASC-2026-000001' },
                        201,
                    ),
                );
            const payload = structuredClone(requestExamples[service]);
            const receipt = await submitServiceRequest(payload);

            expect(fetchSpy).toHaveBeenCalledTimes(1);
            const [url, init] = fetchSpy.mock.calls[0];
            expect(String(url)).toMatch(/\/astrascend\/requests$/);
            expect(init?.method).toBe('POST');
            expect(JSON.parse(String(init?.body))).toEqual(
                requestExamples[service],
            );
            expect(receipt).toMatchObject({
                mode: 'live',
                referenceNumber: 'ASC-2026-000001',
                confirmationEmailSent: false,
            });
            expect(Number.isNaN(Date.parse(receipt.submittedAt))).toBe(false);
            expect(payload).toEqual(requestExamples[service]);
        },
    );

    it('rejects missing consent without calling the backend', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');
        const invalid = {
            ...requestExamples.makeform,
            consent: false,
        } as unknown as ServiceRequest;
        await expect(submitServiceRequest(invalid)).rejects.toBeInstanceOf(
            SubmissionError,
        );
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('maps backend 400 issues to field errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            jsonResponse(
                {
                    error: 'Invalid request',
                    issues: [
                        { path: ['requester', 'email'], message: 'Invalid email' },
                    ],
                },
                400,
            ),
        );
        await expect(
            submitServiceRequest(requestExamples.makeform),
        ).rejects.toMatchObject({
            kind: 'validation',
            fieldErrors: { email: 'Invalid email' },
        });
    });

    it('reports a network error when the server cannot be reached', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fail'));
        await expect(
            submitServiceRequest(requestExamples.makeform),
        ).rejects.toMatchObject({ kind: 'network' });
    });

    it('reports an unknown error for a server failure', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            jsonResponse({ error: 'Failed to save request' }, 500),
        );
        await expect(
            submitServiceRequest(requestExamples.makeform),
        ).rejects.toMatchObject({ kind: 'unknown' });
    });

    it('preserves normalized field errors and provides a safe fallback for other errors', () => {
        const validation = new SubmissionError(
            'Check your email.',
            'validation',
            { 'requester.email': 'Email is invalid.' },
        );
        expect(normalizeSubmissionError(validation)).toBe(validation);
        expect(
            normalizeSubmissionError(new Error('Internal failure')),
        ).toMatchObject({
            kind: 'unknown',
            message: 'Your request could not be submitted. Please try again.',
        });
    });
});