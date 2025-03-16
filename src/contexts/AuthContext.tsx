
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
      }

      setUser(session?.user || null);
      setIsAdmin(session?.user?.app_metadata?.is_admin === true);
      setLoading(false);
    };

    loadUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsAdmin(session?.user?.app_metadata?.is_admin === true);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (email === "google") {
        // Handle Google sign-in
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth`
          }
        });
        
        if (error) {
          setError(error.message);
        }
      } else {
        // Handle email/password sign-in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setUser(data.user);
          setIsAdmin(data.user?.app_metadata?.is_admin === true);
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      } else {
        setUser(null);
        setIsAdmin(false);
        navigate('/auth');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAdmin,
    signIn,
    signOut,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
