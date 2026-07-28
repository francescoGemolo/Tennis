const MASCULINE_EXCEPTIONS = new Set([
  'andrea', 'luca', 'nicola', 'elia', 'mattia', 'enea', 'geremia', 'isaia', 'tobia', 'boemondo',
]);

const FEMININE_EXCEPTIONS = new Set([
  'alice', 'adele', 'agnese', 'beatrice', 'irene', 'rachele', 'jasmine', 'noemi',
]);

const DIACRITICS_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g');

export function isFeminineName(name: string): boolean {
  const firstWord = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_PATTERN, '')
    .split(/[ -]+/)[0] ?? '';

  if (FEMININE_EXCEPTIONS.has(firstWord)) return true;
  if (MASCULINE_EXCEPTIONS.has(firstWord)) return false;

  return firstWord.endsWith('a');
}