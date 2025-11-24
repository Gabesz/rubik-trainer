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
function parseMove(token) {
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

