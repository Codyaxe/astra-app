import { isValidDate } from './fieldValidation';

export const dateKey = (date: Date) => `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const parseDate = (value: string) => isValidDate(value) ? new Date(`${value}T12:00:00`) : null;
export const startOfMonth = (date: Date) => { const next = new Date(date); next.setDate(1); return next; };
export function shiftDays(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
export function shiftMonth(date: Date, amount: number) {
  const next = startOfMonth(date);
  next.setMonth(next.getMonth() + amount);
  const last = new Date(next); last.setMonth(last.getMonth() + 1); last.setDate(0);
  next.setDate(Math.min(date.getDate(), last.getDate()));
  return next;
}
export function calendarDays(month: Date) {
  const first = startOfMonth(month);
  const start = shiftDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => shiftDays(start, index));
}
