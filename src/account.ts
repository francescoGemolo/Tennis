import type { Account } from './types';

export const PLACEHOLDER_ACCOUNT: Account = {
  firstName: 'Francesco',
  lastName: 'Moramarco',
  phone: '377 346 3837',
  memberSince: '2026',
  bookings: [
    { id: '1', date: '2026-08-02', time: '18:00', durationHours: 2 },
    { id: '2', date: '2026-07-28', time: '09:00', durationHours: 1 },
    { id: '3', date: '2026-07-14', time: '20:00', durationHours: 1 },
  ],
};