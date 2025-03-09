
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

export function AlphaBitsSidebar() {
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
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <LogOut className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  
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
        <div>
          <SidebarLink
            link={{
              label: "John Doe",
              href: "/profile",
              icon: (
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-white text-alphabits-purple flex items-center justify-center font-bold">
                  JD
                </div>
              ),
            }}
          />
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
      <div className="h-6 w-6 bg-white rounded-md flex-shrink-0 flex items-center justify-center">
        <div className="h-4 w-4 bg-alphabits-purple rounded-sm"></div>
      </div>
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
      <div className="h-6 w-6 bg-white rounded-md flex-shrink-0 flex items-center justify-center">
        <div className="h-4 w-4 bg-alphabits-purple rounded-sm"></div>
      </div>
    </Link>
  );
};
