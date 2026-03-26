import rawAlgorithms from './af2l-algorithms.json';

const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);

function formatBaseURL(url) {
  if (!url) {
    return '/';
  }
  return url.endsWith('/') ? url : `${url}/`;
}

function deriveImagePath(name) {
  const match = name.match(/AF2L\s*(\d+)(a)?/i);
  const idx = match ? (match[2] ? `${match[1]}a` : match[1]) : name.trim().replace(/\s+/g, '');
  return `${BASE_URL}af2l/svg/AF2L-${idx}.svg`;
}

function deriveId(name) {
  const match = name.match(/AF2L\s*(\d+)(a)?/i);
  if (match) {
    return match[2] ? `af2l-${match[1]}a` : `af2l-${match[1]}`;
  }
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/AdvancedF2L/${slug}`;
}

export async function fetchAlgorithms() {
  const result = rawAlgorithms.map((algorithm, index) => {
    const baseId = deriveId(algorithm.name);
    const uniqueId = baseId || `af2l-${index + 1}`;
    return {
      id: uniqueId,
      name: algorithm.name,
      type: algorithm.type,
      setup: algorithm.setup,
      standardAlg: algorithm.standard_alg ?? algorithm.standardAlg ?? '',
      detailUrl: deriveDetailUrl(algorithm.name),
      imageUrl: deriveImagePath(algorithm.name),
    };
  });

  const ids = result.map((a) => a.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.warn('Duplicate AF2L IDs found:', duplicates);
  }

  return result;
}
