import rawAlgorithms from './oll-algorithms.json';

const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);

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
  const match = name.match(/OLL\s*(\d+)/i);
  if (match) {
    return `oll-${match[1]}`;
  }
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/OLL/${slug}`;
}

export async function fetchAlgorithms() {
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
