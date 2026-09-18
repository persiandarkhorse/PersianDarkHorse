import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Subscription from "./pages/Subscription";
import API from "./pages/API";
import Onboarding from "./pages/Onboarding";
import Legal from "./pages/Legal";

function HomeGate() {
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!localStorage.getItem("fezi-account")) navigate("/welcome");
  }, [navigate]);
  return localStorage.getItem("fezi-account") ? <Home /> : null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={HomeGate} />
      <Route path={"/welcome"} component={Onboarding} />
      <Route path={"/legal"} component={Legal} />
      <Route path={"/subscription"} component={Subscription} />
      <Route path={"/api"} component={API} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
