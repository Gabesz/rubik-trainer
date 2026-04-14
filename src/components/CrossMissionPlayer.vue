<template>
  <div class="cross-mission-player">
    <header class="cross-mission-player__goal text-center mb-3">
      <p class="h5 mb-1">{{ $t('crossGame.goal') }}</p>
      <p class="text-muted small mb-1">{{ $t('crossGame.guidedHint') }}</p>
      <p class="small text-muted mb-0">
        {{ $t('crossGame.stepLabel', { current: stepIndex + 1, total: totalSteps }) }}
      </p>
    </header>

    <div class="form-check cross-mission-player__help form-switch d-flex justify-content-center mb-3">
      <input
        id="cross-help-toggle"
        v-model="helpEnabled"
        class="form-check-input"
        type="checkbox"
        role="switch"
        :aria-label="$t('crossGame.helpCheck')"
      />
      <label class="form-check-label ms-2" for="cross-help-toggle">{{ $t('crossGame.helpCheck') }}</label>
    </div>

    <div
      class="cross-mission-player__cube-wrap rounded border position-relative"
      :class="[
        isDark ? 'border-secondary' : '',
        cubeSuccessFlash ? 'cross-mission-player__cube-wrap--flash' : '',
      ]"
    >
      <RubikCube3D
        ref="cubeRef"
        :key="cubeKey"
        :algorithm="appliedAlg"
        :setup="'x2 ' + activeScramble"
        :show-move-list="false"
        :auto-stick-to-setup-end="false"
        :interactive="true"
        :show-control-panel="false"
        :emit-mission-moves="false"
        experimental-stickering=""
      />
    </div>

    <div
      v-if="failureMessage"
      class="alert alert-warning text-center py-2 mt-3 mb-0"
      role="alert"
    >
      {{ failureMessage }}
    </div>

    <div
      v-if="!missionComplete && totalSteps > 0"
      class="cross-mission-player__choices d-flex flex-wrap gap-2 justify-content-center mt-3"
    >
      <button
        v-for="mv in choiceButtons"
        :key="mv + '-' + choiceRound"
        type="button"
        class="btn btn-lg"
        :class="choiceButtonClass(mv)"
        @click="onPickMove(mv)"
      >
        {{ mv }}
      </button>
    </div>

    <div
      v-if="missionComplete"
      class="alert alert-success text-center py-3 mt-3 mb-0 cross-mission-player__success"
      role="status"
      aria-live="polite"
    >
      <span class="d-block fs-5 mb-2">{{ $t('crossGame.successMessage') }}</span>
      <router-link to="/course/beginner-cfop" class="btn btn-success">
        {{ $t('crossGame.backToCourse') }}
      </router-link>
    </div>

    <footer class="cross-mission-player__footer mt-3">
      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button type="button" class="btn btn-outline-warning btn-sm" @click="resetMission">
          {{ $t('crossGame.resetBtn') }}
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import RubikCube3D from './RubikCube3D.vue';
import { useTheme } from '../composables/useTheme';
import { crossMissions, CROSS_NOTATION_CHOICE_POOL } from '../data/courses/crossMissions.js';
import { BEGINNER_CFOP_COURSE } from '../data/courses/beginnerCfop.js';
import { useCourseProgress } from '../composables/useCourseProgress.js';

const CROSS_MODULE_ID = 'cross';
const CROSS_LESSON_ID = 'cross-mission-pack';

const { isDark } = useTheme();
const { t } = useI18n();
const { recordProgress, unlockF2lIntro } = useCourseProgress(BEGINNER_CFOP_COURSE.id);

const cubeRef = ref(null);
const cubeKey = ref(0);
const activeScramble = ref(crossMissions[0]?.scramble ?? '');
const missionComplete = ref(false);
const cubeSuccessFlash = ref(false);
const appliedAlg = ref('');
const stepIndex = ref(0);
const helpEnabled = ref(false);
const choiceButtons = ref([]);
const choiceRound = ref(0);
const failureMessage = ref('');

let flashTimer = null;

const solutionMoves = computed(() => {
  const m = crossMissions[0]?.solutionMoves;
  return Array.isArray(m) ? m : [];
});

const totalSteps = computed(() => solutionMoves.value.length);

