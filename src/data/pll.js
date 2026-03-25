import rawAlgorithms from './pll-algorithms.json';

const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);

function formatBaseURL(url) {
  if (!url) {
    return '/';
  }
  return url.endsWith('/') ? url : `${url}/`;
}

function deriveImagePath(name) {
  const safeName = name.trim().replace(/\s+/g, '');
  return `${BASE_URL}pll/svg/PLL-${safeName}.svg`;
}

function deriveId(name) {
  const codeMatch = name.match(/PLL\s*([A-Za-z]+)/i);
  if (codeMatch) {
    return `pll-${codeMatch[1].toLowerCase()}`;
  }
  const numberMatch = name.match(/PLL\s*(\d+)/i);
  if (numberMatch) {
    return `pll-${numberMatch[1]}`;
  }
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/PLL/${slug}`;
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
