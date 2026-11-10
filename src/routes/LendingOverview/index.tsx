import { useMemo, useState } from "react";
import {
  ContentBlocksPanel,
  PlacedBlocks,
  useContentBlocks,
} from "@/components/ContentBlocks";
import { D2, H2, H3, H4, H5, B2, B3, B4 } from "@ids-ts/typography";
import Card, { CardContent } from "@ids-ts/cards";
import { Badge } from "@ids-ts/badge";
import Button from "@ids-ts/button";
import Link from "@ids-ts/link";
import { Carousel } from "@ids-ts/carousel";
import { SuggestionChip, SuggestionChipGroup } from "@genux-ds/suggestion-chip";
import {
  AiSparkles,
  ArrowUp,
  Checkmark,
  CircleCheck,
} from "@design-systems/icons";
import { Link as RouterLink } from "react-router-dom";
import styles from "./LendingOverview.module.css";

/* ---------- Prototype data ---------- */

const BORROWING_POWER = {
  amount: "$84,000",
  oddsLabel: "Excellent approval odds",
  deltaLabel: "Up $10,000",
  deltaPeriod: "from last week",
  summary:
    "Fuel your business's growth with confidence. Built from your real-time financials, this estimate shows how your business is trending.³",
}

type FactorStatus = 'strength' | 'opportunity'

const FACTORS: {
  label: string
  status: FactorStatus
  value: string
  meta: string
}[] = [
  {
    label: 'Cash balance',
    status: 'strength',
    value: '$503,152',
    meta: 'in the last month',
  },
  {
    label: 'Revenue',
    status: 'strength',
    value: '$399,000',
    meta: 'in the last 3 months',
  },
  {
    label: 'Debt activity',
    status: 'opportunity',
    value: '$20,000',
    meta: 'paid this month',
  },
  {
    label: 'History',
    status: 'strength',
    value: '153 months',
    meta: 'banking history',
  },
  {
    label: 'Invoices paid',
    status: 'strength',
    value: '94%',
    meta: 'paid on time this year',
  },
  {
    label: 'Credit utilization',
    status: 'opportunity',
    value: '61%',
    meta: 'of available credit in use',
  },
]

const OFFERS = [
  { name: 'Term Loan', amount: '$84,000' },
  { name: 'Line of Credit', amount: '$60,000' },
]

const ASSIST_PROMPTS = [
  "How's my borrowing power looking?",
  'How can I improve my chances of approval?',
  "What's influencing my approval odds?",
]

const CARD_BENEFITS = [
  { text: '2% cash back with no annual fee', footnote: '5' },
  {
    text: 'Get $300 cash back when you spend $3,000 in the first 3 months',
    footnote: '6',
  },
  { text: 'From approval to spending in as little as 3 minutes', footnote: '' },
]

/* Weekly borrowing-power trend, in dollars, oldest to newest. */
const TREND = [
  { label: '1 Sept', value: 52000 },
  { label: '8 Sept', value: 56000 },
  { label: '15 Sept', value: 68000 },
  { label: '22 Sept', value: 64000 },
  { label: '29 Sept', value: 74000 },
  { label: '6 Oct', value: 84000 },
]

const Y_TICKS = [0, 50000, 100000]

