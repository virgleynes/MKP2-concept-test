import Button from "@ids-ts/button";
import { BlockBody } from "./BlockBodies";
import { CONTENT_BLOCKS, type ContentBlockId } from "./types";
import styles from "./ContentBlocks.module.css";

type PlacedBlocksProps = {
  ids: ContentBlockId[];
  onMoveUp: (id: ContentBlockId) => void;
  onMoveDown: (id: ContentBlockId) => void;
  onRemove: (id: ContentBlockId) => void;
};

export default function PlacedBlocks({
  ids,
  onMoveUp,
  onMoveDown,
  onRemove,
}: PlacedBlocksProps) {
  if (ids.length === 0) return null;

  return (
    <section className={styles.placedList} aria-label="Added content blocks">
      {ids.map((id, index) => {
        const def = CONTENT_BLOCKS.find((b) => b.id === id);
        return (
          <article
            key={id}
            id={`placed-block-${id}`}
            className={styles.placedItem}
          >
            <div className={styles.placedToolbar}>
              <h3 className={styles.placedTitle}>{def?.title ?? id}</h3>
              <div className={styles.placedActions}>
                <Button
                  purpose="standard"
                  priority="secondary"
                  size="small"
                  disabled={index === 0}
                  onClick={() => onMoveUp(id)}
                >
                  Move up
                </Button>
                <Button
                  purpose="standard"
                  priority="secondary"
                  size="small"
                  disabled={index === ids.length - 1}
                  onClick={() => onMoveDown(id)}
                >
                  Move down
                </Button>
                <Button
                  purpose="standard"
                  priority="secondary"
                  size="small"
                  onClick={() => onRemove(id)}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className={styles.placedBody}>
              <BlockBody id={id} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
