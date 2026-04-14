<template>
  <div class="rubik-cube-container">
    <div v-if="showMoveList" class="algorithm-text mb-2 text-center">
      <div v-if="setup" class="setup-text small mb-1">
        <strong>Setup:</strong> 
        <span class="font-monospace">
          <span
            v-for="(move, index) in setupMoves"
            :key="`setup-${index}`"
            class="algorithm-move"
            :class="{ 
              'active-move': activeMoveIndex && activeMoveIndex.type === 'setup' && activeMoveIndex.index === index,
              'disabled': !isPlayerReady
            }"
            @click="isPlayerReady && jumpToMove('setup', index)"
            :title="isPlayerReady ? `Ugorj erre a lépésre (${index + 1}/${setupMoves.length})` : 'Várj, amíg a player betöltődik...'"
          >
            {{ move }}
          </span>
        </span>
      </div>
      <div class="algorithm-text-main">
        <strong>Algorithm:</strong> 
        <span class="font-monospace">
          <span
            v-for="(move, index) in algorithmMovesDisplay"
            :key="`alg-${index}`"
            class="algorithm-move"
            :class="{ 
              'active-move': activeMoveIndex && activeMoveIndex.type === 'algorithm' && activeMoveIndex.index === index,
              'disabled': !isPlayerReady
            }"
            @click="isPlayerReady && jumpToMove('algorithm', index)"
            :title="isPlayerReady ? `Ugorj erre a lépésre (${index + 1}/${algorithmMovesDisplay.length})` : 'Várj, amíg a player betöltődik...'"
          >
            {{ move }}
          </span>
        </span>
      </div>
    </div>
    <twisty-player
      :key="playerKey"
      ref="twistyPlayerRef"
      :alg="twistyMainAlg"
      :experimental-setup-alg="setup"
      :experimental-stickering="twistyStickering"
      :control-panel="twistyControlPanel"
      :experimental-drag-input="twistyDragInput"
      puzzle="3x3x3"
      hint-facelets="none"
      background="none"
      :camera-latitude="twistyCameraLatitude"
      :camera-longitude="twistyCameraLongitude"
      style="width: 100%; max-width: 500px; height: 500px;"
    ></twisty-player>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineExpose, defineEmits } from 'vue';
import { cubingMoveDurationMs, cubingDurationMsSlice } from '../utils/cubeParser.js';

/** Twisty internals call random helpers on move lists; empty alg + hidden modals can hit length 0 and throw. */
const EMPTY_ALG_FALLBACK = "R R'";

/**
 * Same library as https://cdn.cubing.net/js/cubing/twisty — loaded from npm so the app
 * does not depend on CDN chunk URLs / cross-origin module graphs in list view.
 */
let twistyModulePromise = null;

function ensureTwistyPlayerLoaded() {
  if (typeof customElements === 'undefined') {
    return Promise.reject(new Error('customElements not available'));
  }
  if (customElements.get('twisty-player')) {
    return Promise.resolve();
  }
  if (!twistyModulePromise) {
    twistyModulePromise = import('cubing/twisty');
  }
  return twistyModulePromise;
}

