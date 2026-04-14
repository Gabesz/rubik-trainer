<template>
  <CoursePageShell user-icon-suffix="overview">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-9">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-3">
            <li class="breadcrumb-item">
              <router-link to="/">{{ $t('nav.home') }}</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ $t('course.title') }}</li>
          </ol>
        </nav>

        <h1 class="h2 mb-2">{{ $t('course.title') }}</h1>
        <div class="course-overview-intro text-muted mb-4">
          <p class="course-overview-intro__lead mb-3">
            {{ $t('courseOverview.introLead') }}
          </p>
          <ul class="list-unstyled course-overview-intro__list mb-0">
            <li class="course-overview-intro__item d-flex gap-3">
              <span class="course-overview-intro__icon flex-shrink-0" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.146 2.646a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L4.293 4.5 3.146 3.354a.5.5 0 0 1 0-.708zM3 8a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5h-.5A.5.5 0 0 1 3 8.5V8zm0-4a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5h-.5A.5.5 0 0 1 3 4.5V4z"
                  />
                </svg>
              </span>
              <p class="mb-0">{{ $t('courseOverview.introBulletSteps') }}</p>
            </li>
            <li class="course-overview-intro__item d-flex gap-3">
              <span class="course-overview-intro__icon flex-shrink-0" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
                  />
                </svg>
              </span>
              <p class="mb-0">{{ $t('courseOverview.introBulletNotation') }}</p>
            </li>
            <li class="course-overview-intro__item d-flex gap-3">
              <span class="course-overview-intro__icon flex-shrink-0" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.859a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"
                  />
                </svg>
              </span>
              <p class="mb-0">{{ $t('courseOverview.introBulletCross') }}</p>
            </li>
            <li class="course-overview-intro__item d-flex gap-3">
              <span class="course-overview-intro__icon flex-shrink-0" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M10.354 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                  <path
                    d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-.649-2.274-1.61-2.845l-.26-.15A2.5 2.5 0 0 0 11.5 4.5h-.011c-.301-.056-.546-.171-.82-.345l-.05-.03a2 2 0 0 1-1.887 0c-.287.173-.615.3-.957.345A2.5 2.5 0 0 0 8 5.5h-.009l-.001.004A5.54 5.54 0 0 0 4.406 4.099z"
                  />
                </svg>
              </span>
              <p class="mb-0">{{ $t('courseOverview.introBulletProgress') }}</p>
            </li>
          </ul>
        </div>

        <div class="mb-4">
          <div class="d-flex justify-content-between small text-muted mb-1">
            <span>{{ $t('courseOverview.overallProgress') }}</span>
            <span>{{ progressLabel }}</span>
          </div>
          <div class="progress course-overview-progress" style="height: 8px">
            <div
              class="progress-bar course-overview-progress__bar"
              role="progressbar"
              :style="{ width: overallPercent + '%' }"
              :aria-valuenow="Math.min(completedSteps, totalSteps)"
              aria-valuemin="0"
              :aria-valuemax="totalSteps"
            />
          </div>
        </div>

        <div class="row g-3">
          <div v-for="mod in notationModules" :key="mod.id" class="col-12 col-md-6">
            <div
              class="card h-100 course-module-card"
              :class="[
                `course-module-card--${mod.id}`,
                isDark ? 'course-module-card--dark' : '',
                { 'course-module-card--completed': isModuleDone(mod) },
              ]"
            >
              <div class="card-body d-flex flex-column">
                <h2 class="h5 card-title d-flex align-items-center gap-2 flex-wrap">
                  {{ $t(`course.modules.${mod.id}.title`) }}
                  <span
                    v-if="isNotationLocked(mod.id)"
                    class="badge text-bg-secondary fw-normal"
                  >
                    {{ $t('courseOverview.locked') }}
                  </span>
                  <span
                    v-else-if="isModuleDone(mod)"
                    class="badge course-module-card__done-badge fw-semibold d-inline-flex align-items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    {{ $t('courseOverview.completedBadge') }}
                  </span>
                </h2>
                <p
                  v-if="mod.estimatedMinutes"
                  class="small course-module-card__study-time mb-2 mb-md-1"
                >
                  {{ $t('courseOverview.estimatedStudyTime', { minutes: mod.estimatedMinutes }) }}
                </p>
                <p class="card-text small text-muted flex-grow-1">{{ $t(`course.modules.${mod.id}.description`) }}</p>
                <router-link
                  v-if="canOpenModule(mod)"
                  :to="`/course/beginner-cfop/${mod.id}`"
                  class="btn btn-primary btn-sm align-self-start"
                >
                  {{ $t('courseOverview.openModule') }}
                </router-link>
                <i18n-t
                  v-else-if="mod.id === 'notation-intermediate'"
                  keypath="courseOverview.unlockNotationBeginner"
                  tag="p"
                  class="small text-muted mb-0"
                >
                  <template #notationBeginner>
                    <router-link to="/course/beginner-cfop/notation-beginner">{{
                      $t('course.modules.notation-beginner.title')
                    }}</router-link>
                  </template>
                </i18n-t>
                <i18n-t
                  v-else-if="mod.id === 'notation-advanced'"
                  keypath="courseOverview.unlockNotationIntermediate"
                  tag="p"
                  class="small text-muted mb-0"
                >
                  <template #notationIntermediate>
                    <router-link to="/course/beginner-cfop/notation-intermediate">{{
                      $t('course.modules.notation-intermediate.title')
                    }}</router-link>
                  </template>
                </i18n-t>
              </div>
            </div>
          </div>
        </div>

        <hr class="course-overview__section-rule my-4" />

        <div class="row g-3">
          <div v-for="mod in courseBodyModules" :key="mod.id" class="col-12">
            <div
              class="card h-100 course-module-card"
              :class="[
                `course-module-card--${mod.id}`,
                isDark ? 'course-module-card--dark' : '',
                { 'course-module-card--completed': isModuleDone(mod) },
              ]"
            >
              <div class="card-body d-flex flex-column">
                <h2 class="h5 card-title d-flex align-items-center gap-2 flex-wrap">
                  {{ $t(`course.modules.${mod.id}.title`) }}
                  <span
                    v-if="mod.id === 'f2l-intro' && !f2lIntroUnlocked"
                    class="badge text-bg-secondary fw-normal"
                  >
                    {{ $t('courseOverview.locked') }}
                  </span>
                  <span
                    v-else-if="isModuleDone(mod)"
                    class="badge course-module-card__done-badge fw-semibold d-inline-flex align-items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    {{ $t('courseOverview.completedBadge') }}
                  </span>
                </h2>
                <p
                  v-if="mod.estimatedMinutes"
                  class="small course-module-card__study-time mb-2 mb-md-1"
                >
                  {{ $t('courseOverview.estimatedStudyTime', { minutes: mod.estimatedMinutes }) }}
                </p>
                <p class="card-text small text-muted flex-grow-1">{{ $t(`course.modules.${mod.id}.description`) }}</p>
                <router-link
                  v-if="canOpenModule(mod)"
                  :to="`/course/beginner-cfop/${mod.id}`"
                  class="btn btn-primary btn-sm align-self-start"
                >
                  {{ $t('courseOverview.openModule') }}
                </router-link>
                <i18n-t
                  v-else-if="mod.id === 'f2l-intro'"
                  keypath="courseOverview.unlockHint"
                  tag="p"
                  class="small text-muted mb-0"
                >
                  <template #cross>
                    <router-link to="/course/beginner-cfop/cross">{{ $t('nav.cross') }}</router-link>
                  </template>
                </i18n-t>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CoursePageShell>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CoursePageShell from '../components/CoursePageShell.vue';
