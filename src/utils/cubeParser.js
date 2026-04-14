/**
 * Rubik-kocka algoritmus parser
 * Feldolgozza az algoritmus stringet és visszaadja a mozgások tömbjét
 */

export function parseAlgorithm(algorithm) {
  if (!algorithm || typeof algorithm !== 'string') {
    return [];
  }

  // Tisztítás: eltávolítjuk a zárójeleket és felesleges szóközöket
  let cleanAlg = algorithm
    .replace(/[()]/g, ' ')  // Zárójelek eltávolítása
    .replace(/\s+/g, ' ')    // Többszörös szóközök egy szóközzé
    .trim();

  const moves = [];
  const tokens = cleanAlg.split(' ').filter(t => t.length > 0);

  for (const token of tokens) {
    const move = parseMove(token);
    if (move) {
      moves.push(move);
    }
  }

  return moves;
}

/**
 * Egy mozgás token feldolgozása
 * Támogatott formátumok:
 * - R, L, U, D, F, B (normál)
 * - R', L', U', D', F', B' (prime)
 * - R2, L2, U2, D2, F2, B2 (dupla)
 * - r, l, u, d, f, b (kisbetűs - wide moves)
 * - M, E, S (középső réteg)
 * - x, y, z (kocka forgatás)
 */
export function parseMove(token) {
  if (!token || token.length === 0) {
    return null;
  }

  // Kisbetűs wide moves
  const wideMoves = {
    'r': { face: 'R', wide: true },
    'l': { face: 'L', wide: true },
    'u': { face: 'U', wide: true },
    'd': { face: 'D', wide: true },
    'f': { face: 'F', wide: true },
    'b': { face: 'B', wide: true },
  };

  // Középső réteg mozgások
  const middleMoves = {
    'M': { face: 'M', layer: 'middle' },
    'E': { face: 'E', layer: 'middle' },
    'S': { face: 'S', layer: 'middle' },
  };

  // Kocka forgatások
  const rotations = {
    'x': { face: 'x', rotation: true },
    'y': { face: 'y', rotation: true },
    'z': { face: 'z', rotation: true },
  };

  const upperToken = token.toUpperCase();
  let baseMove = null;
  let direction = 'normal';
  let count = 1;

  // Kisbetűs wide move ellenőrzés
  if (wideMoves[token.toLowerCase()]) {
    baseMove = wideMoves[token.toLowerCase()];
    return {
      face: baseMove.face,
      direction: 'normal',
      count: 1,
      wide: true,
    };
  }

  // Középső réteg ellenőrzés
  if (middleMoves[upperToken[0]]) {
    baseMove = middleMoves[upperToken[0]];
    // Prime vagy dupla ellenőrzés
    if (token.includes("'") || token.includes('′')) {
      direction = 'prime';
    } else if (token.includes('2')) {
      count = 2;
    }
    return {
      face: baseMove.face,
      direction,
      count,
      layer: 'middle',
    };
  }

  // Kocka forgatás ellenőrzés
  if (rotations[upperToken[0]]) {
    baseMove = rotations[upperToken[0]];
    // Prime vagy dupla ellenőrzés
    if (token.includes("'") || token.includes('′')) {
      direction = 'prime';
    } else if (token.includes('2')) {
      count = 2;
    }
    return {
      face: baseMove.face,
      direction,
      count,
      rotation: true,
    };
  }

  // Normál mozgások (R, L, U, D, F, B)
  const validFaces = ['R', 'L', 'U', 'D', 'F', 'B'];
  const firstChar = upperToken[0];

  if (!validFaces.includes(firstChar)) {
    return null; // Érvénytelen mozgás
  }

  // Prime ellenőrzés
  if (token.includes("'") || token.includes('′')) {
    direction = 'prime';
  }

  // Dupla ellenőrzés
  if (token.includes('2')) {
    count = 2;
  }

  return {
    face: firstChar,
    direction,
    count,
  };
}

/** Twisty timeline: egy token hány „quarter-turn” lépés (pl. U2/D2 → 2×0,5 időegység). */
export function moveQuantumCount(token) {
  const m = parseMove(String(token).trim());
  return m?.count && m.count > 0 ? m.count : 1;
}

export function quantumDurationUnits(tokens) {
  if (!tokens?.length) return 0;
  return tokens.reduce((s, t) => s + moveQuantumCount(t), 0);
}

/** Összeg: tokens[start .. endExclusive) kvantumai. */
export function quantumSumSlice(tokens, start, endExclusive) {
  if (!tokens?.length) return 0;
  let s = 0;
  const lo = Math.max(0, start);
  const hi = Math.min(endExclusive, tokens.length);
  for (let i = lo; i < hi; i++) {
    s += moveQuantumCount(tokens[i]);
  }
  return s;
}

/**
 * cubing.js `defaultDurationForAmount` — milliseconds allocated per animated move on the twisty-player timeline.
 * Must stay in sync with the cubing library's internal timing.
 */
export function cubingMoveDurationMs(token) {
  const m = parseMove(String(token).trim());
  const amount = Math.abs(m?.count ?? 1);
  switch (amount) {
    case 0: return 0;
    case 1: return 1000;
    case 2: return 1500;
    default: return 2000;
  }
}

/** Sum of cubing.js timeline durations (ms) for a token array slice. */
export function cubingDurationMsSlice(tokens, start, endExclusive) {
  if (!tokens?.length) return 0;
  let s = 0;
  const lo = Math.max(0, start);
  const hi = Math.min(endExclusive, tokens.length);
  for (let i = lo; i < hi; i++) {
    s += cubingMoveDurationMs(tokens[i]);
  }
  return s;
}

/** Total cubing.js timeline duration (ms) for a token array. */
export function cubingDurationMsTotal(tokens) {
  if (!tokens?.length) return 0;
  return tokens.reduce((s, t) => s + cubingMoveDurationMs(t), 0);
}

