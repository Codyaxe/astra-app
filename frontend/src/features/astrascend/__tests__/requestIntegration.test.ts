import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestExamples } from '../requestExamples';
import {
    normalizeSubmissionError,
    SubmissionError,
    submitServiceRequest,
} from '../requestIntegration';
import { SERVICES, type ServiceRequest } from '../types';

afterEach(() => vi.restoreAllMocks());

describe('ASTRAscend submission boundary', () => {
    it.each(SERVICES)(
        'accepts the %s contract and returns a truthful demo receipt',
        async (service) => {
            const fetchSpy = vi.spyOn(globalThis, 'fetch');
            const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
            const xhrSpy = vi.spyOn(XMLHttpRequest.prototype, 'open');
            const payload = structuredClone(requestExamples[service]);
            const receipt = await submitServiceRequest(payload);

            expect(receipt).toMatchObject({
                mode: 'demo',
                confirmationEmailSent: false,
            });
            expect(receipt.referenceNumber).toMatch(/^DEMO-[A-F0-9]{8}$/);
            expect(Number.isNaN(Date.parse(receipt.submittedAt))).toBe(false);
            expect(payload).toEqual(requestExamples[service]);
            expect(fetchSpy).not.toHaveBeenCalled();
            expect(xhrSpy).not.toHaveBeenCalled();
            expect(storageSpy).not.toHaveBeenCalled();
        },
    );

    it('generates separate references for separate submissions', async () => {
        const first = await submitServiceRequest(requestExamples.makeform);
        const second = await submitServiceRequest(requestExamples.makeform);
        expect(first.referenceNumber).not.toBe(second.referenceNumber);
    });

    it('rejects missing consent at the integration boundary', async () => {
        const invalid = {
            ...requestExamples.makeform,
            consent: false,
        } as unknown as ServiceRequest;
        await expect(submitServiceRequest(invalid)).rejects.toBeInstanceOf(
            SubmissionError,
        );
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
