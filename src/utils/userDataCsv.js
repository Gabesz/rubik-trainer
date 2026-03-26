/** User training backup (no auth secrets). CSV + # header lines. */

export const TRAINER_MODES = ['oll', 'pll', 'f2l', 'af2l'];

export const THEME_STORAGE_KEY = 'theme-preference';

const EXPORT_MARKER = '# rubik-trainer-export-v1';

export function trainerPrefStorageKeys(mode) {
  return {
    filterType: `${mode}.filter.type`,
    learnedOnly: `${mode}.filter.learnedOnly`,
    practicingOnly: `${mode}.filter.practicingOnly`,
    sortMode: `${mode}.sort.mode`,
  };
}

function escapeCsvField(value) {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function parseCsvLine(line) {
  const result = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      result.push(cell);
      cell = '';
    } else {
      cell += c;
    }
  }
  result.push(cell);
  return result;
}

/** Normalize practicing list: never include ids that are learned. */
export function normalizeTrainingForMode(learnedIds, practiceIds) {
  const learned = Array.isArray(learnedIds) ? [...learnedIds] : [];
  const learnedSet = new Set(learned);
  const practicing = (Array.isArray(practiceIds) ? practiceIds : []).filter((id) => !learnedSet.has(id));
  return { learned, practicing };
}

export function normalizeAllModes(training) {
  const out = {
    learned: {},
    practicing: {},
    myAlgs: {},
    myNames: {},
  };
  for (const mode of TRAINER_MODES) {
    const learned = training.learned?.[mode] || [];
    const practicing = training.practicing?.[mode] || [];
    const { learned: L, practicing: P } = normalizeTrainingForMode(learned, practicing);
    out.learned[mode] = L;
    out.practicing[mode] = P;
    out.myAlgs[mode] = training.myAlgs?.[mode] && typeof training.myAlgs[mode] === 'object'
      ? { ...training.myAlgs[mode] }
      : {};
    out.myNames[mode] = training.myNames?.[mode] && typeof training.myNames[mode] === 'object'
      ? { ...training.myNames[mode] }
      : {};
  }
  return out;
}

function algorithmsToModeCatalog(algorithms) {
  const ids = algorithms.map((a) => a.id);
  const defaultAlgById = {};
  for (const a of algorithms) {
    defaultAlgById[a.id] = a.standardAlg != null ? String(a.standardAlg) : '';
  }
  return { ids, defaultAlgById };
}

/**
 * Catalog for CSV export/import: every id + default (standard) algorithm string per mode.
 */
export async function fetchAlgorithmExportCatalog() {
  const [ollModule, pllModule, f2lModule, af2lModule] = await Promise.all([
    import('../data/oll.js'),
    import('../data/pll.js'),
    import('../data/f2l.js'),
    import('../data/af2l.js'),
  ]);
  const [oll, pll, f2l, af2l] = await Promise.all([
    ollModule.fetchAlgorithms(),
    pllModule.fetchAlgorithms(),
    f2lModule.fetchAlgorithms(),
    af2lModule.fetchAlgorithms(),
  ]);
  return {
    oll: algorithmsToModeCatalog(oll),
    pll: algorithmsToModeCatalog(pll),
    f2l: algorithmsToModeCatalog(f2l),
    af2l: algorithmsToModeCatalog(af2l),
  };
}

/**
 * After CSV import: drop myAlgs entries that only duplicate the built-in standard algorithm (keeps storage/UI as “not customized”).
 */
export function stripMyAlgsMatchingDefaults(training, catalog) {
  if (!catalog || !training?.myAlgs) {
    return;
  }
  for (const mode of TRAINER_MODES) {
    const defMap = catalog[mode]?.defaultAlgById;
    if (!defMap || typeof training.myAlgs[mode] !== 'object') {
      continue;
    }
    const mine = training.myAlgs[mode];
    for (const id of Object.keys(mine)) {
      const v = String(mine[id] ?? '').trim();
      const d = String(defMap[id] ?? '').trim();
      if (v === d) {
        delete mine[id];
      }
    }
  }
}

