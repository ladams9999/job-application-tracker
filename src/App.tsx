
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ApplicationsList from "./pages/ApplicationsList";
import ApplicationForm from "./pages/ApplicationForm";
import Home from "./pages/Home";

const queryClient = new QueryClient();

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Layout>
          <Home />
        </Layout>
      }
    />
    <Route
      path="/applications"
      element={
        <Layout>
          <ApplicationsList />
        </Layout>
      }
    />
    <Route
      path="/add"
      element={
        <Layout>
          <ApplicationForm />
        </Layout>
      }
    />
    <Route
      path="/edit/:id"
      element={
        <Layout>
          <ApplicationForm />
        </Layout>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
