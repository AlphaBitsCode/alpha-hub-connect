
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
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
  MessageSquare,
  BarChart3, 
  Briefcase, 
  UserPlus, 
  Megaphone, 
  HeadphonesIcon 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const AssistantDetail = () => {
  const { assistantId } = useParams<{assistantId: string}>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isDarkMode } = useTheme();

  // Fetch assistant details
  const { data: assistant, isLoading, error } = useQuery({
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
        .eq("id", assistantId)
        .single();
      
      if (error) throw error;
      
      // Transform data to match Assistant type
      return {
        ...data,
        skills: data.assistant_skills.map((as: any) => as.skills)
      } as unknown as Assistant;
    },
  });

  const getAssistantIcon = (name: string = "") => {
    if (name.includes("Data Analyst")) return <BarChart3 className="h-full w-full p-2 text-white" />;
    if (name.includes("Project Manager")) return <Briefcase className="h-full w-full p-2 text-white" />;
    if (name.includes("HR")) return <UserPlus className="h-full w-full p-2 text-white" />;
    if (name.includes("Marketing")) return <Megaphone className="h-full w-full p-2 text-white" />;
    if (name.includes("Customer Support")) return <HeadphonesIcon className="h-full w-full p-2 text-white" />;
    return <Bot className="h-full w-full p-2 text-white" />;
  };

  const getAssistantColor = (name: string = "") => {
    if (name.includes("Data Analyst")) return "bg-blue-600";
    if (name.includes("Project Manager")) return "bg-green-600";
    if (name.includes("HR")) return "bg-purple-600";
    if (name.includes("Marketing")) return "bg-orange-600";
    if (name.includes("Customer Support")) return "bg-red-600";
    return "bg-alphabits-teal";
  };

  const getInitials = (name: string = "") => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <AlphaBitsSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !assistant) {
    return (
      <div className="flex min-h-screen">
        <AlphaBitsSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              Error loading assistant details. Please try again.
            </div>
            <Button 
              onClick={() => navigate("/assistants")} 
              variant="ghost" 
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assistants
            </Button>
          </div>
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
              onClick={() => navigate("/assistants")} 
              variant="ghost" 
              className="mr-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assistants
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => navigate(`/edit-assistant/${assistant.id}`)} 
                variant="outline" 
                className="ml-auto"
              >
                Edit Assistant
              </Button>
            )}
          </div>

          <Card className={cn(
            "mb-8",
            isDarkMode ? "glass-card" : "bg-white shadow-md"
          )}>
            <CardHeader className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className={cn(
                "h-24 w-24 border-4",
                getAssistantColor(assistant.name),
                isDarkMode ? "border-white/20" : "border-gray-200"
              )}>
                {assistant.avatar_url ? (
                  <AvatarImage src={assistant.avatar_url} />
                ) : (
                  <AvatarFallback className={getAssistantColor(assistant.name)}>
                    {getAssistantIcon(assistant.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <CardTitle className={cn(
                  "text-2xl",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}>{assistant.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {assistant.skills?.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className={cn(
                      isDarkMode ? "bg-alphabits-teal/20 text-alphabits-teal border-alphabits-teal/30" :
                      "bg-alphabits-teal/10 text-alphabits-teal/90 border-alphabits-teal/20"
                    )}>
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="mt-4 md:mt-0 md:ml-auto bg-alphabits-teal hover:bg-alphabits-teal/90">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className={cn(
                  "text-lg font-medium mb-2",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}>Introduction</h3>
                <p className={cn(
                  isDarkMode ? "text-white/80" : "text-gray-600"
                )}>{assistant.introduction}</p>
              </div>
              
              <Separator className={isDarkMode ? "bg-white/10" : "bg-gray-200"} />
              
              <div>
                <h3 className={cn(
                  "text-lg font-medium mb-2",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}>Persona</h3>
                <p className={cn(
                  "whitespace-pre-line",
                  isDarkMode ? "text-white/80" : "text-gray-600"
                )}>{assistant.persona}</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button size="lg" className="bg-alphabits-teal hover:bg-alphabits-teal/90">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting with {assistant.name}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssistantDetail;
