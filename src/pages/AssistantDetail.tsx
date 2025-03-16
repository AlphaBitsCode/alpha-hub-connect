
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
import { ArrowLeft, Bot, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const AssistantDetail = () => {
  const { assistantId } = useParams<{assistantId: string}>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Fetch assistant details
  const { data: assistant, isLoading, error } = useQuery({
    queryKey: ["assistant", assistantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select("*, assistant_skills(*)")
        .eq("id", assistantId)
        .single();
      
      if (error) throw error;
      
      return data as Assistant;
    },
  });

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

          <Card className="glass-card mb-8">
            <CardHeader className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 border-alphabits-teal">
                <AvatarImage src={assistant.avatar_url} />
                <AvatarFallback className="bg-alphabits-teal text-white text-2xl">
                  {getInitials(assistant.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-white">{assistant.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {assistant.skills?.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="bg-alphabits-teal/20 text-alphabits-teal border-alphabits-teal/30">
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
                <h3 className="text-lg font-medium text-white mb-2">Introduction</h3>
                <p className="text-white/80">{assistant.introduction}</p>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Persona</h3>
                <p className="text-white/80 whitespace-pre-line">{assistant.persona}</p>
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
