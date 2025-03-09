import React from "react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarUserProfileProps {
  pathname: string;
  onNavigate: (path: string) => (e: React.MouseEvent) => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ 
  pathname, 
  onNavigate 
}) => {
  const { user } = useAuth();
  
  return (
    <SidebarLink
      link={{
        label: user?.email?.split('@')[0] || 'User',
        href: "/settings",
        icon: (
          <div className="h-7 w-7 flex-shrink-0 rounded-full bg-alphabits-teal text-white flex items-center justify-center font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        ),
      }}
      className={cn(
        pathname === "/settings" && "bg-white/10 font-medium"
      )}
      onClick={onNavigate("/settings")}
    />
  );
};