import { useId } from 'react';
import { FieldInput } from './FieldInput';
import { requesterOptions, type ContactDraft, type FieldDefinition } from './formModel';
import type { FieldErrors, RequesterType } from './types';
import { contactGrid, disabled as disabledStyle, fieldError, focus, guidance } from './styles';

export const CONSENT_TEXT = 'I agree that ASTRA Developers may use these details to assess and coordinate this request and contact me about it. I understand that submission does not guarantee acceptance.';

const contactFields: readonly (FieldDefinition & { name: keyof ContactDraft })[] = [
  { name: 'fullName', label: 'Full name', required: true, placeholder: 'Your full name' },
  { name: 'email', label: 'Email address', kind: 'email', required: true, placeholder: 'you@example.com' },
  { name: 'organization', label: 'Organization / college', placeholder: 'If applicable' },
  { name: 'type', label: 'I am a…', kind: 'select', required: true, options: requesterOptions },
];

export function ContactFields({ value, onChange, errors = {}, disabled }: {
  value: ContactDraft; onChange: (value: ContactDraft) => void; errors?: FieldErrors; disabled?: boolean;
}) {
  return <div className={contactGrid}>{contactFields.map(field => (
    <FieldInput key={field.name} field={field} value={value[field.name]} disabled={disabled}
      error={errors[`requester.${field.name}`]}
      onChange={next => onChange({ ...value, [field.name]: field.name === 'type' ? next as RequesterType : next })} />
  ))}</div>;
}

export function ConsentField({ checked, onChange, error, disabled }: {
  checked: boolean; onChange: (value: boolean) => void; error?: string; disabled?: boolean;
}) {
  const id = useId();
  return <div>
    <label className="flex items-start gap-3 text-[14px] text-ascend-muted" htmlFor={id}>
      <input className={`mt-px h-[22px] w-[22px] shrink-0 basis-[22px] accent-ascend-blue aria-[invalid=true]:border-ascend-error ${focus} ${disabledStyle}`} id={id} name="consent" type="checkbox" required checked={checked} disabled={disabled}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
        onChange={event => onChange(event.target.checked)} />
      <span>{CONSENT_TEXT} <span aria-hidden="true">*</span></span>
    </label>
    {error && <p className={fieldError} id={`${id}-error`}>{error}</p>}
    <p className={guidance}>Please avoid sharing passwords, private keys, confidential documents, or unnecessary sensitive personal information.</p>
  </div>;
}
