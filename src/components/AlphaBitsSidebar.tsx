
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  LogOut,
  PlusCircle,
  Bot
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarThemeToggle } from "@/components/SidebarThemeToggle";
import { SidebarUserProfile } from "@/components/SidebarUserProfile";

export function AlphaBitsSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <FolderKanban className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "New Project",
      href: "/new-project",
      icon: (
        <PlusCircle className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Team Members",
      href: "/members",
      icon: (
        <Users className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Assistants",
      href: "/assistants",
      icon: (
        <Bot className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };
  
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link} 
                className={cn(
                  "sidebar-link",
                  location.pathname === link.href && "bg-white/10 font-medium"
                )}
                onClick={handleNavigation(link.href)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-px w-full bg-white/20 my-2"></div>
          
          {/* Theme Toggle - Only show when sidebar is open */}
          {open && <SidebarThemeToggle isOpen={open} />}
          
          <SidebarUserProfile 
            pathname={location.pathname} 
            onNavigate={handleNavigation} 
          />
          
          <div
            className="flex items-center justify-start gap-3 py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all group/sidebar"
            onClick={handleSignOut}
          >
            <LogOut className="text-white h-5 w-5 flex-shrink-0" />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            )}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <img
        src="https://alphabits.team/images/AB_Logo_white_icon.png"
        alt="Alpha Hub Logo"
        className="h-8 w-8 flex-shrink-0 rounded-md"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre text-lg"
      >
        Alpha Hub
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <img
        src="https://alphabits.team/images/AB_Logo_white_icon.png"
        alt="Alpha Hub Logo"
        className="h-8 w-8 flex-shrink-0 rounded-md"
      />
    </Link>
  );
};
