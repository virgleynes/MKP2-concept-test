import { imgUrl } from "@/lib/offerCards/img";
import type { MockOffer, ProductType } from "@/data/offers/offers.types";

const ODDS_TIP_TITLE = "Approval odds";
const ODDS_TIP_BODY =
  "Approval Odds compare your business profile and data to other approved QuickBooks customers and the lender’s own criteria. This isn’t a guarantee. Keep your profile and marketplace filters up to date for more accurate odds.";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAmount(n: number) {
  if (n >= 1_000_000) {
    const millions = n / 1_000_000;
    const text = Number.isInteger(millions)
      ? String(millions)
      : millions.toFixed(1).replace(/\.0$/, "");
    return `$${text}M`;
  }
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function formatMoney(n: number) {
  if (n === 0) return "$0";
  return `$${n.toLocaleString("en-US")}`;
}

function formatPct(n: number) {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
}

export function formatApr(n: number, compact = false) {
  if (compact) return `${Math.trunc(n)}%`;
  const [intPart, frac = ""] = String(n).split(".");
  const decimals = frac.slice(0, 2).replace(/0+$/, "");
  return decimals ? `${intPart}.${decimals}%` : `${intPart}%`;
}

function productPill(type: ProductType) {
  if (type === "term") return "Term loan";
  if (type === "loc") return "Line of credit";
  if (type === "sba") return "SBA loan";
  if (type === "rbf") return "Revenue based financing";
  return null;
}

function oddsInfoButton() {
  return `<button type="button" class="oc-tip-trigger" aria-label="Approval odds">
                                <img src="${imgUrl("img/offercard-v1/icon-approval-info.svg")}" alt="" width="16" height="16" />
                                <span class="oc-tip" role="tooltip">
                                  <p class="oc-tip__title">${escapeHtml(ODDS_TIP_TITLE)}</p>
                                  <p class="oc-tip__body">${escapeHtml(ODDS_TIP_BODY)}</p>
                                </span>
                              </button>`;
}

function oddsBadge(offer: MockOffer) {
  const info = oddsInfoButton();
  if (offer.approvalTier === "pre-qualified") {
    return `<span class="oc-approval oc-approval--pq">PRE-QUALIFIED${info}</span>`;
  }
  if (offer.approvalTier === "good") {
    return `<span class="oc-approval oc-approval--good">GOOD ODDS${info}</span>`;
  }
  return "";
}

function badgesHtml(offer: MockOffer) {
  const pillLabel = productPill(offer.productType);
  const odds = oddsBadge(offer);
  if (!pillLabel && !odds) return "";
  const pill = pillLabel
    ? `<span class="oc-pill">${escapeHtml(pillLabel)}</span>`
    : "";
  return `<div class="oc-card__badges"><div class="oc-badge-group">${pill}${odds}</div></div>`;
}

function logoHtml(offer: MockOffer) {
  const name = escapeHtml(offer.lenderName);
  switch (offer.lenderId) {
    case "qb":
      return `<div class="oc-logo oc-logo--qb">
                              <img src="${imgUrl("img/offercard-v1/logo-qb-mark.svg")}" alt="" width="33" height="33" />
                              <img class="oc-logo__text" src="${imgUrl("img/offercard-v1/logo-qb-text.svg")}" alt="Intuit QuickBooks" width="87" height="29" />
                            </div>`;
    case "liveoak":
      return `<div class="oc-logo"><img src="${imgUrl("img/offercard-v1/logo-liveoak.svg")}" alt="${name}" /></div>`;
    case "youlend":
      return `<div class="oc-logo"><img src="${imgUrl("img/offercard-v1/logo-youlend.svg")}" alt="${name}" width="160" height="23" /></div>`;
    case "ondeck":
      return `<div class="oc-logo"><img src="${imgUrl("img/offercard-v1/logo-ondeck.png")}" alt="${name}" width="105" height="23" /></div>`;
    case "fundbox":
      return `<div class="oc-logo"><img src="${imgUrl("img/offercard-v1/logo-fundbox.png")}" alt="${name}" width="130" height="32" /></div>`;
    case "ibf":
      return `<div class="oc-logo"><img src="${imgUrl("img/offercard-v1/logo-ibf.png")}" alt="${name}" width="125" height="35" /></div>`;
    default:
      return `<div class="oc-logo"><span>${name}</span></div>`;
  }
}

function pricingTerm(offer: MockOffer) {
  if (offer.pricing.type === "revenuePct") {
    return {
      label: "Repayment percent",
      value: `${formatPct(offer.pricing.revenuePctLow)} - ${formatPct(offer.pricing.revenuePctHigh)}`,
      hint: "of each sale",
      aprLow: null as number | null,
      aprHigh: null as number | null,
    };
  }
  return {
    label: "APR range",
    value: `${formatApr(offer.pricing.aprLow)} - ${formatApr(offer.pricing.aprHigh)}`,
    hint: null as string | null,
    aprLow: offer.pricing.aprLow,
    aprHigh: offer.pricing.aprHigh,
  };
}

function termUnitLabel(unit: MockOffer["termUnit"]) {
  if (unit === "yrs") return "yrs";
  if (unit === "wks") return "wks";
  return "mos.";
}

function lengthTerm(offer: MockOffer) {
  if (offer.termMonthsLow == null || offer.termMonthsHigh == null) {
    return {
      value: "Variable",
      hint: offer.termHint ?? "until paid off",
    };
  }
  const unit = termUnitLabel(offer.termUnit);
  const { termMonthsLow: low, termMonthsHigh: high } = offer;
  const value =
    low === high ? `${low} ${unit}` : `${low} - ${high} ${unit}`;
  return {
    value,
    hint: offer.termHint,
  };
}

function detailsCopy(offer: MockOffer) {
  if (offer.productType === "term") {
    const pq =
      offer.approvalTier === "pre-qualified"
        ? `<p><strong>Prequalified: </strong>‘Pre-qualified’ means you have been selected to receive this offer based on meeting certain criteria determined by the lender. To take advantage of this offer, submit an application, which will be reviewed for creditworthiness and verification of additional information by the lender prior to a final decision. This offer is not guaranteed.</p>`
        : "";
    return `<div class="oc-details__copy">
                                <p><strong>What is a Term Loan?: </strong>A term loan puts a lump sum right in your hands, perfect for when you've got big plans or need to make some major purchases. With a fixed interest rate and a set repayment schedule, it's easy to budget and plan ahead.</p>
                                <p><strong>Best for: </strong>A majority of the population with loan amounts for most needs, from buying new equipment to expanding your business.</p>
                                ${pq}
                              </div>`;
  }
  if (offer.productType === "sba") {
    return `<div class="oc-details__copy">
                                <p><strong>What is an SBA loan?: </strong>An SBA loan is backed by the U.S. Small Business Administration (SBA) to help small businesses get the funding they need. The SBA 7(a) loan program is their main offering, providing loan guarantees to lenders. This makes it easier for businesses to acquire or refinance real estate and buildings, get working capital, purchase supplies and equipment, and handle changes in ownership. The maximum loan amount is $5 million. Most SBA loans are repaid with monthly payments from your business's cash flow. Fixed-rate loans have consistent payments, while variable-rate loans may have payments that change with interest rate fluctuations.</p>
                                <p><strong>Best for: </strong>Steady cash flow, tangible assets, and clear operational history such as restaurants, medical facilities or factories.</p>
                                <p><strong>Eligibility: </strong>Based on your business's income, credit history, and location.</p>
                              </div>`;
  }
  if (offer.productType === "rbf") {
    return `<div class="oc-details__copy">
                                <p><strong>What is a Revenue based loan: </strong>A lump sum loan that is repaid automatically as a percentage of your sales. Slower days, smaller repayments.</p>
                                <p><strong>Best for: </strong>New businesses and/or businesses with seasonal cash flow that need more flexible payments.</p>
                                <div>
                                  <p><strong>How does repayment work?: </strong>A fixed fee is determined upfront and paid via an agreed upon, fixed percentage of your daily sales. Example:</p>
                                  <ul>
                                    <li>You receive $10,000 in funding + a $2,500 fixed fee at a 10% remittance rate</li>
                                    <li>Day with $500 in sales → $50 is delivered to YouLend and, $450 stays with you</li>
                                    <li>Day with $0 in sales → $0 delivered to YouLend</li>
                                  </ul>
                                  <p>Your daily remittance scales with your earnings — more when business is good, less when it isn’t. Once you connect your bank account to YouLend as part of the application process, YouLend uses that bank connection to calculate daily sales and process remittances automatically and you can track remittances on the YouLend dashboard.</p>
                                </div>
                                <p><strong>Eligibility: </strong>At least 3 months in business, and at least 3 invoices settled totaling $1,000+ each month, or at least $1,000 in card revenue each month.</p>
                              </div>`;
  }
  const locBody = `<p><strong>What is a Line of Credit?: </strong>A revolving credit limit you can draw from as needed. You pay interest only on what you use, and available credit is restored as you repay.</p>
                                <p><strong>Best for: </strong>Covering unexpected expenses, managing cash flow gaps, and accessing funds on your timeline.</p>`;
  if (offer.approvalTier === "pre-qualified") {
    return `<div class="oc-details__copy">
                                ${locBody}
                                <p><strong>Prequalified: </strong>‘Pre-qualified’ means you have been selected to receive this offer based on meeting certain criteria determined by the lender. To take advantage of this offer, submit an application, which will be reviewed for creditworthiness and verification of additional information by the lender prior to a final decision. This offer is not guaranteed. Offer may be affected if you apply for QuickBooks Term Loan first.</p>
                              </div>`;
  }
  return `<div class="oc-details__copy">${locBody}</div>`;
}

function legalItems(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");
}

function legalBullets(offer: MockOffer) {
  if (offer.lenderId === "qb" && offer.productType === "term") {
    return legalItems(
      "QuickBooks Term Loan is issued by WebBank. QuickBooks Capital is licensed as Intuit Financing Inc. (NMLS #1136148), a subsidiary of Intuit Inc.\nQuickBooks Term Loan amounts and terms may vary depending on the applicant's credit profile and other factors; subject to final approval.\nThis is a loan estimate based on certain criteria determined by the lender and is not a guarantee of approval. Rate, amount, and term are subject to change based on final underwriting. To check for actual offers, you must apply, complete a loan application, and complete the underwriting review process.\n*Actual funding time may vary depending on third party processing time.",
    );
  }
  if (offer.lenderId === "qb" && offer.productType === "loc") {
    return legalItems(
      "QuickBooks Line of Credit loans are issued by WebBank. Conditions apply, see terms and conditions.\nApplying for Line of Credit may affect any prequalified QuickBooks Term Loan offers.\nThis is a loan estimate based on certain criteria determined by the lender and is not a guarantee of approval. Rate, amount, and term are subject to change based on final underwriting. To check for actual offers, you must apply, complete a loan application, and complete the underwriting review process. Estimated Line of Credit monthly amount is based on previous Line of Credit customer activity.\nMoney movement services are provided by Intuit Payments Inc., licensed as a Money Transmitter by the New York State Department of Financial Services.\n*Actual funding time may vary depending on third party processing time.",
    );
  }
  if (offer.lenderId === "fundbox") {
    return legalItems(
      "FundBox makes capital available to businesses through business loans and lines of credit originated by First Electronic Bank or Lead Bank. California businesses: FundBox  makes business loans and lines of credit loans pursuant to California Financing Law license 60DBO-48774. All financing is subject to credit approval of a completed application. FundBox and its bank partners base loan eligibility on their respective credit and risk policies, applicable legal requirements, and other business considerations. Financing may not be available in all states and may be subject to local restrictions where applicable. Funds are disbursed via Automated Clearing House (ACH) networks and usually take 1-3 business days to clear. Funds requested after 1 p.m. Pacific may not begin the disbursement process until the next business day. Delays in receiving funds may take place for multiple reasons, including the submission of incorrect bank account information; operational issues with the originating or receiving depository financial institutions; and system delays within the ACH networks.",
    );
  }
  if (offer.lenderId === "liveoak") {
    return legalItems(
      "*Actual funding time may vary depending on third party processing time.",
    );
  }
  if (offer.lenderId === "youlend") {
    return legalItems(
      "*Actual funding time may vary depending on third party processing time.",
    );
  }
  if (offer.lenderId === "ondeck") {
    return "<li>OnDeck lines of credit are subject to credit approval.</li>";
  }
  if (offer.lenderId === "ibf") {
    return "<li>iBusiness Funding facilitates loans through its network of approved lenders. Terms, rates, and fees vary.</li>";
  }
  return "<li>Subject to credit approval.</li>";
}

function moreAlways(offer: MockOffer) {
  return offer.lenderId === "qb"
    ? "Funds available as soon as the next business day, if approved*"
    : "Loans typically are funded within 1-3 business days if approved.*";
}

function hintHtml(text: string | null) {
  if (!text) return "";
  return `<p class="oc-term__hint">${escapeHtml(text)}</p>`;
}

export function renderOfferCard(offer: MockOffer) {
  const amount = formatAmount(offer.amountUpTo);
  const pricing = pricingTerm(offer);
  const length = lengthTerm(offer);
  const fees = formatMoney(offer.fees);
  const prepay = formatMoney(offer.prepaymentPenalty);
  const copy = detailsCopy(offer);
  const amountLabel =
    offer.productType === "loc" ? "Line amount up to" : "Loan amount up to";
  const promo = Boolean(offer.promo);
  const aprLabelHtml = promo
    ? `<div class="oc-term__label-row">
                                <p class="oc-term__label">${escapeHtml(pricing.label)}</p>
                                <span class="oc-promo-badge">Promo</span>
                              </div>`
    : `<p class="oc-term__label">${escapeHtml(pricing.label)}</p>`;
  const aprValueClass = promo
    ? ' class="oc-term__value oc-term__value--promo"'
    : ' class="oc-term__value"';

  return `<article class="oc-card" data-oc-id="${escapeHtml(offer.id)}" data-oc-type="${escapeHtml(offer.productType)}" data-oc-tier="${escapeHtml(offer.approvalTier)}" data-oc-more-always="${escapeHtml(moreAlways(offer))}"${promo ? ' data-oc-promo="true"' : ""}>
                          ${badgesHtml(offer)}
                          <div class="oc-card__row">
                            ${logoHtml(offer)}
                            <div class="oc-terms">
                              <div class="oc-term" data-oc-term>
                                <p class="oc-term__label">${amountLabel}</p>
                                <p class="oc-term__value">${escapeHtml(amount)}</p>
                              </div>
                              <div class="oc-term" data-oc-term${
                                pricing.aprLow != null && pricing.aprHigh != null
                                  ? ` data-oc-apr-low="${pricing.aprLow}" data-oc-apr-high="${pricing.aprHigh}"`
                                  : ""
                              }>
                                ${aprLabelHtml}
                                <p${aprValueClass}${pricing.aprLow != null ? ' data-oc-apr-value' : ""}>${escapeHtml(pricing.value)}</p>
                                ${hintHtml(pricing.hint)}
                              </div>
                              <div class="oc-term" data-oc-term>
                                <p class="oc-term__label">Term length range</p>
                                <p class="oc-term__value">${escapeHtml(length.value)}</p>
                                ${hintHtml(length.hint)}
                              </div>
                              <div class="oc-term" data-oc-term data-oc-min="l" data-oc-more="Origination fee: ${escapeHtml(fees)}">
                                <p class="oc-term__label">Origination fee</p>
                                <p class="oc-term__value">${escapeHtml(fees)}</p>
                              </div>
                              <div class="oc-term" data-oc-term data-oc-min="xl" data-oc-more="Prepayment penalty: ${escapeHtml(prepay)}">
                                <p class="oc-term__label">Prepayment penalty</p>
                                <p class="oc-term__value">${escapeHtml(prepay)}</p>
                              </div>
                            </div>
                            <div class="oc-actions">
                              <div class="oc-see-wrap">
                                <button type="button" class="oc-see">Get started</button>
                                <p class="oc-credit-note">No impact to <br class="oc-credit-note__break" />personal credit</p>
                              </div>
                            </div>
                          </div>
                          <button type="button" class="oc-expand" data-oc-expand aria-expanded="false">Show details</button>
                          <div class="oc-details" hidden>
                            <p class="oc-details__title">Additional details</p>
                            <div class="oc-details__body">
                              ${copy}
                              <div class="oc-more">
                                <p class="oc-more__label">More terms:</p>
                                <div class="oc-more__chips" data-oc-more-out></div>
                              </div>
                              <div class="oc-legal-in">
                                <p>Legal disclosures:</p>
                                <ul>${legalBullets(offer)}</ul>
                              </div>
                            </div>
                          </div>
                        </article>`;
}

export function renderOfferCards(list: MockOffer[]) {
  return list.map(renderOfferCard).join("\n");
}
