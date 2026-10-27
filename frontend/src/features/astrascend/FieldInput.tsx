import { useId } from 'react';
import type { FieldDefinition } from './formModel';
import { fieldError, input } from './styles';

interface Props {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function FieldInput({ field, value, onChange, error, disabled }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const common = {
    id, name: field.name, value, disabled, required: field.required,
    'aria-invalid': error ? true as const : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value),
  };
  return (
    <div className={`min-w-0${field.fullWidth ? ' col-span-full' : ''}`}>
      <label className="mb-2 block text-[14px] font-semibold" htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
      {field.kind === 'select' ? (
        <select {...common} className={`${input} min-h-[50px] cursor-pointer pr-2`}>
          <option value="">{field.placeholder || 'Choose an option'}</option>
          {field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : field.kind === 'textarea' ? (
        <textarea {...common} className={`${input} min-h-[74px] resize-y`} placeholder={field.placeholder} rows={3} />
      ) : (
        <input {...common} className={`${input} min-h-[50px]`} type={field.kind || 'text'} placeholder={field.placeholder}
          autoComplete={field.kind === 'email' ? 'email' : field.name === 'fullName' ? 'name' : undefined} />
      )}
      {error && <p className={fieldError} id={errorId}>{error}</p>}
    </div>
  );
}