const props = defineProps({
  algorithm: {
    type: String,
    required: true,
  },
  setup: {
    type: String,
    default: '',
  },
  /** When false, hide the setup/algorithm move list (e.g. course lesson player). */
  showMoveList: {
    type: Boolean,
    default: true,
  },
  /**
   * When true (default), after setup/algorithm props change the timeline jumps to setup end (trainer UX).
   * Set false when the parent controls the timeline (step-by-step course).
   */
  autoStickToSetupEnd: {
    type: Boolean,
    default: true,
  },
  /**
   * When true (default), algorithm/setup prop changes trigger seekAfterUserMoves on the twisty timeline.
   * Set false when the parent is the only driver (playUserMoveRange / explicit seek), e.g. notation course —
   * otherwise repeated seeks (incl. 80ms/250ms retries) can race playback and freeze mid-turn.
   */
  syncTimelineOnAlgorithmProp: {
    type: Boolean,
    default: true,
  },
  /**
   * When true, twisty always receives `${EMPTY_ALG_FALLBACK} ${userAlg}` so the first user move appends
   * instead of replacing the empty-state placeholder (avoids twisty timeline resets that race playback).
   */
  prependNeutralAlgorithmPrefix: {
    type: Boolean,
    default: false,
  },
  /**
   * When false, cube is view-only (no drag twists; built-in control panel hidden).
   * Trainers and modals should keep default true.
   */
  interactive: {
    type: Boolean,
    default: true,
  },
  /**
   * When false, hide twisty’s bottom control panel (move buttons) but keep drag if `interactive` is true.
   */
  showControlPanel: {
    type: Boolean,
    default: true,
  },
  /**
   * Passed to twisty `experimental-stickering` when non-empty (e.g. Cross, full).
   * @see https://experiments.cubing.net/cubing.js/twisty/twisty-player-config.html
   */
  experimentalStickering: {
    type: String,
    default: '',
  },
  /**
   * When true, emit `mission-interaction` on twisty move/pause so parents can debounce
   * `getMissionKPattern()` for Cross mission checks.
   */
  emitMissionMoves: {
    type: Boolean,
    default: false,
  },
  /**
   * Initial polar camera angle (twisty-player). Default 180 matches trainers (white cross / D face framing).
   * Use 0 for opposite vertical orbit (e.g. Cross mission: white on top in the viewport).
   */
  cameraLatitude: {
    type: [String, Number],
    default: 180,
  },
  /** Optional horizontal orbit (degrees). Omitted when null/undefined. */
  cameraLongitude: {
    type: [String, Number],
    default: undefined,
  },
});

const emit = defineEmits(['mission-interaction']);

const twistyStickering = computed(() => {
  const o = stickeringOverlay.value?.trim();
  if (o) return o;
  const s = props.experimentalStickering?.trim();
  return s || undefined;
});

const twistyControlPanel = computed(() => {
  if (!props.interactive || !props.showControlPanel) return 'none';
  return undefined;
});

const twistyDragInput = computed(() => (props.interactive ? undefined : 'none'));

const twistyCameraLatitude = computed(() => String(props.cameraLatitude));

const twistyCameraLongitude = computed(() =>
  props.cameraLongitude === undefined || props.cameraLongitude === null || props.cameraLongitude === ''
    ? undefined
    : String(props.cameraLongitude),
);

const twistyPlayerRef = ref(null);
const playerKey = ref(0);
const currentTimestamp = ref(0);
const isPlayerReady = ref(false);
/** When set, overrides `experimentalStickering` prop (guided lesson actions). */
const stickeringOverlay = ref('');

// Setup algoritmus (ha van) - experimental-setup-alg prop-hoz
// x2 rotáció a legelején: fehér alul, sárga felül orientáció (alapértelmezett: sárga alul, fehér felül)
const setup = computed(() => {
  const baseSetup = props.setup && props.setup.trim() ? props.setup.trim() : '';
  return baseSetup ? `x2 ${baseSetup}` : 'x2';
});

/** Neutral placeholder moves (length 2) — must match EMPTY_ALG_FALLBACK token count. */
const NEUTRAL_PREFIX_MOVE_COUNT = 2;

const neutralPrefixMoveCount = computed(() =>
  props.prependNeutralAlgorithmPrefix ? NEUTRAL_PREFIX_MOVE_COUNT : 0,
);

// Fő algoritmus - alg prop-hoz (never empty — cubing.net twisty randomUIntBelow breaks on 0-length sequences)
const twistyMainAlg = computed(() => {
  const user = props.algorithm && props.algorithm.trim() ? props.algorithm.trim() : '';
  if (props.prependNeutralAlgorithmPrefix) {
    return user ? `${EMPTY_ALG_FALLBACK} ${user}` : EMPTY_ALG_FALLBACK;
  }
  return user || EMPTY_ALG_FALLBACK;
});

const setupMoves = computed(() => {
  if (!setup.value) return [];
  return setup.value.split(/\s+/).filter(m => m.trim().length > 0);
});

