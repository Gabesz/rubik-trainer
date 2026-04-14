import { auth } from '../config/firebase';
import { DAILY_NUDGE_LS_KEY, recordAppOpen } from './dailyNudgeFirestore';

let lastMs = 0;
const MIN_INTERVAL_MS = 60_000;

export function pulseAppOpenSession() {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(DAILY_NUDGE_LS_KEY) !== '1') return;
  const u = auth.currentUser;
  if (!u) return;
  const now = Date.now();
  if (now - lastMs < MIN_INTERVAL_MS) return;
  lastMs = now;
  recordAppOpen(u.uid).catch(() => {});
}
