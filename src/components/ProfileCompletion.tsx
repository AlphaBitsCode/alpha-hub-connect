import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MemberProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
}

export const ProfileCompletion = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data as MemberProfile;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: { full_name: string; email: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('members')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          email: formData.email,
        });
      
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsOpen(false);
      toast({
        title: "Profile updated",
        description: "Thank you for completing your profile",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to continue",
        variant: "destructive",
      });
      return;
    }
    
    updateProfileMutation.mutate(formData);
  };

  // If the profile is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-alphabits-teal"></div>
      </div>
    );
  }

  // If the profile is complete, render children
  if (profile?.full_name && profile?.email) {
    return children;
  }

  // Otherwise show the profile completion dialog
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Complete your profile</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Please provide the following information to complete your profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-900 dark:text-white">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!user?.email}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg shadow-md text-center max-w-md w-full bg-white dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Alpha Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please complete your profile to continue.</p>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </>
  );
};
