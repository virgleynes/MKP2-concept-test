import raw from "@/data/offers/mockOffers.json";
import type { MockOffer, MockOffersFile } from "@/data/offers/offers.types";

const { offers } = raw as unknown as MockOffersFile;

export { offers };
export type { MockOffer, ProductType, ApprovalTier } from "@/data/offers/offers.types";

/** Marketplace shows the full mixed list of soft offers. */
export const MARKETPLACE_OFFER_IDS = [
  "qb-term-1",
  "ibf-term-4",
  "ondeck-term-1",
  "ibf-sba-1",
  "liveoak-sba-1",
  "qb-loc-1",
  "fundbox-loc-2",
  "youlend-rbf-2",
] as const;

export function marketplaceOffers(): MockOffer[] {
  return MARKETPLACE_OFFER_IDS.map((id) => {
    const offer = offers.find((item) => item.id === id);
    if (!offer) {
      throw new Error(`No offer with id "${id}" in mockOffers.json`);
    }
    return offer;
  });
}
