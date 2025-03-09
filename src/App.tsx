
import { useState } from "react";
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
import EditProject from "./pages/EditProject";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen w-full">
              <Toaster />
              <Sonner />
              {!isProfileComplete && (
                <ProfileCompletion onComplete={() => setIsProfileComplete(true)} />
              )}
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Project Routes */}
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/new-project" 
                  element={
                    <ProtectedRoute>
                      <NewProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/project/:projectId" 
                  element={
                    <ProtectedRoute>
                      <ProjectDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects/edit/:projectId" 
                  element={
                    <ProtectedRoute>
                      <EditProject />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Team Routes */}
                <Route 
                  path="/members" 
                  element={
                    <ProtectedRoute>
                      <Members />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Settings Routes */}
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings/profile" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
