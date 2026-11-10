import type { SectionLink } from "bench-shells";
import { FusionConfig } from "./types";

export const FUSION_CONFIG: FusionConfig = {
  businessName: "[Your business name here]",
  theme: "gbsgexperimental",
  pathPrefix: "",
  routeDelayMs: 0,
};

/** Lending SubNav — Term Loan renamed to Marketplace per Figma. */
export const LENDING_SECTION_LINKS: SectionLink[] = [
  { name: "Overview", link: "/lending/overview" },
  { name: "Marketplace", link: "/lending/marketplace" },
  { name: "Credit cards", link: "/lending/credit-cards" },
  { name: "QuickBooks Checking", link: "/lending/quickbooks-checking" },
  { name: "PPP Center", link: "/lending/ppp-center" },
];

export const SECTION_LINKS = {
  lending: LENDING_SECTION_LINKS,
};
