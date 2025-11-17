const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);
const DATA_URL = `${BASE_URL}f2l/algorithms.json`;

function formatBaseURL(url) {
  if (!url) {
    return '/';
  }
  return url.endsWith('/') ? url : `${url}/`;
}

function deriveImagePath(name) {
  const match = name.match(/F2L\s*(\d+)/i);
  const idx = match ? match[1] : name.trim().replace(/\s+/g, '');
  return `${BASE_URL}f2l/svg/F2L-${idx}.svg`;
}

function deriveId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/F2L/${slug}`;
}

export async function fetchAlgorithms() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error('Unable to load F2L algorithms.');
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

