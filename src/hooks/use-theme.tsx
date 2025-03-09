import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return newTheme;
  };

  // Apply theme on initial load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggleTheme
  };
}