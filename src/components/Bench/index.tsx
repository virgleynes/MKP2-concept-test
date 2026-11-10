import styles from "./Bench.module.css";
import { B2, B3 } from "@ids-ts/typography";
import BenchLogo from "./BenchLogo";
import { StackLayout, ClusterLayout } from "bench-extras";
import Button from "@ids-ts/button";
import { useShell } from "bench-shells";

export default function Bench() {
  const { changeTheme, customers } = useShell();
  return (
    <StackLayout gap={4} className={styles.container}>
      <BenchLogo />
      <div className={styles.content}>
        <B2>
          Replace this route with your own prototype. See{" "}
          <a href="https://github.intuit.com/jmehlhoff/design-bench-fusion?tab=readme-ov-file#adding-a-new-prototype-route">
            README
          </a>{" "}
          for instructions, or better yet, just ask your agent to do it for you.
        </B2>
      </div>
      <ClusterLayout nowrap>
        <Button
          priority="secondary"
          onClick={() => changeTheme("gbsgexperimental")}
        >
          Switch to Fusion
        </Button>
        <Button
          priority="secondary"
          onClick={() =>
            changeTheme(
              "intuitaccountantsuite",
              customers || ["Keystone Construction", "Keystone Computers"],
            )
          }
        >
          Switch to Intuit Accountant Suite
        </Button>
        <Button
          priority="secondary"
          onClick={() =>
            changeTheme(
              "intuitenterprisesuite",
              customers || ["Keystone Construction", "Keystone Computers"],
            )
          }
        >
          Switch to Intuit Enterprise Suite
        </Button>
      </ClusterLayout>
      <B3>
        Building for{" "}
        <a href="https://github.intuit.com/zwall/design-bench">Mailchimp</a>?
      </B3>
    </StackLayout>
  );
}
