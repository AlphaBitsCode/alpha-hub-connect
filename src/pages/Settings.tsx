
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User } from "lucide-react";

const Settings = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AlphaBitsSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Manage your account settings and preferences.
              </p>
              <Button 
                onClick={() => navigate("/settings/profile")}
                className="bg-alphabits-teal hover:bg-alphabits-teal/90"
              >
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-white">Logout</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Sign out of your account.
              </p>
              <Button 
                onClick={handleSignOut} 
                disabled={loading}
                className="bg-red-500 hover:bg-red-600"
              >
                {loading ? (
                  <>
                    <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
