
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface TeamAvatarsProps {
  projectId: string;
}

export const TeamAvatars = ({ projectId }: TeamAvatarsProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // First get project members
        const { data: projectMembers, error: projectError } = await supabase
          .from('project_members')
          .select('member_id')
          .eq('project_id', projectId);
          
        if (projectError) throw projectError;
        
        if (projectMembers && projectMembers.length > 0) {
          // Then get member details
          const memberIds = projectMembers.map(pm => pm.member_id);
          const { data: members, error: membersError } = await supabase
            .from('members')
            .select('id, full_name, avatar_url')
            .in('id', memberIds);
            
          if (membersError) throw membersError;
          
          setTeamMembers(members || []);
        } else {
          // If no team members found, but we have a current user, show them
          if (user) {
            const { data: currentUser, error: currentUserError } = await supabase
              .from('members')
              .select('id, full_name, avatar_url')
              .eq('id', user.id)
              .single();
              
            if (!currentUserError && currentUser) {
              setTeamMembers([currentUser]);
            } else {
              // Fallback to at least one avatar with user email
              setTeamMembers([{
                id: user.id,
                full_name: user.email || 'Current User',
                avatar_url: null
              }]);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching team members:", error);
        // Still show current user as fallback
        if (user) {
          setTeamMembers([{
            id: user.id,
            full_name: user.email || 'Current User',
            avatar_url: null
          }]);
        }
      }
    };
    
    fetchTeamMembers();
  }, [projectId, user]);
  
  const getInitials = (name: string | null): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate a random pastel color based on the user's name
  const getAvatarColor = (userId: string): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex -space-x-2">
      {teamMembers.map((member) => (
        <Avatar key={member.id} className="border-2 border-alphabits-darkblue">
          {member.avatar_url ? (
            <AvatarImage src={member.avatar_url} alt={member.full_name || 'Team member'} />
          ) : (
            <AvatarFallback className={`${getAvatarColor(member.id)} text-white`}>
              {getInitials(member.full_name)}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
    </div>
  );
};
