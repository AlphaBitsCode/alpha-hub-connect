
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Projects = () => {
  const projectsList = [
    { 
      id: 1, 
      name: "Website Redesign", 
      client: "Tech Corp", 
      deadline: "Jun 30, 2023", 
      status: "In Progress",
      team: ["JD", "AK", "MC"],
      progress: 65 
    },
    { 
      id: 2, 
      name: "Mobile App Development", 
      client: "StartUp Inc", 
      deadline: "Aug 15, 2023", 
      status: "In Progress",
      team: ["JD", "BL"],
      progress: 45 
    },
    { 
      id: 3, 
      name: "Marketing Campaign", 
      client: "Brand Solutions", 
      deadline: "Jul 10, 2023", 
      status: "Completed",
      team: ["AK", "MC", "TJ"],
      progress: 100 
    },
    { 
      id: 4, 
      name: "E-commerce Platform", 
      client: "Retail Group", 
      deadline: "Sep 1, 2023", 
      status: "In Progress",
      team: ["JD", "BL", "MC", "TJ"],
      progress: 30 
    },
    { 
      id: 5, 
      name: "CRM Integration", 
      client: "Service Providers", 
      deadline: "Jul 22, 2023", 
      status: "At Risk",
      team: ["AK", "JD"],
      progress: 50 
    },
    { 
      id: 6, 
      name: "Data Analytics Dashboard", 
      client: "Analytics Co", 
      deadline: "Aug 5, 2023", 
      status: "In Progress",
      team: ["MC", "BL", "TJ"],
      progress: 70 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-500">Manage and track all your projects</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-alphabits-purple hover:bg-alphabits-purple/90">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>

            {/* Project Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="atrisk">At Risk</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsList.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsList
                    .filter(p => p.status === "In Progress")
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsList
                    .filter(p => p.status === "Completed")
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="atrisk" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsList
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

const ProjectCard = ({ project }: { project: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "At Risk":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base font-semibold">{project.name}</span>
          <span 
            className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(project.status)}`}
          >
            {getStatusIcon(project.status)}
            <span className="ml-1">{project.status}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Client</div>
          <div className="font-medium">{project.client}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Deadline</div>
          <div className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" /> {project.deadline}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Team</div>
          <div className="flex -space-x-2">
            {project.team.map((member: string, i: number) => (
              <div 
                key={i} 
                className="h-8 w-8 rounded-full bg-alphabits-purple flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              >
                {member}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-alphabits-purple h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
