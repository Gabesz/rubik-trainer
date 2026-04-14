import { ref } from 'vue';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import app, { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { getInitialLocale } from '../i18n';
import {
  DAILY_NUDGE_LS_KEY,
  upsertEngagementSubscription,
  disableEngagementSubscription,
} from '../push/dailyNudgeFirestore';

function getVapidKey() {
  const k = import.meta.env.VITE_FIREBASE_VAPID_KEY?.trim();
  return k || '';
}

function getTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function useDailyNudgePush() {
  const busy = ref(false);
  const error = ref('');
  const subscribed = ref(
    typeof localStorage !== 'undefined' && localStorage.getItem(DAILY_NUDGE_LS_KEY) === '1'
  );

  async function ensureUser() {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  }

  async function subscribe() {
    error.value = '';
    if (!('Notification' in window)) {
      error.value = 'unsupported';
      return false;
    }
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      error.value = 'unsupported';
      return false;
    }
    const vapidKey = getVapidKey();
    if (!vapidKey) {
      error.value = 'no_vapid';
      return false;
    }

    busy.value = true;
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        error.value = 'denied';
        return false;
      }

      await navigator.serviceWorker.ready;
      const reg = await navigator.serviceWorker.getRegistration();
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: reg || undefined,
      });
      if (!token) {
        error.value = 'no_token';
        return false;
      }

      const user = await ensureUser();
      const locRaw = getInitialLocale();
      const loc = locRaw === 'hu' ? 'hu' : 'en';
      await upsertEngagementSubscription(user.uid, {
        fcmToken: token,
        timeZone: getTimeZone(),
        locale: loc,
        nudgeOptIn: true,
        lastAppOpenAt: serverTimestamp(),
      });

      localStorage.setItem(DAILY_NUDGE_LS_KEY, '1');
      subscribed.value = true;

      onMessage(messaging, () => {
        /* foreground: browser shows if payload has notification */
      });

      return true;
    } catch (e) {
      console.warn('Daily nudge subscribe failed', e);
      error.value = 'failed';
      return false;
    } finally {
      busy.value = false;
    }
  }

  async function unsubscribe() {
    error.value = '';
    busy.value = true;
    try {
      const u = auth.currentUser;
      if (u) {
        await disableEngagementSubscription(u.uid);
      }
      localStorage.removeItem(DAILY_NUDGE_LS_KEY);
      subscribed.value = false;
      return true;
    } finally {
      busy.value = false;
    }
  }

  return {
    busy,
    error,
    subscribed,
    subscribe,
    unsubscribe,
  };
}