const currency = (value: number) =>
  `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

/**
 * Inline SVG trend chart.
 *
 * IDS ships no chart component and the Intuit registry has no approved
 * charting package, so this is hand-authored. Every color comes from an IDS
 * token via the stylesheet so it themes with the rest of the page.
 */
/**
 * Builds a smooth path through the given points using a monotone cubic fit, so
 * the curve eases between readings without overshooting above or below them.
 */
function smoothPath(points: { cx: number; cy: number }[]) {
  if (points.length < 2) return ''

  const commands = [`M ${points[0].cx} ${points[0].cy}`]

  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i]
    const next = points[i + 1]
    const midX = (current.cx + next.cx) / 2
    commands.push(`C ${midX} ${current.cy}, ${midX} ${next.cy}, ${next.cx} ${next.cy}`)
  }

  return commands.join(' ')
}

function TrendChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const geometry = useMemo(() => {
    const width = 520
    const height = 268
    /* Headroom above the plot so a tooltip sits in clear space rather than
       over the gridlines and area fill. */
    const padding = { top: 80, right: 8, bottom: 32, left: 56 }
    const plotWidth = width - padding.left - padding.right
    const plotHeight = height - padding.top - padding.bottom
    const maxY = Y_TICKS[Y_TICKS.length - 1]

    const x = (index: number) =>
      padding.left + (plotWidth / (TREND.length - 1)) * index
    const y = (value: number) =>
      padding.top + plotHeight - (value / maxY) * plotHeight

    const points = TREND.map((point, index) => ({
      ...point,
      cx: x(index),
      cy: y(point.value),
      delta: index === 0 ? null : point.value - TREND[index - 1].value,
    }))

    const baseline = padding.top + plotHeight

    return {
      width,
      height,
      padding,
      plotWidth,
      plotHeight,
      baseline,
      points,
      /* The final segment is split out so it can carry the positive colour. */
      leadPoints: points.slice(0, -1),
      finalSegment: points.slice(-2),
      ticks: Y_TICKS.map((tick) => ({
        value: tick,
        label: tick === 0 ? '$0K' : `$${tick / 1000}K`,
        y: y(tick),
      })),
    }
  }, [])

  /* V2: one continuous path. The blue-to-green shift comes from a horizontal
     gradient on the stroke rather than a second path, so there is no seam. */
  const linePath = smoothPath(geometry.points)
  const areaPath = `${linePath} L ${
    geometry.points[geometry.points.length - 1].cx
  } ${geometry.baseline} L ${geometry.points[0].cx} ${geometry.baseline} Z`

  /* Where the blend sits, as a fraction of the plot: it eases in across the
     closing stretch instead of switching at a single point. */
  const blendStart = 0.45
  const blendEnd = 0.95
  const active = activeIndex === null ? null : geometry.points[activeIndex]

  /* Nearest point to the pointer, so hovering anywhere on the plot works. */
  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const ratio = geometry.width / rect.width
    const localX = (event.clientX - rect.left) * ratio

    let nearest = 0
    let shortest = Infinity
    geometry.points.forEach((point, index) => {
      const distance = Math.abs(point.cx - localX)
      if (distance < shortest) {
        shortest = distance
        nearest = index
      }
    })

    setActiveIndex(nearest)
  }

  const tooltipWidth = 186
  const tooltipHeight = 66
  /* Arrow proportions follow the IDS tooltip: a shallow triangle on the
     bottom edge, pointing down at the data point. */
  const arrowWidth = 12
  const arrowHeight = 6
  /* Clamp to the chart box rather than the plot, so the arrow can still reach
     the first and last points. The SVG does not clip, and the hero's own
     padding absorbs the small overhang. */
  const tooltipX = active
    ? Math.min(
        Math.max(active.cx - tooltipWidth / 2, 0),
        Math.max(geometry.width - tooltipWidth, 0),
      )
    : 0
  /* Always above the point, with the arrow's tip stopping just short of it. */
  const pointGap = 10
  const tooltipY = active
    ? active.cy - pointGap - arrowHeight - tooltipHeight
    : 0

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      role="img"
      aria-label={`Borrowing power trend over the last 6 weeks, rising from ${currency(
        TREND[0].value,
      )} to ${BORROWING_POWER.amount} today.`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveIndex(null)
      }}
    >
      <defs>
        {/* Horizontal blend for the stroke: blue, easing into green across
            the closing stretch. */}
        <linearGradient id="bpLineBlend" x1="0" y1="0" x2="1" y2="0">
          <stop className={styles.lineStopLead} offset="0%" />
          <stop className={styles.lineStopLead} offset={`${blendStart * 100}%`} />
          <stop className={styles.lineStopFinal} offset={`${blendEnd * 100}%`} />
          <stop className={styles.lineStopFinal} offset="100%" />
        </linearGradient>

        {/* The area reuses the same horizontal blend, then fades downward. */}
        <linearGradient id="bpAreaBlend" x1="0" y1="0" x2="1" y2="0">
          <stop className={styles.areaStopLeadTop} offset="0%" />
          <stop className={styles.areaStopLeadTop} offset={`${blendStart * 100}%`} />
          <stop className={styles.areaStopFinalTop} offset={`${blendEnd * 100}%`} />
          <stop className={styles.areaStopFinalTop} offset="100%" />
        </linearGradient>
        <linearGradient id="bpAreaFadeDown" x1="0" y1="0" x2="0" y2="1">
          <stop className={styles.areaFadeSolid} offset="0%" />
          <stop className={styles.areaFadeClear} offset="100%" />
        </linearGradient>
        <mask id="bpAreaMask">
          <rect
            x={0}
            y={0}
            width={geometry.width}
            height={geometry.height}
            fill="url(#bpAreaFadeDown)"
          />
        </mask>
      </defs>

      {/* Transparent capture area so hover works across the whole plot, and
          mouseleave fires reliably when the pointer exits. */}
      <rect
        x={0}
        y={0}
        width={geometry.width}
        height={geometry.height}
        fill="transparent"
      />

      {geometry.ticks.map((tick) => (
        <g key={tick.value}>
          <line
            className={styles.chartGridline}
            x1={geometry.padding.left}
            y1={tick.y}
            x2={geometry.padding.left + geometry.plotWidth}
            y2={tick.y}
          />
          <text
            className={`${styles.chartAxisLabel} ${styles.chartAxisLabelY}`}
            x={geometry.padding.left - 12}
            y={tick.y + 4}
          >
            {tick.label}
          </text>
        </g>
      ))}

      <path
        className={styles.chartArea}
        d={areaPath}
        fill="url(#bpAreaBlend)"
        mask="url(#bpAreaMask)"
      />

      <path
        className={styles.chartLine}
        d={linePath}
        stroke="url(#bpLineBlend)"
      />

      {/* Always rendered so the reveal, grow, and fill can transition rather
          than snapping between states. */}
      {geometry.points.map((point, index) => (
        <circle
          key={point.label}
          className={[
            styles.chartPoint,
            index === TREND.length - 1 ? styles.chartPointFinal : '',
            isHovered ? styles.chartPointVisible : '',
            index === activeIndex ? styles.chartPointActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          cx={point.cx}
          cy={point.cy}
          r={4}
        />
      ))}

      {geometry.points.map((point) => (
        <text
          key={`label-${point.label}`}
          className={`${styles.chartAxisLabel} ${styles.chartAxisLabelX}`}
          x={point.cx}
          y={geometry.height - 8}
        >
          {point.label}
        </text>
      ))}

      {active && (
        <g key={activeIndex} className={styles.tooltip} pointerEvents="none">
          <line
            className={styles.tooltipRule}
            x1={active.cx}
            y1={active.cy}
            x2={active.cx}
            y2={geometry.baseline}
          />
          <rect
            className={styles.tooltipSurface}
            x={tooltipX}
            y={tooltipY}
            width={tooltipWidth}
            height={tooltipHeight}
            rx={6}
          />
          {/* Arrow tracks the point, not the surface, so it still aims at the
              data when the surface is clamped near an edge. Kept within the
              rounded corners so it reads as attached. */}
          <polygon
            className={styles.tooltipArrow}
            points={(() => {
              const tipX = Math.min(
                Math.max(active.cx, tooltipX + 6 + arrowWidth / 2),
                tooltipX + tooltipWidth - 6 - arrowWidth / 2,
              )
              const baseY = tooltipY + tooltipHeight
              return [
                `${tipX - arrowWidth / 2},${baseY}`,
                `${tipX + arrowWidth / 2},${baseY}`,
                `${tipX},${baseY + arrowHeight}`,
              ].join(' ')
            })()}
          />
          <text className={styles.tooltipDate} x={tooltipX + 14} y={tooltipY + 19}>
            {active.label}
          </text>
          <text className={styles.tooltipValue} x={tooltipX + 14} y={tooltipY + 40}>
            {currency(active.value)}
          </text>
          <text
            className={
              active.delta == null || active.delta === 0
                ? styles.tooltipTrendFlat
                : active.delta > 0
                  ? styles.tooltipTrendUp
                  : styles.tooltipTrendDown
            }
            x={tooltipX + 14}
            y={tooltipY + 58}
          >
            {active.delta == null || active.delta === 0
              ? 'No change from last week'
              : `${active.delta > 0 ? '↑' : '↓'} ${currency(
                  Math.abs(active.delta),
                )} from last week`}
          </text>
        </g>
      )}
    </svg>
  )
}

function FactorCard({ factor }: { factor: (typeof FACTORS)[number] }) {
  const isStrength = factor.status === 'strength'

  return (
    <Card className={styles.factorCard} size="none" disableCardClick>
      {/* CardContent overwrites its own class if given a className, which
          drops its padding, so the stack layout goes on a child instead. */}
      <CardContent>
        <div className={styles.factorCardInner}>
          <div className={styles.factorHead}>
            <B3 weight="medium" className={styles.factorLabel}>
              {factor.label}
            </B3>
            <span className={styles.factorStatus}>
              <span
                className={`${styles.statusDot} ${
                  isStrength ? styles.statusDotStrength : styles.statusDotOpportunity
                }`}
                aria-hidden="true"
              />
              <B4>{isStrength ? 'Strength' : 'Opportunity'}</B4>
            </span>
          </div>
          {/* Value and its qualifier share a row, which keeps the card to two
              rows instead of three. */}
          <div className={styles.factorFigure}>
            <H5 as="p" className={styles.factorValue}>
              {factor.value}
            </H5>
            <B4 as="p" className={styles.factorMeta}>
              {factor.meta}
            </B4>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LendingOverview() {
  const blocks = useContentBlocks();

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="borrowing-power-heading">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <H4 as="h1" id="borrowing-power-heading">
              Your Borrowing Power
            </H4>
            <D2 as="p" className={styles.amount}>
              {BORROWING_POWER.amount}
            </D2>
            <B2 className={styles.delta}>
              <span className={styles.deltaIcon} aria-hidden="true">
                <ArrowUp size="small" />
              </span>
              <span>
                <strong className={styles.deltaAmount}>
                  {BORROWING_POWER.deltaLabel}
                </strong>{' '}
                {BORROWING_POWER.deltaPeriod}
              </span>
            </B2>
            <B3 as="p" className={styles.heroSupport}>
              {BORROWING_POWER.summary}
            </B3>
          </div>
          <TrendChart />
        </div>

        <div className={styles.factors}>
          <Carousel fadeEdges>
            {FACTORS.map((factor) => (
              <FactorCard key={factor.label} factor={factor} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className={styles.offers} aria-labelledby="loan-offers-heading">
        <H3 as="h2" id="loan-offers-heading" className={styles.offersHeading}>
          Your approval odds are excellent.²
        </H3>

        <div className={styles.offerGrid}>
          {OFFERS.map((offer) => (
            <Card
              key={offer.name}
              className={styles.offerCard}
              size="none"
              disableCardClick
            >
              <div className={styles.offerHead}>
                <H5 as="h3">{offer.name}</H5>
                <Badge
                  status="success"
                  priority="secondary"
                  capitalization="sentence"
                  icon={CircleCheck}
                >
                  Pre-qualified*
                </Badge>
              </div>
              <div className={styles.offerBody}>
                <B4 as="p" className={styles.offerLabel}>
                  Estimated offer
                </B4>
                <H3 as="p" className={styles.offerAmount}>
                  {offer.amount}
                </H3>
                <div className={styles.offerCta}>
                  <RouterLink to="/app/lending/marketplace">
                    <Button purpose="standard" priority="primary" size="medium">
                      See offer
                    </Button>
                  </RouterLink>
                </div>
                <Link
                  href="#/app/lending/marketplace"
                  className={styles.learnMore}
                >
                  Learn more
                </Link>
                <B4 as="p" className={styles.offerFinePrint}>
                  No impact to your personal credit score
                </B4>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.chips}>
          <SuggestionChipGroup layout="row" alignment="center">
            {ASSIST_PROMPTS.map((prompt) => (
              <SuggestionChip key={prompt}>
                <span className={styles.chipInner}>
                  <AiSparkles size="small" aria-hidden="true" />
                  <span className={styles.chipText}>{prompt}</span>
                </span>
              </SuggestionChip>
            ))}
          </SuggestionChipGroup>
        </div>
      </section>

      <div className={styles.placedWrap}>
        <PlacedBlocks
          ids={blocks.placedIds}
          onMoveUp={blocks.moveUp}
          onMoveDown={blocks.moveDown}
          onRemove={blocks.remove}
        />
      </div>

      <section className={styles.promoSection} aria-labelledby="credit-card-heading">
        <Card size="none" className={styles.promoCard} disableCardClick>
          <div className={styles.promoInner}>
            <div className={styles.promoCopy}>
              <H3 as="h2" id="credit-card-heading" className={styles.promoHeading}>
                Intuit Business Credit Card
              </H3>
              <ul className={styles.benefitList}>
                {CARD_BENEFITS.map((benefit) => (
                  <li key={benefit.text} className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">
                      <Checkmark size="small" />
                    </span>
                    <B3>
                      {benefit.text}
                      {benefit.footnote && <sup>{benefit.footnote}</sup>}
                    </B3>
                  </li>
                ))}
              </ul>
              <div className={styles.promoActions}>
                <Button purpose="standard" priority="primary" size="medium">
                  Apply now
                </Button>
                <Link href="#" className={styles.learnMore}>
                  Learn more
                </Link>
              </div>
              <B4 as="p" className={styles.promoFinePrint}>
                No impact to personal credit score. Terms apply. Intuit Business
                Credit Cards are issued by WebBank.
              </B4>
            </div>

            <div className={styles.cardArt} aria-hidden="true">
              <img
                className={styles.cardArtImg}
                src={`${import.meta.env.BASE_URL}img/overview/ibcc-card.png`}
                alt=""
              />
              <div className={styles.cardArtStats}>
                <div className={styles.cardArtStat}>
                  <H2 as="p" className={styles.cardArtPercent}>
                    2%
                  </H2>
                  <B4 as="p" className={styles.cardArtCaption}>
                    cash back on everyday purchases
                  </B4>
                </div>
                <div className={styles.cardArtRule} />
                <div className={styles.cardArtStat}>
                  <H2 as="p" className={styles.cardArtPercent}>
                    5%
                  </H2>
                  <B4 as="p" className={styles.cardArtCaption}>
                    cash back on Intuit products and services
                  </B4>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.footerSection} aria-label="Legal disclosures">
        <Link href="#borrowing-power-heading" className={styles.backToTop}>
          Back to top
        </Link>

        <Card size="none" className={styles.footerCard} disableCardClick>
          <div className={styles.footerContact}>
            <B3 as="p" className={styles.footerContactLine}>
              Have a question for QuickBooks?
            </B3>
            <B3 as="p" className={styles.footerContactLine}>
              Call us at 844-832-2903 M-F, 6 AM to 3 PM PT
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
                QuickBooks Term Loan and QuickBooks Line of Credit
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                QuickBooks Term Loan and QuickBooks Line of Credit loans are issued by
                WebBank.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                QuickBooks Capital is licensed as Intuit Financing Inc. (NMLS #1136148),
                a subsidiary of Intuit Inc.
              </B4>
            </div>

            <B4 as="p" className={styles.disclosureText}>
              Loans are typically deposited within 1-2 business days. Actual funding time
              may vary depending on third party processing time.
            </B4>

            <ul className={styles.footnoteList}>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  *
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  If &lsquo;prequalified&rsquo;, it means you have been selected to
                  receive this offer based on meeting certain criteria determined by the
                  lender. To take advantage of this offer, submit an application, which
                  will be reviewed for creditworthiness and verification of additional
                  information prior to a final credit decision. This offer is not
                  guaranteed. Program loan amounts may range from $1,500 to $250,000.
                  Final offer may be affected if you apply for QuickBooks Line of Credit
                  first.
                </B4>
              </li>
              <li className={styles.footnoteItem}>
                <B4 as="span" className={styles.footnoteMarker} aria-hidden="true">
                  1
                </B4>
                <B4 as="span" className={styles.disclosureText}>
                  QuickBooks Term Loan amounts and terms may vary depending on the
                  applicant&rsquo;s credit profile and other factors; subject to final
                  approval.
                </B4>
              </li>
            </ul>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                QuickBooks Capital Marketplace
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                The offers that appear on the QuickBooks Capital Marketplace site are from
                companies from which QuickBooks Capital receives compensation. This
                compensation may impact how and where products appear on this site,
                including, for example, the order in which they may appear within listing
                categories. QuickBooks Capital does not include the entire universe of
                available financial or credit offers. Subject to credit approval.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Loans typically are funded within 1-3 business days if approved. Actual
                funding time may vary depending on third party processing time.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Intuit Financing Inc. is a licensed broker in states that require a
                license. Our service is limited to commercial or business loans only.
                State licenses include: CA #6054856, NM #01899, ND #MB102690, RI Licensed
                Loan Broker #20153121LB, VT #LSO-1136148, VT #LSO-1136148-1.
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                Partner loans are made or arranged pursuant to their applicable lending
                license(s).
              </B4>
            </div>

            <div className={styles.disclosureBlock}>
              <B4 weight="demi" as="h3" className={styles.disclosureHeading}>
                iBusiness Funding
              </B4>
              <B4 as="p" className={styles.disclosureText}>
                iBusiness Funding facilitates SBA 7(a) loans through its network of
                approved lenders. The Annual Percentage Rate (APR) is illustrative and
                fluctuates with the prime rate. Please note that various additional fees,
                such as packaging, legal, due diligence, appraisals, reports, and other
                out-of-pocket expenses, may apply.
              </B4>
            </div>
          </div>
        </Card>
      </section>

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
