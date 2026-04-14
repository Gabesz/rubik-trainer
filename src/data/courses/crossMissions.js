/**
 * Guided cross: one scramble, solution as quarter-turn steps (after x2 orientation in player).
 * solutionMoves must lead to a complete white cross (D-layer edges vs reference), verified offline.
 */
export const crossMissions = [
  {
    id: 'cross-guided-1',
    title: 'Cross — vezetett',
    scramble: "D' B D2 R' U R2 B U' R2 F2 L D2 R' B2 L B2 D2 L F2 L2 F",
    solutionMoves: ["F'", 'R', 'R', 'F', "B'", "D'"],
  },
];

/** All basic face turns for multiple-choice distractors. */
export const CROSS_NOTATION_CHOICE_POOL = Object.freeze([
  'U',
  "U'",
  'R',
  "R'",
  'F',
  "F'",
  'L',
  "L'",
  'D',
  "D'",
  'B',
  "B'",
]);
