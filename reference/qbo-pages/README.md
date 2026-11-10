# QBO page reference corpus

Outlines of **real QuickBooks Online pages**, captured from the live product. Each file describes what's actually on a QBO screen — shell regions, the IDS components in use (mapped to the `@ids-ts/*` packages available in this repo), and a pruned layout tree — so an agent building a prototype can match the real product instead of improvising.

Captured with [`scripts/qbo-snapshot/`](../../scripts/qbo-snapshot/) — via the `/snapshot-qbo` Claude Code skill or the bookmarklet.

## Index

| Page | File | urlPattern | Captured |
|---|---|---|---|
| _none yet — run `/snapshot-qbo` on a live QBO page_ | | | |

## How agents should read an outline

1. **Shell regions are informational only.** The rail/header/subnav in an outline describe real QBO chrome — in this repo, chrome comes from `bench-shells` and is already wired in `App.tsx`. **Never rebuild the rail or header.** Build only what's under `region: content`.
2. **The component inventory tells you what to import.** Each row maps a detected component to its `@ids-ts/*` package. Rows marked **NOT AVAILABLE** have no bench equivalent — approximate them from the page archetypes (`src/routes/_examples/`) and `bench-extras` primitives rather than hand-rolling lookalikes.
3. **The layout outline is a skeleton, not a spec.** `×N` means N repeated siblings (table rows, nav items). Combine the outline with the closest archetype in `AGENTS.md` ("Page archetypes") for spacing, tokens, and structure.
4. **Check `capturedAt`.** QBO ships continuously; an old capture may be stale. Re-capture rather than trusting a months-old outline for a screen that matters.
5. **Check `host`.** Captures can come from production (`qbo.intuit.com`, `app.qbo.intuit.com`) or pre-production environments (`e2e.qbo.intuit.com`). An e2e capture may include features or copy that haven't shipped to production yet — the outline says so when this applies.

## Outline file format (schemaVersion 1)

- YAML frontmatter: `urlPattern` (IDs normalized to `:id`, query stripped), `host`, `title`, `capturedAt`, `viewport`, `schemaVersion`, `extractor`.
- **Shell regions** — which chrome regions were detected.
- **Layout outline** — indented tree: `region:` roots, then components / headings / links / `(containers)`, labels in quotes, `×N` sibling collapse.
- **Component inventory** — Component | Count | package (or NOT AVAILABLE + hint).
- **Unknown ids-\* fingerprints** — raw signatures the extractor saw but couldn't name. These are the feedback loop for improving detection (see below).

## Iterating the fingerprint map

Detection lives in `scripts/qbo-snapshot/extractor.js` between the `__FINGERPRINTS_START__` / `__FINGERPRINTS_END__` markers — an ordered list of `{ name, idsPackage, match criteria }` entries (see the comment there for criteria semantics). Workflow:

1. A capture reports unknown `ids-*` signatures.
2. Add or refine a `FINGERPRINTS` entry (prefer `data-automation-id` and ARIA `role` over class tokens — prod class names can churn).
3. Re-run `npm run gen:bookmarklet` so the bookmarklet picks up the change.
4. Optionally re-capture the page.

## Capture rules

- **PII:** the extractor captures label text only (allowlist) and scrubs emails/digit-runs, but every outline still gets a human/agent review for names, amounts, and company-specific data **before commit**. Corpus files are code-reviewed like any other change.
- **Size:** keep each outline under ~15KB / ~300 lines. Bigger means the pruning needs fixing, not that the file should be committed anyway.
- **Curation:** target the ~15 canonical pages designers actually mimic (dashboard, invoice list/detail, banking, expenses, reports, customers…). This corpus ships in every prototype clone — keep it lean.
