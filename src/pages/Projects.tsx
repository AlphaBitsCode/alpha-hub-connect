
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string | null;
  status: string | null;
  progress: number | null;
  google_sheet_id: string | null;
}

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) {
        toast({
          title: "Error loading projects",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Project[];
    },
    enabled: !!user,
  });

  if (isLoading || authLoading) {
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
                <p className="text-white/70">Manage and track all your projects</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white micro-interaction"
                  onClick={() => navigate('/new-project')}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </div>
            </div>

            {/* Project Tabs with improved contrast */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-white/10 p-1 backdrop-blur-md">
                <TabsTrigger 
                  value="all" 
                  className="rounded-md text-white font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction"
                >
                  All Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="rounded-md text-white font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="rounded-md text-white font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger 
                  value="atrisk" 
                  className="rounded-md text-white font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction"
                >
                  At Risk
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  ) : (
                    <div className="col-span-full flex justify-center py-10">
                      <p className="text-white/70">No projects found. Create a new project to get started.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(p => p.status === "In Progress")
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(p => p.status === "Completed")
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="atrisk" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(p => p.status === "At Risk")
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/30 text-green-100 border border-green-400/30";
      case "At Risk":
        return "bg-red-500/30 text-red-100 border border-red-400/30";
      default:
        return "bg-blue-500/30 text-blue-100 border border-blue-400/30";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-3 w-3" />;
      case "At Risk":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Mock upcoming tasks/milestones - In a real app, this would be fetched from the database
  const upcomingTasks = [
    { type: 'task', title: 'Team meeting', date: '2023-10-15' },
    { type: 'milestone', title: 'Design review', date: '2023-10-20' }
  ];

  return (
    <Card 
      className="glass-card hover:shadow-lg transition-shadow border-white/20 overflow-hidden cursor-pointer" 
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base font-semibold text-white">{project.name}</span>
          <span 
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(project.status)}`}
          >
            {getStatusIcon(project.status)}
            <span>{project.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <div className="text-sm text-white/70 mb-1">Client</div>
          <div className="font-medium text-white">{project.client}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-white/70 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-white/70" /> Upcoming
          </div>
          <ul className="space-y-2 mt-2">
            {upcomingTasks.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {item.type === 'milestone' ? (
                  <div className="h-3 w-3 bg-alphabits-teal rounded-full mt-1 flex-shrink-0" />
                ) : (
                  <div className="h-3 w-3 border border-white/40 rounded-full mt-1 flex-shrink-0" />
                )}
                <div>
                  <span className="text-white font-medium">{item.title}</span>
                  <div className="text-white/60 text-xs">{new Date(item.date).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-center glass border-white/20 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project.id}`);
            }}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
