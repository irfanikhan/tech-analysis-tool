'use client'

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-6 right-6">
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ToggleTheme;
