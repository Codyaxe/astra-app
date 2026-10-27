import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ServiceFields } from '../ServiceFields';
import { createEmptyDrafts } from '../RequestState';
import { requestExamples } from '../requestExamples';
import { reign } from './reign';

afterEach(cleanup);
describe('REIGN', () => {
  const sample = requestExamples.reign;
  const contact = { ...sample.requester, organization: '' };
  const draft = { ...createEmptyDrafts().reign, ...sample.details };

  it('shows only the intent until a request type is selected', () => {
    const initial = createEmptyDrafts().reign;
    render(<ServiceFields definition={reign} draft={initial} onChange={vi.fn()} />);
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
    expect(screen.getByRole('combobox', { name: 'What would you like to do?' })).toBeDefined();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(reign.visibleFields(initial).map(field => field.name)).toEqual(['intent']);
  });

  it('shows only the agreed fields for competition search', () => {
    render(<ServiceFields definition={reign} draft={{ ...draft, intent: 'find_competition' }} onChange={vi.fn()} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.queryByRole('textbox', { name: 'Opportunity or competition name' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Team status' })).toBeNull();
  });

  it.each(['find_teammates', 'participation_support'])('preserves every field for %s', intent => {
    expect(reign.visibleFields({ ...draft, intent })).toHaveLength(8);
  });

  it('excludes hidden values from payloads without modifying the draft', () => {
    const searchDraft = { ...draft, intent: 'find_competition' };
    const payload = reign.buildRequest(contact, true, searchDraft);
    expect(payload.details).toEqual({ intent: 'find_competition', skills: sample.details.skills, eligibility: sample.details.eligibility, assistanceNeeded: 'find_teammates' });
    expect(searchDraft.opportunityName).toBe(sample.details.opportunityName);
    const share = reign.buildRequest(contact, true, { ...draft, intent: 'share_opportunity' });
    expect(share.details).not.toHaveProperty('teamStatus');
    expect(share.details.opportunityName).toBe(sample.details.opportunityName);
  });

  it('requires intent and checks real dates and URLs only when relevant and supplied', () => {
    expect(Object.keys(reign.validate(createEmptyDrafts().reign))).toEqual(['details.intent']);
    expect(reign.validate({ ...draft, registrationDeadline: '2027-02-30' })).toHaveProperty('details.registrationDeadline');
    expect(reign.validate({ ...draft, opportunityUrl: 'javascript:alert(1)' })).toHaveProperty('details.opportunityUrl');
    expect(reign.validate({ ...draft, intent: 'find_competition', opportunityUrl: 'invalid hidden value' })).toEqual({});
    expect(reign.buildRequest(contact, true, draft)).toEqual(sample);
  });
});