// Algoritmus mozgások listája (teljes twisty szekvencia)
const algorithmMoves = computed(() => {
  if (!twistyMainAlg.value) return [];
  return twistyMainAlg.value.split(/\s+/).filter(m => m.trim().length > 0);
});

/** Move list UI: elrejti a semleges előtagot, ha van. */
const algorithmMovesDisplay = computed(() => {
  const p = neutralPrefixMoveCount.value;
  const all = algorithmMoves.value;
  return p > 0 ? all.slice(p) : all;
});

function userAlgTokenList() {
  const s = props.algorithm?.trim() || '';
  return s ? s.split(/\s+/).filter(Boolean) : [];
}

const activeMoveIndex = computed(() => {
  const timestamp = currentTimestamp.value;
  if (timestamp < 0) return null;

  const allAlgToks = algorithmMoves.value;
  const prefixCount = neutralPrefixMoveCount.value;
  let acc = 0;
  let moveIdx = -1;
  for (let i = 0; i < allAlgToks.length; i++) {
    const moveDur = cubingMoveDurationMs(allAlgToks[i]);
    if (timestamp < acc + moveDur) {
      moveIdx = i;
      break;
    }
    acc += moveDur;
  }
  if (moveIdx < 0) return null;
  if (prefixCount > 0 && moveIdx < prefixCount) return null;
  const userIdx = moveIdx - prefixCount;
  const userToks = userAlgTokenList();
  if (userIdx < 0 || userIdx >= userToks.length) return null;
  return { type: 'algorithm', index: userIdx };
});

function jumpToMove(type, index) {
  const player = twistyPlayerRef.value;
  if (!player?.experimentalModel) return;

  try {
    let targetTimestamp = 0;

    if (type === 'setup') {
      return;
    } else if (type === 'algorithm') {
      const prefixCount = neutralPrefixMoveCount.value;
      const allAlgToks = algorithmMoves.value;
      targetTimestamp = cubingDurationMsSlice(allAlgToks, 0, prefixCount + index);
    }

    player.experimentalModel.timestampRequest.set(targetTimestamp);
    currentTimestamp.value = targetTimestamp;

    if (player.play) {
      player.play();
    }
  } catch (e) {
    /* timeline not ready */
  }
}

function seekTimestamp(tsMs) {
  const player = twistyPlayerRef.value;
  if (!player?.experimentalModel) return;
  try {
    player.experimentalModel.timestampRequest.set(tsMs);
    currentTimestamp.value = tsMs;
  } catch (e) {
    /* timeline not ready */
  }
}

function isPlayerModelReady() {
  return !!twistyPlayerRef.value?.experimentalModel;
}

function setToSetupEnd() {
  if (!isPlayerModelReady()) return;
  seekTimestamp(0);
}

function seekAfterUserMoves(userMoveCount) {
  if (!isPlayerModelReady()) return;
  const n = Math.max(0, userMoveCount);
  const prefixCount = neutralPrefixMoveCount.value;
  const allAlgToks = algorithmMoves.value;
  const sliceEnd = Math.min(prefixCount + n, allAlgToks.length);
  const ts = cubingDurationMsSlice(allAlgToks, 0, sliceEnd);
  seekTimestamp(ts);
}

function pausePlayback() {
  const player = twistyPlayerRef.value;
  if (player?.pause && typeof player.pause === 'function') {
    try {
      player.pause();
    } catch (e) {
      /* ignore */
    }
  }
}

function resumePlayback() {
  const player = twistyPlayerRef.value;
  if (player?.play && typeof player.play === 'function') {
    try {
      player.play();
    } catch (e) {
      /* ignore */
    }
  }
}

/** Extra ms after cubing.js move duration so twisty finishes before we pause+seek (avoids mid-turn snap / flicker). */
const GUIDED_DEMO_TAIL_MS = 520;
/** Additional safety for U2 / wide moves where player runtime can exceed parsed token duration slightly. */
const GUIDED_DEMO_EXTRA_BUFFER_MS = 220;

/** Invalidates pending playUserMoveRange timeouts when a new range starts. */
let playUserMoveRangeGeneration = 0;