/**
 * @param {{ learned: object, practicing: object, myAlgs: object, myNames: object }} training
 * @param {string} [theme]
 * @param {Record<string, string>} [prefs] flat localStorage keys for trainer filters
 * @param {Record<string, { ids: string[], defaultAlgById: Record<string, string> }> | Record<string, string[]>} [modeCatalog]
 *        Per-mode catalog: full export uses { ids, defaultAlgById }; legacy: ids array only (empty my_alg when not customized).
 */
export function buildUserDataCsv(training, theme, prefs, modeCatalog) {
  const normalized = normalizeAllModes(training);
  const lines = [];
  lines.push(EXPORT_MARKER);
  lines.push(`# theme:${escapeCsvField(theme || '')}`);
  lines.push(`# prefs:${JSON.stringify(prefs || {})}`);
  lines.push('mode,algorithm_id,is_learned,is_practicing,my_alg,my_name');

  for (const mode of TRAINER_MODES) {
    const learnedSet = new Set(normalized.learned[mode] || []);
    const practicingSet = new Set(normalized.practicing[mode] || []);
    const algs = normalized.myAlgs[mode] || {};
    const names = normalized.myNames[mode] || {};
    const ids = new Set();

    const rawCat = modeCatalog?.[mode];
    const catalogIds = Array.isArray(rawCat) ? rawCat : rawCat?.ids;
    const defaultAlgById =
      rawCat && !Array.isArray(rawCat) && rawCat.defaultAlgById && typeof rawCat.defaultAlgById === 'object'
        ? rawCat.defaultAlgById
        : {};

    if (Array.isArray(catalogIds) && catalogIds.length > 0) {
      for (const id of catalogIds) {
        ids.add(id);
      }
    }
    for (const id of learnedSet) ids.add(id);
    for (const id of practicingSet) ids.add(id);
    for (const id of Object.keys(algs)) ids.add(id);
    for (const id of Object.keys(names)) ids.add(id);

    const sortedIds = Array.from(ids).sort((a, b) => a.localeCompare(b));

    for (const id of sortedIds) {
      const isLearned = learnedSet.has(id) ? '1' : '0';
      const isPracticing = practicingSet.has(id) ? '1' : '0';
      const userAlg = algs[id];
      const defaultAlg = defaultAlgById[id] != null ? String(defaultAlgById[id]) : '';
      const myAlg =
        userAlg != null && String(userAlg).trim() !== '' ? String(userAlg) : defaultAlg;
      const myName = names[id] != null ? String(names[id]) : '';
      lines.push(
        [
          escapeCsvField(mode),
          escapeCsvField(id),
          isLearned,
          isPracticing,
          escapeCsvField(myAlg),
          escapeCsvField(myName),
        ].join(','),
      );
    }
  }

  return lines.join('\r\n') + '\r\n';
}

/**
 * @returns {{ theme: string, prefs: Record<string, string>, training: object } | { error: string }}
 */
export function parseUserDataCsv(text) {
  const raw = text.replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter((l, idx) => idx === 0 || l.length > 0);
  if (lines.length < 4) {
    return { error: 'Invalid file: too short.' };
  }
  if (!lines[0].startsWith('# rubik-trainer-export')) {
    return { error: 'Invalid file: not a rubik-trainer export.' };
  }

  let theme = '';
  let prefs = {};
  let headerIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# theme:')) {
      theme = line.slice('# theme:'.length);
    } else if (line.startsWith('# prefs:')) {
      try {
        prefs = JSON.parse(line.slice('# prefs:'.length)) || {};
        if (typeof prefs !== 'object' || prefs === null) prefs = {};
      } catch {
        prefs = {};
      }
    } else if (line.startsWith('mode,')) {
      headerIdx = i;
      break;
    }
  }

  const headerLine = headerIdx >= 0 ? lines[headerIdx] : '';
  if (!headerLine || !headerLine.startsWith('mode,')) {
    return { error: 'Invalid file: missing data header row.' };
  }

  const training = {
    learned: Object.fromEntries(TRAINER_MODES.map((m) => [m, []])),
    practicing: Object.fromEntries(TRAINER_MODES.map((m) => [m, []])),
    myAlgs: Object.fromEntries(TRAINER_MODES.map((m) => [m, {}])),
    myNames: Object.fromEntries(TRAINER_MODES.map((m) => [m, {}])),
  };

  const learnedByMode = Object.fromEntries(TRAINER_MODES.map((m) => [m, new Set()]));
  const practicingByMode = Object.fromEntries(TRAINER_MODES.map((m) => [m, new Set()]));

  for (let r = headerIdx + 1; r < lines.length; r++) {
    const line = lines[r];
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (cols.length < 6) continue;
    const [mode, algorithmId, isLearned, isPracticing, myAlg, myName] = cols;
    if (!TRAINER_MODES.includes(mode) || !algorithmId) continue;

    if (isLearned === '1') learnedByMode[mode].add(algorithmId);
    if (isPracticing === '1') practicingByMode[mode].add(algorithmId);
    if (myAlg && myAlg.trim() !== '') {
      training.myAlgs[mode][algorithmId] = myAlg;
    }
    if (myName && myName.trim() !== '') {
      training.myNames[mode][algorithmId] = myName;
    }
  }

  for (const mode of TRAINER_MODES) {
    const { learned, practicing } = normalizeTrainingForMode(
      Array.from(learnedByMode[mode]),
      Array.from(practicingByMode[mode]),
    );
    training.learned[mode] = learned;
    training.practicing[mode] = practicing;
  }

  return {
    theme: theme || 'light',
    prefs,
    training: normalizeAllModes(training),
  };
}

