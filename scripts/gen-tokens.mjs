// Generates TOKENS.md — the authoritative allow-list of design-system CSS custom
// properties available to prototypes. Reads the real token CSS shipped by bench-shells
// so the doc can never drift from what the themes actually define.
//
// Token NAMES are identical across every theme (Fusion / IAS / IES, light + dark); only
// VALUES differ. We extract names + a sample value from the gbsgexperimental (Fusion) light
// theme only — that single name list is the allow-list for all themes.
//
// Run: npm run gen:tokens   (re-run after bumping the bench-shells ref in package.json)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = join(ROOT, "node_modules/bench-shells/src/tokens/design-tokens.css");
const OUT = join(ROOT, "TOKENS.md");
const THEME = "gbsgexperimental";

// Fail soft: if deps aren't installed yet, don't blow up — just warn.
if (!existsSync(CSS)) {
  console.warn(
    `[gen-tokens] ${CSS} not found — run \`npm install\` first. Skipping TOKENS.md generation.`,
  );
  process.exit(0);
}

const css = readFileSync(CSS, "utf8");
const lines = css.split("\n");

// The light theme is declared across multiple TOP-LEVEL blocks: a bare `:root {` for
// theme-agnostic tokens (e.g. --color-text-link) plus several `:root[data-theme="…"] {`
// blocks. We must skip:
//   - the dark variant:  :root[data-theme="gbsgexperimental"][data-colorscheme="dark"] { … }
//   - other themes' blocks (intuitaccountantsuite, etc.) — names match, so it's harmless,
//     but we only want the Fusion-light sample values.
//   - @media-nested copies, which are indented (not at column 0).
const tokens = new Map(); // name -> sample value (first win, light top-level)

// A line (at column 0) that opens a block whose tokens we want.
function opensWantedBlock(line) {
  if (line.includes('[data-colorscheme="dark"]')) return false;
  if (line === ":root {") return true; // theme-agnostic tokens
  return line.startsWith(`:root[data-theme="${THEME}"] {`);
}

