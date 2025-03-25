import { FC } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import PropertyAnalysis from '@/pages/PropertyAnalysis';
import FAQ from './pages/faq';
import { Analytics } from '@vercel/analytics/next';


// Scroll to top helper component
const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return <Navigate to="/" />;
};

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/property-analysis",
    element: <PropertyAnalysis />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  // Redirect routes for pages that don't exist yet
  {
    path: "/features",
    element: <Navigate to="/#features" />,
  },
  {
    path: "/how-it-works",
    element: <ScrollToTop />,
  },
  {
    path: "/success-stories",
    element: <ScrollToTop />,
  },
  {
    path: "/resources",
    element: <ScrollToTop />,
  },
  {
    path: "/blog",
    element: <ScrollToTop />,
  },
  {
    path: "/guides",
    element: <ScrollToTop />,
  },
  {
    path: "/adu-laws",
    element: <ScrollToTop />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "*",
    element: <ScrollToTop />,
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
        <ThemeToggle />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
