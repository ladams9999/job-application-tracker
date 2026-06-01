import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import AppErrorBoundary from "@/components/error/AppErrorBoundary";

import "./index.css";

const App = lazy(() => import("./App.tsx"));
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AppErrorBoundary>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </AppErrorBoundary>,
);
