export type ContentBlockId =
  | "loan-process"
  | "why-qb"
  | "faq"
  | "ai-chatbot"
  | "help-choose"
  | "stories";

export type ContentBlockDef = {
  id: ContentBlockId;
  title: string;
};

export const CONTENT_BLOCKS: ContentBlockDef[] = [
  {
    id: "loan-process",
    title: "Overview of the loan application process",
  },
  {
    id: "why-qb",
    title: "Why get a loan through QuickBooks?",
  },
  {
    id: "faq",
    title: "Frequently asked questions (FAQ)",
  },
  {
    id: "ai-chatbot",
    title: "AI chatbot",
  },
  {
    id: "help-choose",
    title: "Help me choose a loan product",
  },
  {
    id: "stories",
    title: "Stories and examples from other business owners",
  },
];
