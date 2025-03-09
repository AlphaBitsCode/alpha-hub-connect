
import { useState, useEffect } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTaskList } from "@/components/ProjectTaskList";
import { TeamAvatars } from "@/components/TeamAvatars";
import { ProjectJournal } from "@/components/ProjectJournal";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectDashboardTab } from "@/components/ProjectDashboardTab";
import { ProjectMilestones } from "@/components/ProjectMilestones";

interface Project {
  id: string;
  name: string;
  client: string;
  description: string | null;
  deadline: string | null;
  status: string | null;
  progress: number | null;
  google_sheet_id: string | null;
}

const ProjectDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) {
        toast({
          title: "Error loading project",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Project;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex flex-1 w-full">
          <AlphaBitsSidebar />
          <div className="flex items-center justify-center w-full">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-alphabits-teal"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
        <div className="flex flex-1 w-full">
          <AlphaBitsSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
              <p className="text-white/70 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button 
                onClick={() => navigate('/projects')}
                className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <ProjectHeader 
              projectName={project.name} 
              clientName={project.client} 
              status={project.status} 
            />
            
            {/* Project details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="glass-card border-white/20">
                <CardContent className="pt-6">
                  {projectId && <TeamAvatars projectId={projectId} />}
                </CardContent>
              </Card>
              
              <ProjectMilestones />
              
              <div className="hidden md:block">
                {/* This empty div is for layout purposes when in desktop view */}
              </div>
            </div>
            
            {/* Project content */}
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="bg-white/10 text-white border border-white/20 w-full justify-start">
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="journal" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                >
                  Journal
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-4">
                <ProjectDashboardTab 
                  projectId={projectId || ''} 
                  googleSheetId={project.google_sheet_id} 
                />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-4">
                <ProjectTaskList />
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <p className="text-white/90 whitespace-pre-wrap">
                      {project.description || "No description provided."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="journal" className="mt-4">
                <ProjectJournal />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDashboard;