export function collectTrainerPrefsFromLocalStorage() {
  const prefs = {};
  try {
    for (const mode of TRAINER_MODES) {
      const keys = trainerPrefStorageKeys(mode);
      for (const storageKey of Object.values(keys)) {
        const v = window.localStorage.getItem(storageKey);
        if (v !== null) prefs[storageKey] = v;
      }
    }
  } catch {
    /* ignore */
  }
  return prefs;
}

export function applyTrainerPrefsToLocalStorage(prefs) {
  if (!prefs || typeof prefs !== 'object') return;
  try {
    for (const [k, v] of Object.entries(prefs)) {
      if (typeof k === 'string' && typeof v === 'string') {
        window.localStorage.setItem(k, v);
      }
    }
  } catch {
    /* ignore */
  }
}

export function collectThemeFromLocalStorage() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function applyThemeToLocalStorage(theme) {
  if (theme !== 'dark' && theme !== 'light') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function collectTrainingFromLocalStorage() {
  const training = {
    learned: {},
    practicing: {},
    myAlgs: {},
    myNames: {},
  };
  try {
    for (const mode of TRAINER_MODES) {
      const learnedRaw = window.localStorage.getItem(`${mode}-learned`);
      const practiceRaw = window.localStorage.getItem(`${mode}-practicing`);
      const algsRaw = window.localStorage.getItem(`${mode}-my-algs`);
      const namesRaw = window.localStorage.getItem(`${mode}-my-names`);

      training.learned[mode] = learnedRaw ? JSON.parse(learnedRaw) : [];
      training.practicing[mode] = practiceRaw ? JSON.parse(practiceRaw) : [];
      training.myAlgs[mode] = algsRaw ? JSON.parse(algsRaw) : {};
      training.myNames[mode] = namesRaw ? JSON.parse(namesRaw) : {};

      if (!Array.isArray(training.learned[mode])) training.learned[mode] = [];
      if (!Array.isArray(training.practicing[mode])) training.practicing[mode] = [];
      if (!training.myAlgs[mode] || typeof training.myAlgs[mode] !== 'object') training.myAlgs[mode] = {};
      if (!training.myNames[mode] || typeof training.myNames[mode] !== 'object') training.myNames[mode] = {};
    }
  } catch {
    /* return partial */
  }
  return normalizeAllModes(training);
}

export function applyTrainingToLocalStorage(training) {
  const n = normalizeAllModes(training);
  try {
    for (const mode of TRAINER_MODES) {
      window.localStorage.setItem(`${mode}-learned`, JSON.stringify(n.learned[mode]));
      window.localStorage.setItem(`${mode}-practicing`, JSON.stringify(n.practicing[mode]));
      window.localStorage.setItem(`${mode}-my-algs`, JSON.stringify(n.myAlgs[mode]));
      window.localStorage.setItem(`${mode}-my-names`, JSON.stringify(n.myNames[mode]));
    }
  } catch (e) {
    console.error('Failed to write training to localStorage:', e);
    throw e;
  }
}
