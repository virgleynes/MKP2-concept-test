import { Close } from "@design-systems/icons";
import Button from "@ids-ts/button";
import { IconControl } from "@ids-ts/icon-control";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./OfferPersonalizationDialog.module.css";

export type PersonalizationValues = {
  creditScore: string;
  timeInBusiness: string;
};

const CREDIT_SCORE_OPTIONS = [
  "720 and above",
  "660 - 719",
  "600 - 659",
  "under 600",
] as const;

const TIME_IN_BUSINESS_OPTIONS = [
  "More than 5 years",
  "2 - 5 years",
  "1 - 2 years",
  "Less than 1 year",
] as const;

export const DEFAULT_PERSONALIZATION: PersonalizationValues = {
  creditScore: "660 - 719",
  timeInBusiness: "1 - 2 years",
};

type OfferPersonalizationDialogProps = {
  open: boolean;
  values: PersonalizationValues;
  onClose: () => void;
  onApply: (values: PersonalizationValues) => void;
};

export default function OfferPersonalizationDialog({
  open,
  values,
  onClose,
  onApply,
}: OfferPersonalizationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const creditId = useId();
  const tibId = useId();
  const [draft, setDraft] = useState<PersonalizationValues>(values);

  useEffect(() => {
    if (open) setDraft(values);
  }, [open, values]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.scrim}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className={styles.close}>
          <IconControl aria-label="Close" onClick={onClose}>
            <Close size="small" />
          </IconControl>
        </div>

        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Offer personalization
          </h2>
          <p id={descriptionId} className={styles.body}>
            Offers are based on the following business information. Update the
            information below only if they are inaccurate.
          </p>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={creditId}>
              Your personal credit score
            </label>
            <select
              id={creditId}
              className={styles.select}
              value={draft.creditScore}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  creditScore: event.target.value,
                }))
              }
            >
              {CREDIT_SCORE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={tibId}>
              Time in business
            </label>
            <select
              id={tibId}
              className={styles.select}
              value={draft.timeInBusiness}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  timeInBusiness: event.target.value,
                }))
              }
            >
              {TIME_IN_BUSINESS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.actions}>
          <Button
            purpose="standard"
            priority="secondary"
            size="medium"
            onClick={() => setDraft(DEFAULT_PERSONALIZATION)}
          >
            Reset
          </Button>
          <Button
            purpose="standard"
            priority="primary"
            size="medium"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
