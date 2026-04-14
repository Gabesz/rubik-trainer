import { auth } from '../config/firebase';
import { DAILY_NUDGE_LS_KEY, updateEngagementFields } from './dailyNudgeFirestore';

function getTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function syncEngagementLocaleIfSubscribed(localeCode) {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(DAILY_NUDGE_LS_KEY) !== '1') return;
  const u = auth.currentUser;
  if (!u) return;
  const loc = localeCode === 'hu' ? 'hu' : 'en';
  updateEngagementFields(u.uid, { locale: loc, timeZone: getTimeZone() }).catch(() => {});
}
