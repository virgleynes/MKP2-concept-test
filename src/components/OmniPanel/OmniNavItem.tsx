import { useEffect, useRef, useState } from "react";
import styles from "./FusionOmniNav.module.css";
import AnimatedBrand from "@genux-ds/animated-brand";
import cx from "classnames";
import { TickerTypewriter } from "bench-extras";
import { B3 } from "@ids-ts/typography";
import { DelayedContent } from "@/components/DelayedContent";
import { useShell } from "bench-shells";

function FusionOmniNavButton() {
  const initialLoadTimeout = useRef<NodeJS.Timeout | null>(null);
  const mountedTimeout = useRef<NodeJS.Timeout | null>(null);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [complete, setComplete] = useState(false);
  const { toggleSidePanel } = useShell();
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setAnimating(false);
    mountedTimeout.current = setTimeout(() => {
      setMounted(true);
    }, 1000);
    initialLoadTimeout.current = setTimeout(() => {
      setAnimating(true);
    }, 1000);
    return () => {
      if (initialLoadTimeout.current) {
        clearTimeout(initialLoadTimeout.current);
      }
      if (mountedTimeout.current) {
        clearTimeout(mountedTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      setAnimating(true);
    }
  }, [mounted]);

  return (
    <button
      onClick={() => {
        toggleSidePanel();
      }}
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
      aria-label="Toggle side panel"
      type="button"
      className={cx(styles.root, "agent-gradient", {
        [styles.mounted]: mounted && !complete,
        [styles.animating]: animating,
        [styles.complete]: complete,
      })}
    >
      <AnimatedBrand
        animationType="intuitIntelligenceDefault"
        playing={!mounted || hovering}
        loop={0}
        size={20}
      />
      {!complete && (
        <DelayedContent delay={2300}>
          <B3 weight="demi">
            <TickerTypewriter
              texts={[
                "Find profit last month",
                "Help get new customers",
                "Analyze files and images",
                "Or, ask me anything...",
              ]}
              speed={50}
              loop={animating}
              onComplete={() => {
                setTimeout(() => {
                  setComplete(true);
                }, 1400);
              }}
            />
          </B3>
        </DelayedContent>
      )}
    </button>
  );
}

export default FusionOmniNavButton;
