import { useNavigate } from "react-router-dom";
import Button from "@ids-ts/button";
import styles from "./Home.module.css";

const APPS: { label: string; color: string; glyph: string }[] = [
  { label: "Accounting", color: "#2CA01C", glyph: "M" },
  { label: "Expenses & Pay Bills", color: "#2CA01C", glyph: "›" },
  { label: "Sales & Get Paid", color: "#00A6A4", glyph: "▮" },
  { label: "Customer Hub", color: "#00A6A4", glyph: "✚" },
  { label: "Marketing", color: "#F5C518", glyph: "◢" },
  { label: "Payroll", color: "#0077C5", glyph: "◐" },
  { label: "Team", color: "#5B8DEF", glyph: "⑂" },
  { label: "Time", color: "#5B8DEF", glyph: "◔" },
];

const ACTIONS = [
  "Get paid online",
  "Create invoice",
  "Create check",
  "Add bank deposit",
  "Record expense",
];

const ATTENTION = [
  {
    title: "Approve Invoice #1262",
    meta: "QuickBooks",
    action: "Review",
    overdue: false,
    icon: "qb",
  },
  {
    title: "Send overdue invoice reminders",
    meta: "Payment AI",
    due: "Due 12/25/26",
    action: "Send",
    overdue: true,
    icon: "ai",
  },
  {
    title: "Post categorized transactions",
    meta: "Accounting AI",
    action: "Review",
    overdue: false,
    icon: "ai",
  },
  {
    title: "Send invoices from estimates",
    meta: "Intuit AI",
    due: "Expires 12/25/26",
    action: "Send",
    overdue: false,
    icon: "intuit",
  },
];

const CUSTOMERS = [
  {
    name: "Jim Morgan",
    amount: "$2,400",
    note: "2 months since last project",
    action: "Say thanks",
  },
  {
    name: "Kelly Andrews",
    amount: "$2,000",
    note: "1 open estimate",
    action: "Follow up",
  },
  {
    name: "Meghan Winter",
    amount: "$1,000",
    note: "Paid this month",
    action: "Say thanks",
  },
];

const EXPENSE_LEGEND = [
  { label: "Rent & lease", color: "#0077C5" },
  { label: "Inventory assets", color: "#00A6A4" },
  { label: "Automotive", color: "#4E2B8F" },
  { label: "Salary & wages", color: "#F95700" },
  { label: "Other", color: "#B80000" },
];

function hourGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function AttentionIcon({ kind }: { kind: string }) {
  if (kind === "qb") {
    return <span className={`${styles.attIcon} ${styles.attQb}`}>QB</span>;
  }
  if (kind === "intuit") {
    return <span className={`${styles.attIcon} ${styles.attIntuit}`}>i</span>;
  }
  return <span className={`${styles.attIcon} ${styles.attAi}`}>✦</span>;
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.greeting}>{hourGreeting()}, Kenzo!</h1>
          <div className={styles.carousel} aria-label="Apps">
            {APPS.map((app) => (
              <button key={app.label} type="button" className={styles.pill}>
                <span
                  className={styles.pillIcon}
                  style={{ background: "#0D2B4A" }}
                  aria-hidden="true"
                >
                  <span style={{ color: app.color }}>{app.glyph}</span>
                </span>
                {app.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.carouselNext}
              aria-label="More apps"
            >
              ›
            </button>
          </div>
        </header>

        <div className={styles.createRow}>
          <p className={styles.sectionLabel}>Create actions</p>
          <div className={styles.actionsRow}>
            {ACTIONS.map((action) => (
              <button key={action} type="button" className={styles.actionChip}>
                {action}
              </button>
            ))}
            <a className={styles.link} href="#see-all">
              See all
            </a>
          </div>
        </div>

        <h2 className={styles.widgetSectionTitle}>Business at a glance</h2>

        <div className={styles.widgetGrid}>
          {/* Needs attention */}
          <section className={styles.widget} aria-labelledby="needs-attention">
            <div className={styles.widgetHeader}>
              <h3 id="needs-attention" className={styles.widgetTitle}>
                Needs attention
              </h3>
            </div>
            <ul className={styles.attentionList}>
              {ATTENTION.map((item) => (
                <li key={item.title}>
                  <AttentionIcon kind={item.icon} />
                  <div className={styles.attentionCopy}>
                    <div className={styles.attentionTitle}>{item.title}</div>
                    <div className={styles.attentionMeta}>
                      <span>{item.meta}</span>
                      {item.due ? (
                        <span
                          className={
                            item.overdue ? styles.dueOverdue : styles.due
                          }
                        >
                          {" · "}
                          {item.due}
                        </span>
                      ) : null}
                      <a className={styles.link} href="#task">
                        {item.action}
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.widgetFooter}>
              <a className={styles.link} href="#view-all">
                View all (6)
              </a>
              <button type="button" className={styles.overflow} aria-label="More">
                ⋮
              </button>
            </div>
          </section>

          {/* Bank accounts */}
          <section className={styles.widget} aria-labelledby="bank-accounts">
            <div className={styles.widgetHeader}>
              <h3 id="bank-accounts" className={styles.widgetTitle}>
                Bank accounts
              </h3>
              <span className={styles.dropdown}>As of today</span>
            </div>
            <p className={styles.kpiLabel}>Today&apos;s bank balance</p>
            <p className={styles.kpiValue}>$19,342</p>
            <ul className={styles.bankList}>
              <li>
                <img
                  className={styles.bankLogo}
                  src={`${import.meta.env.BASE_URL}img/home/bank-chase.png`}
                  alt=""
                  width={32}
                  height={32}
                />
                <div className={styles.bankLeft}>
                  <strong>Checking (1234)</strong>
                  <span>Bank balance</span>
                  <span>in QuickBooks</span>
                  <span className={styles.muted}>Updated 5 sec ago</span>
                </div>
                <div className={styles.bankRight}>
                  <span>$15,000.00</span>
                  <span>$4,000.00</span>
                  <a className={styles.link} href="#review">
                    94 to review
                  </a>
                </div>
              </li>
              <li>
                <img
                  className={styles.bankLogo}
                  src={`${import.meta.env.BASE_URL}img/home/bank-mc.png`}
                  alt=""
                  width={32}
                  height={32}
                />
                <div className={styles.bankLeft}>
                  <strong>Mastercard (0987)</strong>
                  <span>Bank balance</span>
                </div>
                <div className={styles.bankRight}>
                  <span>$15,000.00</span>
                </div>
              </li>
            </ul>
            <div className={styles.widgetFooter}>
              <a className={styles.link} href="#registers">
                Go to registers
              </a>
              <button type="button" className={styles.overflow} aria-label="More">
                ⋮
              </button>
            </div>
          </section>

          {/* Profit & Loss */}
          <section className={styles.widget} aria-labelledby="pnl">
            <div className={styles.widgetHeader}>
              <h3 id="pnl" className={styles.widgetTitle}>
                Profit &amp; Loss
              </h3>
              <span className={styles.dropdown}>
                This month <span aria-hidden="true">▾</span>
              </span>
            </div>
            <p className={styles.kpiLabel}>Net profit for March</p>
            <div className={styles.kpiRow}>
              <p className={styles.kpiValue}>$2,900</p>
              <span className={styles.infoPill}>
                <span className={styles.infoDot}>i</span> 80%
              </span>
            </div>
            <p className={styles.trendUp}>
              <span aria-hidden="true">↑</span> Up 80%{" "}
              <span className={styles.muted}>from this time last quarter</span>
            </p>
            <div className={styles.barBlock}>
              <div className={styles.barMeta}>
                <div>
                  <strong>$6,000</strong>
                  <span className={styles.muted}>Income</span>
                </div>
                <a className={styles.link} href="#review">
                  8 to review
                </a>
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barFill} ${styles.barIncome}`} />
                <span className={`${styles.barHash} ${styles.barIncomeHash}`} />
              </div>
            </div>
            <div className={styles.barBlock}>
              <div className={styles.barMeta}>
                <div>
                  <strong>$3,100</strong>
                  <span className={styles.muted}>Expense</span>
                </div>
                <a className={styles.link} href="#review">
                  15 to review
                </a>
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barFill} ${styles.barExpense}`} />
                <span
                  className={`${styles.barHash} ${styles.barExpenseHash}`}
                />
              </div>
            </div>
            <div className={styles.widgetFooter}>
              <a className={styles.link} href="#categorize">
                Categorize 77 transactions
              </a>
              <button type="button" className={styles.overflow} aria-label="More">
                ⋮
              </button>
            </div>
          </section>

          {/* Expenses */}
          <section className={styles.widget} aria-labelledby="expenses">
            <div className={styles.widgetHeader}>
              <h3 id="expenses" className={styles.widgetTitle}>
                Expenses
              </h3>
              <span className={styles.dropdown}>
                This month <span aria-hidden="true">▾</span>
              </span>
            </div>
            <p className={styles.kpiLabel}>Spending for March</p>
            <div className={styles.kpiRow}>
              <p className={styles.kpiValue}>$2,900</p>
              <span className={styles.infoPill}>
                <span className={styles.infoDot}>i</span> 100%
              </span>
            </div>
            <p className={styles.trendWarn}>
              <span aria-hidden="true">↑</span> Up 34%{" "}
              <span className={styles.muted}>from the prior month</span>
            </p>
            <div className={styles.expenseBreakdown}>
              <img
                className={styles.donut}
                src={`${import.meta.env.BASE_URL}img/home/expenses-donut.svg`}
                alt=""
                width={124}
                height={124}
              />
              <ul className={styles.legend}>
                {EXPENSE_LEGEND.map((item) => (
                  <li key={item.label}>
                    <span
                      className={styles.legendDot}
                      style={{ background: item.color }}
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.widgetFooter}>
              <a className={styles.link} href="#spending">
                View all spending
              </a>
              <button type="button" className={styles.overflow} aria-label="More">
                ⋮
              </button>
            </div>
          </section>

          {/* Sales & Get Paid Funnel — spans 2 cols */}
          <section
            className={`${styles.widget} ${styles.funnelWidget}`}
            aria-labelledby="sales-funnel"
          >
            <div className={styles.widgetHeader}>
              <h3 id="sales-funnel" className={styles.widgetTitle}>
                Sales &amp; Get Paid Funnel
              </h3>
              <span className={styles.dropdown}>
                This month <span aria-hidden="true">▾</span>
              </span>
            </div>
            <div className={styles.funnel}>
              <article className={`${styles.milestone} ${styles.milestoneCta}`}>
                <div className={styles.milestoneBar} />
                <p className={styles.milestoneHeading}>
                  Create a new payment request
                </p>
                <a className={styles.link} href="#learn">
                  Learn more
                </a>
                <button type="button" className={styles.splitBtn}>
                  Request payment <span aria-hidden="true">▾</span>
                </button>
              </article>
              <article className={styles.milestone}>
                <div className={`${styles.milestoneBar} ${styles.barGreen}`} />
                <p className={styles.milestoneLabel}>Not paid</p>
                <p className={styles.milestoneAmount}>$100.00</p>
                <span className={`${styles.badge} ${styles.badgeWarn}`}>
                  ⚠ 3 overdue invoices
                </span>
              </article>
              <article className={styles.milestone}>
                <div className={`${styles.milestoneBar} ${styles.barGreen}`} />
                <p className={styles.milestoneLabel}>Paid</p>
                <p className={styles.milestoneAmount}>$300.00</p>
                <span className={`${styles.badge} ${styles.badgeError}`}>
                  ⚠ 1 deposit on hold
                </span>
              </article>
              <article className={styles.milestone}>
                <div className={`${styles.milestoneBar} ${styles.barGreen}`} />
                <p className={styles.milestoneLabel}>Deposited</p>
                <p className={styles.milestoneAmount}>$500.00</p>
                <span className={`${styles.badge} ${styles.badgeOk}`}>
                  ✓ 1 deposited
                </span>
              </article>
            </div>
          </section>

          {/* Top customers */}
          <section className={styles.widget} aria-labelledby="top-customers">
            <div className={styles.widgetHeader}>
              <h3 id="top-customers" className={styles.widgetTitle}>
                Top customers
              </h3>
              <span className={styles.dropdown}>
                This year <span aria-hidden="true">▾</span>
              </span>
            </div>
            <ul className={styles.customerList}>
              {CUSTOMERS.map((c) => (
                <li key={c.name}>
                  <div className={styles.customerTop}>
                    <strong>{c.name}</strong>
                    <strong>{c.amount}</strong>
                  </div>
                  <div className={styles.customerBottom}>
                    <span className={styles.muted}>{c.note}</span>
                    <a className={styles.link} href="#thanks">
                      {c.action}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.widgetFooter}>
              <a className={styles.link} href="#customers">
                View all customers
              </a>
              <button type="button" className={styles.overflow} aria-label="More">
                ⋮
              </button>
            </div>
          </section>

          {/* Lending — Figma Marketplace E2E WIP 10924:204067 */}
          <section
            className={`${styles.widget} ${styles.lendingWidget}`}
            aria-labelledby="lending-widget"
          >
            <div className={styles.widgetHeader}>
              <h3 id="lending-widget" className={styles.widgetTitle}>
                Lending
              </h3>
              <button type="button" className={styles.lendingHide}>
                Hide
              </button>
            </div>
            <p className={styles.lendingHeadline}>Fund your next move</p>
            <div className={styles.lendingProducts}>
              <div className={styles.lendingRow}>
                <div className={styles.lendingCopy}>
                  <p className={styles.lendingLabel}>
                    Term loan - a lump sum deposit
                  </p>
                  <p className={styles.lendingRange}>$6K–$5M</p>
                </div>
                <div
                  className={`${styles.lendingBar} ${styles.lendingBarGreen}`}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.lendingRow}>
                <div className={styles.lendingCopy}>
                  <p className={styles.lendingLabel}>
                    Line of credit - flexible cash when you need it
                  </p>
                  <p className={styles.lendingRange}>$1K–$100K</p>
                </div>
                <div
                  className={`${styles.lendingBar} ${styles.lendingBarBlue}`}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className={styles.lendingFooter}>
              <Button
                purpose="passive"
                priority="secondary"
                size="small"
                onClick={() => navigate("/app/lending/overview")}
              >
                See your offers
              </Button>
            </div>
          </section>

          {/* Add widgets */}
          <section className={styles.widget} aria-labelledby="add-widgets">
            <div className={styles.addWidgets}>
              <button type="button" className={styles.addPlus} aria-label="Add">
                +
              </button>
              <h3 id="add-widgets" className={styles.widgetTitle}>
                Add widgets
              </h3>
            </div>
            <p className={styles.kpiLabel}>Smart suggestions</p>
            <div className={styles.suggestPills}>
              {["Mileage", "Cashflow", "Account receivable", "Sales"].map(
                (label) => (
                  <button key={label} type="button" className={styles.suggestPill}>
                    {label}
                  </button>
                ),
              )}
            </div>
          </section>
        </div>

        <h2 className={styles.widgetSectionTitle}>Suggestions for you</h2>
        <div className={styles.suggestions}>
          <article className={styles.suggestionCard}>
            <div className={styles.suggestionBg} aria-hidden="true">
              <img
                src={`${import.meta.env.BASE_URL}img/home/suggestion-payroll-bg.svg`}
                alt=""
              />
            </div>
            <div className={styles.suggestionInner}>
              <p className={styles.suggestionEyebrow}>ADD ON</p>
              <div className={styles.suggestionBody}>
                <img
                  className={styles.suggestionArt}
                  src={`${import.meta.env.BASE_URL}img/home/suggestion-payroll.png`}
                  alt=""
                />
                <div className={styles.suggestionCopy}>
                  <h3 className={styles.suggestionTitle}>QuickBooks Payroll</h3>
                  <p className={styles.suggestionText}>
                    Manage payroll and people in one place and save time with
                    features like auto pay, same-day-direct-deposit, and auto
                    tax.
                  </p>
                </div>
              </div>
              <a className={styles.link} href="#payroll">
                Subscribe to Payroll
              </a>
            </div>
          </article>
          <article className={styles.suggestionCard}>
            <div className={styles.suggestionBg} aria-hidden="true">
              <img
                src={`${import.meta.env.BASE_URL}img/home/suggestion-help-bg.svg`}
                alt=""
              />
            </div>
            <div className={styles.suggestionInner}>
              <p className={styles.suggestionEyebrow}>Assistance</p>
              <div className={styles.suggestionBody}>
                <img
                  className={styles.suggestionArt}
                  src={`${import.meta.env.BASE_URL}img/home/suggestion-help.png`}
                  alt=""
                />
                <div className={styles.suggestionCopy}>
                  <h3 className={styles.suggestionTitle}>Help &amp; Support</h3>
                  <p className={styles.suggestionText}>
                    Check out our help center to read help articles, watch
                    how-to videos, or chat with a customer support specialist.
                  </p>
                </div>
              </div>
              <a className={styles.link} href="#help">
                Find answers
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
