import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

interface SidebarThemeToggleProps {
  isOpen: boolean;
}

export const SidebarThemeToggle: React.FC<SidebarThemeToggleProps> = ({ isOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between px-2 py-2 text-white">
        <div className="flex items-center gap-3">
          {isDarkMode ? (
            <Moon className="h-5 w-5 text-white" />
          ) : (
            <Sun className="h-5 w-5 text-white" />
          )}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-sm whitespace-pre"
          >
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </motion.span>
        </div>
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={toggleTheme} 
          className="data-[state=checked]:bg-alphabits-teal"
        />
      </div>
      <div className="h-px w-full bg-white/20 my-2"></div>
    </>
  );
};