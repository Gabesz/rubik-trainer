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
  // Extract number from name (e.g., "OLL 1" -> "1", "OLL 2" -> "2")
  const match = name.match(/OLL\s*(\d+)/i);
  if (match) {
    return `oll-${match[1]}`;
  }
  // Fallback to original logic if no number found
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/OLL/${slug}`;
}

export async function fetchAlgorithms() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to load OLL algorithms from ${DATA_URL}. ` +
        `HTTP ${response.status} ${response.statusText}. ` +
        `Please check if the file exists and the server is accessible.`
      );
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
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error while loading OLL algorithms from ${DATA_URL}. ` +
        `Original error: ${error.message}. ` +
        `Please check your network connection and try again.`
      );
    }
    throw error;
  }
}

