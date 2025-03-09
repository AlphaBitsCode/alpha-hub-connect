
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            {/* Placeholder routes for future implementation */}
            <Route path="/messages" element={<ProtectedRoute><ComingSoon title="Messages" /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><ComingSoon title="Calendar" /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><ComingSoon title="AI Assistant" /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ComingSoon title="Settings" /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ComingSoon title="User Profile" /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><ComingSoon title="Logout" /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Temporary component for routes that are not yet implemented
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
    <div className="flex flex-1 w-full">
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="text-center glass-card p-8 max-w-md border-white/20">
          <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-xl text-white/80 mb-6">This page is coming soon!</p>
          <p className="text-md text-white/60">We're working hard to bring you this feature.</p>
          <a href="/" className="mt-8 inline-block text-alphabits-teal hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default App;
