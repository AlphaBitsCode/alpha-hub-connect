
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Assistant } from "@/types/assistant";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  MessageSquare, 
  PlusCircle, 
  BarChart3, 
  Briefcase, 
  UserPlus, 
  Megaphone, 
  HeadphonesIcon 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const Assistants = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { isDarkMode } = useTheme();

  // Fetch assistants
  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ["assistants"],
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
        `);
      
      if (error) throw error;
      
      // Transform data to match Assistant type
      return data.map(assistant => ({
        ...assistant,
        skills: assistant.assistant_skills.map((as: any) => as.skills)
      })) as unknown as Assistant[];
    },
  });

  const getAssistantIcon = (name: string) => {
    if (name.includes("Data Analyst")) return <BarChart3 className="h-full w-full p-2 text-white" />;
    if (name.includes("Project Manager")) return <Briefcase className="h-full w-full p-2 text-white" />;
    if (name.includes("HR")) return <UserPlus className="h-full w-full p-2 text-white" />;
    if (name.includes("Marketing")) return <Megaphone className="h-full w-full p-2 text-white" />;
    if (name.includes("Customer Support")) return <HeadphonesIcon className="h-full w-full p-2 text-white" />;
    return <Bot className="h-full w-full p-2 text-white" />;
  };

  const getAssistantColor = (name: string) => {
    if (name.includes("Data Analyst")) return "bg-blue-600";
    if (name.includes("Project Manager")) return "bg-green-600";
    if (name.includes("HR")) return "bg-purple-600";
    if (name.includes("Marketing")) return "bg-orange-600";
    if (name.includes("Customer Support")) return "bg-red-600";
    return "bg-alphabits-teal";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={cn(
              "text-3xl font-bold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>AI Assistants</h1>
            {isAdmin && (
              <Button 
                onClick={() => navigate("/manage-assistants")} 
                className="bg-alphabits-teal hover:bg-alphabits-teal/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Manage Assistants
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className={cn(
                  "h-64 animate-pulse",
                  isDarkMode ? "glass-card" : "bg-white shadow-md"
                )}>
                  <div className="h-full flex items-center justify-center">
                    <Bot className="h-12 w-12 text-alphabits-teal/30" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              Error loading assistants. Please try again.
            </div>
          ) : assistants?.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto text-alphabits-teal/50 mb-4" />
              <h3 className={cn(
                "text-xl font-medium",
                isDarkMode ? "text-white" : "text-gray-800"
              )}>No Assistants Available</h3>
              <p className="text-muted-foreground mt-2">
                There are no AI assistants available at the moment.
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => navigate("/create-assistant")} 
                  className="mt-6 bg-alphabits-teal hover:bg-alphabits-teal/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Assistant
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assistants.map((assistant) => (
                <Card 
                  key={assistant.id} 
                  className={cn(
                    "hover:shadow-lg transition-all duration-300 cursor-pointer",
                    isDarkMode ? "glass-card" : "bg-white shadow-md"
                  )}
                  onClick={() => navigate(`/assistants/${assistant.id}`)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className={cn(
                      "h-12 w-12 border-2",
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
                    <div>
                      <CardTitle className={cn(
                        "text-lg",
                        isDarkMode ? "text-white" : "text-gray-800"
                      )}>{assistant.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-sm line-clamp-3 mb-4",
                      isDarkMode ? "text-white/80" : "text-gray-600"
                    )}>
                      {assistant.introduction}
                    </p>
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
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with {assistant.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assistants;
