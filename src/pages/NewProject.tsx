
import { useState } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const NewProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    deadline: "",
    dashboardUrl: "",
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
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          client: formData.client,
          description: formData.description,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          google_sheet_id: formData.dashboardUrl || null,
          status: 'In Progress',
          progress: 0,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Project created!",
        description: "Your new project has been successfully created.",
      });
      
      // Navigate to the projects page after successful creation
      navigate("/projects");
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Start a New Project</h1>
            
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
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
                      value={formData.description}
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
                    <Label htmlFor="dashboardUrl" className="text-white">
                      Dashboard URL (Google Sheet ID or External Dashboard)
                    </Label>
                    <Input
                      id="dashboardUrl"
                      name="dashboardUrl"
                      placeholder="Enter URL or Sheet ID"
                      value={formData.dashboardUrl}
                      onChange={handleChange}
                      className="glass border-white/20 text-white placeholder:text-white/60"
                    />
                    <p className="text-white/60 text-xs">
                      For Google Sheets, enter the Sheet ID from the URL (the long string between /d/ and /edit)
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
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

export default NewProject;
