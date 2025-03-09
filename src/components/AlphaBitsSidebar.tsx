
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Bot 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function AlphaBitsSidebar() {
  const { signOut, user } = useAuth();
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
      label: "Team",
      href: "/team",
      icon: (
        <Users className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <MessageSquare className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: (
        <Calendar className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Assistant",
      href: "/ai-assistant",
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
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-px w-full bg-white/20 my-2"></div>
          
          <SidebarLink
            link={{
              label: user?.email?.split('@')[0] || 'User',
              href: "/profile",
              icon: (
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-white text-alphabits-darkblue flex items-center justify-center font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              ),
            }}
          />
          
          <div
            className="flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer micro-interaction"
            onClick={handleSignOut}
          >
            <LogOut className="text-white h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
              Logout
            </motion.span>
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
        className="h-6 w-6 flex-shrink-0 rounded-md"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
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
        className="h-6 w-6 flex-shrink-0 rounded-md"
      />
    </Link>
  );
};
