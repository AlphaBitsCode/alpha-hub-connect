
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (provider: "google" | "email" | "phone", options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle initial session and auth state changes
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Handle OAuth callback and hash params
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          toast({
            title: "Authentication error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        } else if (session) {
          setSession(session);
          setUser(session.user);
          // Only navigate to root if we're on the auth page
          if (window.location.pathname === '/auth') {
            navigate('/');
          }
        }
      } catch (err) {
        console.error("Authentication initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const signIn = async (provider: "google" | "email" | "phone", options?: any) => {
    try {
      setLoading(true);
      
      if (provider === "google") {
        toast({
          title: "Redirecting to Google",
          description: "Please wait while we connect to Google...",
        });
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `https://hub.alphabits.team/`, // Updated redirect URL
          },
        });
        
        if (error) throw error;
      } else if (provider === "email") {
        const { error } = await supabase.auth.signInWithOtp({
          email: options.email,
          options: {
            emailRedirectTo: `https://hub.alphabits.team/`, // Updated redirect URL
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Magic link sent!",
          description: "Check your email for the login link",
        });
      } else if (provider === "phone") {
        const { error } = await supabase.auth.signInWithOtp({
          phone: options.phone,
        });
        
        if (error) throw error;
        
        toast({
          title: "OTP sent!",
          description: "Check your phone for the verification code",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
