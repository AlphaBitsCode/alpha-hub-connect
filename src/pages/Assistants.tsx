
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Assistant } from "@/types/assistant";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Assistants = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Fetch assistants
  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ["assistants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assistants")
        .select("*, assistant_skills(*)");
      
      if (error) throw error;
      
      return data as Assistant[];
    },
  });

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
            <h1 className="text-3xl font-bold">AI Assistants</h1>
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
                <Card key={i} className="glass-card h-64 animate-pulse">
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
              <h3 className="text-xl font-medium">No Assistants Available</h3>
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
                  className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/assistants/${assistant.id}`)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12 border-2 border-alphabits-teal">
                      <AvatarImage src={assistant.avatar_url} />
                      <AvatarFallback className="bg-alphabits-teal text-white">
                        {getInitials(assistant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-white">{assistant.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-sm line-clamp-3 mb-4">
                      {assistant.introduction}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {assistant.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-alphabits-teal/20 text-alphabits-teal border-alphabits-teal/30">
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
