
import { useState } from "react";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Mail, Phone, Github } from "lucide-react";

interface MemberProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const { data: profile, isLoading } = useQuery({
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
      
      return data as MemberProfile;
    },
    enabled: !!user?.id,
  });

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: `Theme changed to ${newTheme}`,
    });
  };

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-white/10 p-1 text-white mb-6">
                <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-white/20">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account" className="rounded-md data-[state=active]:bg-white/20">
                  Account
                </TabsTrigger>
                <TabsTrigger value="appearance" className="rounded-md data-[state=active]:bg-white/20">
                  Appearance
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Settings */}
              <TabsContent value="profile">
                <ProfileSettings profile={profile} />
              </TabsContent>
              
              {/* Account Settings */}
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              
              {/* Appearance Settings */}
              <TabsContent value="appearance">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Appearance</CardTitle>
                    <CardDescription className="text-white/70">
                      Customize how the app looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Dark Theme</Label>
                        <p className="text-sm text-white/70">
                          Switch between light and dark themes.
                        </p>
                      </div>
                      <Switch 
                        checked={isDarkMode} 
                        onCheckedChange={toggleTheme} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const ProfileSettings = ({ profile }: { profile: MemberProfile | null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || "",
    avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || "",
    role: profile?.role || "Member",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('members')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          role: formData.role,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
          <CardDescription className="text-white/70">
            Manage your personal information and how it appears to others.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url || undefined} alt={formData.full_name} />
              <AvatarFallback className="bg-alphabits-teal text-white text-lg">
                {formData.full_name
                  ? formData.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
                  : "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="glass border-white/20 text-white placeholder:text-white/60 mt-1"
              />
              <p className="text-xs text-white/60 mt-1">
                Enter the URL of your profile picture
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">Full Name</Label>
            <Input 
              id="full_name"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              placeholder="John Doe"
              className="glass border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input 
              id="email"
              value={user?.email || ""}
              disabled
              className="glass border-white/20 text-white/70 cursor-not-allowed"
            />
            <p className="text-xs text-white/60">
              Your email address is managed through your account settings
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">Role</Label>
            <Input 
              id="role"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              placeholder="e.g. Developer, Designer, Project Manager"
              className="glass border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white w-full"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Profile
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const AccountSettings = () => {
  const { user, signIn, signOut } = useAuth();
  const { toast } = useToast();
  const [resetEmail, setResetEmail] = useState(user?.email || "");
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsResetting(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/settings`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signIn("google");
    } catch (error: any) {
      toast({
        title: "Error connecting with Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Reset Password</CardTitle>
          <CardDescription className="text-white/70">
            Change your account password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordReset}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white">Email Address</Label>
              <Input 
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="glass border-white/20 text-white"
                placeholder="Enter your email"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white w-full"
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Reset Email
                </>
              ) : (
                "Send Password Reset Email"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Linked Accounts</CardTitle>
          <CardDescription className="text-white/70">
            Connect your accounts for easier login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-white" />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-white/70 text-sm">{user?.email}</p>
              </div>
            </div>
            <p className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">Connected</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <div>
                <p className="text-white font-medium">Google</p>
                <p className="text-white/70 text-sm">Connect your Google account</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="glass border-white/20 text-white hover:bg-white/10"
              onClick={handleGoogleAuth}
            >
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Sign Out</CardTitle>
          <CardDescription className="text-white/70">
            Sign out from all devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
