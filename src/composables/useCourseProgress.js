import { ref, computed } from 'vue';

import { countLessonSteps } from '../data/courses/beginnerCfop';

const STORAGE_KEY = 'course-beginner-cfop-progress';

function readRaw() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeRaw(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

/** 0-based index of this step in the flattened course (all modules, lesson order). */
export function linearStepIndex(course, moduleId, lessonId, stepIndex) {
  let acc = 0;
  for (const mod of course.modules) {
    for (const les of mod.lessons || []) {
      if (mod.id === moduleId && les.id === lessonId) {
        return acc + stepIndex;
      }
      acc += countLessonSteps(les);
    }
  }
  return acc;
}

/**
 * Persisted progress for the beginner CFOP course.
 * @param {string} courseId
 */
export function useCourseProgress(courseId) {
  const existing = readRaw();
  const initial =
    existing && existing.courseId === courseId
      ? {
          ...existing,
          unlocks: {
            f2lIntro: existing.unlocks?.f2lIntro === true,
          },
        }
      : {
          courseId,
          moduleId: null,
          lessonId: null,
          stepIndex: 0,
          /** Max (linearStepIndex + 1) the user has reached (capped by total steps). */
          completedSteps: 0,
          /** Feature flags unlocked by completing lessons (e.g. Cross → F2L). */
          unlocks: {
            f2lIntro: false,
          },
          updatedAt: null,
        };

  const state = ref(initial);

  function persist() {
    state.value.updatedAt = new Date().toISOString();
    writeRaw(state.value);
  }

  function setPosition({ moduleId, lessonId, stepIndex }) {
    state.value.moduleId = moduleId;
    state.value.lessonId = lessonId;
    state.value.stepIndex = stepIndex;
    persist();
  }

  function setCompletedSteps(n) {
    state.value.completedSteps = Math.max(0, n);
    persist();
  }

  /** Call when user moves forward: update high-water mark of steps reached. */
  function recordProgress(course, moduleId, lessonId, stepIndex) {
    const linear = linearStepIndex(course, moduleId, lessonId, stepIndex);
    const reached = linear + 1;
    if (reached > (state.value.completedSteps || 0)) {
      state.value.completedSteps = reached;
    }
    persist();
  }

  const completedSteps = computed(() => state.value.completedSteps || 0);

  const f2lIntroUnlocked = computed(() => state.value.unlocks?.f2lIntro === true);

  function unlockF2lIntro() {
    if (state.value.unlocks?.f2lIntro) return;
    state.value.unlocks = { ...state.value.unlocks, f2lIntro: true };
    persist();
  }

  function isModuleUnlocked(moduleId) {
    if (moduleId === 'f2l-intro') {
      return state.value.unlocks?.f2lIntro === true;
    }
    return true;
  }

  return {
    state,
    completedSteps,
    f2lIntroUnlocked,
    setPosition,
    setCompletedSteps,
    recordProgress,
    unlockF2lIntro,
    isModuleUnlocked,
    persist,
  };
}
