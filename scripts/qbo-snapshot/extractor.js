/*
 * QBO page snapshot extractor
 * ---------------------------
 * Walks the DOM of a live QuickBooks Online page and emits a compact,
 * PII-free "page outline": shell regions, IDS component inventory mapped
 * to fusion-bench's @ids-ts/* packages, and a pruned layout tree.
 *
 * Runs three ways from this single file:
 *   1. Injected by the /snapshot-qbo Claude Code skill (claude-in-chrome).
 *   2. As a bookmarklet (built by build-bookmarklet.mjs).
 *   3. Pasted into the DevTools console.
 *
 * After running: window.__qboSnapshotMd (markdown) and
 * window.__qboSnapshotJson (raw data) are set, and the markdown is the
 * script's completion value. Set window.__QBO_SNAPSHOT_OPTS before this
 * script to control behavior: { overlay: boolean, clipboard: boolean }.
 *
 * STYLE RULES (the bookmarklet build does naive stripping):
 *   - Block comments or full-line comments only. Never trailing comments.
 *   - Every statement ends with a semicolon. No ASI reliance.
 *   - No comment-like sequences inside strings or regexes.
 *
 * PII: text is captured ONLY from an allowlist of label-bearing elements
 * (headings, buttons, tabs, nav links, column headers, labels, aria-labels),
 * truncated and scrubbed. Values, table cells, and inputs are never read.
 */
