
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Assistant } from "@/types/assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Bot, 
  Edit, 
  Eye, 
  PlusCircle, 
  ToggleLeft, 
  ToggleRight, 
  Trash
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ManageAssistants = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [assistantToDelete, setAssistantToDelete] = useState<string | null>(null);

  // Fetch assistants
  const { data: assistants, isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select("*, assistant_skills(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as Assistant[];
    },
  });

  // Delete assistant mutation
  const deleteAssistantMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("assistants")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: () => {
      toast.success("Assistant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      setAssistantToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete assistant");
      console.error(error);
    },
  });

  // Toggle assistant public status mutation
  const togglePublicStatusMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { error } = await supabase
        .from("assistants")
        .update({ is_public: isPublic })
        .eq("id", id);
      
      if (error) throw error;
      
      return { id, isPublic };
    },
    onSuccess: (variables) => {
      toast.success(`Assistant is now ${variables.isPublic ? 'public' : 'private'}`);
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
    onError: (error) => {
      toast.error("Failed to update assistant");
      console.error(error);
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleDeleteAssistant = () => {
    if (assistantToDelete) {
      deleteAssistantMutation.mutate(assistantToDelete);
    }
  };

  const handleTogglePublic = (id: string, currentStatus: boolean) => {
    togglePublicStatusMutation.mutate({ id, isPublic: !currentStatus });
  };

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                onClick={() => navigate("/assistants")} 
                variant="ghost" 
                className="mr-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-3xl font-bold">Manage AI Assistants</h1>
            </div>
            <Button 
              onClick={() => navigate("/create-assistant")} 
              className="bg-alphabits-teal hover:bg-alphabits-teal/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Assistant
            </Button>
          </div>

          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-white">AI Assistants Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Create and manage AI assistants for your team. You can control which assistants are visible to users and customize their personas.
              </p>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card className="glass-card h-64 animate-pulse">
              <div className="h-full flex items-center justify-center">
                <Bot className="h-12 w-12 text-alphabits-teal/30" />
              </div>
            </Card>
          ) : assistants?.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <Bot className="h-16 w-16 mx-auto text-alphabits-teal/50 mb-4" />
              <h3 className="text-xl font-medium text-white">No Assistants Created</h3>
              <p className="text-white/70 mt-2 mb-6">
                Get started by creating your first AI assistant.
              </p>
              <Button 
                onClick={() => navigate("/create-assistant")} 
                className="bg-alphabits-teal hover:bg-alphabits-teal/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Assistant
              </Button>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10">
                      <TableHead className="text-white">Assistant</TableHead>
                      <TableHead className="text-white">Skills</TableHead>
                      <TableHead className="text-white">Public</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assistants.map((assistant) => (
                      <TableRow
                        key={assistant.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-alphabits-teal">
                              <AvatarImage src={assistant.avatar_url} />
                              <AvatarFallback className="bg-alphabits-teal text-white">
                                {getInitials(assistant.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-medium">{assistant.name}</div>
                              <div className="text-white/60 text-xs line-clamp-1">
                                {assistant.introduction?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {assistant.skills?.slice(0, 3).map((skill, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-alphabits-teal/20 text-alphabits-teal border-alphabits-teal/30 text-xs"
                              >
                                {skill.name}
                              </Badge>
                            ))}
                            {assistant.skills?.length > 3 && (
                              <Badge variant="outline" className="bg-white/10 text-white/70 border-white/20 text-xs">
                                +{assistant.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-white"
                            onClick={() => handleTogglePublic(assistant.id, assistant.is_public)}
                          >
                            {assistant.is_public ? (
                              <ToggleRight className="h-5 w-5 text-green-400 mr-2" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400 mr-2" />
                            )}
                            {assistant.is_public ? "Public" : "Private"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/assistants/${assistant.id}`)}
                              className="h-8 w-8 text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/edit-assistant/${assistant.id}`)}
                              className="h-8 w-8 text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog open={assistantToDelete === assistant.id} onOpenChange={(open) => !open && setAssistantToDelete(null)}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setAssistantToDelete(assistant.id)}
                                  className="h-8 w-8 text-white hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Assistant</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {assistant.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteAssistant}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageAssistants;
