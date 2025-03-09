
import { useState, useEffect } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet,
  Edit,
  ExternalLink
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300";
      case "At Risk":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "At Risk":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Back button and edit */}
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/projects')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Button>
              
              <Button
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate(`/projects/edit/${projectId}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Project
              </Button>
            </div>
            
            {/* Project header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                <Badge 
                  className={`mt-2 md:mt-0 flex items-center gap-1 px-3 py-1 ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  <span>{project.status}</span>
                </Badge>
              </div>
              <p className="text-white/70 mt-1">Client: {project.client}</p>
            </div>
            
            {/* Project details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="glass-card border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-alphabits-teal" /> Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{formatDate(project.deadline)}</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-alphabits-teal" /> Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="glass border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/members')}
                  >
                    View Team Members
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center">
                    <FileSpreadsheet className="mr-2 h-5 w-5 text-alphabits-teal" /> Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white">{project.progress || 0}% Complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-alphabits-teal h-2 rounded-full"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Project content */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-white/10 text-white">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/90 whitespace-pre-wrap">
                      {project.description || "No description provided."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-4">
                {project.google_sheet_id ? (
                  <div className="bg-white rounded-lg overflow-hidden aspect-video w-full">
                    <iframe
                      src={`https://docs.google.com/spreadsheets/d/${project.google_sheet_id}/edit?usp=sharing&embedded=true`}
                      className="w-full h-full border-0"
                      title={`${project.name} Dashboard`}
                    ></iframe>
                  </div>
                ) : (
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <FileSpreadsheet className="h-16 w-16 text-white/30 mb-4" />
                      <p className="text-white/70 mb-4">No dashboard has been connected to this project yet.</p>
                      <Button
                        variant="outline"
                        className="glass border-white/20 text-white hover:bg-white/10"
                        onClick={() => navigate(`/projects/edit/${projectId}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Connect Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDashboard;
