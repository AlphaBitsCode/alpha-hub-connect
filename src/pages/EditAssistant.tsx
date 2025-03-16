
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Check, 
  Loader2 
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { Assistant, UpdateAssistantDto } from "@/types/assistant";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatar_url: z.string().url({ message: "Please enter a valid URL." }).optional(),
  skills: z.array(z.string()).min(1, { message: "At least one skill is required." }),
  introduction: z.string().min(10, { message: "Introduction must be at least 10 characters." }),
  persona: z.string().min(20, { message: "Persona must be at least 20 characters." }),
  is_public: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const EditAssistant = () => {
  const { assistantId } = useParams<{assistantId: string}>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch assistant details
  const { data: assistant, isLoading: assistantLoading } = useQuery({
    queryKey: ["assistant", assistantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select(`
          *,
          assistant_skills (
            skill_id,
            skills:skill_id (
              id,
              name
            )
          )
        `)
        .eq("id", assistantId as string)
        .single();
      
      if (error) throw error;
      
      // Extract skill IDs for form
      const skills = data.assistant_skills.map((as: any) => as.skill_id);
      
      return {
        ...data,
        skills
      } as unknown as Assistant & { skills: string[] };
    },
  });
  
  // Get skills for dropdown
  const { data: skillOptions, isLoading: skillsLoading } = useQuery({
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
  
  // Update assistant mutation
  const updateAssistantMutation = useMutation({
    mutationFn: async (values: UpdateAssistantDto) => {
      // Update assistant
      const { data: updatedAssistant, error: assistantError } = await supabase
        .from("assistants")
        .update({
          name: values.name,
          avatar_url: values.avatar_url || null,
          introduction: values.introduction,
          persona: values.persona,
          is_public: values.is_public,
        })
        .eq("id", assistantId as string)
        .select()
        .single();
      
      if (assistantError) throw assistantError;
      
      // Delete all existing skill links
      const { error: deleteError } = await supabase
        .from("assistant_skills")
        .delete()
        .eq("assistant_id", assistantId as string);
      
      if (deleteError) throw deleteError;
      
      // Create new skill links
      if (values.skills && values.skills.length > 0) {
        const skillLinks = values.skills.map(skillId => ({
          assistant_id: assistantId as string,
          skill_id: skillId
        }));
        
        const { error: insertError } = await supabase
          .from("assistant_skills")
          .insert(skillLinks);
        
        if (insertError) throw insertError;
      }
      
      return updatedAssistant;
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
  const form = useForm<FormValues>({
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
  
  // Set form values when assistant data is loaded
  useEffect(() => {
    if (assistant) {
      form.reset({
        name: assistant.name,
        avatar_url: assistant.avatar_url || "",
        skills: assistant.skills,
        introduction: assistant.introduction,
        persona: assistant.persona,
        is_public: assistant.is_public,
      });
    }
  }, [assistant, form]);
  
  const handleSubmit = form.handleSubmit((values) => {
    updateAssistantMutation.mutate(values as UpdateAssistantDto);
  });

  const handleCreateSkill = (skillName: string) => {
    createSkillMutation.mutate(skillName);
  };

  if (assistantLoading) {
    return (
      <div className="flex min-h-screen">
        <AlphaBitsSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-alphabits-teal" />
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
            <Button 
              onClick={() => navigate("/manage-assistants")} 
              variant="ghost" 
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit AI Assistant</h1>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-white">Edit Assistant Details</CardTitle>
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
                            value={field.value || ""}
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
                            options={skillOptions || []} 
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
                      disabled={updateAssistantMutation.isPending}
                    >
                      {updateAssistantMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Update Assistant
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

export default EditAssistant;
