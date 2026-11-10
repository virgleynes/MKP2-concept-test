// Type definitions for src/data/mockOffers.json.
//
// This describes fabricated dummy offer data used for prototype/UI work only.
// See the JSON file's top-level "_disclaimer" field, and the
// qb-capital-mock-lending-offers skill that generated it, for how the
// numbers were modeled per product/lender.

export type ProductType = "term" | "sba" | "loc" | "rbf";

export type ApprovalTier =
  | "none"
  | "pre-qualified"
  | "good"
  | "very-good"
  | "excellent";

export type PricingType = "apr" | "factorRateApr" | "revenuePct";

export type RepaymentFrequency = "monthly" | "weekly" | "daily" | "variable";

/**
 * Pricing is modeled differently per product:
 * - "apr": a standard disclosed APR range (QuickBooks, Live Oak/IBF SBA, Fundbox).
 * - "factorRateApr": OnDeck prices with a factor rate internally, then discloses
 *   an APR-equivalent for comparison. aprLow/aprHigh here are that disclosed
 *   equivalent, not a plain bank-style rate, and it runs much higher.
 * - "revenuePct": YouLend's RBF has no APR at all. revenuePctLow/revenuePctHigh
 *   is the percentage of each sale remitted, not a percentage of the balance.
 */
export type Pricing =
  | { type: "revenuePct"; revenuePctLow: number; revenuePctHigh: number }
  | { type: "apr" | "factorRateApr"; aprLow: number; aprHigh: number };

export interface MockOffer {
  id: string;
  productType: ProductType;
  lenderId: "qb" | "ondeck" | "fundbox" | "ibf" | "liveoak" | "youlend";
  lenderName: string;
  approvalTier: ApprovalTier;
  /** Headline "loan amount up to" / credit limit shown on the card. */
  amountUpTo: number;
  pricing: Pricing;
  /** Range in `termUnit` (months, years, or weeks). Null for RBF (no fixed term). */
  termMonthsLow: number | null;
  termMonthsHigh: number | null;
  termUnit: "mos" | "yrs" | "wks" | null;
  /** e.g. "per draw" for LOC, "until paid off" for RBF. */
  termHint: string | null;
  repaymentFrequency: RepaymentFrequency;
  /** Flat dollar fee. OnDeck's real fees are percentage-based; see originationFeePct. */
  fees: number;
  prepaymentPenalty: number;
  minCreditScore: number | null;
  minTimeInBusinessMonths: number | null;
  /** Always true here — flags this as fabricated dummy data, never a real offer. */
  fabricated: true;
  /** Present on a few entries where the pricing mechanic needs a caveat in-UI. */
  note?: string;
  originationFeePct?: number;
  /** Shows a PROMO badge beside APR and styles the APR value. */
  promo?: boolean;
}

export interface MockOffersFile {
  _disclaimer: string;
  offers: MockOffer[];
}
