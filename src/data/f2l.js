import rawAlgorithms from './f2l-algorithms.json';

const BASE_URL = formatBaseURL(import.meta.env.BASE_URL);

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
  const match = name.match(/F2L\s*(\d+)/i);
  if (match) {
    return `f2l-${match[1]}`;
  }
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/F2L/${slug}`;
}

export async function fetchAlgorithms() {
  const result = rawAlgorithms.map((algorithm, index) => {
    const baseId = deriveId(algorithm.name);
    const uniqueId = baseId || `f2l-${index + 1}`;
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
    console.warn('Duplicate F2L IDs found:', duplicates);
  }

  return result;
}
