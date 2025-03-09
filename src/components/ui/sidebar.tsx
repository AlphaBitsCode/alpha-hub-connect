
"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
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

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
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
        "fixed h-screen px-4 py-4 hidden md:flex md:flex-col modern-glass-sidebar rounded-r-xl z-50",
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
          "h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between modern-glass-sidebar w-full rounded-b-xl"
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
            "fixed h-full w-full inset-0 modern-glass-sidebar p-10 z-[100] flex flex-col justify-between backdrop-blur-xl",
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
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
} & React.HTMLAttributes<HTMLAnchorElement>) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-lg hover:bg-white/10 transition-all",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {link.icon}
      {animate ? (
        <motion.span
          initial={{ opacity: open ? 1 : 0, display: open ? "block" : "none" }}
          animate={{ 
            opacity: open ? 1 : 0,
            display: open ? "block" : "none"
          }}
          className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
        >
          {link.label}
        </motion.span>
      ) : (
        <span className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre">
          {link.label}
        </span>
      )}
    </Link>
  );
};