/**
 * Wait until Vue + twisty-player have applied the latest `alg` prop; otherwise seek/play run on a stale timeline
 * (e.g. still only `R R'`) and playback shows the wrong face (always R).
 */
function waitTwistyAlgFlush() {
  return nextTick().then(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      }),
  );
}

async function waitForTwistyModel(maxWaitMs = 1200) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  for (;;) {
    if (isPlayerModelReady()) return;
    const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;
    if (elapsed >= maxWaitMs) return;
    await new Promise((r) => setTimeout(r, 16));
  }
}

/**
 * Seek to algorithm position after `fromCount` main-alg moves, play until `toCount`, then pause and seek to end state.
 * Used for guided lessons to animate only the new moves on a step.
 * @param {() => void} [onComplete] — called when playback finishes or is superseded / fails (Notation course UI unlock).
 */
function playUserMoveRange(fromCount, toCount, onComplete) {
  const onDone = typeof onComplete === 'function' ? onComplete : () => {};
  const from = Math.max(0, fromCount);
  const to = Math.max(0, toCount);
  if (to < from) {
    onDone();
    return;
  }
  playUserMoveRangeGeneration += 1;
  const gen = playUserMoveRangeGeneration;

  const run = async () => {
    await waitTwistyAlgFlush();
    if (gen !== playUserMoveRangeGeneration) { onDone(); return; }
    await waitForTwistyModel();
    if (gen !== playUserMoveRangeGeneration) { onDone(); return; }

    pausePlayback();
    seekAfterUserMoves(from);
    const player = twistyPlayerRef.value;
    if (!player) { onDone(); return; }
    if (to <= from) {
      seekAfterUserMoves(to);
      onDone();
      return;
    }

    const prefixCount = neutralPrefixMoveCount.value;
    const allAlgToks = algorithmMoves.value;
    const fromIdx = prefixCount + from;
    const toIdx = prefixCount + to;
    const cubingMs = cubingDurationMsSlice(allAlgToks, fromIdx, toIdx);
    const durationMs = Math.max(cubingMs, 1000) + GUIDED_DEMO_TAIL_MS + GUIDED_DEMO_EXTRA_BUFFER_MS;

    await new Promise((r) => setTimeout(r, 50));
    if (gen !== playUserMoveRangeGeneration) { onDone(); return; }

    try {
      if (player.controller?.animationController) {
        player.controller.animationController.play({
          autoSkipToOtherEndIfStartingAtBoundary: false,
        });
      } else if (typeof player.play === 'function') {
        player.play();
      }
    } catch (e) {
      onDone();
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (gen !== playUserMoveRangeGeneration) { onDone(); return; }
        window.setTimeout(() => {
          if (gen !== playUserMoveRangeGeneration) { onDone(); return; }
          pausePlayback();
          seekAfterUserMoves(to);
          onDone();
        }, durationMs);
      });
    });
  };

  void run();
}

function setStickeringOverlay(value) {
  stickeringOverlay.value = value && String(value).trim() ? String(value).trim() : '';
}

function clearStickeringOverlay() {
  stickeringOverlay.value = '';
}

/**
 * Full puzzle state: experimental-setup-alg + main alg (matches twisty timeline).
 * @returns {Promise<import('cubing/kpuzzle').KPattern | null>}
 */
async function getMissionKPattern() {
  const player = twistyPlayerRef.value;
  const em = player?.experimentalModel;
  if (!em) return null;
  try {
    const [{ cube3x3x3 }] = await Promise.all([import('cubing/puzzles')]);
    const kpuzzle = await cube3x3x3.kpuzzle();
    const [setupVal, algVal] = await Promise.all([em.setupAlg.get(), em.alg.get()]);
    const setupStr = setupVal?.alg != null ? String(setupVal.alg) : '';
    const algStr = algVal?.alg != null ? String(algVal.alg) : '';
    const combined = [setupStr, algStr].map((s) => s.trim()).filter(Boolean).join(' ');
    return kpuzzle.defaultPattern().applyAlg(combined);
  } catch {
    return null;
  }
}

function emitMissionIfNeeded() {
  if (props.emitMissionMoves) {
    emit('mission-interaction');
  }
}

