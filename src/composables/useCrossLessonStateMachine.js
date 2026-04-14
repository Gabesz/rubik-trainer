import { ref, computed, watch, unref } from 'vue';
import { normalizeCrossStep, CROSS_LESSON_PHASES } from '../data/courses/crossLessonEngine';

/**
 * Cross Lesson Engine v2 — explicit phases for the per-step training loop.
 * Phase flow (acknowledge): PRESENTING → (user confirms) → may show FEEDBACK_SUCCESS → PRESENTING on next step.
 */
export function useCrossLessonStateMachine(lessonSource, options = {}) {
  const getLesson = () => unref(lessonSource);

  const stepIndex = ref(0);
  const phase = ref(CROSS_LESSON_PHASES.PRESENTING);
  const successMessage = ref('');
  let successClearTimer = null;

  const steps = computed(() => {
    const raw = getLesson()?.steps || [];
    return raw.map(normalizeCrossStep);
  });

  const currentStep = computed(() => steps.value[stepIndex.value] || null);

  function clampStep(i) {
    const max = Math.max(0, steps.value.length - 1);
    return Math.min(Math.max(0, i), max);
  }

  function clearSuccessTimer() {
    if (successClearTimer != null) {
      window.clearTimeout(successClearTimer);
      successClearTimer = null;
    }
  }

  function flashSuccessMessage(text) {
    clearSuccessTimer();
    const msg = text && String(text).trim();
    if (!msg) {
      successMessage.value = '';
      return;
    }
    successMessage.value = msg;
    successClearTimer = window.setTimeout(() => {
      if (successMessage.value === msg) {
        successMessage.value = '';
      }
      successClearTimer = null;
    }, 4500);
  }

  function syncInitialStep() {
    const les = getLesson();
    const idx = unref(options.initialStepIndex);
    const max = Math.max(0, (les?.steps?.length || 1) - 1);
    const n = typeof idx === 'number' ? idx : 0;
    stepIndex.value = clampStep(Math.min(Math.max(0, n), max));
    phase.value = CROSS_LESSON_PHASES.PRESENTING;
    successMessage.value = '';
    clearSuccessTimer();
  }

  watch(
    () => [getLesson()?.id, unref(options.initialStepIndex)],
    () => {
      syncInitialStep();
    },
    { immediate: true }
  );

  watch(steps, () => {
    stepIndex.value = clampStep(stepIndex.value);
  });

  /**
   * @returns {{ ok: boolean, reason?: string }}
   */
  function validateCurrentStep() {
    const s = currentStep.value;
    if (!s) return { ok: false, reason: 'no_step' };
    const t = s.validationType;
    if (t === 'acknowledge') return { ok: true };
    return { ok: false, reason: 'unsupported_validation' };
  }

  function confirmCompletion() {
    const v = validateCurrentStep();
    if (!v.ok) return { advanced: false, validated: false };

    phase.value = CROSS_LESSON_PHASES.FEEDBACK_SUCCESS;
    flashSuccessMessage(currentStep.value?.successMessage || '');

    const last = steps.value.length - 1;
    if (stepIndex.value < last) {
      stepIndex.value += 1;
      phase.value = CROSS_LESSON_PHASES.PRESENTING;
      return { advanced: true, validated: true };
    }

    phase.value = CROSS_LESSON_PHASES.PRESENTING;
    return { advanced: false, validated: true };
  }

  function goPrev() {
    if (stepIndex.value <= 0) return;
    stepIndex.value -= 1;
    phase.value = CROSS_LESSON_PHASES.PRESENTING;
    successMessage.value = '';
    clearSuccessTimer();
  }

  function goNext() {
    if (stepIndex.value >= steps.value.length - 1) return;
    stepIndex.value += 1;
    phase.value = CROSS_LESSON_PHASES.PRESENTING;
    successMessage.value = '';
    clearSuccessTimer();
  }

  function reset() {
    stepIndex.value = 0;
    phase.value = CROSS_LESSON_PHASES.PRESENTING;
    successMessage.value = '';
    clearSuccessTimer();
  }

  return {
    CROSS_LESSON_PHASES,
    stepIndex,
    phase,
    successMessage,
    steps,
    currentStep,
    validateCurrentStep,
    confirmCompletion,
    goPrev,
    goNext,
    reset,
    syncInitialStep,
    clearSuccessTimer,
  };
}
