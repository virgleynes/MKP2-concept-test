# Agent Instructions

This file provides instructions for AI coding agents (Claude Code, Cursor, Copilot, etc.) working inside this repo.

---

## Project Overview

**Fusion Bench** is a Vite + React + TypeScript prototype toolkit built on Intuit's design system. It ships with:

- A `Shell` chrome wrapper imported from the [`bench-shells`](https://github.intuit.com/jmehlhoff/bench-shells) library — a vertical icon rail on the left, a top header with centered search, a content area, and an optional right-side panel. The library also bundles the design tokens, brand SVGs, and the QBO/IAS/IES app taxonomy.
- Layout, animation, and streaming-text primitives imported from the [`bench-extras`](https://github.intuit.com/jmehlhoff/bench-extras) library (`StackLayout`, `ClusterLayout`, `StreamingMarkdown`, etc.).
- A small set of host-only UI components in `src/components/` (`Avatar`, `Bench`, `OmniPanel`, `GlobalCreate`, `DelayedContent`, `AppLayoutWithLatency`) — these are yours to edit.

The shell renders one of three visual themes, selected by `FUSION_CONFIG.theme` in [`src/navigation.ts`](src/navigation.ts):

- **Fusion (QBO-style)** — `theme: "gbsgexperimental"`. The default. No `customers`.
- **Intuit Accountant Suite (IAS)** — `theme: "intuitaccountantsuite"` plus `customers: string[]`. IAS uses a Service Delivery / Firm Operations rail and the IAS logo. Selecting a sub-customer in the header switcher keeps IAS tokens and logo.
- **Intuit Enterprise Suite (IES)** — `theme: "intuitenterprisesuite"` plus `customers: string[]`. The shell uses the Enterprise logo and hides global search (`hideSearch`). Selecting a sub-customer switches IDS tokens to Fusion (`gbsgexperimental`) while keeping the Enterprise logo.

Design tokens (theme palettes, motion vars), brand SVGs, and the app sub-nav taxonomy all live inside `bench-shells`. `import "bench-shells/styles.css"` in [`src/main.tsx`](src/main.tsx) loads them. To pick up a new shell or token revision, bump the `bench-shells` ref in [`package.json`](package.json) and re-run `npm install`.

The app uses `HashRouter` (see [`src/App.tsx`](src/App.tsx)), so prototype routes live under `/#/...` and there is no server-side route config to maintain. `vite.config.ts` and the deploy script set the asset base path via `BASE_PATH` — `/pages/<owner>/<repo>/` for GitHub Pages, `./` (relative) for Ship-It. Never hard-code root-absolute `/assets/...` paths; both hosts serve the site under a sub-path.

> Designers don't clone this repo directly — they create their own from it via GitHub's **Create from template** (`https://github.intuit.com/new?template_name=design-bench-fusion&template_owner=jmehlhoff`), set repo visibility to **Internal**, then `git clone`, `npm install`, `npm run dev` on the Intuit VPN. The shipped `README.md` is written for that *forked* prototype, not for onboarding from the template, so keep template/onboarding instructions here in `AGENTS.md` rather than in the README.

---

## Architecture

```
ShellProvider (theme + company-switcher + side-panel state, from bench-shells)
└─ ThemedShell
   └─ ThemeProvider (@design-systems/theme, driven by useShell().theme)
      └─ Shell (chrome: rail, header, side panel — from bench-shells)
         └─ Routes
            └─ AppLayoutWithLatency (fakes route load latency)
               └─ your route components
```

`App.tsx` wires this up. `ShellProvider` reads `theme` / `pathPrefix` / `businessName` / `customers` from `FUSION_CONFIG`; `ThemedShell` reads the live `theme` back out of `useShell()` so the IDS `ThemeProvider` re-themes when the user switches suites at runtime.

The four `Shell` slot props are how the host injects prototype chrome:

| Prop | Host component | What it is |
|---|---|---|
| `sidePanel` | `<OmniPanel />` | Right-rail panel content |
| `createMenu` | `<GlobalCreate />` | Popover for the rail "Create" item |
| `userAvatar` | `<Avatar />` | Header avatar |
| `pinned` | — | `SectionKey[]` of app sections pinned to the left rail |

`hideSearch` is set to `true` for the IES theme.

---

## Component Conventions

### Adding a new route / screen

1. Create `src/routes/MyFeature/index.tsx` (and an optional `MyFeature.module.css`).
2. Register it in [`src/App.tsx`](src/App.tsx) as a child `<Route>` **inside** the `AppLayoutWithLatency` layout route, so it inherits the fake-latency loader:

   ```tsx
   <Route element={<AppLayoutWithLatency delayMs={FUSION_CONFIG.routeDelayMs} />}>
     <Route path="" element={<Bench />} />
     <Route path="my-feature" element={<MyFeature />} />
     {/* keep the catch-all last */}
     <Route path="/*" element={<NotFound />} />
   </Route>
   ```

You do **not** need to wrap routes in `Shell` — `App.tsx` already wraps `<Routes>` in `<Shell>`. Link between routes with `react-router-dom`'s `<Link to="...">`; prefix programmatic navigation with `useShell().pathPrefix` (see `GlobalCreate`).

### Page archetypes — start from these, don't invent a layout

When asked to build a page (e.g. "create a bank transactions page"), **do not improvise the structure.** Pick the closest archetype below, open its example under [`src/routes/_examples/`](src/routes/_examples), and copy its shape — page header, content regions, spacing, and the IDS components it uses. This is how a page ends up looking like it belongs in the product.

| Ask sounds like… | Archetype | Example to copy |
|---|---|---|
| A list of records: transactions, invoices, customers, bills | **List / table** | [`_examples/ListPage`](src/routes/_examples/ListPage/index.tsx) — page header + toolbar (search/filter/primary action) + `@ids-ts/table` + `@ids-ts/pagination` |
| A single record: one invoice, one customer | **Detail** | [`_examples/DetailPage`](src/routes/_examples/DetailPage/index.tsx) — header with status + actions, `@ids-ts/tabs`, label/value rows in a `Card` |
| An overview / home with metrics | **Dashboard** | [`_examples/DashboardPage`](src/routes/_examples/DashboardPage/index.tsx) — `PageHeader` + responsive grid of metric `Card`s + a chart slot |

Browse them live at `/#/_examples/list`, `/#/_examples/detail`, `/#/_examples/dashboard`.

Shared building blocks every page should reuse (don't re-style these from scratch):

- **[`Page`](src/components/Page/index.tsx)** — the page wrapper. Render `<Page pageHeader={<PageHeader … />}>…</Page>`; it lays out a sticky header above scrollable, padded content. Every archetype starts here.
- **[`PageHeader`](src/components/PageHeader/index.tsx)** — the standard header: a `title`, optional `breadcrumb` and `badge`, and action buttons passed as `children`. Goes in `Page`'s `pageHeader` slot.
- **`Card`** + **`CardContent`** (from [`@ids-ts/cards`](https://registry.npmjs.intuit.com/-/web/detail/@ids-ts/cards)) — the boxed surface for sections and tiles. Wrap content in `CardContent` inside a non-clickable `Card`:

  ```tsx
  import Card, { CardContent } from "@ids-ts/cards";

  <Card disableCardClick size="none" className={styles.card}>
    <CardContent>{/* StackLayout, text, etc. */}</CardContent>
  </Card>
  ```

  `disableCardClick` makes it static (not a button); `size="none"` lets `CardContent` own the padding. See `DetailPage` / `DashboardPage` for the pattern.
- **`StackLayout` / `ClusterLayout`** (from `bench-extras`) — vertical / horizontal layout. `gap` is a 0–8 scale, **not** pixels.

If none of the archetypes fit, compose from the same parts (PageHeader + Card + the IDS components) rather than starting blank. The `_examples` routes are reference scaffolding — a designer can delete them once their real pages exist.

### Real QBO pages — reference corpus (`reference/qbo-pages/`)

When asked to build a screen that **mimics a real QBO page** (e.g. "recreate the invoices page"), check [`reference/qbo-pages/`](reference/qbo-pages/README.md) first — it holds outlines captured from the live product: shell regions, the IDS components actually in use (mapped to `@ids-ts/*` packages), and a pruned layout tree.

How to use an outline:

- **Shell regions are informational only.** The rail/header/subnav describe real QBO chrome; in this repo chrome comes from `bench-shells` and is already wired. **Only build the `content` region** — never rebuild the rail or header.
- **The component inventory is your import list.** Rows marked **NOT AVAILABLE** have no bench equivalent — approximate them from the archetypes above and `bench-extras` primitives rather than hand-rolling lookalikes.
- **Combine outline + archetype.** The outline gives real structure; the archetype gives spacing, tokens, and component usage patterns.

If the page isn't in the corpus, ask the designer to capture it — the `/snapshot-qbo` skill (with Claude in Chrome connected) or the bookmarklet in [`scripts/qbo-snapshot/`](scripts/qbo-snapshot/README.md) does it in one step from their logged-in QBO tab.

### Reading shell state

`useShell()` (from `bench-shells`) returns the live shell context:

| Field | Type | Use |
|---|---|---|
| `theme` | `Theme` | Current suite/visual theme |
| `changeTheme(theme, customers?)` | fn | Switch suites at runtime (the `Bench` home buttons use this) |
| `businessName` | `string` | Header company name |
| `customers` | `string[] \| undefined` | Sub-customers for IAS/IES |
| `sidePanelOpen` / `toggleSidePanel()` | — | Right side-panel state |
| `pathPrefix` | `string` | Prefix for prototype links |
| `sectionLinks` | `Record<SectionKey, SectionLink[]>` | Resolved sub-nav links |

`useShell` must be called inside `<ShellProvider>` (App.tsx mounts it at the root).

### CSS

Use **CSS Modules** (`.module.css`) for component-level styles. Reference design tokens via CSS custom properties — the IDS token set is activated by `data-theme` on `<html>` (see `index.html`) plus `bench-shells/styles.css`:

```css
.card {
  background: var(--color-container-background-primary);
  border-radius: var(--radius-medium);
  padding: var(--space-medium);
}
```

> **Design tokens are an allow-list — see [`TOKENS.md`](TOKENS.md).** It is auto-generated
> from `bench-shells` and lists every valid CSS custom property (names + a sample Fusion-light
> value), grouped by category, with the most-needed tokens up top.
>
> **Hard rule: never invent a token name.** If a `--token` is not in `TOKENS.md`, it does not
> exist. Use the closest listed token. Reach for a raw value only as a last resort, and only
> when nothing in `TOKENS.md` fits.
>
> **Spacing and radius must use tokens too — don't hard-code `px`.** The IDS scale is
> semantic, not numeric, so to translate a pixel value use the **"Pixel → token"** table at
> the top of `TOKENS.md` (e.g. `12px → var(--space-small)`, `24px → var(--space-large)`,
> `6px → var(--radius-medium)`). Use `gap` / `padding` on `StackLayout` / `ClusterLayout`
> from `bench-extras` for layout spacing where it fits.
>
> **Borders vs. dividers — pick the right family.** For the outline *around* a contained
> surface (a card, input, panel, tile), use **`--color-container-border-*`** (e.g.
> `--color-container-border-primary`). For a line that *separates* content within a region
> (between list rows, table rows, sections, field rows), use **`--color-divider-*`** (e.g.
> `--color-divider-primary`). Don't reach for a divider token to outline a box — that's the
> common mistake. See the `DashboardPage` chart card (container-border, outlines a box) and
> the `DetailPage` field rows (divider, separates rows) for the canonical usage.
>
> Common traps the agent falls into: there is **no `--spacing-N` scale** — use `--space-*`
> (e.g. `--space-medium`, `--space-container-padding-medium`). There is **no
> `--color-container-default`** — use `--color-container-background-primary`. There is **no
> `--color-interactive-default`** — the interactive blue is `--color-text-link`.
>
> Regenerate after bumping the `bench-shells` ref: `npm run gen:tokens`.

### Path Aliases

The only host alias is `@/` → `src/`:

```tsx
import { Avatar, Bench } from "@/components";
import OmniPanel from "@/components/OmniPanel";
```

`vite.config.ts` also aliases `bench-shells` to its raw source and `@design-systems/icons` to a local shim (see "Gotchas" below). `tsconfig.app.json` mirrors these in `paths` so `tsc` resolves them the same way — **keep the two in sync** if you change either.

---

## Intuit Design System (`@ids-ts/*`)

All IDS components live in the Intuit private npm registry. The `.npmrc` in this repo is already configured:

```
registry=https://registry.npmjs.intuit.com
```

### Installing a new IDS component

```bash
npm install @ids-ts/<component-name>
```

Browse available packages at `https://registry.npmjs.intuit.com/-/web/detail/@ids-ts/<component-name>`.

Common packages already installed (see [`package.json`](package.json)):

| Package | What it provides |
|---|---|
| `@ids-ts/button` | `Button` |
| `@ids-ts/typography` | `H1`–`H3`, `B1`–`B4`, etc. |
| `@ids-ts/badge` | `Badge` with status variants |
| `@ids-ts/loader` | `Activity`, `Progress` spinners |
| `@ids-ts/icon-control` | `IconControl` |
| `@ids-ts/dropdown`, `@ids-ts/dropdown-button` | `Dropdown`, `DropdownButton` |
| `@ids-ts/tooltip` | `Tooltip` |
| `@ids-ts/text-field` | `TextField` and friends (inputs) |
| `@ids-ts/table` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableFooter` (compound) |
| `@ids-ts/tabs` | `Tabs`, `Tab` |
| `@ids-ts/pagination` | `Pagination` |
| `@ids-ts/checkbox` | `Checkbox` |
| `@ids-ts/styles` | Global IDS CSS custom properties (tokens) |
| `@design-systems/icons` | Icon set (consumed through a local shim) |

> The list/detail page examples use `table`, `tabs`, and `pagination` — see **Page archetypes** above. New IDS packages that ship their own CSS need their import added to [`src/main.tsx`](src/main.tsx) (the page-building ones already are).

### Import pattern

```tsx
import { Button } from "@ids-ts/button";
import { H2, B1 } from "@ids-ts/typography";
import { Badge } from "@ids-ts/badge";
import { Activity } from "@ids-ts/loader";
```

If you add a new IDS package that ships its own CSS, add the import to [`src/main.tsx`](src/main.tsx):

```ts
import "@ids-ts/<component-name>/dist/main.css";
```

### Typography reference

Use `@ids-ts/typography` components instead of raw HTML heading/paragraph tags. `B1`–`B4` accept a `weight` prop (`"regular"` | `"medium"` | `"demi"` | `"bold"`).

```tsx
import { H2, B1, B3 } from "@ids-ts/typography";

<H2>Section title</H2>
<B1>Body copy</B1>
<B3 weight="medium">Label</B3>
```

---

## Gotchas (host-specific build wiring)

These exist because `bench-shells` is consumed as **raw source** (not a pre-built package), so the host's bundler/type-checker has to resolve the library's own internals. If you touch build config, keep these in mind:

- **`@design-systems/icons` shim** ([`src/lib/design-systems-icons-shim.ts`](src/lib/design-systems-icons-shim.ts)). `bench-shells` imports `CirclesClusterThin` and `PersonTwoThin`, which the installed `@design-systems/icons` doesn't ship. The shim re-exports the full icon set and aliases those two names. Both `vite.config.ts` (`resolve.alias`) and `tsconfig.app.json` (`paths`) point `@design-systems/icons` at this shim.
- **`bench-shells` context dedupe** ([`src/lib/bench-shells-context.ts`](src/lib/bench-shells-context.ts) + the `benchShellsContextDedupe` plugin in `vite.config.ts`). Routes every `context` import inside `bench-shells` through a single module so `useShell` resolves to one context identity (otherwise `context.tsx` and `context.tsx?v=…` load as two modules and the provider/consumer don't match).
- **`dedupe` + `optimizeDeps`** in `vite.config.ts`. React, Router, and the IDS theme are deduped so contexts have one identity; several CJS-only transitive deps are pre-bundled. Don't remove these without re-running `npm run build` and `npm run dev` to confirm nothing regresses.

---

## Verifying changes

```bash
npm run lint     # eslint — should report 0 errors
npm run build    # tsc -b && vite build — both must be clean
npm run dev      # http://localhost:5173/  (routes under /#/)
```

Manual smoke checks at `http://localhost:5173/#/`:

- Default Fusion theme renders with the QBO rail + logo.
- The home (`Bench`) buttons switch to IAS (Service Delivery / Firm Operations rail, IAS logo) and IES (Enterprise logo, no search bar).
- Open the side panel via the header omni-nav button; open the "Create" popover from the rail.
- Navigate to a route under `/#/app/...` — the `Activity` dots loader fires for `routeDelayMs`, then content renders.
- DevTools console: no `useShell must be used within a ShellProvider`, no missing-peer-dep warnings, no React Router context duplication.

---

## Sharing with external testers (Ship-It)

`npm run deploy` publishes to **GitHub Pages**, which only works **on VPN**. When the designer wants **customers, research participants or anyone outside Intuit** to open the prototype, publish to **Ship-It** — Intuit's hosting service for user-research prototypes. Viewers use a **share link** that works with no Intuit login until it expires (2 hours, 24 hours or 7 days).

```bash
bench shipit                 # preferred (Design Bench CLI) — or: npm run shipit
bench shipit --yes           # accept the suggested link name/title without prompting
bench shipit --share 7d      # also print a share link in the terminal
bench deploy --shipit        # GitHub Pages + Ship-It in one go
bench shipit list            # what has been shipped so far
```

What `bench shipit` does: builds with a **relative base** (`BASE_PATH=./` → `vite.config.ts` sets `base: "./"` and `<base href="./">`), checks the output (`index.html` at the root, no symlinks, no root-absolute `src="/…"` / `href="/…"` / `url(/…)`, size limits), zips `docs/`, uploads it, and bumps the `package.json` patch version so the next upload gets a fresh name.

**Requirements:** the **Intuit Developer Desktop App** must be running and signed in on the designer's Mac — it signs the upload as them, so no token or secret is ever needed here. Agents running in a sandbox/VM can't ship; hand the designer the command instead.

**Rules for agents:**

- **Never paste a share link into the chat.** The `shipit_prototype` MCP tool returns none on purpose. Tell the designer to open the Ship-It dashboard (https://ship-it.app.intuit.com/prototypes), find the prototype by title, click **Share link**, and choose how long it should work. Anyone holding a link can open the prototype until it expires.
- **Link names (`slug`) are permanent and global.** A changed design always gets a new name — bench suggests `<repo>-v<version>`. `slug_taken` means choose another, never retry the same one. After `preflight_failed` or `bundle_too_large`, nothing was claimed: fix and retry the same name.
- **Keep paths relative.** Ship-It serves the prototype from `…/<slug>/`. Use `./`-relative or bundler-managed asset URLs; never `/assets/...`. External CDNs (`https://…`, `//…`) are fine.
- **No unpublish.** Links expire on their own (≤ 7 days). "Take it down" = stop sharing and let links run out.
- **No real customer data** in anything shipped.

---

## Figma MCP

The Figma MCP server lets an agent read component specs, design tokens, and layout values directly from a Figma file.

When reading a Figma spec, map every literal value to an IDS token or `bench-extras`
primitive — match the Figma color/spacing/radius against [`TOKENS.md`](TOKENS.md) and use the
closest listed token rather than hard-coding the hex/px. A few common mappings:

| Figma value | Prefer this instead |
|---|---|
| `#0077C5` (blue) | `var(--color-text-link)` |
| `border-radius: 8px` | `var(--radius-medium)` |
| `gap: 8px` | `gap={2}` on `StackLayout` / `ClusterLayout` |
| `Avenir Next 400` body text | `<B1>` from `@ids-ts/typography` |
| `Avenir Next 600` label | `<B2 weight="medium">` |

To find the right IDS component for a Figma element: check `package.json` first (import directly if installed); otherwise `npm install @ids-ts/<component-name>`, add its CSS import to `main.tsx` if it ships styles, and read `node_modules/@ids-ts/<component-name>/dist/index.d.ts` for available props.

---

## Key files

| File | Purpose |
|---|---|
| [`src/App.tsx`](src/App.tsx) | Provider + shell wiring and the route registry — add new routes here |
| [`src/main.tsx`](src/main.tsx) | Entry point — add global CSS imports here |
| [`src/navigation.ts`](src/navigation.ts) | Active `FUSION_CONFIG`: `theme`, `businessName`, optional `customers`, `pathPrefix`, `routeDelayMs` |
| [`src/types.ts`](src/types.ts) | `FusionConfig` discriminated union (Fusion vs IAS vs IES) |
| [`src/components/index.ts`](src/components/index.ts) | Barrel exports for host components |
| [`src/components/AppLayoutWithLatency/index.tsx`](src/components/AppLayoutWithLatency/index.tsx) | Layout route that fakes load latency |
| [`src/lib/`](src/lib) | Build-wiring shims (icons, bench-shells context) — see "Gotchas" |
| [`reference/qbo-pages/`](reference/qbo-pages/README.md) | Outlines of real QBO pages — check before mimicking a live screen |
| [`scripts/qbo-snapshot/extractor.js`](scripts/qbo-snapshot/extractor.js) | Live-QBO page capture (skill `/snapshot-qbo` + bookmarklet); fingerprint map inside |
| [`vite.config.ts`](vite.config.ts) | Aliases, context dedupe plugin, base-path detection for Pages |
| [`scripts/deploy.sh`](scripts/deploy.sh) | One-command GitHub Pages deploy (`npm run deploy`; `npm run deploy:static` skips version bump) |
| `npm run shipit` → `bench shipit` | Publish to Ship-It for external testers (relative-base build + upload); see **Sharing with external testers** |
