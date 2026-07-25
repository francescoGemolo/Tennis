import { PRICE_PER_HOUR } from './config';
import type { DurationHours } from './types';

const priceFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

export function bookingPrice(durationHours: DurationHours): number {
  return durationHours * PRICE_PER_HOUR;
}

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}