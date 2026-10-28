import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ContactDraft } from './formModel';
import type { Service, ServiceDrafts, SubmissionReceipt } from './types';

const emptyContact = (): ContactDraft => ({
    fullName: '',
    email: '',
    organization: '',
    type: 'student',
});
export function createEmptyDrafts(): ServiceDrafts {
    return {
        makeform: {
            serviceType: '',
            title: '',
            supportNeeded: '',
            beneficiaries: '',
            preferredTimeline: '',
            resourcesBudget: '',
            materialsOrLinks: '',
        },
        upshift: {
            learningSupportType: '',
            topic: '',
            experienceLevel: '',
            preferredFormat: '',
            goal: '',
            participants: '',
            preferredSchedule: '',
        },
        linkup: {
            partnershipType: '',
            organizationName: '',
            organizationUrl: '',
            proposal: '',
            contributions: '',
            collaborationPeriod: '',
            proposalLink: '',
        },
        reign: {
            intent: '',
            opportunityName: '',
            opportunityUrl: '',
            skills: '',
            eligibility: '',
            assistanceNeeded: '',
            registrationDeadline: '',
            teamStatus: '',
        },
    };
}

interface RequestState {
    contact: ContactDraft;
    setContact: (value: ContactDraft) => void;
    consent: boolean;
    setConsent: (value: boolean) => void;
    drafts: ServiceDrafts;
    updateDetail: (service: Service, field: string, value: string) => void;
    receipt: SubmissionReceipt | null;
    setReceipt: (value: SubmissionReceipt | null) => void;
    reset: () => void;
}

const Context = createContext<RequestState | null>(null);

export function RequestStateProvider({ children }: { children: ReactNode }) {
    const [contact, setContact] = useState(emptyContact);
    const [consent, setConsent] = useState(false);
    const [drafts, setDrafts] = useState(createEmptyDrafts);
    const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
    const updateDetail = (service: Service, field: string, value: string) => {
        setDrafts((previous) => ({
            ...previous,
            [service]: { ...previous[service], [field]: value },
        }));
    };
    const reset = () => {
        setContact(emptyContact());
        setConsent(false);
        setDrafts(createEmptyDrafts());
        setReceipt(null);
    };
    return (
        <Context.Provider
            value={{
                contact,
                setContact,
                consent,
                setConsent,
                drafts,
                updateDetail,
                receipt,
                setReceipt,
                reset,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useRequestState() {
    const state = useContext(Context);
    if (!state)
        throw new Error(
            'ASTRAscend request state requires its feature provider.',
        );
    return state;
}
