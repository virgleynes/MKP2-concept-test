import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { B1 } from "@ids-ts/typography";

export default function StubPage({ title }: { title: string }) {
  return (
    <Page pageHeader={<PageHeader title={title} />}>
      <B1>This Lending destination is a stub in this prototype.</B1>
    </Page>
  );
}
