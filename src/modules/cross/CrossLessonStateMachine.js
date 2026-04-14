import { normalizeCrossStep } from '../../data/courses/crossLessonEngine.js';

/**
 * Imperative state machine for cross-style (and generic) course steps.
 * Steps are normalized so `text`-only lessons work alongside v2 cross data.
 */
export class CrossLessonStateMachine {
  /**
   * @param {Object[]} steps - raw lesson steps
   */
  constructor(steps) {
    this.steps = Array.isArray(steps) ? steps.map((s) => normalizeCrossStep(s)) : [];
    this.currentIndex = 0;
    this.hintLevel = 0;
    this.completed = false;
  }

  getCurrentStep() {
    return this.steps[this.currentIndex] ?? null;
  }

  nextStep() {
    if (this.completed) return;
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex += 1;
      this.hintLevel = 0;
    } else {
      this.completed = true;
    }
  }

  previousStep() {
    this.completed = false;
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.hintLevel = 0;
    }
  }

  reset() {
    this.currentIndex = 0;
    this.hintLevel = 0;
    this.completed = false;
  }

  /**
   * Hint tier for current hintLevel (1–3): soft → more explicit → strongest / reveal.
   * @returns {string | null}
   */
  getHint() {
    const step = this.getCurrentStep();
    if (!step || this.hintLevel < 1 || this.hintLevel > 3) return null;

    const soft = step.hint && String(step.hint).trim();
    const list = (step.hints || []).map((h) => String(h).trim()).filter(Boolean);
    const tier1 = soft || list[0] || '';
    const tier2 = list[1] || list[0] || tier1;
    const tier3 = list[2] || (list.length ? list[list.length - 1] : '') || tier2;
    const tiers = [tier1, tier2, tier3];
    const text = tiers[this.hintLevel - 1];
    return text || null;
  }

  /**
   * MVP: validation always passes. Resets hint level, advances or marks completed.
   * @returns {{ ok: boolean, successMessage: string, lessonComplete?: boolean }}
   */
  confirmStep() {
    const step = this.getCurrentStep();
    if (!step || this.completed) {
      return { ok: false, successMessage: '', lessonComplete: false };
    }

    this.hintLevel = 0;

    const successMessage =
      (step.successMessage && String(step.successMessage).trim()) || 'Step complete.';

    const isLast = this.currentIndex >= this.steps.length - 1;
    if (isLast) {
      this.completed = true;
      return { ok: true, successMessage, lessonComplete: true };
    }

    this.currentIndex += 1;
    return { ok: true, successMessage, lessonComplete: false };
  }

  isCompleted() {
    return this.completed;
  }
}
