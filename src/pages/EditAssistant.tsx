
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Assistant, AssistantSkill, UpdateAssistantDto } from "@/types/assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const EditAssistant = () => {
  const { assistantId } = useParams<{assistantId: string}>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<UpdateAssistantDto>({
    id: assistantId || "",
    name: "",
    avatar_url: "",
    skills: [],
    introduction: "",
    persona: "",
    is_public: false
  });
  
  const [newSkill, setNewSkill] = useState<string>("");
  
  // Fetch assistant details
  const { data: assistant, isLoading: isLoadingAssistant } = useQuery({
    queryKey: ["assistant", assistantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select("*, assistant_skills(skill_id)")
        .eq("id", assistantId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        skills: data.assistant_skills.map((item: any) => item.skill_id)
      } as Assistant & { skills: string[] };
    },
    enabled: !!assistantId,
  });
  
  // Fetch existing skills
  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      return data as AssistantSkill[];
    },
  });

  useEffect(() => {
    if (assistant) {
      setFormData({
        id: assistant.id,
        name: assistant.name,
        avatar_url: assistant.avatar_url || "",
        skills: assistant.skills || [],
        introduction: assistant.introduction,
        persona: assistant.persona,
        is_public: assistant.is_public
      });
    }
  }, [assistant]);

  // Update assistant mutation
  const updateAssistantMutation = useMutation({
    mutationFn: async (data: UpdateAssistantDto) => {
      // 1. Update the assistant basic info
      const { error } = await supabase
        .from("assistants")
        .update({
          name: data.name,
          avatar_url: data.avatar_url || null,
          introduction: data.introduction,
          persona: data.persona,
          is_public: data.is_public
        })
        .eq("id", data.id);
      
      if (error) throw error;
      
      // 2. Delete existing skills relationships
      const { error: deleteError } = await supabase
        .from("assistant_skills")
        .delete()
        .eq("assistant_id", data.id);
      
      if (deleteError) throw deleteError;
      
      // 3. Insert new skills relationships
      if (data.skills && data.skills.length > 0) {
        const skillsToInsert = data.skills.map(skillId => ({
          assistant_id: data.id,
          skill_id: skillId
        }));
        
        const { error: skillsError } = await supabase
          .from("assistant_skills")
          .insert(skillsToInsert);
        
        if (skillsError) throw skillsError;
      }
      
      return data;
    },
    onSuccess: () => {
      toast.success("Assistant updated successfully");
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      queryClient.invalidateQueries({ queryKey: ["assistant", assistantId] });
      navigate("/manage-assistants");
    },
    onError: (error) => {
      toast.error("Failed to update assistant");
      console.error(error);
    },
  });

  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("skills")
        .insert({ name })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as AssistantSkill;
    },
    onSuccess: (skill) => {
      toast.success(`Skill "${skill.name}" created`);
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.id]
      }));
      setNewSkill("");
    },
    onError: (error) => {
      toast.error("Failed to create skill");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      toast.error("Assistant name is required");
      return;
    }
    
    if (!formData.introduction) {
      toast.error("Introduction is required");
      return;
    }
    
    if (!formData.persona) {
      toast.error("Persona is required");
      return;
    }
    
    updateAssistantMutation.mutate(formData);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_public: checked }));
  };
  
  const handleSkillSelect = (skillId: string) => {
    if (formData.skills?.includes(skillId)) {
      // Remove skill
      setFormData(prev => ({
        ...prev,
        skills: prev.skills?.filter(id => id !== skillId) || []
      }));
    } else {
      // Add skill
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillId]
      }));
    }
  };
  
  const handleCreateSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Skill name cannot be empty");
      return;
    }
    
    createSkillMutation.mutate(newSkill.trim());
  };
  
  const getSkillNameById = (id: string): string => {
    return skills?.find(skill => skill.id === id)?.name || "";
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (isLoadingAssistant) {
    return (
      <div className="flex min-h-screen">
        <AlphaBitsSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              onClick={() => navigate("/manage-assistants")} 
              variant="ghost" 
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Assistant</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <Avatar className="h-24 w-24 border-4 border-alphabits-teal">
                      <AvatarImage src={formData.avatar_url} />
                      <AvatarFallback className="bg-alphabits-teal text-white text-lg">
                        {formData.name ? getInitials(formData.name) : <Bot />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar_url" className="text-white mb-2 block">
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar_url"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/avatar.png"
                        className="glass border-white/20 text-white placeholder:text-white/60"
                      />
                      <p className="text-white/60 text-xs mt-1">
                        Enter a URL for the assistant's avatar image
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white mb-2 block">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="AI Assistant Name"
                        required
                        className="glass border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="introduction" className="text-white mb-2 block">
                        Introduction*
                      </Label>
                      <Textarea
                        id="introduction"
                        name="introduction"
                        value={formData.introduction}
                        onChange={handleInputChange}
                        placeholder="A brief description of what this assistant can help with"
                        required
                        className="glass border-white/20 text-white placeholder:text-white/60 min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="skills" className="text-white">
                          Skills & Expertise
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add new skill"
                            className="glass border-white/20 text-white placeholder:text-white/60 h-8 text-sm w-40"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleCreateSkill}
                            className="h-8 text-white hover:bg-white/10"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills?.map(skillId => (
                          <Badge
                            key={skillId}
                            variant="outline"
                            className="bg-alphabits-teal/20 text-alphabits-teal border-alphabits-teal/30 flex items-center gap-1"
                          >
                            {getSkillNameById(skillId)}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-400"
                              onClick={() => handleSkillSelect(skillId)}
                            />
                          </Badge>
                        ))}
                      </div>
                      
                      {skills && skills.length > 0 && (
                        <div className="glass border border-white/20 rounded-md p-2 max-h-40 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                              <div
                                key={skill.id}
                                onClick={() => handleSkillSelect(skill.id)}
                                className={`cursor-pointer px-2 py-1 rounded-md text-sm flex items-center gap-1 ${
                                  formData.skills?.includes(skill.id)
                                    ? "bg-alphabits-teal/20 text-alphabits-teal"
                                    : "bg-white/5 text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {formData.skills?.includes(skill.id) && (
                                  <Check className="h-3 w-3" />
                                )}
                                {skill.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Persona & Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="persona" className="text-white mb-2 block">
                      Persona Description*
                    </Label>
                    <Textarea
                      id="persona"
                      name="persona"
                      value={formData.persona}
                      onChange={handleInputChange}
                      placeholder="Detailed description of how this assistant should behave, communicate, and respond"
                      required
                      className="glass border-white/20 text-white placeholder:text-white/60 min-h-[150px]"
                    />
                    <p className="text-white/60 text-xs mt-1">
                      Define the assistant's tone, style, expertise level, and any specific language patterns
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                      <div className="text-white font-medium">Public Availability</div>
                      <div className="text-white/60 text-sm">
                        Make this assistant available to all users
                      </div>
                    </div>
                    <Switch
                      checked={formData.is_public}
                      onCheckedChange={handleSwitchChange}
                      className="data-[state=checked]:bg-alphabits-teal"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/manage-assistants")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-alphabits-teal hover:bg-alphabits-teal/90"
                  disabled={updateAssistantMutation.isPending}
                >
                  {updateAssistantMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditAssistant;
