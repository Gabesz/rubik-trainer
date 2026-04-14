/**
 * Global Firestore cache for notation move explanations.
 * Flow: current UI locale → read doc for (version, locale, move). If missing, Groq answers in that language, then we store it.
 * So each token (e.g. U, R', U2) has separate documents for `en` and `hu`, not one shared text.
 */
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const COLLECTION = 'notationMoveAiCache';

/**
 * Bump when `groqExplainMove` system prompt changes so old cache entries are not reused.
 * v2: cache key = locale + move only (one EN + one HU string per notation token, all tiers share).
 */
export const NOTATION_EXPLAIN_PROMPT_VERSION = '2';

function hasFirestoreConfig() {
  return Boolean(import.meta.env?.VITE_FIREBASE_PROJECT_ID?.trim());
}

/** Set `VITE_NOTATION_AI_CACHE=0` until `notationMoveAiCache` rules are deployed (stops RPC + console noise). */
function isNotationAiFirestoreCacheEnabled() {
  const v = String(import.meta.env?.VITE_NOTATION_AI_CACHE ?? '').trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'off') {
    return false;
  }
  return hasFirestoreConfig();
}

function isPermissionDenied(e) {
  const code = e && typeof e === 'object' ? e.code : '';
  const msg = e && typeof e === 'object' && typeof e.message === 'string' ? e.message : '';
  return code === 'permission-denied' || /permission-denied/i.test(msg);
}

export function normalizeNotationToken(move) {
  return String(move ?? '')
    .trim()
    .replace(/\u2032/g, "'")
    .replace(/\s/g, '');
}

/**
 * Stable Firestore document id (URL-safe, no slashes).
 * One document per (promptVersion, language, notation token) — e.g. Hungarian `U` vs English `U` are separate docs.
 */
export function notationExplanationDocId(locale, move) {
  const loc = String(locale || 'en').toLowerCase().split(/[-_]/)[0];
  const m = normalizeNotationToken(move);
  const raw = `${NOTATION_EXPLAIN_PROMPT_VERSION}|${loc}|${m}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @returns {Promise<string | null>}
 */
export async function getCachedNotationExplanation({ locale, move }) {
  if (!isNotationAiFirestoreCacheEnabled()) return null;
  try {
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const id = notationExplanationDocId(locale, move);
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const text = snap.data()?.text;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (e) {
    if (!isPermissionDenied(e)) {
      console.warn('[notationExplainCache] read failed', e);
    }
    return null;
  }
}

/**
 * Save only if missing (global shared cache; first successful writer wins).
 * @param {object} p
 * @param {string} p.text
 */
export async function putCachedNotationExplanation({ locale, move, text }) {
  if (!isNotationAiFirestoreCacheEnabled()) return;
  const trimmed = typeof text === 'string' ? text.trim() : '';
  if (!trimmed || trimmed.length > 2000) return;

  const id = notationExplanationDocId(locale, move);
  const ref = doc(db, COLLECTION, id);
  const payload = {
    text: trimmed,
    move: normalizeNotationToken(move),
    locale: String(locale || 'en').toLowerCase().split(/[-_]/)[0],
    promptVersion: NOTATION_EXPLAIN_PROMPT_VERSION,
    updatedAt: serverTimestamp(),
  };

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (snap.exists()) return;
      transaction.set(ref, payload);
    });
  } catch (e) {
    if (!isPermissionDenied(e)) {
      console.warn('[notationExplainCache] write failed', e);
    }
  }
}
