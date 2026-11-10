// ARCHETYPE: Dashboard / overview page (home, business overview).
//
// Reference shape. Copy and swap the metrics/cards. Anatomy:
//   PageHeader → page title + optional action
//   Metric grid → a responsive grid of summary Cards (each a label + big value + delta)
//   Wider Card → room for a chart or list below the metric row
//
// Demonstrates: Card reuse, a CSS-grid of tiles (the one place a grid is the right tool),
// and typography hierarchy. Tokens only.

import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import Button from "@ids-ts/button";
import Card, { CardContent } from "@ids-ts/cards";
import { B1, B3, H3 } from "@ids-ts/typography";
import { StackLayout } from "bench-extras";
import styles from "./DashboardPage.module.css";

const METRICS: Array<{
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}> = [
  {
    label: "Net income",
    value: "$24,180",
    delta: "+12% vs last month",
    positive: true,
  },
  {
    label: "Expenses",
    value: "$8,940",
    delta: "+4% vs last month",
    positive: false,
  },
  {
    label: "Open invoices",
    value: "$11,200",
    delta: "6 invoices",
    positive: true,
  },
  {
    label: "Cash balance",
    value: "$52,610",
    delta: "Across 2 accounts",
    positive: true,
  },
];

export default function DashboardPage() {
  return (
    <Page
      pageHeader={
        <PageHeader title="Business overview">
          <Button>Create</Button>
        </PageHeader>
      }
    >
      <StackLayout gap={4}>
        <div className={styles.metricGrid}>
          {METRICS.map((m) => (
            <Card
              key={m.label}
              disableCardClick
              size="none"
              className={styles.card}
            >
              <CardContent>
                <StackLayout gap={1}>
                  <B3 className={styles.metricLabel}>{m.label}</B3>
                  <H3 weight="demi">{m.value}</H3>
                  <B3
                    className={m.positive ? styles.deltaUp : styles.deltaDown}
                  >
                    {m.delta}
                  </B3>
                </StackLayout>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card disableCardClick size="none" className={styles.card}>
          <CardContent>
            <StackLayout gap={2}>
              <B1 weight="demi">Income vs. expenses</B1>
              <div className={styles.chartPlaceholder}>
                <B3 className={styles.metricLabel}>Chart goes here</B3>
              </div>
            </StackLayout>
          </CardContent>
        </Card>
      </StackLayout>
    </Page>
  );
}
