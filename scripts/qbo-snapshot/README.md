# qbo-snapshot

Captures a structured, PII-free outline of a live QuickBooks Online page — shell regions, IDS component inventory mapped to `@ids-ts/*` packages, and a pruned layout tree. Outlines land in [`reference/qbo-pages/`](../../reference/qbo-pages/) where agents use them to build prototypes that match the real product.

One extractor, three ways to run it:

## 1. Claude Code skill (primary)

In a Claude Code session inside this repo, with the **Claude in Chrome** extension connected and a QBO page open in a logged-in tab:

```
/snapshot-qbo
```

or just say "snapshot this QBO page". The agent injects the extractor into your tab, reviews the output for PII, saves `reference/qbo-pages/<slug>.md`, and updates the corpus index. Skill definition: [`.claude/skills/snapshot-qbo/SKILL.md`](../../.claude/skills/snapshot-qbo/SKILL.md).

## 2. Bookmarklet (works anywhere, no Claude Code needed)

One-time install:

1. Open `dist/bookmarklet.txt` and copy the entire contents.
2. Chrome → Bookmarks → Bookmark Manager → ⋮ → **Add new bookmark**.
3. Name: `QBO snapshot`. URL: paste. Save.

Use: on any QBO page, click the bookmark. The outline is copied to your clipboard (an overlay confirms, with the text as fallback). Paste it into whatever coding agent you're using — **review labels for anything sensitive before sharing/committing.**

## 3. DevTools console (always-works fallback)

Paste the full contents of `extractor.js` into the console on a QBO tab and press Enter. The outline is returned, stashed on `window.__qboSnapshotMd`, and copied to the clipboard (if that fails: `copy(window.__qboSnapshotMd)`).

## Files

| File | What |
|---|---|
| `extractor.js` | The single-file extractor. Self-contained vanilla JS — the source of truth for all three run paths. The component fingerprint map lives inside it between `__FINGERPRINTS_START__/__END__` markers. |
| `build-bookmarklet.mjs` | Zero-dep build: strips comments/whitespace and wraps as a `javascript:` URL. |
| `dist/bookmarklet.txt` | Generated + committed so designers never need node. |

**After editing `extractor.js`, re-run:**

```bash
npm run gen:bookmarklet
```

## Editing rules for extractor.js

The bookmarklet build does naive stripping, so the file follows strict rules (see its header comment): block or full-line comments only (never trailing), a semicolon after every statement, no comment-like sequences inside strings/regexes. Verify after editing:

```bash
node --check scripts/qbo-snapshot/extractor.js && npm run gen:bookmarklet
```

## Privacy

The extractor never reads input values or table-cell text. Label text is captured only from an allowlist (headings, buttons, tabs, nav links, column headers, `<label>`s, `aria-label`s), truncated to 40 chars, with emails and 5+ digit runs scrubbed. URLs are normalized (`/invoice/123` → `/invoice/:id`). A human/agent PII review is still required before committing any outline.
