import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { DateTime } from 'luxon';

initializeApp();

const VARIANTS = [
  {
    hu: '\u{1F449} H\u00E9! Tegnap kimaradt az app \u{1F60F} N\u00E9zz r\u00E1 ma, ne maradj le!',
    en: "\u{1F449} Hey! You missed the app yesterday \u{1F60F} Check it today so you don't fall behind!",
  },
  {
    hu: '\u{23F3} Egy nap kihagy\u00E1s m\u00E1r sz\u00E1m\u00EDt. Ma visszat\u00E9rsz?',
    en: '\u{23F3} One missed day already matters. Coming back today?',
  },
  {
    hu: '\u{1F4C8} A fejl\u0151d\u00E9sed tegnap meg\u00E1llt. Ind\u00EDtsd \u00FAjra ma!',
    en: '\u{1F4C8} Your progress paused yesterday. Restart today!',
  },
  {
    hu: '\u{1F6A8} Lemaradt\u00E1l tegnap! Ma bep\u00F3tolod?',
    en: '\u{1F6A8} You missed yesterday! Ready to catch up today?',
  },
  {
    hu: '\u{1F440} Tegnap nem l\u00E1ttunk\u2026 ma visszat\u00E9rsz?',
    en: "\u{1F440} We didn't see you yesterday\u2026 coming back today?",
  },
];

export const sendDailyEngagementNudge = onSchedule(
  {
    schedule: 'every 15 minutes',
    region: 'europe-west1',
    timeZone: 'UTC',
  },
  async () => {
    const db = getFirestore();
    const messaging = getMessaging();
    const snap = await db.collection('userEngagement').get();

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      if (!data.nudgeOptIn || !data.fcmToken) continue;

      const tz = typeof data.timeZone === 'string' && data.timeZone ? data.timeZone : 'UTC';
      let now;
      try {
        now = DateTime.now().setZone(tz);
      } catch {
        continue;
      }

      if (now.hour !== 8) continue;

      const todayStr = now.toISODate();
      if (data.lastNudgeLocalDate === todayStr) continue;

      const todayEight = now.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      const cutoff = todayEight.minus({ hours: 24 });

      const lastOpen = data.lastAppOpenAt;
      if (lastOpen) {
        const lastMs = typeof lastOpen.toMillis === 'function' ? lastOpen.toMillis() : 0;
        if (lastMs >= cutoff.toMillis()) continue;
      }

      const locale = data.locale === 'hu' ? 'hu' : 'en';
      const pick = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
      const body = pick[locale];

      try {
        await messaging.send({
          token: data.fcmToken,
          notification: {
            title: 'RUBIK TRAINER',
            body,
          },
        });
        await docSnap.ref.update({
          lastNudgeLocalDate: todayStr,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (e) {
        const code = e?.errorInfo?.code || e?.code;
        console.warn('FCM send failed', docSnap.id, code || e?.message);
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token'
        ) {
          await docSnap.ref.update({
            fcmToken: FieldValue.delete(),
            nudgeOptIn: false,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }
    }
  }
);
