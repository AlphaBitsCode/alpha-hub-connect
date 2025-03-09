
import { useState } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Trash2, AlertCircle, HelpCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const ProjectSettings = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    deadline: "",
    dashboardUrl: "",
    status: "",
    progress: 0,
  });

  // Fetch project data
  const { isLoading, error, data: project } = useQuery({
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
      
      const project = data as Project;
      
      // Format the date for the input field (YYYY-MM-DD)
      let formattedDate = "";
      if (project.deadline) {
        const date = new Date(project.deadline);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      setFormData({
        name: project.name || "",
        client: project.client || "",
        description: project.description || "",
        deadline: formattedDate,
        dashboardUrl: project.google_sheet_id || "",
        status: project.status || "In Progress",
        progress: project.progress || 0,
      });
      
      return project;
    },
    enabled: !!projectId,
    // This ensures the form data is updated when the query succeeds
    onSuccess: (data) => {
      // Format the date for the input field (YYYY-MM-DD)
      let formattedDate = "";
      if (data.deadline) {
        const date = new Date(data.deadline);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      setFormData({
        name: data.name || "",
        client: data.client || "",
        description: data.description || "",
        deadline: formattedDate,
        dashboardUrl: data.google_sheet_id || "",
        status: data.status || "In Progress",
        progress: data.progress || 0,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.client) {
      toast({
        title: "Missing information",
        description: "Project name and client are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          client: formData.client,
          description: formData.description,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          google_sheet_id: formData.dashboardUrl || null,
          status: formData.status,
          progress: formData.progress,
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project updated!",
        description: "Your project has been successfully updated.",
      });
      
      // Navigate to the project dashboard after successful update
      navigate(`/project/${projectId}`);
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    
    try {
      setIsDeleting(true);
      
      // Delete the project from the database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      
      // Navigate back to the projects list
      navigate('/projects');
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

  if (error) {
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
        
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 mr-4"
                onClick={() => navigate(`/project/${projectId}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
              </Button>
              <h1 className="text-3xl font-bold text-white">Project Settings</h1>
            </div>
            
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
                <div className="text-white/60 text-sm">Update your project information</div>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Project Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={handleChange}
                      className="glass border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-white">Client Name*</Label>
                    <Input
                      id="client"
                      name="client"
                      placeholder="Enter client name"
                      value={formData.client}
                      onChange={handleChange}
                      className="glass border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Project Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the project"
                      value={formData.description || ""}
                      onChange={handleChange}
                      className="glass border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-white">Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="glass border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || "In Progress"}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="glass border-white/20 text-white bg-transparent w-full h-10 px-3 rounded-md"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="progress" className="text-white">Progress (%)</Label>
                    <Input
                      id="progress"
                      name="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleChange}
                      className="glass border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dashboardUrl" className="text-white">
                        Google Sheet ID for Dashboard
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => window.open('https://support.google.com/docs/answer/183965?hl=en&co=GENIE.Platform%3DDesktop', '_blank')}
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              To embed your Google Sheet, publish it to the web first. Click "File" {"→"} "Share" {"→"} "Publish to web" in Google Sheets, then copy the Sheet ID.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="dashboardUrl"
                      name="dashboardUrl"
                      placeholder="Enter Google Sheet ID"
                      value={formData.dashboardUrl}
                      onChange={handleChange}
                      className="glass border-white/20 text-white placeholder:text-white/60"
                    />
                    <p className="text-white/60 text-xs">
                      Enter the Sheet ID from the URL (the long string between /d/ and /edit)
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full border-t border-white/10 my-2"></div>
                  <Button 
                    type="button"
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="bg-gray-900 border border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          Delete Project
                        </DialogTitle>
                        <DialogDescription className="text-white/70">
                          Are you sure you want to delete this project? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleDeleteProject}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Project"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    type="submit" 
                    className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Project"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectSettings;
