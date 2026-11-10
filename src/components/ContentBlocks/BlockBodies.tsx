import { useState } from "react";
import Button from "@ids-ts/button";
import { AiSparkles } from "@design-systems/icons";
import { imgUrl } from "@/lib/offerCards/img";
import type { ContentBlockId } from "./types";
import styles from "./ContentBlocks.module.css";

const asset = (file: string) => imgUrl(`img/content-blocks/${file}`);

const LOAN_STEPS = [
  {
    badge: "Step 1",
    title: "Shop for offers",
    body: "Our marketplace has soft offers from partner lenders and QuickBooks with estimated terms and feel confident applying with approval odds.",
    image: asset("shop-for-offers.svg"),
    imageAlt: "Person reviewing offers on a computer",
  },
  {
    badge: "Step 2",
    title: "Apply all in QuickBooks",
    body: "Apply for either a QuickBooks Loan or a partner loan and get a decision within [X amount of time], without leaving the platform.",
    image: asset("multitasking.svg"),
    imageAlt: "Person multitasking while applying in QuickBooks",
  },
  {
    badge: "Step 3",
    title: "Review and accept offer",
    body: "Review personalized offers with different loan amounts and term lengths based on your business information. Accept the offer and funds are in your account in 1-2 days.",
    image: asset("success-celebration.svg"),
    imageAlt: "Person celebrating after accepting an offer",
  },
];

const WHY_BENEFITS = [
  {
    title: "Compare in one place",
    body: "See offers from hand picked and trusted partner lenders, right in QuickBooks.",
    icon: asset("transaction.svg"),
  },
  {
    title: "Get a head start",
    body: "With your OK, we use info already in QuickBooks to start your application. Less typing for you.",
    icon: asset("note-edit.svg"),
  },
  {
    title: "See costs up front",
    body: "Once you submit your application, you can review your offer terms before you accept it.",
    icon: asset("invoice-payment-received.svg"),
  },
  {
    title: "All in one loan management",
    body: "Manage both QuickBooks and partner loans all in a product you already use.",
    icon: asset("make-payments.svg"),
  },
];

/** Figma Marketplace E2E WIP 10924:195014 */
const FAQ_CHIPS = [
  "General questions",
  "Term loan",
  "Line of credit",
  "SBA loan",
  "Revenue based loan",
];

const FAQS = [
  {
    q: "What determines my eligibility for Marketplace partner loans?",
    a: "Partners review your QuickBooks profile, revenue, banking history, and other factors. Soft browsing does not affect personal credit. Final decisions are made by each lender.",
  },
  {
    q: "What is reported to credit agencies?",
    a: "Browsing soft offers typically does not impact personal credit. Completing a full application with a partner may include a hard inquiry—each partner discloses this before you proceed.",
  },
  {
    q: "Which product is a good fit for me?",
    a: "Term loans work well for lump-sum needs. Lines of credit fit recurring cash-flow gaps. SBA and revenue-based options can fit longer or more flexible repayment plans.",
  },
  {
    q: "What is the application process like?",
    a: "Shop soft offers, apply once in QuickBooks, then review personalized offers and accept the one that fits. Funding timelines vary by partner after approval.",
  },
];

/** Figma Marketplace E2E WIP 10924:194983 */
const PROMPTS = [
  "Which product is right for me?",
  "What determines my eligibility for loans?",
  "How do I manage my loan payments?",
  "Are these the final terms?",
  "What is reported to credit agencies?",
  "What are approval odds?",
];

/** Figma Marketplace E2E WIP 10924:194929 — three guidance cards */
const PRODUCTS = [
  {
    title: "Find the right fit for your industry",
    body: "How your money comes in matters. Steady sales often suit fixed payments. Seasonal sales may fit a flexible option.",
    icon: asset("term-loan.svg"),
    iconAlt: "Money bag next to a storefront",
  },
  {
    title: "Timing is everything",
    body: "Need funds for a one-time cost now, or a cushion for later? Your timeline helps narrow down which type of financing fits.",
    icon: asset("estimates.svg"),
    iconAlt: "Calculator for estimating costs",
  },
  {
    title: "Simulate repayment overtime",
    body: "Try different amounts and terms to see your estimated payments and total cost, before you apply.",
    icon: asset("percent-money-taxes.svg"),
    iconAlt: "Dollar bill with percentage mark",
  },
];

/** Figma Marketplace E2E WIP 10924:194729 */
const STORIES = [
  {
    title: "Help cover cash flow gaps",
    quote:
      "A lot of clients take about 90+ days to pay their invoice. With the Term Loan we got, we were able to pay our staff in the meantime.",
    attribution: "Warehouse Co. Los Angeles, CA",
    image: asset("story-cash-flow.jpg"),
    imageAlt: "Warehouse shelves stacked with cardboard boxes",
  },
  {
    title: "Grow team and expand business",
    quote:
      "We needed to hire more staff for the holiday season and we couldn’t have met demand without this loan.",
    attribution: "Joy Shop Emporium. San Francisco, CA",
    image: asset("story-grow-team.jpg"),
    imageAlt: "Shelves of toys in a retail shop",
  },
  {
    title: "Take on more projects",
    quote:
      "With the extra cash flow, we’ve been able to take on more projects rather than waiting in between projects.",
    attribution: "ACME Construction. New York, NY",
    image: asset("story-more-projects.jpg"),
    imageAlt: "Construction worker framing a building",
  },
];

