
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { BlogProvider } from "@/context/BlogContext";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Editor from "./pages/Editor";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BlogProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/blog/:id" element={<Layout><Blog /></Layout>} />
                <Route path="/editor" element={<Layout><Editor /></Layout>} />
                <Route path="/editor/:id" element={<Layout><Editor /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BlogProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
