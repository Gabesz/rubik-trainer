<template>
  <div class="course-lesson-player">
    <div class="mb-3">
      <h2 class="h4 mb-1">{{ lesson.title }}</h2>
      <p class="text-muted small mb-0">Progress: Step {{ stepIndex + 1 }} / {{ stepsCount }}</p>
      <div class="progress mt-2 course-lesson-player__step-bar" style="height: 6px">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: stepProgressPercent + '%' }"
          :aria-valuenow="stepIndex + 1"
          aria-valuemin="1"
          :aria-valuemax="stepsCount"
        />
      </div>
    </div>

    <div
      v-if="feedbackMessage"
      class="alert alert-success py-2 mb-3"
      role="status"
      aria-live="polite"
    >
      {{ feedbackMessage }}
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-5 order-lg-2">
        <div
          class="course-lesson-player__cube-wrap rounded border"
          :class="isDark ? 'border-secondary' : ''"
        >
          <RubikCube3D
            ref="cubeRef"
            :key="cubeKey"
            :algorithm="algorithmProp"
            :setup="effectiveSetup"
            :show-move-list="false"
            :auto-stick-to-setup-end="false"
            :sync-timeline-on-algorithm-prop="false"
            :prepend-neutral-algorithm-prefix="true"
          />
        </div>
      </div>
      <div class="col-12 col-lg-7 order-lg-1">
        <div
          class="course-lesson-player__text card border"
          :class="isDark ? 'bg-dark border-secondary text-light' : ''"
        >
          <div class="card-body">
            <p class="mb-0 course-lesson-player__narration fs-5 fw-medium" role="status">
              {{ instructionText }}
            </p>
          </div>
        </div>

        <div
          v-if="machine && machine.hintLevel > 0 && activeHintText"
          class="alert alert-secondary mt-3 mb-0 small"
          role="status"
        >
          <strong>Hint {{ machine.hintLevel }} of 3:</strong>
          {{ activeHintText }}
        </div>
      </div>
    </div>

    <div
      class="course-lesson-player__controls card border mt-4"
      :class="isDark ? 'bg-dark border-secondary' : 'bg-body-secondary'"
    >
      <div class="card-body py-3">
        <p class="text-muted small text-center mb-3 mb-sm-2">
          <template v-if="requireStepConfirm">
            Use <strong>I did it</strong> to confirm and advance.
            <strong>Next step</strong> is disabled while this lesson requires confirmation on each step.
          </template>
          <template v-else>
            Use <strong>Next step</strong> or <strong>I did it</strong> to move forward.
          </template>
        </p>
        <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            :disabled="nextStepDisabled"
            title="Go to the next step"
            @click="onNextStep"
          >
            Next step
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :disabled="confirmDisabled"
            @click="onConfirmStep"
          >
            I did it
          </button>
          <button type="button" class="btn btn-outline-warning btn-sm" @click="resetLesson">
            Reset lesson
          </button>
        </div>
        <div class="d-grid gap-2 d-sm-flex flex-sm-wrap justify-content-sm-center">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"
            :disabled="hintDisabled"
            @click="onCycleHint"
          >
            Hint
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted, shallowRef } from 'vue';
import RubikCube3D from './RubikCube3D.vue';
import { useTheme } from '../composables/useTheme';
import { CrossLessonStateMachine } from '../modules/cross/CrossLessonStateMachine.js';

const FEEDBACK_MS = 2600;

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  initialStepIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['step-change', 'lesson-complete']);

const { isDark } = useTheme();

const cubeRef = ref(null);
const cubeKey = ref(0);
const machine = shallowRef(new CrossLessonStateMachine([]));
const stateTick = ref(0);
const feedbackMessage = ref('');
const isAnimating = ref(false);
let feedbackClearTimer = null;

function touch() {
  stateTick.value += 1;
}

function clearFeedbackTimer() {
  if (feedbackClearTimer != null) {
    window.clearTimeout(feedbackClearTimer);
    feedbackClearTimer = null;
  }
}

function clampInitialIndex(len) {
  const max = Math.max(0, len - 1);
  return Math.min(Math.max(0, props.initialStepIndex), max);
}

function rebuildMachine() {
  const rawSteps = props.lesson.steps || [];
  const m = new CrossLessonStateMachine(rawSteps);
  m.currentIndex = clampInitialIndex(m.steps.length);
  m.hintLevel = 0;
  m.completed = false;
  machine.value = m;
  touch();
}

rebuildMachine();

const requireStepConfirm = computed(() => props.lesson.requireStepConfirm !== false);

const stepsCount = computed(() => {
  stateTick.value;
  return machine.value?.steps?.length ?? 0;
});

const stepIndex = computed(() => {
  stateTick.value;
  return machine.value?.currentIndex ?? 0;
});

const currentStep = computed(() => {
  stateTick.value;
  return machine.value?.getCurrentStep() ?? null;
});

const instructionText = computed(() => (currentStep.value?.instruction || '').trim() || '—');

