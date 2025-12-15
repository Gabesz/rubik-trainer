import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const versionFile = join(__dirname, '..', 'version.txt');
const versionJsFile = join(__dirname, '..', 'src', 'version.js');

function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  // Increment patch version (0.0.1 -> 0.0.2)
  parts[2] = (parts[2] || 0) + 1;
  return parts.join('.');
}

try {
  const currentVersionStr = readFileSync(versionFile, 'utf-8').trim() || '0.0.0';
  const newVersion = incrementVersion(currentVersionStr);
  
  // Update version.txt
  writeFileSync(versionFile, `${newVersion}\n`, 'utf-8');
  
  // Generate version.js with 'v' prefix
  const versionJsContent = `// This file is auto-generated during build
export const APP_VERSION = 'v${newVersion}';
`;
  writeFileSync(versionJsFile, versionJsContent, 'utf-8');
  
  console.log(`Version incremented: ${currentVersionStr} -> ${newVersion}`);
} catch (error) {
  console.error('Error incrementing version:', error);
  process.exit(1);
}

