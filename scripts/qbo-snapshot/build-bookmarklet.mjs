#!/usr/bin/env node
/**
 * Builds dist/bookmarklet.txt from extractor.js.
 *
 * Zero dependencies — does naive stripping, which extractor.js is written
 * to survive (block/full-line comments only, semicolons everywhere).
 * Re-run after editing extractor.js:  npm run gen:bookmarklet
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "extractor.js"), "utf8");

let code = src
  // strip block comments
  .replace(/\/\*[\s\S]*?\*\//g, "")
  // strip full-line comments (extractor.js never uses trailing ones)
  .replace(/^\s*\/\/.*$/gm, "")
  // collapse all whitespace runs (safe: every statement is semicolon-terminated)
  .replace(/\s+/g, " ")
  .trim();

// Bookmarklet mode: show the overlay so designers get visible feedback.
const wrapped =
  "javascript:" +
  encodeURIComponent(
    "void(function(){window.__QBO_SNAPSHOT_OPTS={overlay:true,clipboard:true};" +
      code +
      "}())"
  );

mkdirSync(join(here, "dist"), { recursive: true });
writeFileSync(join(here, "dist", "bookmarklet.txt"), wrapped + "\n");
console.log(
  `Wrote dist/bookmarklet.txt (${wrapped.length.toLocaleString()} chars)`
);