(function () {
  "use strict";

  var MAX_NODES = 400;
  var MAX_DEPTH = 12;
  var MAX_LABEL = 40;
  var COLLAPSE_AFTER = 3;
  var MAX_UNKNOWN = 30;

  /* __FINGERPRINTS_START__
   * Map of real-DOM patterns to fusion-bench component packages.
   * Entry matches when EVERY specified criterion passes:
   *   tag        - lowercase tag name
   *   inputType  - the type attribute (implies tag input)
   *   role       - explicit or implicit ARIA role
   *   classToken - regex tested against each class token starting with "ids"
   *   automationId - regex tested against data-automation-id / data-testid
   * First matching entry wins, so order specific to general.
   *   idsPackage - the @ids-ts/* package in fusion-bench, or null if the
   *                widget has no bench equivalent (hint says what to do).
   *   inventoryOnly - count it, but do not emit an outline node (used for
   *                   high-frequency inline things like typography).
   *   suppress   - match but neither count nor emit an outline node; use for
   *                wrapper elements whose inner control is fingerprinted
   *                separately (prevents double counting and unknown reports).
   * Iterate this map: every capture reports unmatched ids-* signatures in
   * the "Unknown fingerprints" section, which are candidate entries here.
   */
  var FINGERPRINTS = [
    { name: "Table", idsPackage: "@ids-ts/table", tag: "table" },
    { name: "Table", idsPackage: "@ids-ts/table", classToken: /table/i },
    { name: "Tabs", idsPackage: "@ids-ts/tabs", role: "tablist" },
    { name: "Tab", idsPackage: "@ids-ts/tabs", role: "tab" },
    { name: "Tabs", idsPackage: "@ids-ts/tabs", classToken: /tabs$/i },
    { name: "Pagination", idsPackage: "@ids-ts/pagination", classToken: /pagination|paginator/i },
    { name: "Checkbox", idsPackage: "@ids-ts/checkbox", inputType: "checkbox" },
    { name: "Checkbox", idsPackage: "@ids-ts/checkbox", role: "checkbox" },
    { name: "CheckboxWrapper", suppress: true, tag: "span", classToken: /^idsTSCheckbox$/i },
    { name: "Dropdown", idsPackage: "@ids-ts/dropdown", role: "combobox" },
    { name: "Dropdown", idsPackage: "@ids-ts/dropdown", tag: "select" },
    { name: "Dropdown", idsPackage: "@ids-ts/dropdown", classToken: /dropdown/i },
    { name: "TextField", idsPackage: "@ids-ts/text-field", classToken: /textfield|text-field/i },
    { name: "TextField", idsPackage: "@ids-ts/text-field", inputType: "text" },
    { name: "TextField", idsPackage: "@ids-ts/text-field", inputType: "search" },
    { name: "Badge", idsPackage: "@ids-ts/badge", classToken: /badge/i },
    { name: "Tooltip", idsPackage: "@ids-ts/tooltip", role: "tooltip", inventoryOnly: true },
    { name: "Tooltip", idsPackage: "@ids-ts/tooltip", classToken: /tooltip/i, inventoryOnly: true },
    { name: "Loader", idsPackage: "@ids-ts/loader", role: "progressbar" },
    { name: "Loader", idsPackage: "@ids-ts/loader", classToken: /loader|spinner/i },
    { name: "IconControl", idsPackage: "@ids-ts/icon-control", classToken: /iconcontrol|icon-control/i },
    { name: "Card", idsPackage: "@ids-ts/cards", classToken: /card/i },
    { name: "Accordion", idsPackage: null, hint: "not installed - check registry for @ids-ts/accordion", classToken: /accordion/i },
    { name: "Link", idsPackage: null, hint: "not installed - check registry for @ids-ts/link, or use react-router-dom Link", tag: "a", classToken: /^idsTSLink$/i, inventoryOnly: true },
    { name: "Typography", idsPackage: "@ids-ts/typography", classToken: /^idsF?[HB][1-6]$|typography/i, inventoryOnly: true },
    { name: "Button", idsPackage: "@ids-ts/button", classToken: /button|btn/i },
    { name: "Button", idsPackage: "@ids-ts/button", tag: "button" },
    { name: "Modal", idsPackage: null, hint: "not installed - check registry for @ids-ts/modal-dialog", role: "dialog" },
    { name: "DatePicker", idsPackage: null, hint: "not installed - check registry for @ids-ts/date-picker", classToken: /datepicker|date-picker|calendar/i },
    { name: "Avatar", idsPackage: null, hint: "use host component src/components/Avatar", classToken: /avatar/i }
  ];
  /* __FINGERPRINTS_END__ */

  /* Known shell container anchors in real QBO. Best-effort; iterated the
   * same way as FINGERPRINTS. Geometry fallback covers misses. */
  var SHELL_ANCHORS = [
    { region: "rail", automationId: /left-?nav|global-?nav|navigation-?container/i },
    { region: "header", automationId: /app-?header|top-?bar|global-?header/i },
    { region: "subnav", automationId: /sub-?nav|secondary-?nav/i }
  ];

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, PATH: 1, BR: 1, HR: 1 };
  var NAV_REGIONS = { rail: 1, header: 1, subnav: 1 };

  function scrub(text) {
    if (!text) { return ""; }
    var t = String(text).replace(/\s+/g, " ").trim();
    t = t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "<email>");
    t = t.replace(/\d{5,}/g, "#####");
    if (t.length > MAX_LABEL) { t = t.slice(0, MAX_LABEL - 1) + "…"; }
    return t;
  }

  function attr(el, name) {
    var v = el.getAttribute ? el.getAttribute(name) : null;
    return v || "";
  }

  function getRole(el) {
    var r = attr(el, "role");
    if (r) { return r.toLowerCase(); }
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    if (tag === "button") { return "button"; }
    if (tag === "a" && attr(el, "href")) { return "link"; }
    if (tag === "nav") { return "navigation"; }
    if (tag === "main") { return "main"; }
    if (tag === "header") { return "banner"; }
    if (tag === "aside") { return "complementary"; }
    if (tag === "table") { return "table"; }
    if (tag === "th") { return "columnheader"; }
    if (tag === "select") { return "combobox"; }
    if (/^h[1-6]$/.test(tag)) { return "heading"; }
    return "";
  }

  function idsTokens(el) {
    var out = [];
    var cls = (typeof el.className === "string") ? el.className : (el.className && el.className.baseVal) || "";
    var parts = cls.split(/\s+/);
    var i;
    for (i = 0; i < parts.length; i += 1) {
      if (/^ids/i.test(parts[i])) { out.push(parts[i]); }
    }
    return out;
  }

  function autoId(el) {
    return attr(el, "data-automation-id") || attr(el, "data-testid") || attr(el, "data-test-id");
  }

  function matchesEntry(el, entry, tokens, role, tag, aid) {
    var i;
    var ok;
    if (entry.tag && entry.tag !== tag) { return false; }
    if (entry.inputType) {
      if (tag !== "input") { return false; }
      if ((attr(el, "type") || "text").toLowerCase() !== entry.inputType) { return false; }
    }
    if (entry.role && entry.role !== role) { return false; }
    if (entry.classToken) {
      ok = false;
      for (i = 0; i < tokens.length; i += 1) {
        if (entry.classToken.test(tokens[i])) { ok = true; }
      }
      if (!ok) { return false; }
    }
    if (entry.automationId) {
      if (!aid || !entry.automationId.test(aid)) { return false; }
    }
    return true;
  }

  function fingerprint(el) {
    var tokens = idsTokens(el);
    var role = getRole(el);
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    var aid = autoId(el);
    var i;
    for (i = 0; i < FINGERPRINTS.length; i += 1) {
      if (matchesEntry(el, FINGERPRINTS[i], tokens, role, tag, aid)) { return FINGERPRINTS[i]; }
    }
    return null;
  }

  /* Note: do NOT use getClientRects here - wrappers with display:contents
   * report zero rects while their descendants are fully visible. */
  function isVisible(el) {
    if (attr(el, "aria-hidden") === "true") { return false; }
    if (el.hidden) { return false; }
    if (!el.tagName || !window.getComputedStyle) { return true; }
    var cs = window.getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") { return false; }
    return true;
  }

  function elementChildren(el) {
    var out = [];
    var i;
    var kids = el.children || [];
    if (el.shadowRoot && el.shadowRoot.children) {
      for (i = 0; i < el.shadowRoot.children.length; i += 1) { out.push(el.shadowRoot.children[i]); }
    }
    for (i = 0; i < kids.length; i += 1) { out.push(kids[i]); }
    return out;
  }

  /* ---- region detection ---- */

  function detectRegions() {
    var regions = [];
    var claimed = [];
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    function claim(name, el) {
      var i;
      if (!el || !isVisible(el)) { return; }
      for (i = 0; i < claimed.length; i += 1) {
        if (claimed[i] === el || claimed[i].contains(el) || el.contains(claimed[i])) { return; }
      }
      claimed.push(el);
      regions.push({ name: name, el: el });
    }

    var i;
    var el;
    var rect;
    var all = document.querySelectorAll("[data-automation-id]");
    var a;
    for (i = 0; i < all.length; i += 1) {
      el = all[i];
      for (a = 0; a < SHELL_ANCHORS.length; a += 1) {
        if (SHELL_ANCHORS[a].automationId.test(attr(el, "data-automation-id"))) {
          claim(SHELL_ANCHORS[a].region, el);
        }
      }
    }

    var mains = document.querySelectorAll("main, [role=main]");
    if (mains.length > 0) { claim("content", mains[0]); }

    var banners = document.querySelectorAll("header, [role=banner]");
    for (i = 0; i < banners.length; i += 1) {
      rect = banners[i].getBoundingClientRect();
      if (rect.top < 150) { claim("header", banners[i]); }
    }

    var navs = document.querySelectorAll("nav, [role=navigation]");
    for (i = 0; i < navs.length; i += 1) {
      el = navs[i];
      if (!isVisible(el)) { continue; }
      rect = el.getBoundingClientRect();
      if (rect.height > vh * 0.5 && rect.left < 120) {
        claim("rail", el);
      } else if (rect.width > vw * 0.4 && rect.top < vh * 0.35) {
        claim("subnav", el);
      } else {
        claim("nav", el);
      }
    }

    var asides = document.querySelectorAll("aside, [role=complementary]");
    for (i = 0; i < asides.length; i += 1) {
      rect = asides[i].getBoundingClientRect();
      if (rect.left > vw * 0.5) { claim("sidepanel", asides[i]); }
    }

    var dialogs = document.querySelectorAll("[role=dialog], [role=alertdialog]");
    for (i = 0; i < dialogs.length; i += 1) { claim("overlay", dialogs[i]); }

    if (regions.length === 0) {
      regions.push({ name: "content", el: document.body });
      claimed.push(document.body);
    } else {
      var hasContent = false;
      for (i = 0; i < regions.length; i += 1) {
        if (regions[i].name === "content") { hasContent = true; }
      }
      if (!hasContent) { regions.push({ name: "content", el: document.body, skip: claimed.slice() }); }
    }

    var order = { rail: 0, header: 1, subnav: 2, nav: 3, content: 4, sidepanel: 5, overlay: 6 };
    regions.sort(function (x, y) { return (order[x.name] || 9) - (order[y.name] || 9); });
    return regions;
  }

  /* ---- walk ---- */

  function collect() {
    var components = {};
    var unknown = {};
    var nodeCount = 0;
    var truncated = false;

    function countComponent(entry) {
      var rec = components[entry.name];
      if (!rec) {
        rec = { count: 0, idsPackage: entry.idsPackage, hint: entry.hint || "" };
        components[entry.name] = rec;
      }
      rec.count += 1;
    }

    function countUnknown(el, tokens) {
      var key = (el.tagName || "?").toLowerCase() + " ." + tokens.join(" .");
      var aid = autoId(el);
      if (aid) { key += " [" + scrub(aid) + "]"; }
      if (!unknown[key] && Object.keys(unknown).length >= MAX_UNKNOWN) { return; }
      unknown[key] = (unknown[key] || 0) + 1;
    }

    function labelFor(el, regionName, entry, role) {
      var aria = attr(el, "aria-label");
      if (aria) { return scrub(aria); }
      var tag = el.tagName ? el.tagName.toLowerCase() : "";
      var allow = false;
      if (role === "heading" || /^h[1-6]$/.test(tag)) { allow = true; }
      if (role === "button" || role === "tab" || role === "columnheader" || role === "menuitem") { allow = true; }
      if (tag === "label") { allow = true; }
      if ((role === "link") && NAV_REGIONS[regionName]) { allow = true; }
      if (entry && (entry.name === "Badge")) { allow = true; }
      if (!allow) { return ""; }
      return scrub(el.textContent || "");
    }

    /* Label is part of the key so distinct nav items and buttons never
     * merge - only true repeats (table rows, unlabeled tiles) collapse. */
    function collapseKey(node) {
      return node.kind + "|" + node.name + "|" + (node.role || "") + "|" + (node.label || "");
    }

    function collapseSiblings(nodes) {
      var out = [];
      var i = 0;
      var j;
      while (i < nodes.length) {
        j = i;
        while (j < nodes.length && collapseKey(nodes[j]) === collapseKey(nodes[i])) { j += 1; }
        var runLen = j - i;
        if (runLen > COLLAPSE_AFTER) {
          nodes[i].repeat = runLen;
          out.push(nodes[i]);
        } else {
          var k;
          for (k = i; k < j; k += 1) { out.push(nodes[k]); }
        }
        i = j;
      }
      return out;
    }

    function walk(el, regionName, depth, skipRoots) {
      if (!el || !el.tagName) { return []; }
      if (SKIP_TAGS[el.tagName.toUpperCase()]) { return []; }
      if (!isVisible(el)) { return []; }
      var i;
      if (skipRoots) {
        for (i = 0; i < skipRoots.length; i += 1) {
          if (skipRoots[i] === el) { return []; }
        }
      }

      var tag = el.tagName.toLowerCase();
      if (tag === "iframe") {
        nodeCount += 1;
        return [{ kind: "iframe", name: "iframe", label: "(embedded frame, not walked)", children: [] }];
      }

      var role = getRole(el);
      var tokens = idsTokens(el);
      var entry = fingerprint(el);
      if (entry) {
        if (!entry.suppress) { countComponent(entry); }
      } else if (tokens.length > 0) {
        countUnknown(el, tokens);
      }

      var kids = elementChildren(el);
      var childNodes = [];
      var deeper = depth;
      var significantSelf = false;
      var kind = "";
      var name = "";

      if (entry && !entry.inventoryOnly && !entry.suppress) {
        significantSelf = true;
        kind = "component";
        name = entry.name;
      } else if (role === "heading" || /^h[1-6]$/.test(tag)) {
        significantSelf = true;
        kind = "heading";
        name = /^h[1-6]$/.test(tag) ? tag.toUpperCase() : "Heading";
      } else if (role === "link" && NAV_REGIONS[regionName]) {
        significantSelf = true;
        kind = "link";
        name = "Link";
      } else if (role === "navigation" || role === "banner" || role === "main" || role === "complementary" || tag === "form" || role === "search") {
        significantSelf = true;
        kind = "landmark";
        name = tag === "form" ? "form" : role;
      }

      if (significantSelf) { deeper = depth + 1; }

      if (depth < MAX_DEPTH && nodeCount < MAX_NODES) {
        var isLeafComponent = significantSelf && kind === "component" && (name === "Button" || name === "Checkbox" || name === "TextField" || name === "Badge" || name === "Loader" || name === "IconControl" || name === "Dropdown");
        var isLeaf = isLeafComponent || kind === "heading" || kind === "link";
        if (!isLeaf) {
          for (i = 0; i < kids.length; i += 1) {
            childNodes = childNodes.concat(walk(kids[i], regionName, deeper, skipRoots));
          }
          childNodes = collapseSiblings(childNodes);
        }
      } else if (nodeCount >= MAX_NODES && !truncated) {
        truncated = true;
      }

      if (significantSelf) {
        if (nodeCount >= MAX_NODES) { return childNodes; }
        nodeCount += 1;
        var node = { kind: kind, name: name, children: childNodes };
        if (role && kind !== "landmark") { node.role = role; }
        var label = labelFor(el, regionName, entry, role);
        if (label) { node.label = label; }
        return [node];
      }

      if (childNodes.length >= 2) {
        if (nodeCount >= MAX_NODES) { return childNodes; }
        nodeCount += 1;
        return [{ kind: "container", name: tag, children: childNodes }];
      }
      return childNodes;
    }

    var regions = detectRegions();
    var outline = [];
    var regionNames = [];
    var r;
    var claimedRoots = [];
    for (r = 0; r < regions.length; r += 1) { claimedRoots.push(regions[r].el); }

    for (r = 0; r < regions.length; r += 1) {
      var reg = regions[r];
      var skipRoots = [];
      var q;
      for (q = 0; q < claimedRoots.length; q += 1) {
        if (claimedRoots[q] !== reg.el) { skipRoots.push(claimedRoots[q]); }
      }
      if (reg.skip) { skipRoots = skipRoots.concat(reg.skip); }
      regionNames.push(reg.name);
      var kids = elementChildren(reg.el);
      var children = [];
      var c;
      for (c = 0; c < kids.length; c += 1) {
        children = children.concat(walk(kids[c], reg.name, 1, skipRoots));
      }
      outline.push({ kind: "region", name: reg.name, children: collapseSiblings(children) });
    }

    var path = location.pathname.replace(/\/\d+(?=\/|$)/g, "/:id").replace(/\/[0-9a-f]{8,}(?=\/|$)/gi, "/:id");
    var title = scrub((document.title || "").split(" - ")[0]);

    return {
      schemaVersion: 1,
      urlPattern: path,
      host: location.hostname,
      title: title,
      capturedAt: new Date().toISOString(),
      viewport: { w: window.innerWidth, h: window.innerHeight },
      shell: { regions: regionNames },
      components: components,
      unknownFingerprints: unknown,
      truncated: truncated,
      outline: outline
    };
  }

  /* ---- markdown ---- */

  function toMarkdown(data) {
    var lines = [];
    lines.push("---");
    lines.push("urlPattern: " + data.urlPattern);
    lines.push("host: " + data.host);
    lines.push("title: \"" + data.title + "\"");
    lines.push("capturedAt: " + data.capturedAt);
    lines.push("viewport: " + data.viewport.w + "x" + data.viewport.h);
    lines.push("schemaVersion: " + data.schemaVersion);
    lines.push("extractor: fusion-bench scripts/qbo-snapshot/extractor.js");
    lines.push("---");
    lines.push("");
    lines.push("# QBO page outline: " + (data.title || data.urlPattern));
    lines.push("");
    lines.push("## Shell regions");
    lines.push("");
    lines.push("`" + data.shell.regions.join("` `") + "`");
    lines.push("");
    lines.push("> Shell regions (rail/header/subnav) are informational only - in fusion-bench the chrome comes from `bench-shells`. Build the **content** region.");
    lines.push("");
    lines.push("## Layout outline");
    lines.push("");

    function emit(node, indent) {
      var line = indent + "- ";
      if (node.kind === "region") {
        line += "**region: " + node.name + "**";
      } else if (node.kind === "component") {
        line += node.name;
      } else if (node.kind === "heading") {
        line += node.name.toLowerCase();
      } else if (node.kind === "link") {
        line += "link";
      } else if (node.kind === "landmark") {
        line += "(" + node.name + ")";
      } else if (node.kind === "iframe") {
        line += "iframe";
      } else {
        line += "(" + node.name + ")";
      }
      if (node.label) { line += " — \"" + node.label + "\""; }
      if (node.repeat) { line += " ×" + node.repeat; }
      lines.push(line);
      var i;
      var kids = node.children || [];
      for (i = 0; i < kids.length; i += 1) { emit(kids[i], indent + "  "); }
    }

    var i;
    for (i = 0; i < data.outline.length; i += 1) { emit(data.outline[i], ""); }
    if (data.truncated) {
      lines.push("");
      lines.push("_Outline truncated at " + MAX_NODES + " nodes; component counts below still cover the full page._");
    }

    lines.push("");
    lines.push("## Component inventory");
    lines.push("");
    lines.push("| Component | Count | fusion-bench package |");
    lines.push("|---|---|---|");
    var names = Object.keys(data.components).sort(function (a, b) {
      return data.components[b].count - data.components[a].count;
    });
    for (i = 0; i < names.length; i += 1) {
      var rec = data.components[names[i]];
      var pkg = rec.idsPackage ? "`" + rec.idsPackage + "`" : "**NOT AVAILABLE** (" + (rec.hint || "no bench equivalent") + ")";
      lines.push("| " + names[i] + " | " + rec.count + " | " + pkg + " |");
    }
    if (names.length === 0) { lines.push("| _none detected_ | | |"); }

    var unknownKeys = Object.keys(data.unknownFingerprints);
    if (unknownKeys.length > 0) {
      lines.push("");
      lines.push("## Unknown ids-* fingerprints");
      lines.push("");
      lines.push("_Candidates for the FINGERPRINTS map in `scripts/qbo-snapshot/extractor.js`:_");
      lines.push("");
      unknownKeys.sort(function (a, b) { return data.unknownFingerprints[b] - data.unknownFingerprints[a]; });
      for (i = 0; i < unknownKeys.length; i += 1) {
        lines.push("- `" + unknownKeys[i] + "` ×" + data.unknownFingerprints[unknownKeys[i]]);
      }
    }

    lines.push("");
    lines.push("_Labels only; no user data, values, or table-cell text is captured._");
    lines.push("");
    return lines.join("\n");
  }

  /* ---- overlay fallback (bookmarklet path) ---- */

  function showOverlay(md, copied) {
    var wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:24px;z-index:2147483647;background:#fff;border:2px solid #0077c5;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:8px;font-family:sans-serif;box-shadow:0 8px 40px rgba(0,0,0,.35);";
    var bar = document.createElement("div");
    bar.style.cssText = "display:flex;justify-content:space-between;align-items:center;";
    var msg = document.createElement("strong");
    msg.textContent = copied ? "QBO snapshot copied to clipboard — paste it into your coding agent." : "QBO snapshot ready — copy the text below.";
    var close = document.createElement("button");
    close.textContent = "Close";
    close.style.cssText = "padding:6px 14px;cursor:pointer;";
    close.addEventListener("click", function () { wrap.remove(); });
    bar.appendChild(msg);
    bar.appendChild(close);
    var ta = document.createElement("textarea");
    ta.style.cssText = "flex:1;width:100%;font:12px monospace;";
    ta.value = md;
    wrap.appendChild(bar);
    wrap.appendChild(ta);
    document.body.appendChild(wrap);
    ta.focus();
    ta.select();
  }

  function run(opts) {
    opts = opts || window.__QBO_SNAPSHOT_OPTS || {};
    var md;
    try {
      var data = collect();
      md = toMarkdown(data);
      window.__qboSnapshotJson = data;
    } catch (err) {
      md = "QBO snapshot extractor failed: " + (err && err.message ? err.message : String(err));
      window.__qboSnapshotJson = null;
    }
    window.__qboSnapshotMd = md;
    if (opts.clipboard !== false && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(md).then(function () {
          if (opts.overlay) { showOverlay(md, true); }
        }, function () {
          if (opts.overlay) { showOverlay(md, false); }
        });
      } catch (e) {
        if (opts.overlay) { showOverlay(md, false); }
      }
    } else if (opts.overlay) {
      showOverlay(md, false);
    }
    return md;
  }

  window.__qboSnapshot = { collect: collect, toMarkdown: toMarkdown, run: run };
  return run();
}());