let depth = 0;
let capturing = false;
for (const line of lines) {
  if (!capturing) {
    if (opensWantedBlock(line)) {
      capturing = true;
      depth = 1;
    }
    continue;
  }
  depth += (line.match(/{/g) || []).length;
  depth -= (line.match(/}/g) || []).length;
  const m = line.trim().match(/^(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
  if (m && !tokens.has(m[1])) tokens.set(m[1], m[2].trim());
  if (depth <= 0) capturing = false;
}

if (tokens.size === 0) {
  console.error(
    `[gen-tokens] No tokens extracted from ${CSS}. The file structure may have changed.`,
  );
  process.exit(1);
}

// Curated short-list of the tokens agents reach for most often. Names that aren't present
// in the extracted set are dropped (so a bench-shells rename can't leave a dead row).
const MOST_NEEDED = [
  ["--color-container-background-primary", "card / surface background"],
  ["--color-page-background-primary", "page background"],
  ["--color-text-primary", "default body text"],
  ["--color-text-secondary", "muted / secondary text"],
  ["--color-text-link", "links, interactive blue"],
  ["--color-divider-primary", "borders / hairlines"],
  ["--color-icon-primary", "default icon color"],
  ["--radius-medium", "default corner radius"],
  ["--radius-small", "tight corner radius"],
  ["--space-small", "small padding / gap"],
  ["--space-medium", "default padding / gap"],
  ["--space-large", "large padding / gap"],
  ["--space-component-gap-medium", "gap between items in a component"],
  ["--space-container-padding-medium", "padding inside a container"],
];

// Group by first segment after `--`; color is large so sub-group by its second segment.
const COLOR_SUBGROUPS = [
  "action",
  "container",
  "page-background",
  "text",
  "link",
  "icon",
  "data",
  "divider",
  "input",
  "ui",
];

function categorize(name) {
  const body = name.replace(/^--/, "");
  if (body.startsWith("color-")) {
    const rest = body.slice("color-".length);
    const sub = COLOR_SUBGROUPS.find((s) => rest === s || rest.startsWith(s + "-"));
    return { group: "color", sub: sub || "other" };
  }
  if (body.startsWith("font-size-")) return { group: "font-size", sub: null };
  if (body.startsWith("font-weight-")) return { group: "font-weight", sub: null };
  if (body.startsWith("font-family-")) return { group: "font-family", sub: null };
  if (body.startsWith("font-name-")) return { group: "font-name", sub: null };
  if (body.startsWith("line-height-")) return { group: "line-height", sub: null };
  if (body.startsWith("space-")) return { group: "space", sub: null };
  if (body.startsWith("radius-")) return { group: "radius", sub: null };
  if (body.startsWith("duration-")) return { group: "duration", sub: null };
  if (body.startsWith("ease-")) return { group: "ease", sub: null };
  if (body.startsWith("elevation-")) return { group: "elevation", sub: null };
  if (body.startsWith("opacity-")) return { group: "opacity", sub: null };
  if (body.startsWith("size-")) return { group: "size", sub: null };
  return { group: "other", sub: null };
}

// Build a nested structure: group -> sub (or "") -> [name]
const groups = new Map();
for (const name of tokens.keys()) {
  const { group, sub } = categorize(name);
  if (!groups.has(group)) groups.set(group, new Map());
  const key = sub || "";
  const bySub = groups.get(group);
  if (!bySub.has(key)) bySub.set(key, []);
  bySub.get(key).push(name);
}

const GROUP_ORDER = [
  "color",
  "space",
  "radius",
  "font-size",
  "font-weight",
  "font-family",
  "font-name",
  "line-height",
  "duration",
  "ease",
  "elevation",
  "opacity",
  "size",
  "other",
];

function table(names) {
  const rows = [...names]
    .sort()
    .map((n) => `| \`${n}\` | \`${tokens.get(n)}\` |`)
    .join("\n");
  return `| Token | Sample (Fusion light) |\n| --- | --- |\n${rows}`;
}

const out = [];
out.push("# Design Tokens (allow-list)");
out.push("");
out.push(
  "> **AUTO-GENERATED** by `scripts/gen-tokens.mjs` from `bench-shells`'s `design-tokens.css`.",
);
out.push("> **DO NOT EDIT BY HAND** — run `npm run gen:tokens` to regenerate.");
out.push(">");
out.push(
  "> These are the **only** valid design-system CSS custom properties. Token **names** are",
);
out.push(
  "> identical across every theme (Fusion / IAS / IES, light + dark); only **values** differ.",
);
out.push(
  "> The _Sample (Fusion light)_ column is illustrative only — always reference the token with",
);
out.push("> `var(--name)`, never the literal value.");
out.push(">");
out.push(
  "> **Hard rule: never invent a token name.** If a `--token` is not in this file, it does not",
);
out.push(
  "> exist. Use the closest listed token; fall back to a raw value only as a last resort.",
);
out.push(">");
out.push(`> Total: ${tokens.size} tokens.`);
out.push("");
out.push("## Most-needed tokens (start here)");
out.push("");
out.push("| Token | Sample (Fusion light) | Use for |");
out.push("| --- | --- | --- |");
for (const [name, use] of MOST_NEEDED) {
  if (tokens.has(name)) out.push(`| \`${name}\` | \`${tokens.get(name)}\` | ${use} |`);
}
out.push("");

// Pixel → token lookup, derived from the real values. Agents reading a Figma spec (or
// porting hard-coded CSS) think in pixels; the IDS spacing/radius scale is semantic, so this
// bridge stops them falling back to raw px. When several tokens share a px value, prefer the
// short semantic-agnostic name (--space-small/medium/large/x-large, --radius-*).
function pxFor(name) {
  const v = tokens.get(name);
  const m = v && v.match(/^(\d+)px$/);
  return m ? Number(m[1]) : null;
}
// Canonical names that should win a px tie regardless of segment count (e.g. 6px should map
// to --radius-medium, the default, not the --radius-action alias).
const CANONICAL = [
  "--radius-small",
  "--radius-medium",
  "--radius-large",
  "--radius-full",
  "--space-x-small",
  "--space-small",
  "--space-medium",
  "--space-large",
  "--space-x-large",
];
function preference(name) {
  // Lower = preferred. Canonical names rank first; otherwise fewer segments → simpler name.
  const idx = CANONICAL.indexOf(name);
  if (idx !== -1) return idx - 100; // always beats non-canonical
  const body = name.replace(/^--/, "");
  return body.split("-").length; // fewer segments → simpler name
}
const byPx = new Map(); // px -> best token name (for space + radius)
for (const name of tokens.keys()) {
  if (!name.startsWith("--space-") && !name.startsWith("--radius-")) continue;
  const px = pxFor(name);
  if (px == null) continue;
  const cur = byPx.get(px);
  if (!cur || preference(name) < preference(cur)) byPx.set(px, name);
}
if (byPx.size > 0) {
  out.push("## Pixel → token (spacing & radius)");
  out.push("");
  out.push(
    "When a design or existing CSS specifies a pixel value, map it to the token below instead",
  );
  out.push(
    "of hard-coding the `px`. (Derived from the real Fusion-light values; pick by intent — e.g.",
  );
  out.push("use a gap/padding token for gaps and padding.)");
  out.push("");
  out.push("| Pixels | Use this token |");
  out.push("| --- | --- |");
  for (const px of [...byPx.keys()].sort((a, b) => a - b)) {
    out.push(`| \`${px}px\` | \`var(${byPx.get(px)})\` |`);
  }
  out.push("");
}

for (const group of GROUP_ORDER) {
  const bySub = groups.get(group);
  if (!bySub) continue;
  out.push(`## ${group}`);
  out.push("");
  const subKeys = [...bySub.keys()].sort((a, b) => {
    if (a === "") return -1;
    if (b === "") return 1;
    return a.localeCompare(b);
  });
  if (subKeys.length === 1 && subKeys[0] === "") {
    out.push(table(bySub.get("")));
    out.push("");
  } else {
    for (const sub of subKeys) {
      out.push(`### ${group} · ${sub || "(general)"}`);
      out.push("");
      out.push(table(bySub.get(sub)));
      out.push("");
    }
  }
}

writeFileSync(OUT, out.join("\n").replace(/\n+$/, "\n"));
console.log(`[gen-tokens] Wrote ${OUT} (${tokens.size} tokens).`);
