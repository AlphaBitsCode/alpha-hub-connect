
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          {/* Placeholder routes for future implementation */}
          <Route path="/messages" element={<ComingSoon title="Messages" />} />
          <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
          <Route path="/ai-assistant" element={<ComingSoon title="AI Assistant" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="/profile" element={<ComingSoon title="User Profile" />} />
          <Route path="/logout" element={<ComingSoon title="Logout" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Temporary component for routes that are not yet implemented
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col min-h-screen w-full">
    <div className="flex flex-1 w-full">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-6">This page is coming soon!</p>
          <p className="text-md text-gray-500">We're working hard to bring you this feature.</p>
          <a href="/" className="mt-8 inline-block text-alphabits-purple hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default App;
