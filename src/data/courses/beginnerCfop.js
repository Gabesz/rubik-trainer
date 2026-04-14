/**
 * CFOP Beginner Course — content and structure (MVP).
 * Steps use defaultSetup on the lesson plus optional per-step setup override.
 * cumulativeAlg: moves after setup end through this step (space-separated). Empty = show post-setup state only.
 */

import { crossMissionLesson } from './crossLessonEngine';
import { crossMissions } from './crossMissions';

function crossMissionStepCount() {
  const moves = crossMissions[0]?.solutionMoves;
  if (Array.isArray(moves) && moves.length) return moves.length;
  return crossMissions.length;
}

function makePlaceholderLesson(lessonId) {
  return {
    id: lessonId,
    title: 'Coming soon',
    requireStepConfirm: false,
    defaultSetup: '',
    steps: [
      {
        text:
          'This module will be added in a future update. For now, use the Cross lesson or the main trainers from the home page.',
        cumulativeAlg: '',
        hints: [
          'You can open the F2L, OLL, or PLL trainers from the home page.',
          'The Notation page explains basic moves (R, U, F, etc.).',
          'Come back later for guided lessons in this slot.',
        ],
      },
    ],
  };
}

export const BEGINNER_CFOP_COURSE = {
  id: 'beginner-cfop',
  title: 'CFOP Beginner Course',
  modules: [
    {
      id: 'notation-beginner',
      title: 'Notation — Beginner',
      description: 'Learn the six face turns (U, D, L, R, F, B) on a solved 3D cube with short challenges.',
      /** Rough guided study time shown on course overview (minutes). */
      estimatedMinutes: 5,
      lessons: [],
    },
    {
      id: 'notation-intermediate',
      title: 'Notation — Intermediate',
      description: 'Add prime (′) and double turns; practice short move combinations.',
      estimatedMinutes: 15,
      lessons: [],
    },
    {
      id: 'notation-advanced',
      title: 'Notation — Advanced',
      description: 'Full notation input, move history, and common algorithm patterns.',
      estimatedMinutes: 30,
      lessons: [],
    },
    {
      id: 'cross',
      title: 'Cross',
      description: 'White cross on the bottom: mission mode — scramble, then build the cross on an interactive cube.',
      lessons: [crossMissionLesson],
    },
    {
      id: 'f2l-intro',
      title: 'F2L intro',
      description: 'Intuitive corner–edge pairs (no full case library).',
      lessons: [makePlaceholderLesson('f2l-intro-placeholder')],
    },
    {
      id: 'oll-2look-intro',
      title: '2-look OLL intro',
      description: 'Concept plus a few example cases (not the full 57).',
      lessons: [makePlaceholderLesson('oll-2look-intro-placeholder')],
    },
    {
      id: 'pll-2look-intro',
      title: '2-look PLL intro',
      description: 'Concept plus a few example cases (not the full 21).',
      lessons: [makePlaceholderLesson('pll-2look-intro-placeholder')],
    },
  ],
};

export function findModule(course, moduleId) {
  return course.modules.find((m) => m.id === moduleId) || null;
}

export function countLessonSteps(lesson) {
  if (lesson?.player === 'cross-mission') return crossMissionStepCount();
  return lesson?.steps?.length ?? 0;
}

export function countTotalStepsInCourse(course) {
  let n = 0;
  for (const mod of course.modules) {
    for (const les of mod.lessons || []) {
      n += countLessonSteps(les);
    }
  }
  return n;
}

export function getPrimaryLesson(module) {
  if (!module?.lessons?.length) return null;
  return module.lessons[0];
}
