/**
 * Cross mission — white cross on D after default twisty orientation (x2: white down, yellow up).
 * D-layer edge slots in cubing.js 3×3 EDGES orbit: indices 4–7.
 */

export const CROSS_MISSION_D_EDGE_SLOTS = Object.freeze([4, 5, 6, 7]);

export function crossMissionDisplayRefPattern(kpuzzle) {
  return kpuzzle.defaultPattern().applyAlg('x2');
}

export class CrossMissionEngine {
  /**
   * @param {{ reset: () => void, applyAlgorithm: (alg: string) => void, getState: () => unknown }} cube
   */
  constructor(cube) {
    this.cube = cube;
    this.currentMission = null;
    this._refEdges = null;
    this._completed = false;
    this._onSuccess = null;
  }

  /**
   * @param {import('cubing/kpuzzle').KPattern | null | undefined} displayRefPattern — `crossMissionDisplayRefPattern(kpuzzle)`
   */
  setReferencePattern(displayRefPattern) {
    this._refEdges = this._snapshotEdges(displayRefPattern);
  }

  /** @param {() => void} fn */
  setSuccessHandler(fn) {
    this._onSuccess = typeof fn === 'function' ? fn : null;
  }

  /** @param {object} mission */
  loadMission(mission) {
    this.currentMission = mission;
    this.reset();
  }

  reset() {
    if (!this.currentMission) return;
    this._completed = false;
    this.cube.applyAlgorithm(this.currentMission.scramble);
    this.cube.reset();
  }

  onMove() {
    if (this._completed || !this.currentMission) return;
    const state = this.cube.getState();
    if (!state) return;
    if (this.checkWhiteCross(state)) {
      this._completed = true;
      this.onSuccess();
    }
  }

  /** @param {import('cubing/kpuzzle').KPattern | null | undefined} state */
  checkWhiteCross(state) {
    return this.isWhiteCrossComplete(state);
  }

  /** @param {import('cubing/kpuzzle').KPattern | null | undefined} cubeState */
  isWhiteCrossComplete(cubeState) {
    if (!cubeState?.patternData?.EDGES || !this._refEdges) return false;
    const cur = cubeState.patternData.EDGES;
    const ref = this._refEdges;
    for (const slot of CROSS_MISSION_D_EDGE_SLOTS) {
      if (cur.pieces[slot] !== ref.pieces[slot] || cur.orientation[slot] !== ref.orientation[slot]) {
        return false;
      }
    }
    return true;
  }

  onSuccess() {
    if (this._onSuccess) {
      this._onSuccess();
    } else {
      console.log('Cross completed!');
    }
  }

  /** @param {import('cubing/kpuzzle').KPattern | null | undefined} pattern */
  _snapshotEdges(pattern) {
    if (!pattern?.patternData?.EDGES) return null;
    const e = pattern.patternData.EDGES;
    return {
      pieces: [...e.pieces],
      orientation: [...e.orientation],
    };
  }
}
