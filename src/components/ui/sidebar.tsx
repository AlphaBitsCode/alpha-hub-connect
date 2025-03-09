
"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem("theme") === "light" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: light)").matches) 
      ? 'light' 
      : 'dark'
  );

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize theme on mount
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, theme, toggleTheme }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "fixed h-screen px-4 py-4 hidden md:flex md:flex-col rounded-r-2xl z-50 shadow-xl",
        "bg-alphabits-darkblue/85 backdrop-blur-xl border border-white/10",
        className
      )}
      initial={{ width: animate ? (open ? "300px" : "70px") : "300px" }}
      animate={{
        width: animate ? (open ? "300px" : "70px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between w-full z-50",
          "bg-alphabits-darkblue/85 backdrop-blur-xl border-b border-white/10 sticky top-0"
        )}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: open ? 0 : "-100%", opacity: open ? 1 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "fixed h-full w-full inset-0 p-10 z-[100] flex flex-col justify-between backdrop-blur-xl",
            "bg-alphabits-darkblue/90 border-r border-white/10",
            className,
            open ? "block" : "hidden"
          )}
          {...props}
        >
          <div
            className="absolute right-10 top-10 z-50 text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <X />
          </div>
          {children}
        </motion.div>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: any;
}) => {
  const { open, animate } = useSidebar();

  // Fix TypeScript error by using a string/number directly
  const display = animate ? (open ? "inline-block" : "none") : "inline-block";
  const opacity = animate ? (open ? 1 : 0) : 1;

  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{ display, opacity }}
        className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const ThemeToggle = () => {
  const { open, animate, theme, toggleTheme } = useSidebar();
  
  // Fix TypeScript error by using a string/number directly
  const display = animate ? (open ? "inline-block" : "none") : "inline-block";
  const opacity = animate ? (open ? 1 : 0) : 1;
  
  return (
    <div 
      className="flex items-center justify-start gap-3 py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <Moon className="text-white h-5 w-5 flex-shrink-0" />
      ) : (
        <Sun className="text-white h-5 w-5 flex-shrink-0" />
      )}
      <motion.span
        animate={{ display, opacity }}
        className="text-white text-sm transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </motion.span>
    </div>
  );
};
