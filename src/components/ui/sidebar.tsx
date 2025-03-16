
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.aside
        initial={{ width: 75 }}
        animate={{ width: open ? 260 : 75 }}
        className="bg-black/40 backdrop-blur-sm h-screen fixed top-0 left-0 z-50 overflow-hidden shadow-xl transition-all duration-300"
      >
        {children}
      </motion.aside>
    </SidebarContext.Provider>
  );
};

export const SidebarBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col p-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
}: {
  link: { href: string; label: string; icon: React.ReactNode };
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { open } = useSidebarContext();

  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/10 transition-all group/sidebar",
        className
      )}
      onClick={onClick}
    >
      {link.icon}
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
        >
          {link.label}
        </motion.span>
      )}
    </Link>
  );
};

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
