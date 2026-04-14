import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const DAILY_NUDGE_LS_KEY = 'rt-daily-nudge-subscribed';

export function engagementDocRef(uid) {
  return doc(db, 'userEngagement', uid);
}

export async function upsertEngagementSubscription(uid, data) {
  await setDoc(
    engagementDocRef(uid),
    {
      ...data,
      fcmTokenUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateEngagementFields(uid, data) {
  await updateDoc(engagementDocRef(uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function recordAppOpen(uid) {
  await updateDoc(engagementDocRef(uid), {
    lastAppOpenAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function disableEngagementSubscription(uid) {
  await setDoc(
    engagementDocRef(uid),
    {
      nudgeOptIn: false,
      fcmToken: null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function clearEngagementOnSignOut() {
  try {
    localStorage.removeItem(DAILY_NUDGE_LS_KEY);
  } catch {
    /* ignore */
  }
  const u = auth.currentUser;
  if (!u) return;
  await disableEngagementSubscription(u.uid);
}
