import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { capitalizeName } from '../validation';
import type { UserProfile } from '../types';

export const USERS_COLLECTION = 'users';

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
  await setDoc(doc(db, USERS_COLLECTION, uid), profile);
}