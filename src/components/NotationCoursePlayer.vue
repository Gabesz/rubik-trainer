<template>
  <div class="notation-course-player" :class="{ 'notation-course-player--dark': isDark }">
    <template v-if="showPlayerShell">
    <p v-if="isWarmup" class="text-muted mb-3">{{ $t(`notationCourse.lead.${tier}`) }}</p>

    <header class="mb-3">
      <p class="h5 mb-2 text-center text-lg-start">
        {{ isWarmup ? $t('notationCourse.taskWarmup') : $t('notationCourse.quizHeading') }}
      </p>
      <div
        class="d-flex flex-wrap align-items-center justify-content-between gap-2 gap-lg-3 notation-course-player__progress-row"
      >
        <p class="small text-muted mb-0">
          {{ headerProgressText }}
        </p>
        <button
          v-if="isWarmup"
          type="button"
          class="btn d-inline-flex align-items-center gap-2 fw-semibold notation-course-player__reset-btn"
          :class="buttonClass"
          @click="resetChallenge(true)"
        >
          <svg
            class="notation-course-player__reset-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
            />
          </svg>
          {{ $t('notationCourse.resetBtn') }}
        </button>
      </div>
    </header>

    <div class="row g-3 g-lg-4 align-items-start notation-course-player__layout">
      <div class="col-12 col-lg-5 notation-course-player__col-cube">
        <div
          class="notation-course-player__cube-wrap rounded border position-relative mb-3 mb-lg-0"
          :class="isDark ? 'border-secondary' : ''"
        >
          <RubikCube3D
            ref="cubeRef"
            :key="cubeKey"
            :algorithm="appliedAlg"
            :show-move-list="tier === 'advanced' && isWarmup"
            :auto-stick-to-setup-end="false"
            :sync-timeline-on-algorithm-prop="false"
            :prepend-neutral-algorithm-prefix="true"
            :interactive="showPlayerShell && !cubeAnimating && !isQuizPlay"
            :show-control-panel="false"
            :camera-latitude="30"
            experimental-stickering=""
          />
        </div>

        <div
          v-if="failureMessage"
          class="alert alert-warning py-2 mb-0"
          role="alert"
        >
          {{ failureMessage }}
        </div>
      </div>

      <div class="col-12 col-lg-7 notation-course-player__col-side">
        <div class="notation-course-player__controls mb-3">
          <div v-if="tier === 'beginner'" class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
          <button
            v-for="mv in faceBaseMoves"
            :key="'b-' + mv"
            type="button"
            class="btn btn-lg"
            :class="[buttonClass, { 'notation-course-player__move-btn--tried': isWarmup && isMoveTriedOnGrid(mv) }]"
            :title="isWarmup && isMoveTriedOnGrid(mv) ? t('notationCourse.moveTriedTitle') : undefined"
            :disabled="moveButtonsDisabled"
            @click="onPickMove(mv)"
          >
            {{ mv }}
          </button>
          </div>

          <div v-else-if="tier === 'intermediate'" class="d-flex flex-column gap-2 align-items-center align-items-lg-start">
          <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
            <button
              v-for="mv in intermediatePrimeRow"
              :key="'ip-' + mv"
              type="button"
              class="btn"
              :class="[buttonClass, { 'notation-course-player__move-btn--tried': isWarmup && isMoveTriedOnGrid(mv) }]"
              :title="isWarmup && isMoveTriedOnGrid(mv) ? t('notationCourse.moveTriedTitle') : undefined"
              :disabled="moveButtonsDisabled"
              @click="onPickMove(mv)"
            >
              {{ mv }}
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
            <button
              v-for="mv in intermediateDoubleRow"
              :key="'i2-' + mv"
              type="button"
              class="btn"
              :class="[buttonClass, { 'notation-course-player__move-btn--tried': isWarmup && isMoveTriedOnGrid(mv) }]"
              :title="isWarmup && isMoveTriedOnGrid(mv) ? t('notationCourse.moveTriedTitle') : undefined"
              :disabled="moveButtonsDisabled"
              @click="onPickMove(mv)"
            >
              {{ mv }}
            </button>
          </div>
          </div>

          <div v-else class="advanced-controls">
          <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start mb-2">
            <button
              v-for="mv in NOTATION_FULL_FACE_MOVES"
              :key="'a-' + mv"
              type="button"
              class="btn btn-sm"
              :class="[buttonClass, { 'notation-course-player__move-btn--tried': isWarmup && isMoveTriedOnGrid(mv) }]"
              :title="isWarmup && isMoveTriedOnGrid(mv) ? t('notationCourse.moveTriedTitle') : undefined"
              :disabled="moveButtonsDisabled"
              @click="onPickMove(mv)"
            >
              {{ mv }}
            </button>
          </div>
          <div class="input-group input-group-sm mb-2">
            <input
              v-model="notationInput"
              type="text"
              class="form-control font-monospace"
              :placeholder="$t('notationCourse.inputPlaceholder')"
              autocomplete="off"
              :disabled="!isWarmup || cubeAnimating"
              @keydown.enter.prevent="onApplyNotationInput"
            />
            <button
              type="button"
              class="btn btn-outline-primary"
              :disabled="!isWarmup || cubeAnimating"
              @click="onApplyNotationInput"
            >
              {{ $t('notationCourse.applyInputBtn') }}
            </button>
          </div>
          <p v-if="isWarmup" class="small text-muted text-center text-lg-start mb-2">{{ $t('notationCourse.inputHint') }}</p>
          <div v-if="isWarmup && historyTokens.length" class="notation-course-player__history">
            <p class="small fw-semibold mb-1">{{ $t('notationCourse.moveHistory') }}</p>
            <div class="d-flex flex-wrap gap-1">
              <span
                v-for="(tok, i) in historyTokens"
                :key="'h-' + i + '-' + tok"
                class="badge font-monospace"
                :class="isDark ? 'text-bg-secondary' : 'text-bg-light border'"
              >
                {{ tok }}
              </span>
            </div>
          </div>
          </div>
        </div>

        <div
          v-if="isWarmup"
          class="card border mb-3"
          :class="isDark ? 'bg-dark border-secondary' : ''"
        >
          <div class="card-body">
            <h3 class="h6 card-title">{{ $t('notationCourse.eventTitle') }}</h3>
            <p v-if="aiLoading" class="small text-muted mb-0">{{ $t('notationCourse.aiLoading') }}</p>
            <p v-else-if="aiError" class="small text-danger mb-0">{{ aiError }}</p>
            <p v-else-if="aiText" class="small mb-0">{{ aiText }}</p>
            <p v-else-if="!hasGroqKey" class="small text-muted mb-0">{{ $t('notationCourse.aiNoKey') }}</p>
            <p v-else class="small text-muted mb-0">{{ $t('notationCourse.aiEmpty') }}</p>
          </div>
        </div>

        <div
          v-else
          class="card border mb-3 notation-course-player__quiz-result-card"
          :class="isDark ? 'bg-dark border-secondary' : ''"
        >
          <div class="card-body" role="status" aria-live="polite">
            <h3 class="h6 card-title">{{ $t('notationCourse.quizResultTitle') }}</h3>
            <div v-if="isQuizPlay" class="notation-course-player__quiz-play-feedback">
              <Transition name="notation-quiz-praise">
                <div
                  v-if="quizPraiseMessage"
                  class="notation-course-player__quiz-praise"
                  role="status"
                >
                  <span class="notation-course-player__quiz-praise-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path
                        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
                      />
                    </svg>
                  </span>
                  <span class="notation-course-player__quiz-praise-text">{{ quizPraiseMessage }}</span>
                </div>
              </Transition>
              <p class="small mb-0 notation-course-player__quiz-demo-hint">
                {{ $t('notationCourse.quizWatchDemo') }}
              </p>
            </div>
            <template v-else>
              <p v-if="quizFeedback" class="small mb-3">{{ quizFeedback }}</p>
              <p v-else class="small mb-3">{{ $t('notationCourse.quizLobbyIntro') }}</p>
              <button
                type="button"
                class="btn btn-lg w-100 w-lg-auto notation-course-player__quiz-start"
                :class="isDark ? 'btn-light' : 'btn-primary'"
                :disabled="cubeAnimating"
                @click="onQuizStart"
              >
                {{ $t('notationCourse.quizStartBtn') }}
              </button>
            </template>
          </div>
        </div>

        <div
          v-if="tier === 'advanced' && isWarmup && historyTokens.length > 0"
          class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start"
        >
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            :disabled="moveButtonsDisabled"
            @click="undoLast"
          >
            {{ $t('notationCourse.undoBtn') }}
          </button>
        </div>
      </div>
    </div>
    </template>

    <div
      v-if="showSuccessUI"
      class="alert alert-success py-3 mb-0"
      role="status"
      aria-live="polite"
    >
      <p class="mb-2">{{ $t('notationCourse.tierDone') }}</p>
      <div class="d-flex flex-wrap gap-2">
        <router-link v-if="nextModulePath" :to="nextModulePath" class="btn btn-success btn-sm">
          {{ $t('notationCourse.nextNotation') }}
        </router-link>
        <router-link to="/course/beginner-cfop" class="btn btn-outline-secondary btn-sm">
          {{ $t('notationCourse.backToCourse') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import RubikCube3D from './RubikCube3D.vue';
import { useTheme } from '../composables/useTheme';
import {
  NOTATION_FACE_BASE,
  NOTATION_INTERMEDIATE_MODULE_ID,
  NOTATION_ADVANCED_MODULE_ID,
  NOTATION_INTERMEDIATE_GRID_MOVES,
  NOTATION_FULL_FACE_MOVES,
} from '../data/courses/notationMissions.js';
import { useNotationCourseProgress } from '../composables/useNotationCourseProgress.js';
import { explainMoveWithGroq, userFacingGroqError } from '../api/groqExplainMove.js';
import { parseMove, moveQuantumCount, quantumDurationUnits } from '../utils/cubeParser.js';
import { groqConfig } from '../config/groq.js';

const RUBIK_MOVE_TAIL_MS = 380;
/** `animateMoveRange` setTimeout: custom element `alg` needs a beat after Vue patch */
const ANIM_RANGE_LEAD_MS = 80;
const TIER_COMPLETE_BUFFER_MS = 120;
const QUIZ_QUESTION_COUNT = 4;

const props = defineProps({
  tier: {
    type: String,
    required: true,
    validator: (v) => ['beginner', 'intermediate', 'advanced'].includes(v),
  },
  moduleId: {
    type: String,
    required: true,
  },
});

const { t, locale, tm } = useI18n();
const { isDark } = useTheme();
const {
  beginnerDone,
  intermediateDone,
  advancedDone,
  markBeginnerComplete,
  markIntermediateComplete,
  markAdvancedComplete,
} = useNotationCourseProgress();

/** True after user clicks Reset on a tier they had already finished (stay in practice mode until nav away). */
const userRequestedReplay = ref(false);

/** 'warmup' | 'quizLobby' | 'quizPlay' | 'complete' */
const coursePhase = ref('warmup');

const cubeRef = ref(null);
const cubeKey = ref(0);
const appliedAlg = ref('');
const failureMessage = ref('');
const cubeAnimating = ref(false);
const lastMoveToken = ref('');
const notationInput = ref('');

const aiText = ref('');
const aiError = ref('');
const aiLoading = ref(false);

const beginnerTried = ref(
  /** @type Record<string, boolean> */ ({
    U: false,
    D: false,
    L: false,
    R: false,
    F: false,
    B: false,
  }),
);

/** Keys: normalized move strings that appear in the current tier’s control grid */
const gridMovesTried = ref(/** @type Record<string, boolean> */ ({}));

/** @type {import('vue').Ref<string[]>} */
const quizSequence = ref([]);
const quizIndex = ref(0);
const quizFeedback = ref('');
/** Short encouragement after a correct quiz answer (game mode). */
const quizPraiseMessage = ref('');
/** 1-based question number shown in header after a wrong answer */
const quizFailAtQuestion = ref(/** @type number | null */ (null));

let groqTimer = null;
let failureClearTimer = null;
let warmupToQuizTimer = null;
let quizPraiseTimer = null;

const hasGroqKey = computed(() => Boolean(groqConfig.apiKey?.trim()));

const faceBaseMoves = NOTATION_FACE_BASE;

const intermediatePrimeRow = computed(() => NOTATION_FACE_BASE.map((f) => `${f}'`));
const intermediateDoubleRow = computed(() => NOTATION_FACE_BASE.map((f) => `${f}2`));

/** Közép: csak ' és 2; haladó: teljes rács — szintlépéshez minden gomb egyszer. */
const tierGridMoves = computed(() => {
  if (props.tier === 'beginner') return NOTATION_FACE_BASE;
  if (props.tier === 'intermediate') return NOTATION_INTERMEDIATE_GRID_MOVES;
  return NOTATION_FULL_FACE_MOVES;
});

const historyTokens = computed(() =>
  appliedAlg.value.trim() ? appliedAlg.value.trim().split(/\s+/).filter(Boolean) : [],
);

const buttonClass = computed(() => (isDark.value ? 'btn-outline-light' : 'btn-outline-primary'));

const controlsProgressTotal = computed(() => {
  if (props.tier === 'beginner') return NOTATION_FACE_BASE.length;
  return tierGridMoves.value.length;
});

const controlsProgressDone = computed(() => {
  if (props.tier === 'beginner') {
    return NOTATION_FACE_BASE.filter((f) => beginnerTried.value[f]).length;
  }
  return tierGridMoves.value.filter((m) => gridMovesTried.value[normalizeMove(m)]).length;
});

const facesProgressText = computed(() =>
  t('notationCourse.facesProgress', {
    done: controlsProgressDone.value,
    total: controlsProgressTotal.value,
  }),
);

const isWarmup = computed(() => coursePhase.value === 'warmup');
const isQuizLobby = computed(() => coursePhase.value === 'quizLobby');
const isQuizPlay = computed(() => coursePhase.value === 'quizPlay');

/** Quiz lobby: wait for Start; during animation always disabled. */
const moveButtonsDisabled = computed(() => cubeAnimating.value || isQuizLobby.value);

const headerProgressText = computed(() => {
  if (coursePhase.value === 'warmup') return facesProgressText.value;
  if (coursePhase.value === 'quizLobby') {
    if (quizFailAtQuestion.value != null) {
      return t('notationCourse.quizProgress', {
        current: quizFailAtQuestion.value,
        total: QUIZ_QUESTION_COUNT,
      });
    }
    return t('notationCourse.quizProgressLobby');
  }
  if (coursePhase.value === 'quizPlay') {
    return t('notationCourse.quizProgress', {
      current: quizIndex.value + 1,
      total: QUIZ_QUESTION_COUNT,
    });
  }
  return facesProgressText.value;
});

function tierWasCompletedBefore() {
  if (props.tier === 'beginner') return beginnerDone.value;
  if (props.tier === 'intermediate') return intermediateDone.value;
  return advancedDone.value;
}

const showSuccessUI = computed(
  () => tierWasCompletedBefore() && !userRequestedReplay.value,
);

const showPlayerShell = computed(() => !showSuccessUI.value);

const nextModulePath = computed(() => {
  if (props.tier === 'beginner') return `/course/beginner-cfop/${NOTATION_INTERMEDIATE_MODULE_ID}`;
  if (props.tier === 'intermediate') return `/course/beginner-cfop/${NOTATION_ADVANCED_MODULE_ID}`;
  return null;
});

function normalizeMove(m) {
  return String(m).trim().replace(/′/g, "'").replace(/\s/g, '');
}

function isMoveTriedOnGrid(mv) {
  if (props.tier === 'beginner') {
    return Boolean(beginnerTried.value[mv]);
  }
  return Boolean(gridMovesTried.value[normalizeMove(mv)]);
}

function isOnCurrentGrid(move) {
  const k = normalizeMove(move);
  if (props.tier === 'beginner') {
    return NOTATION_FACE_BASE.includes(move);
  }
  return tierGridMoves.value.some((m) => normalizeMove(m) === k);
}

function registerControlUsed(move) {
  if (props.tier === 'beginner') {
    if (NOTATION_FACE_BASE.includes(move)) {
      beginnerTried.value = { ...beginnerTried.value, [move]: true };
    }
    return;
  }
  const k = normalizeMove(move);
  if (tierGridMoves.value.some((m) => normalizeMove(m) === k)) {
    gridMovesTried.value = { ...gridMovesTried.value, [k]: true };
  }
}

function recomputeProgressFromHistory() {
  const tokens = historyTokens.value;
  const b = { U: false, D: false, L: false, R: false, F: false, B: false };
  const g = {};
  for (const tok of tokens) {
    if (props.tier === 'beginner') {
      if (NOTATION_FACE_BASE.includes(tok)) b[tok] = true;
    } else {
      const k = normalizeMove(tok);
      if (tierGridMoves.value.some((m) => normalizeMove(m) === k)) g[k] = true;
    }
  }
  if (props.tier === 'beginner') {
    beginnerTried.value = b;
  } else {
    gridMovesTried.value = g;
  }
}

function tierCompleteDelayMs(animatedQuantumSum) {
  const n = Math.max(1, animatedQuantumSum);
  return n * 1000 + RUBIK_MOVE_TAIL_MS + ANIM_RANGE_LEAD_MS + TIER_COMPLETE_BUFFER_MS;
}

function clearWarmupToQuizTimer() {
  if (warmupToQuizTimer != null) {
    window.clearTimeout(warmupToQuizTimer);
    warmupToQuizTimer = null;
  }
}

function isTierCompleteNow() {
  if (props.tier === 'beginner') {
    return NOTATION_FACE_BASE.every((f) => beginnerTried.value[f]);
  }
  return tierGridMoves.value.every((m) => gridMovesTried.value[normalizeMove(m)]);
}

function enterQuizLobby() {
  clearWarmupToQuizTimer();
  coursePhase.value = 'quizLobby';
  quizFeedback.value = '';
  cubeAnimating.value = false;
  appliedAlg.value = '';
  lastMoveToken.value = '';
  aiText.value = '';
  aiError.value = '';
  aiLoading.value = false;
  nextTick(() => {
    requestAnimationFrame(() => {
      cubeRef.value?.seekAfterUserMoves?.(0);
      cubeRef.value?.pausePlayback?.();
    });
  });
}

function scheduleEnterQuizIfDone(animatedQuantumSum) {
  if (coursePhase.value !== 'warmup' || !isTierCompleteNow()) return;
  if (warmupToQuizTimer != null) return;
  warmupToQuizTimer = window.setTimeout(() => {
    warmupToQuizTimer = null;
    if (coursePhase.value !== 'warmup' || !isTierCompleteNow()) return;
    enterQuizLobby();
  }, tierCompleteDelayMs(animatedQuantumSum));
}

function clearFailureLater() {
  if (failureClearTimer != null) {
    window.clearTimeout(failureClearTimer);
    failureClearTimer = null;
  }
  failureClearTimer = window.setTimeout(() => {
    failureMessage.value = '';
    failureClearTimer = null;
  }, 3200);
}

const GROQ_SCHEDULE_DEBOUNCE_MS = 80;

function scheduleGroq(move) {
  if (coursePhase.value !== 'warmup') return;
  if (groqTimer != null) {
    window.clearTimeout(groqTimer);
    groqTimer = null;
  }
  groqTimer = window.setTimeout(async () => {
    groqTimer = null;
    aiLoading.value = true;
    aiError.value = '';
    const historySummary = historyTokens.value.slice(-12).join(' ');
    try {
      const text = await explainMoveWithGroq({
        move,
        historySummary,
        tier: props.tier,
        locale: locale.value,
      });
      aiText.value = text || '';
    } catch (e) {
      aiError.value = userFacingGroqError(e, t);
      aiText.value = '';
    } finally {
      aiLoading.value = false;
    }
  }, GROQ_SCHEDULE_DEBOUNCE_MS);
}

function animateMoveRange(fromCount, toCount, moveForExplanation = null) {
  const from = Math.max(0, fromCount);
  const to = Math.max(0, toCount);
  const release = () => {
    cubeAnimating.value = false;
    const m = moveForExplanation;
    if (coursePhase.value === 'warmup' && m != null && String(m).trim() !== '') {
      requestAnimationFrame(() => {
        scheduleGroq(String(m).trim());
      });
    }
  };
  nextTick(() => {
    window.setTimeout(() => {
      if (to <= 0) {
        cubeRef.value?.seekAfterUserMoves?.(0);
        cubeRef.value?.pausePlayback?.();
        release();
        return;
      }
      if (from >= to) {
        cubeRef.value?.seekAfterUserMoves?.(to);
        cubeRef.value?.pausePlayback?.();
        release();
        return;
      }
      const cube = cubeRef.value;
      if (!cube || typeof cube.playUserMoveRange !== 'function') {
        release();
        return;
      }
      cube.playUserMoveRange(from, to, release);
    }, ANIM_RANGE_LEAD_MS);
  });
}

function pickRandomQuizMoves() {
  const pool = tierGridMoves.value;
  return Array.from({ length: QUIZ_QUESTION_COUNT }, () => pool[Math.floor(Math.random() * pool.length)]);
}

/**
 * Quiz: clear user alg and seek to solved — do not bump `cubeKey` (remount causes flicker / false “reset”).
 * @param {() => void} [afterSeek] — run after twisty has applied empty alg + seek (e.g. start next demo).
 */
function resetCubeSolvedOnly(afterSeek) {
  appliedAlg.value = '';
  lastMoveToken.value = '';
  nextTick(() => {
    requestAnimationFrame(() => {
      cubeRef.value?.seekAfterUserMoves?.(0);
      cubeRef.value?.pausePlayback?.();
      afterSeek?.();
    });
  });
}

function playCurrentQuizDemo() {
  const move = quizSequence.value[quizIndex.value];
  if (!move) return;
  cubeAnimating.value = true;
  appliedAlg.value = move;
  lastMoveToken.value = move;
  nextTick(() => {
    animateMoveRange(0, 1, null);
  });
}

function clearQuizPraise() {
  quizPraiseMessage.value = '';
  if (quizPraiseTimer != null) {
    window.clearTimeout(quizPraiseTimer);
    quizPraiseTimer = null;
  }
}

function flashQuizPraise() {
  const raw = tm('notationCourse.quizPraiseLines');
  const lines = Array.isArray(raw) ? raw.filter((s) => typeof s === 'string' && s.trim()) : [];
  if (!lines.length) return;
  quizPraiseMessage.value = lines[Math.floor(Math.random() * lines.length)];
  if (quizPraiseTimer != null) window.clearTimeout(quizPraiseTimer);
  quizPraiseTimer = window.setTimeout(() => {
    quizPraiseMessage.value = '';
    quizPraiseTimer = null;
  }, 2600);
}

function onQuizStart() {
  clearQuizPraise();
  quizFeedback.value = '';
  quizFailAtQuestion.value = null;
  failureMessage.value = '';
  quizSequence.value = pickRandomQuizMoves();
  quizIndex.value = 0;
  coursePhase.value = 'quizPlay';
  cubeAnimating.value = false;
  resetCubeSolvedOnly(() => {
    nextTick(() => playCurrentQuizDemo());
  });
}

function completeQuizSuccess() {
  if (props.tier === 'beginner') markBeginnerComplete();
  if (props.tier === 'intermediate') markIntermediateComplete();
  if (props.tier === 'advanced') markAdvancedComplete();
  coursePhase.value = 'complete';
  clearWarmupToQuizTimer();
  appliedAlg.value = '';
  cubeAnimating.value = false;
}

function onQuizAnswer(mv) {
  if (coursePhase.value !== 'quizPlay' || cubeAnimating.value) return;
  if (!parseMove(mv)) {
    failureMessage.value = t('notationCourse.invalidToken');
    clearFailureLater();
    return;
  }
  const expected = quizSequence.value[quizIndex.value];
  if (normalizeMove(mv) !== normalizeMove(expected)) {
    clearQuizPraise();
    quizFailAtQuestion.value = quizIndex.value + 1;
    quizFeedback.value = t('notationCourse.quizWrongWithAnswer', { move: expected });
    coursePhase.value = 'quizLobby';
    cubeAnimating.value = false;
    resetCubeSolvedOnly();
    return;
  }
  quizIndex.value += 1;
  if (quizIndex.value >= quizSequence.value.length) {
    clearQuizPraise();
    completeQuizSuccess();
    return;
  }
  flashQuizPraise();
  cubeAnimating.value = false;
  resetCubeSolvedOnly(() => {
    nextTick(() => playCurrentQuizDemo());
  });
}

function applyFreeMove(move) {
  if (cubeAnimating.value) return;
  if (!parseMove(move)) {
    failureMessage.value = t('notationCourse.invalidToken');
    clearFailureLater();
    return;
  }
  failureMessage.value = '';
  cubeAnimating.value = true;
  const prevCount = historyTokens.value.length;
  const next = appliedAlg.value.trim() ? `${appliedAlg.value.trim()} ${move}` : move;
  appliedAlg.value = next;
  lastMoveToken.value = move;
  animateMoveRange(prevCount, prevCount + 1, null);
}

function applyMove(move) {
  if (coursePhase.value !== 'warmup' || cubeAnimating.value) return;
  if (!parseMove(move)) {
    failureMessage.value = t('notationCourse.invalidToken');
    clearFailureLater();
    return;
  }
  if (props.tier === 'beginner' && !isOnCurrentGrid(move)) {
    failureMessage.value = t('notationCourse.invalidToken');
    clearFailureLater();
    return;
  }

  failureMessage.value = '';
  cubeAnimating.value = true;
  const prevCount = historyTokens.value.length;
  const next = appliedAlg.value.trim() ? `${appliedAlg.value.trim()} ${move}` : move;
  appliedAlg.value = next;
  lastMoveToken.value = move;
  registerControlUsed(move);

  animateMoveRange(prevCount, prevCount + 1, move);
  scheduleEnterQuizIfDone(moveQuantumCount(move));
}

function onPickMove(mv) {
  if (coursePhase.value === 'quizPlay') {
    onQuizAnswer(mv);
    return;
  }
  if (coursePhase.value === 'quizLobby') {
    applyFreeMove(mv);
    return;
  }
  applyMove(mv);
}

function onApplyNotationInput() {
  if (props.tier !== 'advanced') return;
  if (coursePhase.value !== 'warmup') return;
  if (cubeAnimating.value) return;
  const raw = notationInput.value.trim();
  if (!raw) return;
  const clean = raw.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = clean.split(' ').filter(Boolean);
  for (const tok of tokens) {
    if (!parseMove(tok)) {
      failureMessage.value = t('notationCourse.invalidToken');
      clearFailureLater();
      return;
    }
  }
  cubeAnimating.value = true;
  const prevCount = historyTokens.value.length;
  const start = appliedAlg.value.trim();
  appliedAlg.value = start ? `${start} ${tokens.join(' ')}` : tokens.join(' ');
  for (const tok of tokens) {
    registerControlUsed(tok);
  }
  lastMoveToken.value = tokens[tokens.length - 1] || '';
  const lastTok = tokens.length ? tokens[tokens.length - 1] : null;
  animateMoveRange(prevCount, prevCount + tokens.length, lastTok);
  scheduleEnterQuizIfDone(quantumDurationUnits(tokens));
  notationInput.value = '';
}

function resetChallenge(fromUser = false) {
  clearWarmupToQuizTimer();
  clearQuizPraise();
  if (fromUser) userRequestedReplay.value = true;
  coursePhase.value = 'warmup';
  quizSequence.value = [];
  quizIndex.value = 0;
  quizFeedback.value = '';
  quizFailAtQuestion.value = null;
  cubeAnimating.value = false;
  appliedAlg.value = '';
  lastMoveToken.value = '';
  failureMessage.value = '';
  aiText.value = '';
  aiError.value = '';
  beginnerTried.value = { U: false, D: false, L: false, R: false, F: false, B: false };
  gridMovesTried.value = {};
  cubeKey.value += 1;
  nextTick(() => {
    cubeRef.value?.seekAfterUserMoves?.(0);
    cubeRef.value?.pausePlayback?.();
  });
}

function undoLast() {
  if (props.tier !== 'advanced') return;
  if (coursePhase.value !== 'warmup') return;
  if (cubeAnimating.value) return;
  const parts = appliedAlg.value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return;
  parts.pop();
  appliedAlg.value = parts.join(' ');
  lastMoveToken.value = parts.length ? parts[parts.length - 1] : '';
  recomputeProgressFromHistory();
  cubeKey.value += 1;
  nextTick(() => {
    cubeRef.value?.seekAfterUserMoves?.(parts.length);
    cubeRef.value?.pausePlayback?.();
  });
}

watch(
  () => props.tier,
  () => {
    userRequestedReplay.value = false;
    resetChallenge(false);
  },
);

onMounted(() => {
  userRequestedReplay.value = false;
  nextTick(() => {
    cubeRef.value?.seekAfterUserMoves?.(0);
    cubeRef.value?.pausePlayback?.();
  });
});

onUnmounted(() => {
  if (groqTimer != null) window.clearTimeout(groqTimer);
  if (failureClearTimer != null) window.clearTimeout(failureClearTimer);
  clearWarmupToQuizTimer();
  clearQuizPraise();
});
</script>

<style scoped>
.notation-course-player__reset-btn {
  white-space: nowrap;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.notation-course-player__reset-icon {
  flex-shrink: 0;
  opacity: 0.92;
}

.notation-course-player__move-btn--tried {
  font-weight: 600;
  box-shadow: inset 0 0 0 2px var(--bs-success, #198754);
  background-color: rgba(25, 135, 84, 0.14) !important;
}

.notation-course-player--dark .notation-course-player__move-btn--tried {
  background-color: rgba(25, 135, 84, 0.28) !important;
}

.notation-course-player__quiz-result-card .notation-course-player__quiz-start {
  font-weight: 700;
  min-height: 3rem;
}

.notation-course-player__quiz-play-feedback {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notation-course-player__quiz-praise {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--bs-success, #198754) 38%, transparent);
  background: linear-gradient(
    125deg,
    color-mix(in srgb, var(--bs-success, #198754) 16%, transparent) 0%,
    color-mix(in srgb, var(--bs-primary, #0d6efd) 8%, transparent) 100%
  );
  box-shadow: 0 1px 0 color-mix(in srgb, var(--bs-success, #198754) 12%, transparent);
}

.notation-course-player--dark .notation-course-player__quiz-praise {
  border-color: color-mix(in srgb, var(--bs-success, #198754) 45%, transparent);
  background: linear-gradient(
    125deg,
    color-mix(in srgb, var(--bs-success, #198754) 22%, transparent) 0%,
    color-mix(in srgb, var(--bs-primary, #0d6efd) 12%, transparent) 100%
  );
}

.notation-course-player__quiz-praise-icon {
  flex-shrink: 0;
  color: var(--bs-success, #198754);
  line-height: 1;
  margin-top: 0.1rem;
}

.notation-course-player__quiz-praise-text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.notation-quiz-praise-enter-active,
.notation-quiz-praise-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.notation-quiz-praise-enter-from,
.notation-quiz-praise-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.notation-course-player__cube-wrap {
  overflow: hidden;
  background: var(--bs-body-bg, #fff);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.notation-course-player__cube-wrap :deep(twisty-player) {
  height: 280px !important;
  width: 100% !important;
  max-width: 500px;
}

.notation-course-player__cube-wrap :deep(.rubik-cube-container) {
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@media (min-width: 992px) {
  .notation-course-player__cube-wrap {
    min-height: 420px;
  }

  .notation-course-player__cube-wrap :deep(twisty-player) {
    height: 420px !important;
  }
}
</style>
