import { B2, B3 } from "@ids-ts/typography";
import styles from "./NotFound.module.css";
import { StackLayout } from "bench-extras";
import { useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();
  return (
    <StackLayout className={styles.root}>
      <B2 weight="demi">Not found</B2>
      <B3>
        Add a route to this path <pre>{location.pathname}</pre> in your
        prototype. See the{" "}
        <a href="https://github.intuit.com/jmehlhoff/design-bench-fusion?tab=readme-ov-file#adding-a-new-prototype-route">
          README
        </a>{" "}
        for instructions, or simply ask your agent to do it.
      </B3>
    </StackLayout>
  );
}

export default NotFound;
