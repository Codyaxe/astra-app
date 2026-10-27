import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import type { Option } from './formModel';
import { focus, input } from './styles';
import { useFieldPopover, type PickerProps } from './useFieldPopover';

export function SelectField({
    id,
    name,
    label,
    labelId,
    value,
    options,
    placeholder = 'Choose an option',
    disabled,
    required,
    invalid,
    describedBy,
    onChange,
    onBlur,
}: PickerProps & { options: readonly Option[]; placeholder?: string }) {
    const popover = useFieldPopover<HTMLButtonElement>(disabled, 320);
    const [active, setActive] = useState(0);
    const search = useRef({ value: '', time: 0 });
    const listId = `${id}-options`;
    const selected = options.findIndex((option) => option.value === value);
    const open = () => {
        setActive(Math.max(0, selected));
        popover.show();
    };
    const choose = (index: number) => {
        if (!options[index]) return;
        onChange(options[index].value);
        popover.close(true);
    };
    useEffect(() => {
        if (popover.open)
            document
                .getElementById(`${listId}-${active}`)
                ?.scrollIntoView?.({ block: 'nearest' });
    }, [popover.open, active, listId]);
    const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            if (!popover.open) open();
            setActive((previous) =>
                event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? options.length - 1
                      : !popover.open
                        ? selected >= 0
                            ? selected
                            : event.key === 'ArrowUp'
                              ? options.length - 1
                              : 0
                        : Math.max(
                              0,
                              Math.min(
                                  options.length - 1,
                                  previous +
                                      (event.key === 'ArrowDown' ? 1 : -1),
                              ),
                          ),
            );
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (popover.open) choose(active);
            else open();
        } else if (event.key === 'Tab') popover.close();
        else if (
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
        ) {
            const now = Date.now();
            const query =
                now - search.current.time < 700
                    ? search.current.value + event.key.toLowerCase()
                    : event.key.toLowerCase();
            search.current = { value: query, time: now };
            const index = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(query),
            );
            if (index >= 0) {
                event.preventDefault();
                if (!popover.open) popover.show();
                setActive(index);
            }
        }
    };
    return (
        <div className="relative" ref={popover.rootRef}>
            <input
                type="hidden"
                name={name}
                value={value}
                disabled={disabled}
            />
            <button
                type="button"
                id={id}
                ref={popover.triggerRef}
                role="combobox"
                aria-labelledby={labelId}
                aria-expanded={popover.open}
                aria-haspopup="listbox"
                aria-controls={popover.open ? listId : undefined}
                aria-activedescendant={
                    popover.open ? `${listId}-${active}` : undefined
                }
                aria-required={required}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                disabled={disabled}
                className={`${input} relative min-h-[50px] cursor-pointer text-left ${value && !required ? 'pr-[84px]' : 'pr-12'}`}
                onBlur={onBlur}
                onClick={() => (popover.open ? popover.close() : open())}
                onKeyDown={keyDown}
            >
                <span
                    className={`block truncate ${selected < 0 ? 'text-ascend-muted' : ''}`}
                >
                    {selected < 0 ? placeholder : options[selected].label}
                </span>
                <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${popover.open ? 'rotate-180' : ''}`}
                />
            </button>
            {value && !required && (
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Clear ${label}`}
                    onClick={() => {
                        onChange('');
                        popover.close(true);
                    }}
                    className={`absolute right-10 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ascend-muted hover:bg-ascend-selected hover:text-ascend-ink ${focus}`}
                >
                    <X size={16} aria-hidden="true" />
                </button>
            )}
            {popover.open && (
                <div
                    id={listId}
                    ref={popover.popupRef}
                    role="listbox"
                    aria-labelledby={labelId}
                    data-placement={popover.position?.placement}
                    className="fixed z-30 overflow-y-auto overscroll-contain rounded-xl border border-ascend-line bg-ascend-panel p-1.5 text-[16px] text-ascend-ink shadow-xl [scrollbar-color:var(--as-input-border)_var(--as-panel)] [scrollbar-width:thin]"
                    style={{
                        left: popover.position?.left ?? 0,
                        top: popover.position?.top ?? 0,
                        width: popover.position?.width ?? 0,
                        maxHeight: popover.position?.maxHeight ?? 320,
                        visibility: popover.position ? 'visible' : 'hidden',
                    }}
                >
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            id={`${listId}-${index}`}
                            role="option"
                            aria-selected={value === option.value}
                            className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${active === index ? 'bg-ascend-selected' : ''} ${value === option.value ? 'font-semibold text-ascend-accent' : ''}`}
                            onPointerMove={() => setActive(index)}
                            onPointerDown={(event) => event.preventDefault()}
                            onClick={() => choose(index)}
                        >
                            <span>{option.label}</span>
                            {value === option.value && (
                                <Check
                                    size={18}
                                    className="shrink-0"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
