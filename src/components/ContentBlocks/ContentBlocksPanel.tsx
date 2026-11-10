import { useEffect, useState } from "react";
import Button from "@ids-ts/button";
import { BlockBody } from "./BlockBodies";
import { CONTENT_BLOCKS, type ContentBlockId } from "./types";
import styles from "./ContentBlocks.module.css";

type ContentBlocksPanelProps = {
  open: boolean;
  placedIds: ContentBlockId[];
  onOpen: () => void;
  onClose: () => void;
  onToggle: (id: ContentBlockId) => void;
  onReset: () => void;
};

export default function ContentBlocksPanel({
  open,
  placedIds,
  onOpen,
  onClose,
  onToggle,
  onReset,
}: ContentBlocksPanelProps) {
  const [expanded, setExpanded] = useState<ContentBlockId | null>(null);

  useEffect(() => {
    if (!open) return;
    setExpanded(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleAdd(id: ContentBlockId) {
    const alreadyPlaced = placedIds.includes(id);
    onToggle(id);
    if (!alreadyPlaced) {
      // Wait for the placed block to mount in the scrollable page shell.
      window.setTimeout(() => {
        document
          .getElementById(`placed-block-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.edgeTab}
        aria-label="Open content blocks"
        onClick={onOpen}
      >
        <span className={styles.edgeChevron} aria-hidden="true">
          ‹
        </span>
      </button>
    );
  }

  return (
    <div className={styles.panelRoot}>
      <button
        type="button"
        className={styles.collapseTab}
        aria-label="Collapse content blocks"
        onClick={onClose}
      >
        <span className={styles.edgeChevron} aria-hidden="true">
          ›
        </span>
      </button>

      <aside
        className={styles.panel}
        role="complementary"
        aria-labelledby="content-blocks-title"
      >
        <div className={styles.header}>
          <h2 id="content-blocks-title" className={styles.title}>
            Content blocks
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {CONTENT_BLOCKS.map((block) => {
            const isOpen = expanded === block.id;
            const isAdded = placedIds.includes(block.id);
            return (
              <div key={block.id} className={styles.row}>
                <div className={styles.rowHeader}>
                  <button
                    type="button"
                    className={styles.expandBtn}
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen ? `Collapse ${block.title}` : `Expand ${block.title}`
                    }
                    onClick={() => setExpanded(isOpen ? null : block.id)}
                  >
                    <span
                      className={
                        isOpen
                          ? `${styles.chevron} ${styles.chevronOpen}`
                          : styles.chevron
                      }
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>
                  <h3 className={styles.rowTitle}>{block.title}</h3>
                  <Button
                    purpose="standard"
                    priority="secondary"
                    size="medium"
                    onClick={() => handleAdd(block.id)}
                  >
                    {isAdded ? "Remove" : "Add"}
                  </Button>
                </div>
                {isOpen ? (
                  <div className={styles.rowBody}>
                    <BlockBody id={block.id} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            purpose="standard"
            priority="tertiary"
            size="medium"
            disabled={placedIds.length === 0}
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            purpose="standard"
            priority="primary"
            size="medium"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </aside>
    </div>
  );
}
