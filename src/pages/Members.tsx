
import { useState, useEffect } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MoreHorizontal,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
}

const Members = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*');
      
      if (error) {
        toast({
          title: "Error loading members",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Member[];
    },
  });

  const filteredMembers = members.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (member.full_name && member.full_name.toLowerCase().includes(searchLower)) ||
      (member.email && member.email.toLowerCase().includes(searchLower)) ||
      (member.role && member.role.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex flex-1 w-full">
          <AlphaBitsSidebar />
          <div className="flex items-center justify-center w-full">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-alphabits-teal"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Team Members</h1>
                <p className="text-white/70">View and manage your team members</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white micro-interaction"
                  onClick={() => navigate("/settings/profile")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-9 glass border-white/20 text-white placeholder:text-white/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              ) : (
                <div className="col-span-full flex justify-center py-10">
                  <p className="text-white/70">No members found. Adjust your search or add new members.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MemberCard = ({ member }: { member: Member }) => {
  const getInitials = (name: string | null): string => {
    if (!name) return "?";
    
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow glass-card border-white/20">
      <CardHeader className="pb-2 pt-6 flex flex-row items-start justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={member.avatar_url || undefined} alt={member.full_name || "Team member"} />
            <AvatarFallback className="bg-alphabits-teal text-white">
              {getInitials(member.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base text-white">{member.full_name || "Unnamed Member"}</CardTitle>
            <p className="text-sm text-white/70">{member.role || "Member"}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-alphabits-darkblue border-white/20 text-white">
            {member.email && (
              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                <Mail className="h-4 w-4 mr-2" /> Email
              </DropdownMenuItem>
            )}
            {member.phone && (
              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                <Phone className="h-4 w-4 mr-2" /> Call
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              <MessageSquare className="h-4 w-4 mr-2" /> Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {member.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-white/70" />
              <span className="text-white truncate">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-white/70" />
              <span className="text-white">{member.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Members;
