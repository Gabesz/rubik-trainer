import { groqConfig } from '../config/groq.js';
import { getCachedNotationExplanation, putCachedNotationExplanation } from './notationExplainCache.js';

const DEFAULT_MODEL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_MODEL) || 'llama-3.1-8b-instant';

/**
 * @param {object} opts
 * @param {string} opts.move - Last move token (e.g. R')
 * @param {string} opts.historySummary - Short recent history for context
 * @param {string} opts.tier - beginner | intermediate | advanced
 * @param {string} opts.locale - BCP-47 or short code (en, hu)
 * @returns {Promise<string | null>} Assistant text, or null if skipped / error
 */
export async function explainMoveWithGroq({ move, historySummary, tier, locale }) {
  const cached = await getCachedNotationExplanation({ locale, move });
  if (cached) return cached;

  const key = groqConfig.apiKey?.trim();
  if (!key) return null;

  const isHu = String(locale || 'en').toLowerCase().startsWith('hu');
  const lang = isHu ? 'Hungarian' : 'English';

  /** WCA: direction is defined from outside, looking at that face toward the cube center — not from the app camera. */
  const wcaFaceMap = [
    'Face letters (never mix these up): U = Up (top); D = Down (BOTTOM layer, opposite U) — NOT «back»; F = Front; B = Back (rear face, opposite F); L = Left; R = Right.',
    'D vs B in Hungarian: D means Down = ALSÓ lap / alsó réteg (alul). B means Back = HÁTSÓ lap (hátul). Never call D «hátsó» or «hátsó réteg». Never describe D2 as turning toward the back face — D2 only turns the bottom/down layer 180°.',
    'Critical for Hungarian output: B means hátsó — it is NOT «bal» (left). L is always bal oldali. Never call B «bal».',
    'Moves with suffix 2: half turn (180°) of that same face/layer, using the same face letter (e.g. D2 = 180° of the D/down layer, viewed from below).',
  ].join(' ');

  const wcaDirection = [
    'WCA direction (you MUST follow this; many models get this wrong):',
    wcaFaceMap,
    'For a bare letter U D F B L R (no prime, not a 2-move): one quarter turn CLOCKWISE when you look straight at that outside face, from outside the cube toward the center of that face.',
    "A trailing apostrophe ' means the same face, one quarter turn COUNTER-CLOCKWISE from that same viewpoint.",
    'A trailing 2 means a half turn (180°).',
    'Do NOT use the on-screen 3D view or a global "top of the screen" to guess clockwise; only the viewpoint above.',
    'Examples: D2 rotates the bottom (down) layer 180° as seen from below; B2 rotates the back layer 180° as seen from behind; R is clockwise on the right face as seen from the right; U is clockwise on top as seen from above; F is clockwise on the front as seen from the front.',
  ].join(' ');

  const baseRules = [
    'You help someone learn Rubik\'s cube WCA face-turn notation.',
    wcaDirection,
    'Explain ONLY what the last move means (which layer or face, which direction).',
    'Do NOT solve the cube. Do NOT give a full algorithm or sequence to solve anything.',
    `Reply in ${lang}.`,
  ];

  const lengthRule = isHu
    ? 'Use exactly ONE or TWO short sentences. Do not repeat the same idea in different words.'
    : 'Keep the answer to 1–3 short sentences.';

  const huStyle = isHu
    ? [
        'Hungarian style: write natural, idiomatic Hungarian (not word-for-word English).',
        'Avoid redundant phrasing like «felső (felső)» or saying «mozgalom»; prefer «mozdulat» or rephrase.',
        'Name faces correctly: D → «alsó (D) réteg» or «D lap alul», never «hátsó». B → «hátsó (B)». L → «bal (L)». R → «jobb (R)». U → «felső (U)». F → «elülső (F)».',
        'Avoid odd wording like «lemez» or «legerősen hátsó»; use «réteg» / «lap» and the correct face (D = alul, B = hátul).',
        "State direction using the WCA rule above (e.g. R = óramutató járásával megegyező, a jobb lap felől nézve; R' = ellentétes irány, ugyaninnen nézve).",
        'Do not give three versions of the same explanation; one clear wording is enough.',
      ].join(' ')
    : '';

  const system = [...baseRules, lengthRule, huStyle].filter(Boolean).join(' ');

  const user = [
    `Move: ${move}`,
    `Recent history (newest last): ${historySummary || '(none)'}`,
    `Lesson tier: ${tier} notation training.`,
  ].join('\n');

  const res = await fetch(groqConfig.chatCompletionsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: isHu ? 0.25 : 0.4,
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let detail = errText;
    try {
      const j = JSON.parse(errText);
      detail = j?.error?.message || j?.message || errText;
    } catch {
      /* plain text body */
    }
    const err = new Error(typeof detail === 'string' && detail.trim() ? detail.trim() : `HTTP ${res.status}`);
    err.status = res.status;
    err.body = errText;
    throw err;
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  const trimmed = typeof text === 'string' && text.trim() ? text.trim() : null;
  if (trimmed) {
    await putCachedNotationExplanation({ locale, move, text: trimmed });
  }
  return trimmed;
}

/**
 * Map Groq/fetch errors to localized UI strings (no secrets).
 * @param {unknown} err
 * @param {(key: string) => string} t - vue-i18n `t`
 */
export function userFacingGroqError(err, t) {
  const status = typeof err?.status === 'number' ? err.status : undefined;
  const msg = `${err?.message ?? ''} ${err?.body ?? ''}`.toLowerCase();

  if (err?.name === 'TypeError' && /fetch|network|failed to fetch/i.test(String(err?.message))) {
    return t('notationCourse.aiErrorNetwork');
  }
  if (status === 401) {
    return t('notationCourse.aiErrorUnauthorized');
  }
  if (status === 403) {
    return t('notationCourse.aiErrorForbidden');
  }
  if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
    return t('notationCourse.aiErrorRateLimit');
  }
  if (
    status === 402 ||
    msg.includes('quota') ||
    msg.includes('insufficient') ||
    msg.includes('billing') ||
    msg.includes('exceeded')
  ) {
    return t('notationCourse.aiErrorQuota');
  }
  if (status === 503 || status === 529 || msg.includes('overloaded') || msg.includes('unavailable')) {
    return t('notationCourse.aiErrorOverloaded');
  }

  return t('notationCourse.aiError');
}
