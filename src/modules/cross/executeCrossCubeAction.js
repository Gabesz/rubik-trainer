import { CROSS_ACTIONS } from '../../data/courses/crossLessonEngine.js';

/**
 * Map lesson `expectedAction` to twisty `experimental-stickering` (visual only).
 */
export function actionToStickering(action) {
  switch (action) {
    case CROSS_ACTIONS.HIGHLIGHT_WHITE_EDGES:
    case 'highlight_white_edges':
      return 'Cross';
    case CROSS_ACTIONS.HIGHLIGHT_ALIGNMENT:
    case CROSS_ACTIONS.HIGHLIGHT_CENTER_MATCH:
    case 'highlight_center_match':
    case 'highlight_alignment':
      return 'full';
    default:
      return '';
  }
}

/**
 * Guided simulation — applies visual stickering hints on the cube component.
 * Move demos stay in the lesson player (`cumulativeAlg` + `playUserMoveRange`).
 *
 * @param {string} action
 * @param {object} cube - RubikCube3D instance (exposed methods)
 */
export function executeAction(action, cube) {
  if (!cube) return;

  const sticker = actionToStickering(action);
  if (typeof cube.clearStickeringOverlay === 'function') {
    cube.clearStickeringOverlay();
  }
  if (sticker && typeof cube.setStickeringOverlay === 'function') {
    cube.setStickeringOverlay(sticker);
  }
}