import { BEGINNER_CFOP_COURSE, countTotalStepsInCourse } from '../data/courses/beginnerCfop';
import { useCourseProgress } from '../composables/useCourseProgress';
import { useNotationCourseProgress } from '../composables/useNotationCourseProgress.js';
import { useTheme } from '../composables/useTheme';

const { t } = useI18n();

const course = BEGINNER_CFOP_COURSE;
const { isDark } = useTheme();
const { completedSteps, f2lIntroUnlocked } = useCourseProgress(course.id);
const {
  beginnerDone,
  intermediateDone,
  advancedDone,
  intermediateUnlocked,
  advancedUnlocked,
} = useNotationCourseProgress();

const notationModules = computed(() => course.modules.filter((m) => m.id.startsWith('notation-')));
const courseBodyModules = computed(() => course.modules.filter((m) => !m.id.startsWith('notation-')));

function isNotationLocked(modId) {
  if (modId === 'notation-intermediate') return !intermediateUnlocked.value;
  if (modId === 'notation-advanced') return !advancedUnlocked.value;
  return false;
}

function canOpenModule(mod) {
  if (mod.id === 'f2l-intro' && !f2lIntroUnlocked.value) return false;
  if (isNotationLocked(mod.id)) return false;
  return true;
}

function isModuleDone(mod) {
  if (mod.id === 'notation-beginner') return beginnerDone.value;
  if (mod.id === 'notation-intermediate') return intermediateDone.value;
  if (mod.id === 'notation-advanced') return advancedDone.value;
  if (mod.id === 'cross') return f2lIntroUnlocked.value;
  return false;
}

const totalSteps = computed(() => countTotalStepsInCourse(course));

