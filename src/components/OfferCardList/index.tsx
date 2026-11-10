import { marketplaceOffers, type MockOffer } from "@/data/offers";
import { initOfferCards } from "@/lib/offerCards/initOfferCards";
import { renderOfferCard } from "@/lib/offerCards/renderOfferCard";
import { useEffect, useMemo, useRef } from "react";
import "./offercard-v1.css";
import styles from "./OfferCardList.module.css";

export type { MockOffer };

type OfferCardListProps = {
  offers?: MockOffer[];
  className?: string;
};

export default function OfferCardList({
  offers,
  className,
}: OfferCardListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const list = useMemo(() => offers ?? marketplaceOffers(), [offers]);
  const markup = useMemo(
    () => list.map((offer) => renderOfferCard(offer)).join("\n"),
    [list],
  );

  useEffect(() => initOfferCards(rootRef.current), [markup]);

  return (
    <div
      ref={rootRef}
      className={`oc ${styles.root}${className ? ` ${className}` : ""}`}
    >
      <div
        className="oc-list"
        data-oc-list
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  );
}
