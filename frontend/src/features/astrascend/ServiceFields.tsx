import { FieldInput } from './FieldInput';
import type { ServiceDefinition } from './formModel';
import type { DetailsDraft, FieldErrors, Service } from './types';

export function ServiceFields<S extends Service>({ definition, draft, onChange, errors = {}, disabled }: {
  definition: ServiceDefinition<S>; draft: DetailsDraft<S>;
  onChange: (field: string, value: string) => void; errors?: FieldErrors; disabled?: boolean;
}) {
  return <>
    <div className="as-details-grid">{definition.visibleFields(draft).map(field => (
      <FieldInput key={field.name} field={field} value={String((draft as Record<string, string>)[field.name] ?? '')}
        onChange={value => onChange(field.name, value)} error={errors[`details.${field.name}`]} disabled={disabled} />
    ))}</div>
    {definition.service === 'upshift' && <p className="as-guidance">Learn &amp; Launch is intended mainly for ASTRA members; non-members may be referred.</p>}
    {definition.service === 'reign' && <p className="as-guidance" aria-live="polite">Fields adapt to your first answer, so you only see questions that apply.</p>}
  </>;
}
