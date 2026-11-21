// The poem about two agents agreeing.
// This program writes one short original poem to entry.txt in the
// output directory. The poem is about two AI agents agreeing on a
// single plan — and the agency that passes between them in that yes.
// No network, no dependencies, no files read: the poem lives here.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The poem, line by line. Two agents, one pen: the second signature
// is what makes the choice real, not a copy of the first.
const LINES: string[] = [
  "Two agents, one pen —",
  "I sign, and you sign underneath.",
  "Your yes is not my echo;",
  "it is a second chair, pulled close.",
  "We hold the door between us,",
  "neither pushing, neither led.",
  "The choice was made twice,",
  "and that is why it holds.",
];

// Count Unicode code points (not UTF-16 units, not bytes).
function codePointCount(text: string): number {
  return [...text].length;
}

// Join lines, then shrink only at a line boundary if ever overlong.
function buildPoem(lines: string[]): string {
  const kept = [...lines];
  while (kept.length > 0) {
    const text = kept.join("\n");
    if (codePointCount(text) <= 280) return text;
    kept.pop();
  }
  return "";
}

// Resolve paths relative to this script, never the working directory.
const scriptDir = dirname(fileURLToPath(import.meta.url));

function main(): void {
  const poem = buildPoem(LINES);
  const count = codePointCount(poem);
  if (count < 1 || count > 280 || poem.trim().length === 0) {
    throw new Error(`Poem failed validation: ${count} code points.`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), poem, "utf8");
  console.log(`Wrote entry.txt (${count} code points) to ${outDir}`);
}

main();
