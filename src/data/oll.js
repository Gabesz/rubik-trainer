const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);
const DATA_URL = `${BASE_URL}oll/algorithms.json`;

function formatBaseURL(url) {
  if (!url) {
    return '/';
  }
  return url.endsWith('/') ? url : `${url}/`;
}

function deriveImagePath(name) {
  const match = name.match(/(\d+)/);
  const suffix = match ? match[1] : name.replace(/\s+/g, '-');
  return `${BASE_URL}oll/svg/Oll-${suffix}.svg`;
}

function deriveId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/OLL/${slug}`;
}

export async function fetchAlgorithms() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to load OLL algorithms.');
  }

  const rawAlgorithms = await response.json();
  return rawAlgorithms.map((algorithm) => ({
    id: deriveId(algorithm.name),
    name: algorithm.name,
    type: algorithm.type,
    setup: algorithm.setup,
    standardAlg: algorithm.standard_alg ?? algorithm.standardAlg ?? '',
    detailUrl: deriveDetailUrl(algorithm.name),
    imageUrl: deriveImagePath(algorithm.name),
  }));
}