const expectedMove = computed(() => solutionMoves.value[stepIndex.value] ?? null);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoiceButtons() {
  const correct = expectedMove.value;
  if (!correct) {
    choiceButtons.value = [];
    return;
  }
  const others = CROSS_NOTATION_CHOICE_POOL.filter((m) => m !== correct);
  const distractors = shuffle(others).slice(0, 3);
  choiceButtons.value = shuffle([correct, ...distractors]);
  choiceRound.value += 1;
}

function choiceButtonClass(mv) {
  const base = isDark.value ? 'btn-outline-light' : 'btn-outline-primary';
  if (helpEnabled.value && mv === expectedMove.value) {
    return 'btn-outline-success cross-mission-player__choice--hint';
  }
  return base;
}

function clearFlashTimer() {
  if (flashTimer != null) {
    window.clearTimeout(flashTimer);
    flashTimer = null;
  }
}

function triggerSuccessFlash() {
  clearFlashTimer();
  cubeSuccessFlash.value = true;
  flashTimer = window.setTimeout(() => {
    cubeSuccessFlash.value = false;
    flashTimer = null;
  }, 650);
}

function onMissionSuccess() {
  missionComplete.value = true;
  triggerSuccessFlash();
  recordProgress(BEGINNER_CFOP_COURSE, CROSS_MODULE_ID, CROSS_LESSON_ID, totalSteps.value - 1);
  unlockF2lIntro();
}

function onPickMove(mv) {
  if (missionComplete.value || !expectedMove.value) return;
  if (mv !== expectedMove.value) {
    failureMessage.value = t('crossGame.wrongMove');
    window.setTimeout(() => {
      failureMessage.value = '';
    }, 3200);
    return;
  }
  failureMessage.value = '';
  const nextAlg = appliedAlg.value.trim()
    ? `${appliedAlg.value.trim()} ${mv}`
    : mv;
  appliedAlg.value = nextAlg;
  const nextStep = stepIndex.value + 1;
  stepIndex.value = nextStep;
  recordProgress(BEGINNER_CFOP_COURSE, CROSS_MODULE_ID, CROSS_LESSON_ID, Math.min(nextStep, totalSteps.value - 1));

  if (nextStep >= totalSteps.value) {
    onMissionSuccess();
    return;
  }
  nextTick(() => {
    buildChoiceButtons();
    cubeRef.value?.resumePlayback?.();
  });
}

function resetMission() {
  clearFlashTimer();
  missionComplete.value = false;
  cubeSuccessFlash.value = false;
  appliedAlg.value = '';
  stepIndex.value = 0;
  failureMessage.value = '';
  helpEnabled.value = false;
  cubeKey.value += 1;
  nextTick(() => {
    buildChoiceButtons();
    cubeRef.value?.resumePlayback?.();
  });
}

watch(expectedMove, () => {
  if (!missionComplete.value) buildChoiceButtons();
});

onMounted(() => {
  buildChoiceButtons();
  nextTick(() => {
    cubeRef.value?.seekAfterUserMoves?.(0);
    cubeRef.value?.resumePlayback?.();
  });
});

onUnmounted(() => {
  clearFlashTimer();
});
</script>

<style scoped>
.cross-mission-player__cube-wrap {
  overflow: hidden;
  background: var(--bs-body-bg, #fff);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.15s ease;
}

.cross-mission-player__cube-wrap--flash {
  animation: cross-mission-success-flash 0.65s ease;
}

@keyframes cross-mission-success-flash {
  0%,
  100% {
    box-shadow: inset 0 0 0 0 transparent;
  }
  35% {
    box-shadow:
      inset 0 0 0 3px rgba(25, 135, 84, 0.9),
      0 0 24px rgba(25, 135, 84, 0.35);
  }
}

.cross-mission-player__cube-wrap :deep(twisty-player) {
  height: 300px !important;
  width: 100% !important;
  max-width: 500px;
}

.cross-mission-player__cube-wrap :deep(.rubik-cube-container) {
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.cross-mission-player__success {
  border-radius: var(--bs-border-radius, 0.375rem);
}

.cross-mission-player__choice--hint {
  box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.95);
  border-color: rgba(25, 135, 84, 0.9);
}

@media (min-width: 992px) {
  .cross-mission-player__cube-wrap {
    min-height: 500px;
  }

  .cross-mission-player__cube-wrap :deep(twisty-player) {
    height: 500px !important;
  }
}
</style>
