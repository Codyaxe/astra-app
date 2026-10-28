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

const API_URL = (
    import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
).replace(/\/$/, '');

interface BackendIssue {
    path?: (string | number)[];
    message?: string;
}

function issuesToFieldErrors(issues: unknown): FieldErrors {
    const errors: FieldErrors = {};
    if (!Array.isArray(issues)) return errors;
    for (const issue of issues as BackendIssue[]) {
        const key = issue.path?.[issue.path.length - 1];
        if (key !== undefined && !(String(key) in errors)) {
            errors[String(key)] = issue.message ?? 'Invalid value';
        }
    }
    return errors;
}

/**
 * The only submission boundary used by the ASTRAscend UI.
 * Sends the request to POST {VITE_API_URL}/astrascend/requests.
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

    let response: Response;
    try {
        response = await fetch(`${API_URL}/astrascend/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
    } catch {
        throw new SubmissionError(
            'Could not reach the server. Check your connection and try again.',
            'network',
        );
    }

    if (response.status === 400) {
        const body = await response.json().catch(() => ({}));
        throw new SubmissionError(
            'Please check the highlighted fields.',
            'validation',
            issuesToFieldErrors((body as { issues?: unknown }).issues),
        );
    }

    if (!response.ok) {
        throw new SubmissionError(
            'Your request could not be submitted. Please try again.',
            'unknown',
        );
    }

    const data = (await response.json()) as { referenceNumber: string };

    return {
        mode: 'live',
        referenceNumber: data.referenceNumber,
        submittedAt: new Date().toISOString(),
        confirmationEmailSent: false,
    };
}