defineExpose({
  goToSetupEnd: setToSetupEnd,
  seekAfterUserMoves,
  pausePlayback,
  resumePlayback,
  playUserMoveRange,
  setStickeringOverlay,
  clearStickeringOverlay,
  getMissionKPattern,
});

// A beépített vezérlő panel használata, de a reset gombot felülírjuk
// hogy a setup utáni állapotba állítsa vissza

// Figyeljük az algoritmus változását
watch(() => [props.algorithm, props.setup], () => {
  if (!props.syncTimelineOnAlgorithmProp) {
    return;
  }
  if (props.autoStickToSetupEnd) {
    nextTick(() => {
      setToSetupEnd();
      setTimeout(() => setToSetupEnd(), 100);
      setTimeout(() => setToSetupEnd(), 300);
    });
    return;
  }
  const n =
    props.algorithm && props.algorithm.trim()
      ? props.algorithm.trim().split(/\s+/).filter((m) => m.length > 0).length
      : 0;
  nextTick(() => {
    seekAfterUserMoves(n);
    setTimeout(() => seekAfterUserMoves(n), 80);
    setTimeout(() => seekAfterUserMoves(n), 250);
  });
});

onMounted(() => {
  const trySetInitialState = () => {
    const player = twistyPlayerRef.value;
    if (!player?.experimentalModel) {
      setTimeout(trySetInitialState, 100);
      return;
    }

    isPlayerReady.value = true;
    if (props.autoStickToSetupEnd) {
      setToSetupEnd();
    } else {
      seekAfterUserMoves(0);
    }

    if (player.addEventListener) {
      player.addEventListener('move', () => emitMissionIfNeeded());
      player.addEventListener('pause', () => emitMissionIfNeeded());
    }

    if (player.experimentalModel) {
      const originalRestart = player.restart;
      if (originalRestart) {
        player.restart = function () {
          originalRestart.call(this);
          setTimeout(() => setToSetupEnd(), 50);
        };
      }
    }
  };

  ensureTwistyPlayerLoaded()
    .then(() => {
      setTimeout(trySetInitialState, 500);
      setTimeout(trySetInitialState, 1000);
      setTimeout(trySetInitialState, 2000);
    })
    .catch((err) => {
      console.error('[RubikCube3D] Failed to load cubing/twisty', err);
    });
});
</script>

<style scoped>
.rubik-cube-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.algorithm-text {
  max-width: 500px;
  width: 100%;
  color: #000 !important;
}

.algorithm-text * {
  color: #000 !important;
}

.algorithm-text .font-monospace {
  word-break: break-all;
  line-height: 1.5;
  color: #000 !important;
}

.algorithm-text .setup-text {
  color: #000 !important;
}

.algorithm-text .setup-text strong {
  color: #000 !important;
}

.algorithm-text .algorithm-text-main {
  color: #000 !important;
}

.algorithm-text .algorithm-text-main strong {
  color: #000 !important;
}

.algorithm-move {
  display: inline-block;
  padding: 2px 4px;
  margin: 0 2px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;
  color: #000;
}

.algorithm-move:hover {
  background-color: rgba(255, 193, 7, 0.3);
}

.algorithm-move.active-move {
  background-color: #ffc107 !important;
  color: #000 !important;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
}

/* Dark mode - fehér betűk */
html[data-bs-theme="dark"] .algorithm-text,
html.dark-theme .algorithm-text {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text *,
html.dark-theme .algorithm-text * {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .font-monospace,
html.dark-theme .algorithm-text .font-monospace {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .setup-text,
html.dark-theme .algorithm-text .setup-text {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .setup-text strong,
html.dark-theme .algorithm-text .setup-text strong {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .algorithm-text-main,
html.dark-theme .algorithm-text .algorithm-text-main {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .algorithm-text-main strong,
html.dark-theme .algorithm-text .algorithm-text-main strong {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-move,
html.dark-theme .algorithm-move {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-move.active-move,
html.dark-theme .algorithm-move.active-move {
  background-color: #ffc107 !important;
  color: #000 !important;
}

</style>
