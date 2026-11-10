import {
  ContentBlocksPanel,
  PlacedBlocks,
  useContentBlocks,
} from "@/components/ContentBlocks";
import OfferCardList from "@/components/OfferCardList";
import OfferPersonalizationDialog, {
  DEFAULT_PERSONALIZATION,
  type PersonalizationValues,
} from "@/components/OfferPersonalizationDialog";
import {
  marketplaceOffers,
  type MockOffer,
  type ProductType,
} from "@/data/offers";
import { imgUrl } from "@/lib/offerCards/img";
import Button from "@ids-ts/button";
import Card from "@ids-ts/cards";
import Link from "@ids-ts/link";
import { B3, B4 } from "@ids-ts/typography";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./Marketplace.module.css";

const VALUE_PROPS: { label: string; linked?: boolean }[] = [
  { label: "Short and long term financing options" },
  { label: "Loans with no pre-payment penalties", linked: true },
  { label: "No impact to credit score", linked: true },
  { label: "Potential tax savings", linked: true },
];

const STEPS = [
  "Review soft offers with estimated terms and see your approval odds.",
  "Apply for either a QuickBooks Loan or a partner loan, all within QuickBooks.",
  "Review personalized offers based on your business. Then choose terms and amount.",
];

const CHECKMARK_SRC = imgUrl("img/marketplace/plan-feature-checkmark.svg");
const CHEVRON_LEFT_SRC = imgUrl("img/marketplace/chevron-left.svg");
const CHEVRON_RIGHT_SRC = imgUrl("img/marketplace/chevron-right.svg");
const CLOSE_SRC = imgUrl("img/marketplace/close.svg");

type MatchTourKind = "excellent" | "good";
type ProductFilter = "all" | ProductType;

const MATCH_TOUR = {
  excellent: {
    tier: "pre-qualified" as const,
    label: "Excellent match",
    labelPlural: "Excellent matches",
  },
  good: {
    tier: "good" as const,
    label: "Good match",
    labelPlural: "Good matches",
  },
};

const PRODUCT_FILTERS: { id: ProductFilter; label: string }[] = [
  { id: "all", label: "All offers" },
  { id: "term", label: "Term loan" },
  { id: "sba", label: "SBA loan" },
  { id: "loc", label: "Line of credit" },
  { id: "rbf", label: "Revenue based financing" },
];

const SORT_OPTIONS = [
  "Loan amount (high to low)",
  "Loan amount (low to high)",
  "APR (low to high)",
  "Term Length (high to low)",
  "Term length (low to high)",
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

function countByProduct(offers: MockOffer[], type: ProductFilter) {
  if (type === "all") return offers.length;
  return offers.filter((offer) => offer.productType === type).length;
}

function termMonthsValue(offer: MockOffer, which: "low" | "high") {
  const raw = which === "low" ? offer.termMonthsLow : offer.termMonthsHigh;
  if (raw == null) return null;
  if (offer.termUnit === "yrs") return raw * 12;
  if (offer.termUnit === "wks") return raw / (52 / 12);
  return raw;
}

function aprSortValue(offer: MockOffer) {
  if (offer.pricing.type === "revenuePct") return Number.POSITIVE_INFINITY;
  return offer.pricing.aprLow;
}

function sortOffers(offers: MockOffer[], sort: SortOption) {
  const next = [...offers];
  next.sort((a, b) => {
    if (sort === "Loan amount (high to low)") return b.amountUpTo - a.amountUpTo;
    if (sort === "Loan amount (low to high)") return a.amountUpTo - b.amountUpTo;
    if (sort === "APR (low to high)") return aprSortValue(a) - aprSortValue(b);
    if (sort === "Term Length (high to low)") {
      const aTerm = termMonthsValue(a, "high") ?? -1;
      const bTerm = termMonthsValue(b, "high") ?? -1;
      return bTerm - aTerm;
    }
    const aTerm = termMonthsValue(a, "low") ?? Number.POSITIVE_INFINITY;
    const bTerm = termMonthsValue(b, "low") ?? Number.POSITIVE_INFINITY;
    return aTerm - bTerm;
  });
  return next;
}

function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

function OddsBar({ filled }: { filled: number }) {
  return (
    <div className={styles.oddsBar} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < filled ? styles.oddsOn : styles.oddsOff}
        />
      ))}
    </div>
  );
}

const MATCH_FOCUS_CLASS = "oc-card--match-focus";

function clearMatchFocus() {
  document
    .querySelectorAll<HTMLElement>(`.oc-card.${MATCH_FOCUS_CLASS}`)
    .forEach((card) => card.classList.remove(MATCH_FOCUS_CLASS));
}

