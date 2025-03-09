
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import ProjectDashboard from "./pages/ProjectDashboard";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen w-full">
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <Index />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              
              {/* Project Routes */}
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <Projects />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              <Route path="/new-project" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <NewProject />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              <Route path="/project/:projectId" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <ProjectDashboard />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              
              {/* Team Routes */}
              <Route path="/members" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <Members />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              
              {/* Settings Routes */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <Settings />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              <Route path="/settings/profile" element={
                <ProtectedRoute>
                  <ProfileCompletion>
                    <Settings />
                  </ProfileCompletion>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
