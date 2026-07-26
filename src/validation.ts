export function sanitizeText(value: string, maxLength = 60): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(value: string, maxLength = 10): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

const ASCENDING_DIGITS = '0123456789';
const DESCENDING_DIGITS = '9876543210';

function isTrivialSequence(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return true;
  if (digits.length >= 4 && (ASCENDING_DIGITS.includes(digits) || DESCENDING_DIGITS.includes(digits))) return true;
  return false;
}

export function isValidPhone(value: string, maxLength = 10): boolean {
  const digits = sanitizePhone(value, maxLength);
  return digits.length === 10 && !isTrivialSequence(digits);
}

export function isValidName(value: string, maxLength = 40): boolean {
  return sanitizeText(value, maxLength).length >= 2;
}

export function nameError(value: string, maxLength = 40): string | null {
  const clean = sanitizeText(value, maxLength);
  if (clean.length === 0) return 'Campo obbligatorio';
  if (clean.length < 2) return 'Deve contenere almeno 2 caratteri';
  return null;
}

export function phoneError(value: string, maxLength = 10): string | null {
  const digits = sanitizePhone(value, maxLength);
  if (digits.length === 0) return 'Campo obbligatorio';
  if (digits.length < 10) return 'Il numero deve avere 10 cifre';
  if (isTrivialSequence(digits)) return 'Numero non valido';
  return null;
}

export function emailError(value: string): string | null {
  const clean = value.trim();
  if (clean.length === 0) return 'Campo obbligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return 'Email non valida';
  return null;
}

export function passwordError(value: string): string | null {
  if (value.length === 0) return 'Campo obbligatorio';
  return null;
}

export function newPasswordError(value: string): string | null {
  if (value.length === 0) return 'Campo obbligatorio';
  if (value.length < 6) return 'Almeno 6 caratteri';
  return null;
}

export function confirmPasswordError(password: string, confirmPassword: string): string | null {
  if (confirmPassword.length === 0) return 'Campo obbligatorio';
  if (confirmPassword !== password) return 'Le password non coincidono';
  return null;
}

export function capitalizeName(value: string): string {
  return sanitizeText(value)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function messageError(value: string, maxLength = 200): string | null {
  const clean = sanitizeText(value, maxLength);
  if (clean.length === 0) return 'Campo obbligatorio';
  if (clean.length < 2) return 'Messaggio troppo breve';
  return null;
}