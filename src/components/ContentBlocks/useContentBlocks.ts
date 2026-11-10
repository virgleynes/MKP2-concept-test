import { useCallback, useState } from "react";
import type { ContentBlockId } from "./types";

export function useContentBlocks(initial: ContentBlockId[] = []) {
  const [placedIds, setPlacedIds] = useState<ContentBlockId[]>(initial);
  const [panelOpen, setPanelOpen] = useState(false);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const submit = useCallback((ids: ContentBlockId[]) => {
    setPlacedIds(ids);
  }, []);

  const toggle = useCallback((id: ContentBlockId) => {
    setPlacedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  }, []);

  const reset = useCallback(() => {
    setPlacedIds([]);
  }, []);

  const moveUp = useCallback((id: ContentBlockId) => {
    setPlacedIds((prev) => {
      const index = prev.indexOf(id);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((id: ContentBlockId) => {
    setPlacedIds((prev) => {
      const index = prev.indexOf(id);
      if (index < 0 || index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const remove = useCallback((id: ContentBlockId) => {
    setPlacedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  return {
    placedIds,
    panelOpen,
    openPanel,
    closePanel,
    submit,
    toggle,
    reset,
    moveUp,
    moveDown,
    remove,
  };
}
