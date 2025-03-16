import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  deadline: string;
  status: string;
  google_sheet_id: string;
  google_sheet_range: string;
}

const ProjectSettings = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch project
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (error) throw error;
      
      return data as Project;
    },
  });

  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [googleSheetRange, setGoogleSheetRange] = useState("");

  // Set form values when project data is loaded
  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setClient(project.client || "");
      setDescription(project.description || "");
      setDeadline(project.deadline || "");
      setStatus(project.status || "");
      setGoogleSheetId(project.google_sheet_id || "");
      setGoogleSheetRange(project.google_sheet_range || "");
    }
  }, [project]);

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name,
          client,
          description,
          deadline,
          status,
          google_sheet_id: googleSheetId,
          google_sheet_range: googleSheetRange,
        })
        .eq("id", projectId)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Project updated successfully!");
      navigate(`/project/${projectId}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate();
  };

  if (isLoadingProject) {
    return (
      <div className="flex min-h-screen">
        <AlphaBitsSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-alphabits-teal" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button onClick={() => navigate(`/project/${projectId}`)} variant="ghost" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Project</h1>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-white">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <Label htmlFor="client" className="text-white">
                    Client
                  </Label>
                  <Input
                    type="text"
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Project Description"
                    className="h-24"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="text-white">
                    Deadline
                  </Label>
                  <Input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <Input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Project Status"
                  />
                </div>
                <div>
                  <Label htmlFor="googleSheetId" className="text-white">
                    Google Sheet ID
                  </Label>
                  <Input
                    type="text"
                    id="googleSheetId"
                    value={googleSheetId}
                    onChange={(e) => setGoogleSheetId(e.target.value)}
                    placeholder="Google Sheet ID"
                  />
                </div>
                <div>
                  <Label htmlFor="googleSheetRange" className="text-white">
                    Google Sheet Range
                  </Label>
                  <Input
                    type="text"
                    id="googleSheetRange"
                    value={googleSheetRange}
                    onChange={(e) => setGoogleSheetRange(e.target.value)}
                    placeholder="Google Sheet Range"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => navigate(`/project/${projectId}`)} className="mr-2">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-alphabits-teal hover:bg-alphabits-teal/90" disabled={updateProjectMutation.isPending}>
                    {updateProjectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Update Project
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProjectSettings;
