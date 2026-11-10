import { Fullscreen, NewWindow } from "@design-systems/icons";
import { IconControl } from "@ids-ts/icon-control";
import { H4 } from "@ids-ts/typography";
import { ClusterLayout, StackLayout } from "bench-extras";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  pathPrefix?: string;
  hideTopRow?: boolean;
  breadcrumb?: {
    label: string;
    link: string;
  }[];
};

function PageHeader({
  title,
  badge,
  children,
  breadcrumb,
  hideTopRow = false,
  pathPrefix = "",
}: PageHeaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
      <StackLayout
        className={cx(styles.root, { [styles.stuck]: stuck })}
        gap={2}
        style={{ justifyContent: "center" }}
      >
        {!hideTopRow && (
          <ClusterLayout
            justifyContent="spaceBetween"
            className={styles.breadcrumb}
          >
            <ClusterLayout>
              <Link to={pathPrefix}>Home</Link>
              {breadcrumb &&
                breadcrumb.map((item) => (
                  <Fragment key={item.label}>
                    <span>/</span>
                    <Link to={pathPrefix + item.link}>{item.label}</Link>
                  </Fragment>
                ))}
            </ClusterLayout>
            <ClusterLayout>
              <IconControl
                aria-label="Open in new window"
                onClick={() => window.open(window.location.href, "_blank")}
              >
                <NewWindow size="small" />
              </IconControl>
              <IconControl aria-label="Minimize">
                <Fullscreen />
              </IconControl>
            </ClusterLayout>
          </ClusterLayout>
        )}

        <ClusterLayout justifyContent="spaceBetween">
          <ClusterLayout>
            <H4 weight="medium">{title}</H4>
            {badge && badge}
          </ClusterLayout>
          <>{children}</>
        </ClusterLayout>
      </StackLayout>
    </>
  );
}

export default PageHeader;
