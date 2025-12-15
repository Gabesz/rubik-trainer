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
  // Extract number from name (e.g., "F2L 1" -> "1", "F2L 2" -> "2")
  const match = name.match(/F2L\s*(\d+)/i);
  if (match) {
    return `f2l-${match[1]}`;
  }
  // Fallback to original logic if no number found
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function deriveDetailUrl(name) {
  const slug = name.trim().replace(/\s+/g, '_');
  return `https://speedcubedb.com/a/3x3/F2L/${slug}`;
}

export async function fetchAlgorithms() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to load F2L algorithms from ${DATA_URL}. ` +
        `HTTP ${response.status} ${response.statusText}. ` +
        `Please check if the file exists and the server is accessible.`
      );
    }

    const rawAlgorithms = await response.json();
  const result = rawAlgorithms.map((algorithm, index) => {
    // Use index as fallback to ensure unique IDs
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
  
  // Debug: check for duplicate IDs
  const ids = result.map(a => a.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.warn('Duplicate F2L IDs found:', duplicates);
  }
  
  return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error while loading F2L algorithms from ${DATA_URL}. ` +
        `Original error: ${error.message}. ` +
        `Please check your network connection and try again.`
      );
    }
    throw error;
  }
}

