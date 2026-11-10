// ARCHETYPE: Detail / record page (one invoice, one customer, one transaction).
//
// Reference shape. Copy and swap the record data and sections. Anatomy:
//   PageHeader   → record title + status badge, with actions (edit, more) on the right
//   Card section → grouped label/value pairs ("Details", "Line items"…)
//
// Demonstrates: PageHeader reuse, a reusable Card surface, label/value rows, and a Tabs
// section for switching between facets of the record. Tokens only — no hard-coded values.

import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import Button from "@ids-ts/button";
import Card, { CardContent } from "@ids-ts/cards";
import { Tab, Tabs } from "@ids-ts/tabs";
import { B2, B3 } from "@ids-ts/typography";
import { ClusterLayout, StackLayout } from "bench-extras";
import { useState } from "react";
import styles from "./DetailPage.module.css";

const FIELDS: Array<{ label: string; value: string }> = [
  { label: "Customer", value: "Acme Landscaping" },
  { label: "Invoice no.", value: "1042" },
  { label: "Issue date", value: "Jun 14, 2026" },
  { label: "Due date", value: "Jul 14, 2026" },
  { label: "Terms", value: "Net 30" },
  { label: "Amount", value: "$3,500.00" },
];

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <ClusterLayout
      justifyContent="spaceBetween"
      nowrap
      className={styles.fieldRow}
    >
      <B3 className={styles.fieldLabel}>{label}</B3>
      <B3 weight="medium">{value}</B3>
    </ClusterLayout>
  );
}

export default function DetailPage() {
  const [tab, setTab] = useState("details");

  return (
    <Page
      pageHeader={
        <PageHeader
          title="Transaction"
          breadcrumb={[
            { label: "Bank transactions", link: "/bank-transactions" },
            {
              label: "Transaction",
              link: "/bank-transactions/transaction-details",
            },
          ]}
        >
          <ClusterLayout gap={3} nowrap>
            <Button priority="secondary">Edit</Button>
            <Button priority="primary">View</Button>
          </ClusterLayout>
        </PageHeader>
      }
    >
      <Tabs selected={tab} onChange={setTab} isHorizontalRuleVisible>
        <Tab id="details" title="Details">
          <Card disableCardClick size="none" className={styles.card}>
            <CardContent>
              <StackLayout gap={2}>
                <B2 weight="demi">Invoice details</B2>
                {FIELDS.map((f) => (
                  <FieldRow key={f.label} {...f} />
                ))}
              </StackLayout>
            </CardContent>
          </Card>
        </Tab>
        <Tab id="activity" title="Activity">
          <Card disableCardClick size="none" className={styles.card}>
            <CardContent>
              <StackLayout gap={2}>
                <B2 weight="demi">Activity</B2>
                <B3 className={styles.muted}>
                  Invoice sent Jun 14. Payment received Jun 28.
                </B3>
              </StackLayout>
            </CardContent>
          </Card>
        </Tab>
      </Tabs>
    </Page>
  );
}