function LoanProcessBody() {
  return (
    <div className={styles.loanProcessSection}>
      <h3 className={styles.loanProcessHeading}>
        An overview of the QuickBooks loan process
      </h3>
      <div className={styles.stepsGrid}>
        {LOAN_STEPS.map((step) => (
          <article key={step.title} className={styles.stepCard}>
            <div className={styles.stepCopy}>
              <span className={styles.stepBadge}>{step.badge}</span>
              <h4 className={styles.stepHeading}>{step.title}</h4>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
            <div className={styles.stepArt}>
              <img src={step.image} alt={step.imageAlt} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WhyQbBody() {
  return (
    <div>
      <div className={styles.whyLayout}>
        <div className={styles.whyPhoto}>
          <img
            src={asset("why-qb-photo.jpg")}
            alt="Business owners reviewing financing options together"
          />
        </div>
        <div>
          <h3 className={styles.sectionTitle}>
            Why get a loan through QuickBooks
          </h3>
          <p className={styles.whyLede}>
            You already run your business in QuickBooks. That gives you a head
            start when it&apos;s time to look at funding. Here&apos;s what that
            looks like.
          </p>
          <div className={styles.benefitGrid}>
            {WHY_BENEFITS.map((item) => (
              <article key={item.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                </div>
                <div>
                  <h4 className={styles.benefitTitle}>{item.title}</h4>
                  <p className={styles.benefitBody}>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqBody() {
  const [activeChip, setActiveChip] = useState(FAQ_CHIPS[0]);
  const [open, setOpen] = useState(0);

  return (
    <div className={styles.faqSection}>
      <div className={styles.faqLayout}>
        <div className={styles.faqSidebar}>
          <div className={styles.faqIntro}>
            <h3 className={styles.faqHeading}>Frequently asked questions</h3>
            <div className={styles.chipRow} role="group" aria-label="FAQ categories">
              {FAQ_CHIPS.map((chip) => {
                const isActive = chip === activeChip;
                return (
                  <button
                    key={chip}
                    type="button"
                    className={
                      isActive
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    aria-pressed={isActive}
                    onClick={() => setActiveChip(chip)}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={styles.supportCard}>
            <div className={styles.supportCopy}>
              <h4 className={styles.supportTitle}>Still have questions</h4>
              <p className={styles.supportBody}>
                Chat with our AI assistant or contact our support team and we
                will be happy to assist you.
              </p>
            </div>
            <div className={styles.supportActions}>
              <Button purpose="standard" priority="secondary" size="medium">
                Chat with AI
              </Button>
              <Button purpose="standard" priority="secondary" size="medium">
                Contact support
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.faqList}>
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqTrigger}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className={styles.faqQuestion}>{item.q}</span>
                  <img
                    className={styles.faqIcon}
                    src={asset(isOpen ? "icon-dash.svg" : "icon-plus.svg")}
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                  />
                </button>
                {isOpen ? <p className={styles.faqAnswer}>{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AiChatBody() {
  return (
    <div className={styles.aiChatSection}>
      <div className={styles.aiChatTop}>
        <p className={styles.aiChatLabel}>Ask AI assistant</p>
        <div className={styles.chatBar}>
          <input
            className={styles.chatInput}
            placeholder="Search, jump to, or ask a question"
            aria-label="Ask AI assistant"
          />
          <Button purpose="standard" priority="secondary" size="large">
            Chat with AI
          </Button>
        </div>
      </div>
      <div className={styles.promptGrid}>
        {PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            purpose="ai"
            priority="primary"
            size="medium"
            className={styles.promptBtn}
          >
            <AiSparkles size="small" aria-hidden="true" />
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}

function HelpChooseBody() {
  return (
    <div className={styles.helpChooseSection}>
      <h3 className={styles.helpChooseHeading}>Help me choose a loan product</h3>
      <div className={styles.productGrid}>
        {PRODUCTS.map((product) => (
          <article key={product.title} className={styles.productCard}>
            <div className={styles.productIcon}>
              <img src={product.icon} alt={product.iconAlt} />
            </div>
            <div className={styles.productCopy}>
              <h4 className={styles.productTitle}>{product.title}</h4>
              <p className={styles.productBody}>{product.body}</p>
            </div>
            <Button purpose="standard" priority="secondary" size="medium">
              Learn more
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function StoriesBody() {
  return (
    <div className={styles.storiesSection}>
      <h3 className={styles.storiesHeading}>
        We&apos;ve helped business owners with a variety of loan needs
      </h3>
      <div className={styles.storiesGrid}>
        {STORIES.map((story) => (
          <article key={story.title} className={styles.storyCard}>
            <div className={styles.storyArt}>
              <img src={story.image} alt={story.imageAlt} />
            </div>
            <div className={styles.storyCopy}>
              <h4>{story.title}</h4>
              <div className={styles.storyQuoteBlock}>
                <p className={styles.storyQuote}>&ldquo;{story.quote}&rdquo;</p>
                <p className={styles.storyAttribution}>
                  — {story.attribution}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BlockBody({ id }: { id: ContentBlockId }) {
  switch (id) {
    case "loan-process":
      return <LoanProcessBody />;
    case "why-qb":
      return <WhyQbBody />;
    case "faq":
      return <FaqBody />;
    case "ai-chatbot":
      return <AiChatBody />;
    case "help-choose":
      return <HelpChooseBody />;
    case "stories":
      return <StoriesBody />;
    default:
      return null;
  }
}
