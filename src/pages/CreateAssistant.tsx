
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Bot, 
  Check, 
  Loader2, 
  PlusCircle 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { CreateAssistantDto } from "@/types/assistant";
import { MultiSelect } from "@/components/ui/multi-select"; // You'll need to implement this

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatar_url: z.string().url({ message: "Please enter a valid URL." }).optional(),
  skills: z.array(z.string()).min(1, { message: "At least one skill is required." }),
  introduction: z.string().min(10, { message: "Introduction must be at least 10 characters." }),
  persona: z.string().min(20, { message: "Persona must be at least 20 characters." }),
  is_public: z.boolean().default(false),
});

const CreateAssistant = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Get skills for dropdown
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      return data.map(skill => ({
        value: skill.id,
        label: skill.name
      }));
    },
  });
  
  // Create assistant mutation
  const createAssistantMutation = useMutation({
    mutationFn: async (values: CreateAssistantDto) => {
      // Insert assistant
      const { data: assistant, error: assistantError } = await supabase
        .from("assistants")
        .insert({
          name: values.name,
          avatar_url: values.avatar_url || null,
          introduction: values.introduction,
          persona: values.persona,
          is_public: values.is_public,
        })
        .select()
        .single();
      
      if (assistantError) throw assistantError;
      
      // Create skills that don't exist yet
      for (const skillId of values.skills) {
        // Link skills to assistant
        const { error: skillLinkError } = await supabase
          .from("assistant_skills")
          .insert(
            { assistant_id: assistant.id, skill_id: skillId }
          );
        
        if (skillLinkError) throw skillLinkError;
      }
      
      return assistant;
    },
    onSuccess: () => {
      toast.success("Assistant created successfully");
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      navigate("/manage-assistants");
    },
    onError: (error) => {
      toast.error("Failed to create assistant");
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
      
      return {
        value: data.id,
        label: data.name
      };
    },
    onSuccess: (newSkill) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(`Skill "${newSkill.label}" created`);
    },
    onError: (error) => {
      toast.error("Failed to create skill");
      console.error(error);
    },
  });
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      avatar_url: "",
      skills: [],
      introduction: "",
      persona: "",
      is_public: false,
    },
  });
  
  const handleSubmit = form.handleSubmit((values) => {
    createAssistantMutation.mutate(values as CreateAssistantDto);
  });

  const handleCreateSkill = (skillName: string) => {
    createSkillMutation.mutate(skillName);
  };

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              onClick={() => navigate("/manage-assistants")} 
              variant="ghost" 
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Create New AI Assistant</h1>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-white">AI Assistant Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter assistant name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The name of your AI assistant.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Avatar URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/avatar.png" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          URL to the assistant's avatar image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Skills</FormLabel>
                        <FormControl>
                          <MultiSelect 
                            options={skills || []} 
                            placeholder="Select skills"
                            loading={skillsLoading} 
                            onChange={field.onChange}
                            value={field.value}
                            onCreateOption={handleCreateSkill}
                          />
                        </FormControl>
                        <FormDescription>
                          Skills and capabilities of the assistant.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="introduction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Introduction</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief introduction of the assistant"
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short introduction text displayed to users.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="persona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Persona</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the assistant's personality and behavior"
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed description of the assistant's personality, tone, and behavior.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Public Assistant</FormLabel>
                          <FormDescription>
                            Make this assistant visible to everyone.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/manage-assistants")}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-alphabits-teal hover:bg-alphabits-teal/90"
                      disabled={createAssistantMutation.isPending}
                    >
                      {createAssistantMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Create Assistant
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateAssistant;
