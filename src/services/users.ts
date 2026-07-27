import { doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { capitalizeName } from '../validation';
import type { UserProfile } from '../types';

export const USERS_COLLECTION = 'users';
export const PHONE_NUMBERS_COLLECTION = 'phoneNumbers';

export async function createUserProfile(
  uid: string,
  data: { firstName: string; lastName: string; phone: string; email: string },
): Promise<void> {
  const profile: UserProfile = {
    firstName: capitalizeName(data.firstName),
    lastName: capitalizeName(data.lastName),
    phone: data.phone,
    email: data.email,
    createdAt: new Date().toISOString(),
  };

  // Riserva il numero in un documento a parte (ID = numero) così Firestore
  // rifiuta la scrittura se è già associato a un altro account: le regole
  // permettono solo "create", non "update", su questa collezione.
  const batch = writeBatch(db);
  batch.set(doc(db, USERS_COLLECTION, uid), profile);
  batch.set(doc(db, PHONE_NUMBERS_COLLECTION, data.phone), { uid });
  await batch.commit();
}