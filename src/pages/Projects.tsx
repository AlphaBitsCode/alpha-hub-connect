
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  team?: string[];
  progress: number;
  google_sheet_id?: string;
}

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
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
      
      return data.map(project => ({
        ...project,
        deadline: new Date(project.deadline).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        team: ["JD", "AK", "MC", "TJ"].slice(0, Math.floor(Math.random() * 4) + 1) // Mock data for team
      }));
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
                <Button className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white micro-interaction">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-9 glass border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button variant="outline" className="flex gap-2 glass border-white/20 text-white hover:bg-white/10">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>

            {/* Project Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-white/10 p-1 backdrop-blur-md">
                <TabsTrigger value="all" className="rounded-md text-white data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction">All Projects</TabsTrigger>
                <TabsTrigger value="active" className="rounded-md text-white data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction">Active</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-md text-white data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction">Completed</TabsTrigger>
                <TabsTrigger value="atrisk" className="rounded-md text-white data-[state=active]:bg-white/20 data-[state=active]:text-white micro-interaction">At Risk</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
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
  const [currentTab, setCurrentTab] = useState<'details' | 'sheet'>('details');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300";
      case "At Risk":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-3 w-3" />;
      case "At Risk":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-shadow border-white/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base font-semibold text-white">{project.name}</span>
          <span 
            className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(project.status)}`}
          >
            {getStatusIcon(project.status)}
            <span className="ml-1">{project.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="details" className="w-full" onValueChange={(value) => setCurrentTab(value as 'details' | 'sheet')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-white/20">
              Details
            </TabsTrigger>
            <TabsTrigger value="sheet" className="text-white data-[state=active]:bg-white/20">
              <FileSpreadsheet className="mr-1 h-3.5 w-3.5" />
              Tasks Sheet
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-3">
            <div className="mb-4">
              <div className="text-sm text-white/70 mb-1">Client</div>
              <div className="font-medium text-white">{project.client}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-white/70 mb-1">Deadline</div>
              <div className="font-medium flex items-center text-white">
                <Clock className="h-4 w-4 mr-1 text-white/70" /> {project.deadline}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-white/70 mb-1">Team</div>
              <div className="flex -space-x-2">
                {project.team?.map((member: string, i: number) => (
                  <div 
                    key={i} 
                    className="h-8 w-8 rounded-full bg-alphabits-teal flex items-center justify-center text-white text-xs font-medium border-2 border-alphabits-darkblue"
                  >
                    {member}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Progress</span>
                <span className="text-sm font-medium text-white">{project.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-alphabits-teal h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sheet" className="mt-3">
            <div className="h-[200px] flex flex-col items-center justify-center space-y-3">
              {project.google_sheet_id ? (
                <>
                  <FileSpreadsheet className="h-12 w-12 text-white/50" />
                  <p className="text-white/70 text-sm text-center">Project tasks are tracked in Google Sheets</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 micro-interaction"
                    onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${project.google_sheet_id}`, '_blank')}
                  >
                    Open Sheet
                  </Button>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-12 w-12 text-white/30" />
                  <p className="text-white/50 text-sm text-center">No Google Sheet connected to this project</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 micro-interaction"
                  >
                    Connect Sheet
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Projects;