const effectiveSetup = computed(() => {
  const base = (props.lesson.defaultSetup && props.lesson.defaultSetup.trim()) || '';
  const extra = (currentStep.value?.setup && String(currentStep.value.setup).trim()) || '';
  return extra ? `${base} ${extra}`.trim() : base;
});

const algorithmProp = computed(() => (currentStep.value?.cumulativeAlg || '').trim());

const userMoveCount = computed(() => {
  const t = algorithmProp.value;
  if (!t) return 0;
  return t.split(/\s+/).filter((m) => m.length > 0).length;
});

const stepProgressPercent = computed(() => {
  if (!stepsCount.value) return 0;
  return ((stepIndex.value + 1) / stepsCount.value) * 100;
});

const atLastStep = computed(() => {
  stateTick.value;
  const m = machine.value;
  if (!m?.steps?.length) return true;
  return m.currentIndex >= m.steps.length - 1;
});

/** When requireStepConfirm, forward-only navigation is I did it (Next step stays off). */
const nextStepDisabled = computed(() => {
  stateTick.value;
  const m = machine.value;
  if (!m || m.isCompleted()) return true;
  if (requireStepConfirm.value) return true;
  if (atLastStep.value) return true;
  return false;
});

const confirmDisabled = computed(() => {
  stateTick.value;
  const m = machine.value;
  if (!m || !m.getCurrentStep()) return true;
  if (m.isCompleted()) return true;
  return isAnimating.value;
});

const activeHintText = computed(() => {
  stateTick.value;
  return machine.value?.getHint() ?? '';
});

const hasHintContent = computed(() => {
  stateTick.value;
  const step = machine.value?.getCurrentStep();
  if (!step) return false;
  const soft = step.hint && String(step.hint).trim();
  const arr = step.hints?.length;
  return Boolean(soft || arr);
});

const hintDisabled = computed(() => {
  stateTick.value;
  if (!machine.value || !hasHintContent.value) return true;
  return machine.value.hintLevel >= 3;
});

function syncCubeSeek() {
  const run = () => {
    const c = cubeRef.value;
    if (c?.seekAfterUserMoves) {
      c.seekAfterUserMoves(userMoveCount.value);
    }
  };
  nextTick(() => {
    run();
    window.setTimeout(run, 80);
    window.setTimeout(run, 250);
  });
}

function emitStep() {
  emit('step-change', {
    moduleId: props.moduleId,
    lessonId: props.lesson.id,
    stepIndex: stepIndex.value,
  });
}

function scheduleFeedbackClear() {
  clearFeedbackTimer();
  isAnimating.value = true;
  feedbackClearTimer = window.setTimeout(() => {
    feedbackMessage.value = '';
    isAnimating.value = false;
    feedbackClearTimer = null;
  }, FEEDBACK_MS);
}

function onConfirmStep() {
  const m = machine.value;
  const result = m.confirmStep();
  touch();
  if (!result.ok) {
    return;
  }
  feedbackMessage.value = result.successMessage || '';
  scheduleFeedbackClear();
  syncCubeSeek();
  emitStep();
  if (result.lessonComplete) {
    emit('lesson-complete', { moduleId: props.moduleId, lessonId: props.lesson.id });
  }
}

function onNextStep() {
  if (nextStepDisabled.value) return;
  machine.value.nextStep();
  touch();
  syncCubeSeek();
  emitStep();
}

function onCycleHint() {
  const m = machine.value;
  if (!m || hintDisabled.value) return;
  if (m.hintLevel < 3) {
    m.hintLevel += 1;
  }
  touch();
}

function resetLesson() {
  clearFeedbackTimer();
  feedbackMessage.value = '';
  isAnimating.value = false;
  machine.value.reset();
  touch();
  cubeKey.value += 1;
  nextTick(() => {
    cubeRef.value?.resumePlayback?.();
    syncCubeSeek();
    emitStep();
  });
}

watch(
  () => props.lesson.id,
  () => {
    rebuildMachine();
    cubeKey.value += 1;
    clearFeedbackTimer();
    feedbackMessage.value = '';
    isAnimating.value = false;
    nextTick(() => {
      syncCubeSeek();
      emitStep();
    });
  }
);

watch(
  () => props.initialStepIndex,
  (v) => {
    const m = machine.value;
    if (!m) return;
    const max = Math.max(0, m.steps.length - 1);
    m.currentIndex = Math.min(Math.max(0, v), max);
    m.hintLevel = 0;
    m.completed = false;
    touch();
    syncCubeSeek();
    emitStep();
  }
);

watch([stepIndex, algorithmProp, effectiveSetup], () => {
  syncCubeSeek();
});

onMounted(() => {
  syncCubeSeek();
  emitStep();
});

onUnmounted(() => {
  clearFeedbackTimer();
});
</script>

<style scoped>
.course-lesson-player__cube-wrap {
  overflow: hidden;
  background: var(--bs-body-bg, #fff);
}

.course-lesson-player__narration {
  line-height: 1.65;
  white-space: pre-wrap;
}

.course-lesson-player__controls {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

@media (min-width: 992px) {
  .course-lesson-player__controls {
    position: static;
  }
}
</style>
