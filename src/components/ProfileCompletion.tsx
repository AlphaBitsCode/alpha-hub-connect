
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileCompletionProps {
  onComplete: () => void;
}

export function ProfileCompletion({ onComplete }: ProfileCompletionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: user?.email || "",
    role: "Team Member"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            full_name: data.full_name || "",
            email: data.email || user?.email || "",
            role: data.role || "Team Member"
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('members')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
        })
        .eq('id', user?.id || '');
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully",
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-alphabits-teal" />
      </div>
    );
  }

  const isProfileComplete = !!formData.full_name && !!formData.email;
  
  // If profile is already complete, call onComplete and return null
  useEffect(() => {
    if (isProfileComplete && !loading) {
      onComplete();
    }
  }, [isProfileComplete, loading, onComplete]);
  
  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass border-white/20 dark:bg-gray-900/70">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-gray-600 dark:text-white/70">
              Please provide the following information to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-gray-800 dark:text-white">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="glass border-gray-300 dark:border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/60"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 dark:text-white">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="glass border-gray-300 dark:border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/60"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-800 dark:text-white">
                Role
              </Label>
              <Input 
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Developer, Designer, Manager"
                className="glass border-gray-300 dark:border-white/20 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/60"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
