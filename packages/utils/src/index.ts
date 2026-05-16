const DEFAULT_CURRENCY = 'PHP';

export const formatCurrency = (amount: number, currency = DEFAULT_CURRENCY): string =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency }).format(amount);

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

export const formatBillingPeriod = (month: number, year: number): string =>
  new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));

const HOUSE_CODE_LENGTH = 8;
const HOUSE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateHouseCode = (): string =>
  Array.from({ length: HOUSE_CODE_LENGTH }, () => HOUSE_CODE_CHARS[Math.floor(Math.random() * HOUSE_CODE_CHARS.length)]).join('');

export const isOverdue = (dueDate: Date | string): boolean => {
  const due = new Date(dueDate);
  const today = new Date();
  return due.getTime() < today.getTime();
};

export const getDaysUntilDue = (dueDate: Date | string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((due.getTime() - now.getTime()) / msPerDay);
};
