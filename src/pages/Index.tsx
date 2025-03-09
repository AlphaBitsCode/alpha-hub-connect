
import { useEffect } from 'react';
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface IndexProps {
  onProfileCheck?: (isComplete: boolean) => void;
}

const Index = ({ onProfileCheck }: IndexProps) => {
  const { user } = useAuth();

  // Query to fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Query to fetch user's projects
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get projects where user is a member
      const { data: memberProjects, error: memberError } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('member_id', user.id);
      
      if (memberError) {
        console.error("Error fetching member projects:", memberError);
        return [];
      }
      
      if (!memberProjects.length) return [];
      
      // Get actual project details
      const projectIds = memberProjects.map(pm => pm.project_id);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        return [];
      }
      
      return projectsData;
    },
    enabled: !!user?.id,
  });

  // Check if profile is complete
  useEffect(() => {
    if (profile && onProfileCheck) {
      const isComplete = !!profile.full_name && !!profile.email;
      onProfileCheck(isComplete);
    }
  }, [profile, onProfileCheck]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-alphabits-darkblue via-alphabits-blue to-alphabits-teal">
      <div className="flex flex-1">
        <AlphaBitsSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">
              Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">Active Projects</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-white/70">
                    Projects currently in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    {projects?.filter(p => p.status === 'In Progress').length || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">Completed Projects</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-white/70">
                    Successfully completed projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    {projects?.filter(p => p.status === 'Completed').length || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">Upcoming Deadlines</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-white/70">
                    Projects due in the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    {projects?.filter(p => {
                      if (!p.deadline) return false;
                      const deadline = new Date(p.deadline);
                      const now = new Date();
                      const diff = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      return diff <= 7 && diff >= 0;
                    }).length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects?.slice(0, 4).map((project) => (
                <Card key={project.id} className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-800 dark:text-white">{project.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-white/70">
                      Client: {project.client}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-white/90">{project.description || 'No description'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-white/70">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'Completed' ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 
                          project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                          'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      {project.deadline && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-white/70">Deadline:</span>
                          <span className="text-gray-700 dark:text-white/90">
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-white/70">Progress:</span>
                        <div className="w-32 h-2 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-alphabits-teal rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!projects || projects.length === 0) && (
                <Card className="glass-card border-white/20 col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-700 dark:text-white/90">No projects found. Create your first project!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
