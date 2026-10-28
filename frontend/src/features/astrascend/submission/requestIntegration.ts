import {
    SERVICES,
    type FieldErrors,
    type ServiceRequest,
    type SubmissionReceipt,
} from '../forms/types';

export class SubmissionError extends Error {
    constructor(
        message: string,
        public readonly kind: 'validation' | 'network' | 'unknown' = 'unknown',
        public readonly fieldErrors: FieldErrors = {},
    ) {
        super(message);
        this.name = 'SubmissionError';
    }
}

export function normalizeSubmissionError(error: unknown): SubmissionError {
    if (error instanceof SubmissionError) return error;
    return new SubmissionError(
        'Your request could not be submitted. Please try again.',
    );
}

/**
 * The only submission boundary used by the ASTRAscend UI.
 * Replace this function's internals with the agreed API transport later.
 * Map that API's payload, receipt, auth headers and errors here, preserving
 * ServiceRequest, SubmissionReceipt and SubmissionError for the callers.
 * This demo never sends or stores the submitted personal information.
 */
export async function submitServiceRequest(
    request: ServiceRequest,
): Promise<SubmissionReceipt> {
    if (!SERVICES.includes(request.service) || request.consent !== true) {
        throw new SubmissionError(
            'Check your service selection and consent.',
            'validation',
        );
    }

    await Promise.resolve();

    return {
        mode: 'demo',
        referenceNumber: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        confirmationEmailSent: false,
    };
}
