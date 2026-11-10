import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

const base = process.env.BASE_PATH || "/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: "docs",
  },
  plugins: [react(), {
      name: "html-base",
      transformIndexHtml(html) {
        const href = base;
        return html.replace("<head>", `<head>\n    <base href="${href}">`);
      },
    }],
  resolve: {
    alias: [
      {
        find: /^@design-systems\/icons$/,
        replacement: resolve(__dirname, "src/lib/design-systems-icons-shim.ts"),
      },
      {
        find: /^bench-shells$/,
        replacement: resolve(__dirname, "node_modules/bench-shells/src/index.ts"),
      },
      { find: /^@\//, replacement: `${resolve(__dirname, "src")}/` },
    ],
    // bench-shells re-imports React, Router, and IDS theme — make sure
    // every consumer in the graph gets fusion-bench's single copy so
    // contexts have one identity.
    dedupe: [
      "react",
      "react-dom",
      "react-router-dom",
      "@design-systems/theme",
    ],
  },
  optimizeDeps: {
    // Pre-bundle CJS-only deps that ESM consumers default-import. Without
    // this, the browser hits raw CJS files and throws "does not provide an
    // export named 'default'".
    include: [
      // react-markdown chain (bench-extras StreamingMarkdown)
      "react-markdown",
      "hast-util-to-jsx-runtime",
      "style-to-js",
      "style-to-object",
      // @ids-ts/core deviceUtils
      "ua-parser-js",
      // @ids-ts/utils check-for-a11y-props
      "@design-systems/logger",
      // @ids-ts/text-field (and other IDS form controls)
      "lodash.uniqueid",
      // @ids-ts/icon-control (and other IDS components) ship a nested CJS
      // react-is; pre-bundle it so named exports like `isFragment` resolve.
      "react-is",
    ],
    // Pre-bundling bench-shells bakes CSS-module imports as absolute
    // filesystem paths inside the chunk, which the browser can't resolve
    // at runtime (blank page). Serving as native ESM lets Vite's transform
    // pipeline handle .module.css imports correctly.
    exclude: ["bench-shells", "bench-extras", "@design-systems/icons"],
  },
});
