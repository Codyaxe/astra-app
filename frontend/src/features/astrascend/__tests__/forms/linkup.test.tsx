import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ServiceFields } from '../../ServiceFields';
import { createEmptyDrafts } from '../../RequestState';
import { requestExamples } from '../../requestExamples';
import { linkup } from '../../forms/linkup';

afterEach(cleanup);
describe('LINKUP', () => {
  it('renders all partnership fields and keeps website/document controls as links', () => {
    render(<ServiceFields definition={linkup} draft={createEmptyDrafts().linkup} onChange={vi.fn()} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    expect(screen.getByRole('textbox', { name: 'Organization website or official page' }).getAttribute('type')).toBe('url');
    fireEvent.click(screen.getByRole('combobox', { name: 'What kind of partnership are you proposing?' }));
    expect(screen.getByRole('option', { name: 'App perks' })).toBeDefined();
    expect(screen.queryByLabelText(/upload/i)).toBeNull();
  });
  it('requires the four starred partnership fields and validates supplied URLs', () => {
    expect(Object.keys(linkup.validate(createEmptyDrafts().linkup))).toEqual(['details.partnershipType', 'details.organizationName', 'details.proposal', 'details.contributions']);
    expect(linkup.validate({ ...createEmptyDrafts().linkup, ...requestExamples.linkup.details, proposalLink: 'not-a-link' })).toHaveProperty('details.proposalLink');
  });
  it('keeps the contact affiliation separate from the proposing organization', () => {
    const sample = requestExamples.linkup;
    const contact = { ...sample.requester, organization: 'My college affiliation' };
    const payload = linkup.buildRequest(contact, true, { ...createEmptyDrafts().linkup, ...sample.details });
    expect(payload.requester.organization).toBe('My college affiliation');
    expect(payload.details.organizationName).toBe('Community Learning Network');
    expect(payload.details).toEqual(sample.details);
  });
});
