export function sanitizeText(value: string, maxLength = 60): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(value: string, maxLength = 20): string {
  return value.replace(/[^0-9+\s()-]/g, '').trim().slice(0, maxLength);
}