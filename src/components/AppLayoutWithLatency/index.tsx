import { Activity } from "@ids-ts/loader";
import { Outlet, useLocation } from "react-router-dom";
import { DelayedContent } from "../DelayedContent";

export function AppLayoutWithLatency({ delayMs }: { delayMs: number }) {
  const location = useLocation();

  const outlet =
    delayMs > 0 ? (
      <DelayedContent
        key={location.pathname}
        delay={delayMs}
        loader={
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity shape="dots" />
          </div>
        }
      >
        <Outlet />
      </DelayedContent>
    ) : (
      <Outlet />
    );

  return outlet;
}
