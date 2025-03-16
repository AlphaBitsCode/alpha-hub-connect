
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  LogOut,
  PlusCircle,
  Bot,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarThemeToggle } from "@/components/SidebarThemeToggle";
import { SidebarUserProfile } from "@/components/SidebarUserProfile";
import { useTheme } from "@/hooks/use-theme";

export function AlphaBitsSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <FolderKanban className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
      ),
    },
    {
      label: "New Project",
      href: "/new-project",
      icon: (
        <PlusCircle className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
      ),
    },
    {
      label: "Team Members",
      href: "/members",
      icon: (
        <Users className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
      ),
    },
    {
      label: "AI Assistants",
      href: "/assistants",
      icon: (
        <Bot className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className={cn(
          "h-5 w-5 flex-shrink-0",
          isDarkMode ? "text-white" : "text-gray-700"
        )} />
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
    navigate("/auth");
  };
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };
  
  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  className="sidebar-link"
                  onClick={handleNavigation(link.href)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-px w-full bg-gray-200 dark:bg-white/20 my-2"></div>
            
            {/* Theme Toggle - Only show when sidebar is open */}
            {open && <SidebarThemeToggle isOpen={open} />}
            
            <SidebarUserProfile 
              pathname={location.pathname} 
              onNavigate={handleNavigation} 
            />
            
            <div
              className={cn(
                "flex items-center justify-start gap-3 py-2 px-2 rounded-lg cursor-pointer transition-all group/sidebar",
                "dark:hover:bg-white/10",
                "hover:bg-gray-100"
              )}
              onClick={handleSignOut}
            >
              <LogOut className={cn(
                "h-5 w-5 flex-shrink-0",
                isDarkMode ? "text-white" : "text-gray-700"
              )} />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
                    isDarkMode ? "text-white" : "text-gray-700"
                  )}
                >
                  Logout
                </motion.span>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* Toggle button for sidebar */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 left-[76px] z-50 p-1 rounded-full shadow-md transition-all",
          open ? "left-[261px]" : "left-[76px]",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700 border border-gray-200"
        )}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </>
  );
}

export const Logo = () => {
  const { isDarkMode } = useTheme();
  const logoSrc = isDarkMode 
    ? "https://alphabits.team/images/AB_Logo_white_icon.png"
    : "https://alphabits.team/images/AB_Logo_white_icon.png"; // You may want a dark logo for light mode

  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <img
        src={logoSrc}
        alt="Alpha Hub Logo"
        className="h-8 w-8 flex-shrink-0 rounded-md"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "font-medium whitespace-pre text-lg",
          isDarkMode ? "text-white" : "text-gray-800"
        )}
      >
        Alpha Hub
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  const { isDarkMode } = useTheme();
  const logoSrc = isDarkMode 
    ? "https://alphabits.team/images/AB_Logo_white_icon.png"
    : "https://alphabits.team/images/AB_Logo_white_icon.png"; // You may want a dark logo for light mode

  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <img
        src={logoSrc}
        alt="Alpha Hub Logo"
        className="h-8 w-8 flex-shrink-0 rounded-md"
      />
    </Link>
  );
};
