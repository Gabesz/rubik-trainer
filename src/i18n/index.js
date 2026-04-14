import { createI18n } from 'vue-i18n';
import en from '../locales/en.js';
import hu from '../locales/hu.js';

export const LOCALE_STORAGE_KEY = 'rt-locale';

export function detectBrowserLocale() {
  if (typeof navigator === 'undefined') return 'en';
  const list =
    navigator.languages?.length > 0 ? [...navigator.languages] : [navigator.language || 'en'];
  for (const raw of list) {
    const base = String(raw).split('-')[0].toLowerCase();
    if (base === 'hu') return 'hu';
  }
  return 'en';
}

export function getInitialLocale() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'hu') return saved;
  } catch (_) {
    /* ignore */
  }
  return detectBrowserLocale();
}

export function syncHtmlLang(code) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code === 'hu' ? 'hu' : 'en';
}

const initialLocale = getInitialLocale();
syncHtmlLang(initialLocale);

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, hu },
});

export default i18n;
