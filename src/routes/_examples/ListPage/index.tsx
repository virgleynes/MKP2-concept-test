// ARCHETYPE: List / table page (bank transactions, invoices, customers, bills…).
//
// This is a reference shape. To build a new list page, COPY this file and swap the data,
// columns, and labels. The anatomy — page wrapper, header, table, pagination — is the
// convention every QBO-style list page should follow.
//
// Structure (top to bottom):
//   Page        → wrapper with a sticky header slot + scrollable content
//   PageHeader  → title + primary action (in the Page `pageHeader` slot)
//   Table       → @ids-ts/table compound components
//   Pagination  → @ids-ts/pagination, bottom-right
//
// Rules this file demonstrates:
//   - Real IDS components (Table, Pagination, Button) — never hand-rolled.
//   - All spacing/color/radius via tokens (see TOKENS.md); no hard-coded px or hex.
//   - bench-extras ClusterLayout for layout; gap is a 0–8 scale, not px.

import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@ids-ts/badge";
import Button from "@ids-ts/button";
import { Pagination } from "@ids-ts/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@ids-ts/table";
import { ClusterLayout } from "bench-extras";
import { useState } from "react";
import styles from "./ListPage.module.css";

type Txn = {
  date: string;
  description: string;
  account: string;
  category: string;
  amount: string;
  status: "Reviewed" | "Pending";
};

// Stand-in data. In a real prototype, replace with whatever the screen represents.
const TRANSACTIONS: Txn[] = [
  {
    date: "Jun 18",
    description: "Office Depot",
    account: "Checking ••1234",
    category: "Supplies",
    amount: "-$84.21",
    status: "Reviewed",
  },
  {
    date: "Jun 17",
    description: "Stripe payout",
    account: "Checking ••1234",
    category: "Sales",
    amount: "+$1,920.00",
    status: "Reviewed",
  },
  {
    date: "Jun 16",
    description: "Adobe",
    account: "Visa ••8829",
    category: "Software",
    amount: "-$54.99",
    status: "Pending",
  },
  {
    date: "Jun 15",
    description: "Uber",
    account: "Visa ••8829",
    category: "Travel",
    amount: "-$23.40",
    status: "Pending",
  },
  {
    date: "Jun 14",
    description: "Client deposit — Acme",
    account: "Checking ••1234",
    category: "Sales",
    amount: "+$3,500.00",
    status: "Reviewed",
  },
];

const PAGE_SIZE = 5;

export default function ListPage() {
  const [page, setPage] = useState(1);

  return (
    <Page
      pageHeader={
        <PageHeader title="Bank transactions">
          <Button priority="primary">Add transaction</Button>
        </PageHeader>
      }
    >
      <Table density="comfortable" striped hover="row">
        <TableHeader>
          <TableRow>
            <TableCell component="th">Date</TableCell>
            <TableCell component="th">Description</TableCell>
            <TableCell component="th">Account</TableCell>
            <TableCell component="th">Category</TableCell>
            <TableCell component="th">Status</TableCell>
            <TableCell component="th" className={styles.amountCell}>
              Amount
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TRANSACTIONS.map((t) => (
            <TableRow key={t.date + t.description}>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>{t.account}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>
                <ClusterLayout nowrap>
                  <Badge
                    status={t.status === "Reviewed" ? "success" : "pending"}
                  >
                    {t.status}
                  </Badge>
                </ClusterLayout>
              </TableCell>
              <TableCell className={styles.amountCell}>{t.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ClusterLayout justifyContent="flexEnd" nowrap>
        <Pagination
          totalItems={TRANSACTIONS.length}
          totalPages={Math.ceil(TRANSACTIONS.length / PAGE_SIZE)}
          pageSize={PAGE_SIZE}
          activePage={page}
          onPageChange={setPage}
        />
      </ClusterLayout>
    </Page>
  );
}
