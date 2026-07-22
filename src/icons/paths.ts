export interface IconDefinition {
  viewBox: string;
  strokeWidth: number;
  paths: string[];
}

export const ICONS: Record<string, IconDefinition> = {
  calendar: {
    viewBox: '0 0 24 24',
    strokeWidth: 1.5,
    paths: [
      'M16 2v4M8 2v4m5-2h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172S21 17.771 21 14v-2c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4M3 10h18',
      'M10 18.5v-4.653c0-.191-.137-.347-.305-.347H9m5 4.998l1.486-4.606a.3.3 0 0 0-.286-.392H13',
    ],
  },
  phone: {
    viewBox: '0 0 24 24',
    strokeWidth: 2,
    paths: [
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
    ],
  },
  mail: {
    viewBox: '0 0 24 24',
    strokeWidth: 2,
    paths: [
      'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      'M2 6l10 7 10-7',
    ],
  },
  arrowLeft: {
    viewBox: '0 0 24 24',
    strokeWidth: 2,
    paths: ['M15 6l-6 6 6 6'],
  },
  arrowRight: {
    viewBox: '0 0 24 24',
    strokeWidth: 2,
    paths: ['M9 6l6 6-6 6'],
  },
};

export type IconName = keyof typeof ICONS;