function focusOfferCard(id: string) {
  clearMatchFocus();
  const card = document.querySelector<HTMLElement>(
    `.oc-card[data-oc-id="${id}"]`,
  );
  if (!card) return;
  card.classList.add(MATCH_FOCUS_CLASS);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

const OFFERS = marketplaceOffers();
const EXCELLENT_OFFERS = OFFERS.filter(
  (offer) => offer.approvalTier === "pre-qualified",
);
const GOOD_OFFERS = OFFERS.filter((offer) => offer.approvalTier === "good");
const EXCELLENT_COUNT = EXCELLENT_OFFERS.length;
const GOOD_COUNT = GOOD_OFFERS.length;

export default function Marketplace() {
  const blocks = useContentBlocks();
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS[0]);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizationValues>(
    DEFAULT_PERSONALIZATION,
  );
  const [matchTour, setMatchTour] = useState<{
    kind: MatchTourKind;
    index: number;
  } | null>(null);

  const filteredOffers =
    productFilter === "all"
      ? OFFERS
      : OFFERS.filter((offer) => offer.productType === productFilter);
  const visibleOffers = sortOffers(filteredOffers, sortBy);
  const maxAmount = visibleOffers.length
    ? Math.max(...visibleOffers.map((offer) => offer.amountUpTo))
    : 0;
  const maxAmountLabel = `$${maxAmount.toLocaleString("en-US")}`;

  const tourIds = matchTour
    ? (matchTour.kind === "excellent" ? EXCELLENT_OFFERS : GOOD_OFFERS).map(
        (offer) => offer.id,
      )
    : [];

  function openMatchTour(kind: MatchTourKind) {
    const ids = (kind === "excellent" ? EXCELLENT_OFFERS : GOOD_OFFERS).map(
      (offer) => offer.id,
    );
    if (ids.length === 0) return;
    setMatchTour({ kind, index: 0 });
  }

  function closeMatchTour() {
    setMatchTour(null);
  }

  function goToMatch(nextIndex: number) {
    if (!matchTour || tourIds.length === 0) return;
    const index =
      ((nextIndex % tourIds.length) + tourIds.length) % tourIds.length;
    setMatchTour({ kind: matchTour.kind, index });
  }

  useEffect(() => {
    if (!matchTour) {
      clearMatchFocus();
      return;
    }

    const id = (
      matchTour.kind === "excellent" ? EXCELLENT_OFFERS : GOOD_OFFERS
    )[matchTour.index]?.id;
    // Defer so OfferCardList has painted when opening the tour.
    const timer = id
      ? window.setTimeout(() => focusOfferCard(id), 0)
      : undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMatchTour(null);
      if (event.key === "ArrowLeft") {
        setMatchTour((current) => {
          if (!current) return current;
          const ids = (
            current.kind === "excellent" ? EXCELLENT_OFFERS : GOOD_OFFERS
          ).map((offer) => offer.id);
          if (ids.length === 0) return current;
          const index =
            ((current.index - 1) % ids.length + ids.length) % ids.length;
          return { kind: current.kind, index };
        });
      }
      if (event.key === "ArrowRight") {
        setMatchTour((current) => {
          if (!current) return current;
          const ids = (
            current.kind === "excellent" ? EXCELLENT_OFFERS : GOOD_OFFERS
          ).map((offer) => offer.id);
          if (ids.length === 0) return current;
          const index = (current.index + 1) % ids.length;
          return { kind: current.kind, index };
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [matchTour]);

  return (
    <div className={styles.root} id="marketplace-top">
      <header className={styles.header}>
        <p className={styles.crumbs}>
          <RouterLink to="/app/lending/overview">Lending</RouterLink>
          {" / Marketplace"}
        </p>
        <h1 className={styles.title}>Marketplace</h1>
      </header>

      <section className={styles.hero} aria-labelledby="mp-hero-title">
        <div className={styles.heroTop}>
          <div className={styles.heroCopy}>
            <h2 id="mp-hero-title" className={styles.heroTitle}>
              Compare business loans that suit your needs
            </h2>
            <ol className={styles.steps}>
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className={styles.heroCta}>
              <Button purpose="standard" priority="secondary" size="medium">
                Open questions, chat with our assistant
              </Button>
            </div>
          </div>

          <div className={styles.matchCards}>
            <article className={`${styles.matchCard} ${styles.matchExcellent}`}>
              <h3>
                You have {EXCELLENT_COUNT} Excellent match offer
                {EXCELLENT_COUNT === 1 ? "" : "s"}
              </h3>
              <div className={styles.oddsBlock}>
                <p className={styles.oddsLabel}>Approval likelihood</p>
                <OddsBar filled={4} />
              </div>
              <p className={styles.oddsHint}>
                Your business profile is an excellent match and you have a
                extremely high likelihood of getting approved.
              </p>
              <Button
                purpose="standard"
                priority="tertiary"
                size="small"
                onClick={() => openMatchTour("excellent")}
              >
                See offers
              </Button>
            </article>
            <article className={`${styles.matchCard} ${styles.matchGood}`}>
              <h3>
                You have {GOOD_COUNT} Good match offer
                {GOOD_COUNT === 1 ? "" : "s"}
              </h3>
              <div className={styles.oddsBlock}>
                <p className={styles.oddsLabel}>Approval likelihood</p>
                <OddsBar filled={2} />
              </div>
              <p className={styles.oddsHint}>
                Your business profile is a good match and you have a decent
                likelihood of getting approved.
              </p>
              <Button
                purpose="standard"
                priority="tertiary"
                size="small"
                onClick={() => openMatchTour("good")}
              >
                See offers
              </Button>
            </article>
          </div>
        </div>

        <div className={styles.valueProps} aria-label="Marketplace benefits">
          {VALUE_PROPS.map((item) => (
            <span key={item.label} className={styles.valueProp}>
              <img
                className={styles.check}
                src={CHECKMARK_SRC}
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
              {item.linked ? (
                <a className={styles.valueLink} href="#benefit">
                  {item.label}
                </a>
              ) : (
                <span className={styles.valueLabel}>{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </section>

      <section
        className={styles.filterPanel}
        aria-label="Filter and sort offers"
      >
        <div className={styles.filterGroup}>
          <div className={styles.filterBy}>
            <p className={styles.filterLabel} id="filter-by-label">
              Filter by
            </p>
            <div
              className={styles.filterChips}
              role="group"
              aria-labelledby="filter-by-label"
            >
              {PRODUCT_FILTERS.map((filter) => {
                const count = countByProduct(OFFERS, filter.id);
                const active = productFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    className={`${styles.filterChip}${
                      active ? ` ${styles.filterChipActive}` : ""
                    }`}
                    aria-pressed={active}
                    onClick={() => setProductFilter(filter.id)}
                  >
                    <span>{filter.label}</span>
                    <span className={styles.filterChipCount} aria-hidden="true">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.sortBy}>
            <label className={styles.filterLabel} htmlFor="marketplace-sort">
              Sort by
            </label>
            <select
              id="marketplace-sort"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(event) => {
                const next = event.target.value;
                if (isSortOption(next)) setSortBy(next);
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.resultsHeader}>
          <h2 id="results-title" className={styles.resultsCount}>
            {visibleOffers.length} offer
            {visibleOffers.length === 1 ? "" : "s"} for up to {maxAmountLabel}
          </h2>
          <p className={styles.resultsCaption}>
            Offers are personalized to your business{" "}
            <button
              type="button"
              className={styles.moreInfo}
              onClick={() => setPersonalizationOpen(true)}
            >
              more info
            </button>
          </p>
        </div>
      </section>

      <OfferPersonalizationDialog
        open={personalizationOpen}
        values={personalization}
        onClose={() => setPersonalizationOpen(false)}
        onApply={setPersonalization}
      />

      <section className={styles.results} aria-labelledby="results-title">
        <OfferCardList offers={visibleOffers} />
      </section>

      <div className={styles.placedWrap}>
        <PlacedBlocks
          ids={blocks.placedIds}
          onMoveUp={blocks.moveUp}
          onMoveDown={blocks.moveDown}
          onRemove={blocks.remove}
        />
      </div>

      <section className={styles.footerSection} aria-label="Legal disclosures">
        <Link href="#marketplace-top" className={styles.backToTop}>
          Back to top
        </Link>

        <Card size="none" className={styles.footerCard} disableCardClick>
          <div className={styles.footerContact}>
            <B3 as="p" className={styles.footerContactQuestion}>
              Have a question for QuickBooks?
            </B3>
            <B3 as="p" className={styles.footerContactPhone}>
              Call us at 844-832-2903 M–F, 6 AM to 3 PM PT
            </B3>
          </div>

          <div className={styles.disclosures}>
            <div className={styles.legalLinks}>
              <Link href="#">Privacy</Link>
              <B4 as="span" className={styles.legalDivider} aria-hidden="true">
                |
              </B4>
              <Link href="#">Terms of Service</Link>
            </div>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                QuickBooks Capital Marketplace
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Loans typically are funded within 1-3 business days if approved.
                Actual funding time may vary depending on third party processing
                time.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Intuit Financing Inc. is a licensed broker in states that require
                a license. Our service is limited to commercial or business loans
                only. State licenses include: CA #6054856, NM #01899, ND
                #MB102690, RI Licensed Loan Broker #20153121LB, VT #LSO-1136148,
                VT #LSO-1136148-1.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Partner loans are made or arranged pursuant to their applicable
                lending license(s).
              </B4>
            </div>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                QuickBooks Term Loan
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                QuickBooks Term Loan is issued by WebBank.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                QuickBooks Capital is licensed as Intuit Financing Inc. (NMLS
                #1136148), a subsidiary of Intuit Inc.
              </B4>
            </div>

            <ul className={styles.footnoteList}>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  *
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  &lsquo;Prequalified&rsquo; means you have been selected to
                  receive this offer based on meeting certain criteria determined
                  by the lender. To take advantage of this offer, submit an
                  application, which will be reviewed for creditworthiness and
                  verification of additional information prior to a final credit
                  decision. This offer is not guaranteed. Program loan amounts may
                  range from $1,500 to $150,000. Final offer may be affected if you
                  apply for QuickBooks Line of Credit first.
                </B4>
              </li>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  1
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  QuickBooks Term Loan amounts and terms may vary depending on the
                  applicant&rsquo;s credit profile and other factors; subject to
                  final approval.
                </B4>
              </li>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  2
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  Includes originations across the QuickBooks Capital platform,
                  including Direct Lending, QuickBooks Term Loan, QuickBooks Line
                  of Credit and QuickBooks Capital Marketplace loans.
                </B4>
              </li>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  3
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  Loans are typically deposited within 1–2 business days. Actual
                  funding time may vary depending on third party processing time.
                </B4>
              </li>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  4
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  Interest will apply. Rates vary and depend on the
                  applicant&rsquo;s credit profile and other factors.
                </B4>
              </li>
            </ul>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                iBusiness Funding
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                iBusiness Funding facilitates SBA 7(a) loans through its network
                of approved lenders. The Annual Percentage Rate (APR) is
                illustrative and fluctuates with the prime rate. Please note that
                various additional fees, such as packaging, legal, due diligence,
                appraisals, reports, and other out-of-pocket expenses, may apply.
              </B4>
            </div>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                BHG Financial
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Not all solutions, loan amounts, rates or terms are available in
                all states. This is not a guaranteed offer of credit and is
                subject to credit approval. Terms subject to credit approval upon
                completion of an application. Loan sizes, interest rates, and loan
                terms vary based on the applicant&rsquo;s credit profile. BHG
                Financial business loans typically range from $20,000 to $250,000;
                however, well-qualified borrowers may be eligible for business
                loans up to $500,000. For California Residents: BHG Financial
                loans made or arranged pursuant to a California Financing Law
                license - Number 603G493.
              </B4>
            </div>
          </div>
        </Card>
      </section>

      {matchTour && tourIds.length > 0 ? (
        <div
          className={styles.matchPager}
          role="navigation"
          aria-label={`${MATCH_TOUR[matchTour.kind].label} offers`}
        >
          <button
            type="button"
            className={styles.matchPagerNav}
            aria-label="Previous offer"
            onClick={() => goToMatch(matchTour.index - 1)}
          >
            <img src={CHEVRON_LEFT_SRC} alt="" width={20} height={20} />
          </button>
          <p className={styles.matchPagerLabel}>
            {matchTour.index + 1} of {tourIds.length}{" "}
            {tourIds.length === 1
              ? MATCH_TOUR[matchTour.kind].label
              : MATCH_TOUR[matchTour.kind].labelPlural}
          </p>
          <button
            type="button"
            className={styles.matchPagerNav}
            aria-label="Next offer"
            onClick={() => goToMatch(matchTour.index + 1)}
          >
            <img src={CHEVRON_RIGHT_SRC} alt="" width={20} height={20} />
          </button>
          <button
            type="button"
            className={styles.matchPagerClose}
            aria-label="Close match offers"
            onClick={closeMatchTour}
          >
            <img src={CLOSE_SRC} alt="" width={20} height={20} />
          </button>
        </div>
      ) : null}

      <ContentBlocksPanel
        open={blocks.panelOpen}
        placedIds={blocks.placedIds}
        onOpen={blocks.openPanel}
        onClose={blocks.closePanel}
        onToggle={blocks.toggle}
        onReset={blocks.reset}
      />
    </div>
  );
}
