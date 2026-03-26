/**
 * Generates public/af2l/svg/AF2L-{n}.svg from af2l-algorithms.json setup algs.
 * Uses cubing + JSDOM (TwistyAnimatedSVG needs document).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { cube3x3x3 } from "cubing/puzzles";
import { ExperimentalSVGAnimator } from "cubing/twisty";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "af2l", "svg");

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  pretendToBeVisual: true,
});
const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
globalThis.Node = window.Node;
globalThis.Element = window.Element;
globalThis.SVGElement = window.SVGElement;

function nameToFilename(name) {
  const m = String(name).match(/AF2L\s*(\d+)(a)?/i);
  if (!m) return null;
  return m[2] ? `AF2L-${m[1]}a.svg` : `AF2L-${m[1]}.svg`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const raw = readFileSync(join(root, "src", "data", "af2l-algorithms.json"), "utf8");
  const rows = JSON.parse(raw);
  const kpuzzle = await cube3x3x3.kpuzzle();
  const svgSource = await cube3x3x3.svg();

  for (const row of rows) {
    const filename = nameToFilename(row.name);
    if (!filename) {
      console.warn("Skip (unparseable name):", row.name);
      continue;
    }
    const setupAlg = `x2 ${row.setup}`.trim();
    let pattern;
    try {
      pattern = kpuzzle.defaultPattern().applyAlg(setupAlg);
    } catch (e) {
      console.warn("Skip (alg error):", row.name, setupAlg, e.message);
      continue;
    }
    const animator = new ExperimentalSVGAnimator(kpuzzle, svgSource);
    animator.drawPattern(pattern);
    const svgXml = animator.svgElement.outerHTML;
    writeFileSync(join(outDir, filename), svgXml, "utf8");
    console.log("Wrote", filename);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
