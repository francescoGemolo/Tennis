import { sanitizePhone, sanitizeText } from './sanitize';

const ASCENDING_DIGITS = '0123456789';
const DESCENDING_DIGITS = '9876543210';

function isTrivialSequence(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return true;
  if (digits.length >= 4 && (ASCENDING_DIGITS.includes(digits) || DESCENDING_DIGITS.includes(digits))) return true;
  return false;
}

export function isValidPhone(value: string, maxLength = 20): boolean {
  const clean = sanitizePhone(value, maxLength);
  const digits = clean.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return false;
  if (!/^\+?[0-9\s()-]+$/.test(clean)) return false;
  if (isTrivialSequence(digits)) return false;
  return true;
}

export function isValidName(value: string, maxLength = 40): boolean {
  return sanitizeText(value, maxLength).length >= 2;
}