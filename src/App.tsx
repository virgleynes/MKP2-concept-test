import { Avatar } from "@/components";
import { AppLayoutWithLatency } from "@/components/AppLayoutWithLatency";
import GlobalCreate from "@/components/GlobalCreate";
import OmniPanel from "@/components/OmniPanel";
import Home from "@/routes/Home";
import LendingOverview from "@/routes/LendingOverview";
import Marketplace from "@/routes/Marketplace";
import NotFound from "@/routes/NotFound";
import StubPage from "@/routes/StubPage";
import { ThemeProvider } from "@design-systems/theme";
import { Shell, ShellProvider, useShell } from "bench-shells";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import { FUSION_CONFIG, SECTION_LINKS } from "./navigation";

function ThemedShell() {
  const { theme } = useShell();

  return (
    <ThemeProvider theme={theme}>
      <Shell
        hideSearch={theme === "intuitenterprisesuite"}
        sidePanel={<OmniPanel />}
        createMenu={<GlobalCreate />}
        userAvatar={<Avatar size="xsmall" name="S" color="blue" />}
        pinned={["accounting", "expensesBills", "salesPaid"]}
      >
        <Routes>
          <Route
            element={
              <AppLayoutWithLatency delayMs={FUSION_CONFIG.routeDelayMs} />
            }
          >
            <Route index element={<Home />} />
            <Route path="app/lending">
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<LendingOverview />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route
                path="term-loans"
                element={<Navigate to="../marketplace" replace />}
              />
              <Route
                path="credit-cards"
                element={<StubPage title="Credit cards" />}
              />
              <Route
                path="quickbooks-checking"
                element={<StubPage title="QuickBooks Checking" />}
              />
              <Route
                path="ppp-center"
                element={<StubPage title="PPP Center" />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Shell>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <ShellProvider
        theme={FUSION_CONFIG.theme}
        pathPrefix={FUSION_CONFIG.pathPrefix}
        businessName={FUSION_CONFIG.businessName}
        sectionLinks={SECTION_LINKS}
        navPaths={{ home: "/" }}
        customers={
          "customers" in FUSION_CONFIG ? FUSION_CONFIG.customers : undefined
        }
      >
        <ThemedShell />
      </ShellProvider>
    </Router>
  );
}

export default App;