const overallPercent = computed(() => {
  if (!totalSteps.value) return 0;
  return Math.min(100, (completedSteps.value / totalSteps.value) * 100);
});

const progressLabel = computed(() => {
  const c = Math.min(completedSteps.value, totalSteps.value);
  return t('courseOverview.stepsProgress', { done: c, total: totalSteps.value });
});
</script>

<style scoped>
.course-overview__section-rule {
  border: 0;
  border-top: 1px solid var(--bs-border-color);
  opacity: 1;
}

.course-overview-intro__lead {
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--bs-secondary-color, #6c757d);
}

.course-overview-intro__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-overview-intro__icon {
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding-top: 0.2rem;
  border-radius: 0.5rem;
  color: var(--bs-primary, #0d6efd);
  background: color-mix(in srgb, var(--bs-primary, #0d6efd) 12%, transparent);
}

.course-overview-intro__item p {
  line-height: 1.55;
  padding-top: 0.15rem;
}

/* Course module cards — per-module accent (notation / CFOP steps) */
.course-module-card {
  --mod-accent: var(--bs-primary);
  position: relative;
  border-radius: 0.65rem;
  border: 1px solid color-mix(in srgb, var(--mod-accent) 22%, var(--bs-border-color));
  border-left: 4px solid var(--mod-accent);
  background: linear-gradient(
    155deg,
    color-mix(in srgb, var(--mod-accent) 13%, var(--bs-body-bg)) 0%,
    var(--bs-body-bg) 52%
  );
  box-shadow: 0 1px 2px color-mix(in srgb, var(--mod-accent) 8%, transparent);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.course-module-card:hover {
  border-color: color-mix(in srgb, var(--mod-accent) 42%, var(--bs-border-color));
  box-shadow:
    0 6px 20px color-mix(in srgb, var(--mod-accent) 18%, transparent),
    0 14px 36px rgba(0, 0, 0, 0.07);
}

.course-module-card--notation-beginner {
  --mod-accent: #0aa2c0;
}
.course-module-card--notation-intermediate {
  --mod-accent: #6d28d9;
}
.course-module-card--notation-advanced {
  --mod-accent: #db2777;
}
.course-module-card--cross {
  --mod-accent: #059669;
}
.course-module-card--f2l-intro {
  --mod-accent: #ea580c;
}
.course-module-card--oll-2look-intro {
  --mod-accent: #ca8a04;
}
.course-module-card--pll-2look-intro {
  --mod-accent: #dc2626;
}

.course-module-card--dark {
  background: linear-gradient(
    155deg,
    color-mix(in srgb, var(--mod-accent) 22%, #1c1f24) 0%,
    #141619 55%
  );
  border-color: color-mix(in srgb, var(--mod-accent) 38%, #3d444b);
  border-left-color: var(--mod-accent);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--mod-accent) 25%, transparent);
}

.course-module-card--dark:hover {
  border-color: color-mix(in srgb, var(--mod-accent) 55%, #3d444b);
  box-shadow:
    0 6px 22px color-mix(in srgb, var(--mod-accent) 28%, transparent),
    0 0 0 1px color-mix(in srgb, var(--mod-accent) 15%, transparent);
}

.course-module-card--completed {
  border-left-width: 5px;
  border-left-color: var(--bs-success, #198754);
  background: linear-gradient(
    155deg,
    color-mix(in srgb, var(--bs-success, #198754) 14%, var(--bs-body-bg)) 0%,
    color-mix(in srgb, var(--mod-accent) 10%, var(--bs-body-bg)) 48%,
    var(--bs-body-bg) 100%
  );
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--bs-success, #198754) 12%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--bs-success, #198754) 18%, transparent);
}

.course-module-card--completed.course-module-card--dark {
  background: linear-gradient(
    155deg,
    color-mix(in srgb, var(--bs-success, #198754) 18%, #1a1d21) 0%,
    color-mix(in srgb, var(--mod-accent) 14%, #141619) 50%,
    #141619 100%
  );
  border-left-color: #2fb344;
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--bs-success, #198754) 35%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--bs-success, #198754) 22%, transparent);
}

.course-module-card__done-badge {
  background-color: var(--bs-success, #198754) !important;
  color: #fff !important;
}

.course-module-card--dark .course-module-card__done-badge {
  background-color: #2fb344 !important;
  color: #0b0d0f !important;
}

.course-module-card__study-time {
  color: var(--bs-secondary-color, #6c757d);
  font-weight: 500;
}

.course-overview-progress {
  background-color: color-mix(in srgb, var(--bs-secondary-color) 12%, var(--bs-border-color));
  border-radius: 999px;
  overflow: hidden;
}

.course-overview-progress__bar {
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border-radius: 999px;
}
</style>
