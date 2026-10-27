import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarDays, dateKey, parseDate, shiftDays, shiftMonth, startOfMonth } from './calendarDates';
import { focus, input } from './styles';
import { useFieldPopover, type PickerProps } from './useFieldPopover';

const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
const dayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function DatePicker({ id, name, label, labelId, value, disabled, required, invalid, describedBy, onChange, onBlur }: PickerProps) {
  const popover = useFieldPopover<HTMLInputElement>(disabled, 400, 320);
  const [month, setMonth] = useState(() => startOfMonth(parseDate(value) || new Date()));
  const [cursor, setCursor] = useState(() => dateKey(parseDate(value) || new Date()));
  const focusCalendar = useRef(false);
  const popupId = `${id}-calendar`;
  const today = dateKey(new Date());
  const days = calendarDays(month);
  const open = (moveFocus: boolean) => {
    const initial = parseDate(value) || new Date();
    setMonth(startOfMonth(initial)); setCursor(dateKey(initial)); focusCalendar.current = moveFocus; popover.show();
  };
  useLayoutEffect(() => {
    if (popover.open && popover.position && focusCalendar.current) document.getElementById(`${popupId}-${cursor}`)?.focus();
  }, [popover.open, popover.position, cursor, popupId]);
  useEffect(() => {
    const date = parseDate(value);
    if (popover.open && date && !focusCalendar.current) { setMonth(startOfMonth(date)); setCursor(dateKey(date)); }
  }, [value, popover.open]);
  const select = (next: string) => { onChange(next); popover.close(true); };
  const move = (next: Date, moveFocus: boolean) => {
    if (next.getFullYear() < 0 || next.getFullYear() > 9999) return;
    focusCalendar.current = moveFocus; setCursor(dateKey(next)); setMonth(startOfMonth(next));
  };
  const dayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let next: Date | undefined;
    if (event.key === 'ArrowLeft') next = shiftDays(date, -1);
    else if (event.key === 'ArrowRight') next = shiftDays(date, 1);
    else if (event.key === 'ArrowUp') next = shiftDays(date, -7);
    else if (event.key === 'ArrowDown') next = shiftDays(date, 7);
    else if (event.key === 'Home') next = shiftDays(date, -date.getDay());
    else if (event.key === 'End') next = shiftDays(date, 6 - date.getDay());
    else if (event.key === 'PageUp') next = shiftMonth(date, event.shiftKey ? -12 : -1);
    else if (event.key === 'PageDown') next = shiftMonth(date, event.shiftKey ? 12 : 1);
    if (next) { event.preventDefault(); move(next, true); }
  };
  return <div className="relative" ref={popover.rootRef}>
    <input id={id} name={name} value={value} ref={popover.triggerRef} type="text" maxLength={10} placeholder="YYYY-MM-DD"
      aria-labelledby={labelId} aria-invalid={invalid || undefined} aria-describedby={`${id}-hint${describedBy ? ` ${describedBy}` : ''}`}
      disabled={disabled} required={required} className={`${input} min-h-[50px] pr-14`} onBlur={onBlur}
      onChange={event => { focusCalendar.current = false; onChange(event.target.value); }} onClick={() => { if (!popover.open) open(false); }}
      onKeyDown={event => { if (event.key === 'ArrowDown' && (event.altKey || popover.open)) { event.preventDefault(); open(true); } }} />
    <span id={`${id}-hint`} className="sr-only">Enter a date as YYYY-MM-DD, or open the calendar.</span>
    <button type="button" disabled={disabled} aria-label={`Open calendar for ${label}`} aria-haspopup="dialog" aria-expanded={popover.open}
      aria-controls={popover.open ? popupId : undefined} onClick={() => popover.open ? popover.close(true) : open(true)}
      className={`absolute right-2 top-[25px] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-ascend-muted hover:bg-ascend-selected hover:text-ascend-accent ${focus}`}><CalendarDays size={18} aria-hidden="true" /></button>
    {popover.open && <div id={popupId} ref={popover.popupRef} role="dialog" aria-label={`Choose ${label.toLowerCase()}`} data-placement={popover.position?.placement}
      className="fixed z-30 overflow-y-auto overscroll-contain rounded-2xl border border-ascend-line bg-ascend-panel p-3 text-[14px] text-ascend-ink shadow-xl [scrollbar-color:var(--as-input-border)_var(--as-panel)] [scrollbar-width:thin]"
      style={{ left: popover.position?.left ?? 0, top: popover.position?.top ?? 0, width: popover.position?.width ?? 320, maxHeight: popover.position?.maxHeight ?? 400, visibility: popover.position ? 'visible' : 'hidden' }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" className={`flex h-9 w-9 items-center justify-center rounded-lg hover:bg-ascend-selected ${focus}`}
          onClick={() => move(shiftMonth(parseDate(cursor) || month, -1), false)}><ChevronLeft size={18} aria-hidden="true" /></button>
        <h3 className="font-semibold" aria-live="polite">{monthLabel.format(month)}</h3>
        <button type="button" aria-label="Next month" className={`flex h-9 w-9 items-center justify-center rounded-lg hover:bg-ascend-selected ${focus}`}
          onClick={() => move(shiftMonth(parseDate(cursor) || month, 1), false)}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
      <div role="grid" aria-label={monthLabel.format(month)}>
        <div role="row" className="grid grid-cols-7">{weekdays.map(day => <span key={day} role="columnheader" aria-label={day} className="py-1.5 text-center text-[12px] font-semibold text-ascend-muted">{day.slice(0, 2)}</span>)}</div>
        {Array.from({ length: 6 }, (_, week) => <div role="row" className="grid grid-cols-7" key={week}>{days.slice(week * 7, week * 7 + 7).map(date => {
          const key = dateKey(date), selected = key === value, inMonth = date.getMonth() === month.getMonth();
          return <div role="gridcell" aria-selected={selected} key={key}>
            <button type="button" id={`${popupId}-${key}`} aria-label={dayLabel.format(date)} aria-current={key === today ? 'date' : undefined}
              disabled={date.getFullYear() < 0 || date.getFullYear() > 9999} tabIndex={key === cursor ? 0 : -1}
              className={`h-9 w-full rounded-lg text-center ${selected ? 'bg-ascend-blue font-semibold text-white' : `${inMonth ? 'text-ascend-ink' : 'text-ascend-muted'} hover:bg-ascend-selected`} ${key === today && !selected ? 'ring-1 ring-inset ring-ascend-accent' : ''} ${focus}`}
              onKeyDown={event => dayKeyDown(event, date)} onClick={() => select(key)}>{date.getDate()}</button>
          </div>;
        })}</div>)}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-ascend-line pt-2">
        <button type="button" onClick={() => select(today)} className={`min-h-9 rounded-lg px-3 font-semibold text-ascend-accent hover:bg-ascend-selected ${focus}`}>Today</button>
        {!required && value && <button type="button" onClick={() => select('')} className={`min-h-9 rounded-lg px-3 text-ascend-muted hover:bg-ascend-selected ${focus}`}>Clear date</button>}
      </div>
    </div>}
  </div>;
}
