import { formatApr } from "@/lib/offerCards/renderOfferCard";

const RANK: Record<string, number> = { xs: 0, s: 0, m: 1, l: 2, xl: 3 };
const APR_COMPACT_WIDTH = 400;
const TERM_VALUE_COMPACT_WIDTH = 420;

function band(width: number) {
  if (width < 600) return "xs";
  if (width < 800) return "s";
  if (width < 1000) return "m";
  if (width < 1200) return "l";
  return "xl";
}

function applyAprFormat(card: HTMLElement, width: number) {
  const compact = width < APR_COMPACT_WIDTH;
  card.querySelectorAll<HTMLElement>("[data-oc-apr-low]").forEach((el) => {
    const low = Number(el.dataset.ocAprLow);
    const high = Number(el.dataset.ocAprHigh);
    if (Number.isNaN(low) || Number.isNaN(high)) return;
    const value = el.querySelector<HTMLElement>("[data-oc-apr-value]");
    if (value) value.textContent = `${formatApr(low, compact)} - ${formatApr(high, compact)}`;
  });
}

function applyCard(card: HTMLElement) {
  const width = card.getBoundingClientRect().width;
  const b = band(width);
  card.dataset.ocBand = b;
  if (width < TERM_VALUE_COMPACT_WIDTH) card.dataset.ocNarrow = "true";
  else delete card.dataset.ocNarrow;
  applyAprFormat(card, width);
  const rank = RANK[b];
  const more: string[] = [];

  card.querySelectorAll<HTMLElement>("[data-oc-term]").forEach((el) => {
    const min = el.getAttribute("data-oc-min") || "s";
    const visible = rank >= (RANK[min] ?? 0);
    el.hidden = !visible;
    if (!visible && el.dataset.ocMore) more.push(el.dataset.ocMore);
  });

  const extras = card.getAttribute("data-oc-more-extra-" + b);
  if (extras) more.push(...extras.split("|").filter(Boolean));

  const always = (card.getAttribute("data-oc-more-always") || "")
    .split("|")
    .filter(Boolean);
  more.push(...always);

  const out = card.querySelector("[data-oc-more-out]");
  if (out) {
    out.replaceChildren(
      ...more.map((text) => {
        const chip = document.createElement("span");
        chip.className = "oc-more-chip";
        chip.textContent = text;
        return chip;
      }),
    );
  }
}

function setExpanded(btn: HTMLElement, open: boolean) {
  btn.setAttribute("aria-expanded", String(open));
  btn.classList.toggle("is-open", open);
  btn.textContent = open ? "Hide details" : "Show details";
}

export function initOfferCards(root: HTMLElement | null) {
  if (!root) return () => {};

  const onExpandClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest<HTMLElement>("[data-oc-expand]");
    if (!btn || !root.contains(btn)) return;
    event.preventDefault();
    const card = btn.closest(".oc-card");
    const panel = card?.querySelector<HTMLElement>(".oc-details");
    if (!card || !panel) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    if (open) {
      panel.removeAttribute("hidden");
      setExpanded(btn, true);
      panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else {
      panel.setAttribute("hidden", "");
      setExpanded(btn, false);
    }
  };
  root.addEventListener("click", onExpandClick);

  const update = root.querySelector<HTMLElement>("#oc-update");
  const onUpdate = () => {
    const credit = (root.querySelector("#oc-credit") as HTMLSelectElement | null)
      ?.value;
    const tib = (root.querySelector("#oc-tib") as HTMLSelectElement | null)
      ?.value;
    root
      .querySelector("#oc-filter-echo")
      ?.setAttribute("data-filters", [credit, tib].join("|"));
  };
  update?.addEventListener("click", onUpdate);

  const cards = Array.from(root.querySelectorAll<HTMLElement>(".oc-card"));
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => applyCard(entry.target as HTMLElement));
  });
  cards.forEach((card) => {
    applyCard(card);
    ro.observe(card);
  });

  return () => {
    root.removeEventListener("click", onExpandClick);
    update?.removeEventListener("click", onUpdate);
    ro.disconnect();
  };
}
