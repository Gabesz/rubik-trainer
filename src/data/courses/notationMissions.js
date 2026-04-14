export const NOTATION_BEGINNER_MODULE_ID = 'notation-beginner';
export const NOTATION_INTERMEDIATE_MODULE_ID = 'notation-intermediate';
export const NOTATION_ADVANCED_MODULE_ID = 'notation-advanced';

/** @typedef {{ id: string, promptKey: string, expectedMoves: string[] }} NotationTask */

/** @type {Record<string, NotationTask[]>} */
export const NOTATION_TASKS_BY_TIER = {
  beginner: [
    { id: 'b1', promptKey: 'notationCourse.tasks.pressU', expectedMoves: ['U'] },
    { id: 'b2', promptKey: 'notationCourse.tasks.pressR', expectedMoves: ['R'] },
    { id: 'b3', promptKey: 'notationCourse.tasks.pressUthenR', expectedMoves: ['U', 'R'] },
    { id: 'b4', promptKey: 'notationCourse.tasks.pressF', expectedMoves: ['F'] },
    { id: 'b5', promptKey: 'notationCourse.tasks.pressL', expectedMoves: ['L'] },
    { id: 'b6', promptKey: 'notationCourse.tasks.pressDthenB', expectedMoves: ['D', 'B'] },
  ],
  intermediate: [
    { id: 'i1', promptKey: 'notationCourse.tasks.seqURUp', expectedMoves: ['U', 'R', "U'"] },
    { id: 'i2', promptKey: 'notationCourse.tasks.seqRURp', expectedMoves: ['R', 'U', "R'"] },
    { id: 'i3', promptKey: 'notationCourse.tasks.seqF2L', expectedMoves: ['F', 'R', "F'"] },
    { id: 'i4', promptKey: 'notationCourse.tasks.seqU2R2', expectedMoves: ['U2', 'R2'] },
  ],
  advanced: [
    { id: 'a1', promptKey: 'notationCourse.tasks.algSexy', expectedMoves: ['R', 'U', "R'", "U'"] },
    { id: 'a2', promptKey: 'notationCourse.tasks.algFruit', expectedMoves: ['F', 'R', 'U', "R'", "U'", "F'"] },
  ],
};

export const NOTATION_FACE_BASE = ['U', 'D', 'L', 'R', 'F', 'B'];

/** Közép szint: csak a kezdőben nem szereplő jelölések (fordított és dupla fordulat). */
export const NOTATION_INTERMEDIATE_GRID_MOVES = [
  ...NOTATION_FACE_BASE.map((f) => `${f}'`),
  ...NOTATION_FACE_BASE.map((f) => `${f}2`),
];

/** Haladó gyorsgombok: sima + aposztrófos + dupla mind a hat lapra. */
export const NOTATION_FULL_FACE_MOVES = [
  ...NOTATION_FACE_BASE,
  ...NOTATION_FACE_BASE.map((f) => `${f}'`),
  ...NOTATION_FACE_BASE.map((f) => `${f}2`),
];

/**
 * @param {string} moduleId
 * @returns {'beginner' | 'intermediate' | 'advanced' | null}
 */
export function moduleIdToTier(moduleId) {
  switch (moduleId) {
    case NOTATION_BEGINNER_MODULE_ID:
      return 'beginner';
    case NOTATION_INTERMEDIATE_MODULE_ID:
      return 'intermediate';
    case NOTATION_ADVANCED_MODULE_ID:
      return 'advanced';
    default:
      return null;
  }
}

/**
 * @param {'beginner' | 'intermediate' | 'advanced'} tier
 * @returns {NotationTask[]}
 */
export function getTasksForTier(tier) {
  return NOTATION_TASKS_BY_TIER[tier] ?? [];
}
