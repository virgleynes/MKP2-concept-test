import cx from "classnames";
import styles from "./Page.module.css";

type PageProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  pageHeader?: React.ReactNode;
};

function Page({ children, pageHeader, ...props }: PageProps) {
  return (
    <div className={cx(styles.root, props.className)} {...props}>
      {pageHeader && pageHeader}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default Page;
