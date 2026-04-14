/**
 * Cross module — Cross Lesson Engine v2 (state-machine oriented lesson data).
 *
 * Each step is a state in the training loop: instruction → action / simulation → confirm → feedback → next.
 *
 * expectedAction — drives cube emphasis / demo segment (executeCrossCubeAction + player):
 * - neutral: default view, no extra stickering
 * - highlight_white_edges: emphasize edges (experimental-stickering Cross)
 * - highlight_center_match: full stickering — center-matching pairs (visual)
 * - highlight_alignment: same as full for legacy steps
 * - demo_move_D | demo_move_DR | demo_move_DRF | demo_move_DRF_Ri: demo segment labels (optional play on enter)
 */

export const CROSS_ACTIONS = Object.freeze({
  NEUTRAL: 'neutral',
  HIGHLIGHT_WHITE_EDGES: 'highlight_white_edges',
  /** Full stickering — emphasize center/edge matching (guided visual, not solver). */
  HIGHLIGHT_CENTER_MATCH: 'highlight_center_match',
  HIGHLIGHT_ALIGNMENT: 'highlight_alignment',
  DEMO_MOVE_D: 'demo_move_D',
  DEMO_MOVE_DR: 'demo_move_DR',
  DEMO_MOVE_DRF: 'demo_move_DRF',
  DEMO_MOVE_DRF_RI: 'demo_move_DRF_Ri',
});

/** Phases used by useCrossLessonStateMachine (per-step UX state). */
export const CROSS_LESSON_PHASES = Object.freeze({
  PRESENTING: 'presenting',
  FEEDBACK_SUCCESS: 'feedback_success',
  FEEDBACK_ERROR: 'feedback_error',
});

export const CROSS_VALIDATION_TYPES = Object.freeze({
  ACKNOWLEDGE: 'acknowledge',
});

/**
 * @typedef {Object} CrossLessonStepV2
 * @property {number|string} id
 * @property {string} instruction
 * @property {string} [hint]
 * @property {string[]} [hints]
 * @property {string} expectedAction
 * @property {'acknowledge' | string} validationType — v2: extend later (e.g. move_matches)
 * @property {string} [successMessage]
 * @property {string} [wrongMessage]
 * @property {string} [setup] — appended after lesson defaultSetup for this step only
 * @property {string} [cumulativeAlg] — moves after setup; cube shows state after these moves
 * @property {boolean} [playDemoOnEnter] — animate from previous cumulative count to this step’s count
 *
 * Legacy (v1) still accepted: action, validation, feedback.success, text */

/**
 * @param {Object} step
 * @returns {CrossLessonStepV2 & { raw: Object }}
 */
export function normalizeCrossStep(step) {
  if (!step || typeof step !== 'object') {
    return {
      id: '',
      instruction: '',
      hint: '',
      hints: [],
      expectedAction: CROSS_ACTIONS.NEUTRAL,
      validationType: CROSS_VALIDATION_TYPES.ACKNOWLEDGE,
      successMessage: '',
      wrongMessage: '',
      setup: '',
      cumulativeAlg: '',
      playDemoOnEnter: false,
      raw: step || {},
    };
  }

  const validationRaw = step.validationType ?? step.validation;
  let validationType = CROSS_VALIDATION_TYPES.ACKNOWLEDGE;
  if (typeof validationRaw === 'string' && validationRaw) {
    validationType = validationRaw;
  } else if (validationRaw && typeof validationRaw === 'object' && validationRaw.type) {
    validationType = validationRaw.type;
  }

  const instruction =
    (step.instruction && String(step.instruction).trim()) ||
    (step.text && String(step.text).trim()) ||
    '';

  const successMessage =
    (step.successMessage && String(step.successMessage).trim()) ||
    (step.feedbackSuccess && String(step.feedbackSuccess).trim()) ||
    (step.feedback?.success && String(step.feedback.success).trim()) ||
    '';

  const wrongMessage =
    (step.wrongMessage && String(step.wrongMessage).trim()) ||
    (step.feedbackWrong && String(step.feedbackWrong).trim()) ||
    (step.feedback?.wrong && String(step.feedback.wrong).trim()) ||
    '';

  return {
    id: step.id,
    instruction,
    hint: step.hint,
    hints: Array.isArray(step.hints) ? step.hints : [],
    expectedAction: step.expectedAction ?? step.action ?? CROSS_ACTIONS.NEUTRAL,
    validationType,
    successMessage,
    wrongMessage,
    setup: step.setup,
    cumulativeAlg: step.cumulativeAlg ?? '',
    playDemoOnEnter: Boolean(step.playDemoOnEnter),
    raw: step,
  };
}

/** Cross beginner course — mission pack metadata (game UI: /course/beginner-cfop/cross). */
export const crossMissionLesson = {
  id: 'cross-mission-pack',
  title: 'Cross: white cross mission',
  player: 'cross-mission',
  defaultSetup: '',
  steps: [],
};

/** @deprecated Use crossMissionLesson */
export const crossInteractiveLessonV2 = crossMissionLesson;

/** @deprecated Use crossMissionLesson */
export const crossGuidedLesson = crossMissionLesson;

/** @deprecated Use crossMissionLesson */
export const crossInteractiveLesson = crossMissionLesson;
