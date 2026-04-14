<template>
  <CoursePageShell user-icon-suffix="module">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-9">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-3">
            <li class="breadcrumb-item">
              <router-link to="/">{{ $t('nav.home') }}</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/course/beginner-cfop">{{ $t('course.title') }}</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ module ? $t(`course.modules.${module.id}.title`) : $t('courseModule.moduleFallback') }}
            </li>
          </ol>
        </nav>

        <template v-if="!module">
          <div class="alert alert-warning">
            {{ $t('courseModule.unknown') }}
            <router-link to="/course/beginner-cfop" class="alert-link">{{ $t('courseModule.backToOverview') }}</router-link>
          </div>
        </template>

        <template v-else-if="notationTier">
          <template v-if="notationModuleLocked">
            <h1 class="h2 mb-3">{{ $t(`course.modules.${module.id}.title`) }}</h1>
            <div class="alert alert-secondary">
              {{
                notationTier === 'intermediate'
                  ? $t('courseModule.notationLockedIntermediate')
                  : $t('courseModule.notationLockedAdvanced')
              }}
            </div>
            <router-link
              v-if="notationTier === 'intermediate'"
              :to="`/course/beginner-cfop/notation-beginner`"
              class="btn btn-primary me-2"
            >
              {{ $t('courseModule.goToNotationBeginner') }}
            </router-link>
            <router-link
              v-else
              :to="`/course/beginner-cfop/notation-intermediate`"
              class="btn btn-primary me-2"
            >
              {{ $t('courseModule.goToNotationIntermediate') }}
            </router-link>
            <router-link to="/course/beginner-cfop" class="btn btn-outline-secondary">{{
              $t('courseModule.backOverviewBtn')
            }}</router-link>
          </template>
          <template v-else>
            <h1 class="h2 mb-3">{{ $t(`course.modules.${module.id}.title`) }}</h1>
            <NotationCoursePlayer :tier="notationTier" :module-id="module.id" />
          </template>
        </template>

        <template v-else-if="!lesson">
          <h1 class="h2 mb-3">{{ $t(`course.modules.${module.id}.title`) }}</h1>
          <p class="text-muted">{{ $t('courseModule.noLessons') }}</p>
          <router-link to="/course/beginner-cfop" class="btn btn-outline-secondary">{{
            $t('courseModule.backOverviewBtn')
          }}</router-link>
        </template>

        <template v-else-if="isF2lLocked">
          <h1 class="h2 mb-3">{{ $t(`course.modules.${module.id}.title`) }}</h1>
          <div class="alert alert-secondary">
            {{ $t('courseModule.lockedAlert') }}
          </div>
          <router-link to="/course/beginner-cfop/cross" class="btn btn-primary me-2">{{
            $t('courseModule.goToCross')
          }}</router-link>
          <router-link to="/course/beginner-cfop" class="btn btn-outline-secondary">{{
            $t('courseModule.backOverviewBtn')
          }}</router-link>
        </template>

        <template v-else>
          <h1 class="h2 mb-3">{{ $t(`course.modules.${module.id}.title`) }}</h1>
          <CourseLessonPlayer
            :lesson="lesson"
            :module-id="module.id"
            :initial-step-index="initialStepIndex"
            @step-change="onStepChange"
          />
        </template>
      </div>
    </div>
  </CoursePageShell>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CoursePageShell from '../components/CoursePageShell.vue';
import CourseLessonPlayer from '../components/CourseLessonPlayer.vue';
import NotationCoursePlayer from '../components/NotationCoursePlayer.vue';
import {
  BEGINNER_CFOP_COURSE,
  countLessonSteps,
  findModule,
  getPrimaryLesson,
} from '../data/courses/beginnerCfop';
import { moduleIdToTier } from '../data/courses/notationMissions.js';
import { useCourseProgress } from '../composables/useCourseProgress';
import { useNotationCourseProgress } from '../composables/useNotationCourseProgress.js';

const route = useRoute();
const course = BEGINNER_CFOP_COURSE;

const moduleId = computed(() => route.params.moduleId);
const module = computed(() => findModule(course, moduleId.value));
const lesson = computed(() => getPrimaryLesson(module.value));

const { state, setPosition, recordProgress, f2lIntroUnlocked } = useCourseProgress(course.id);
const { intermediateUnlocked, advancedUnlocked } = useNotationCourseProgress();

const notationTier = computed(() => moduleIdToTier(module.value?.id ?? ''));

const notationModuleLocked = computed(() => {
  const t = notationTier.value;
  if (t === 'intermediate') return !intermediateUnlocked.value;
  if (t === 'advanced') return !advancedUnlocked.value;
  return false;
});

const isF2lLocked = computed(() => {
  if (module.value?.id !== 'f2l-intro') return false;
  return !f2lIntroUnlocked.value;
});

const initialStepIndex = computed(() => {
  const les = lesson.value;
  const mod = module.value;
  if (!les || !mod) return 0;
  if (state.value.moduleId === mod.id && state.value.lessonId === les.id) {
    const max = Math.max(0, countLessonSteps(les) - 1);
    return Math.min(Math.max(0, state.value.stepIndex ?? 0), max);
  }
  return 0;
});

function onStepChange({ moduleId: mid, lessonId, stepIndex }) {
  setPosition({ moduleId: mid, lessonId, stepIndex });
  recordProgress(course, mid, lessonId, stepIndex);
}

</script>
