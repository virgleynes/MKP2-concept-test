import type { Theme } from "bench-shells";

export type FusionConfig = {
  businessName: string;
  theme: Theme;
  pathPrefix: string;
  routeDelayMs: number;
} & (
  | {
      theme: "gbsgexperimental";
    }
  | {
      theme: "intuitaccountantsuite";
      customers: string[];
    }
  | {
      theme: "intuitenterprisesuite";
      customers: string[];
    }
);
