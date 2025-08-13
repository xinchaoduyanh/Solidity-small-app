"use client";

import React, { useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  type Attribute,
} from "next-themes";

interface ClientThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ClientThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ClientThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Only render theme provider after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show minimal loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Simple loading without complex animations - match server render */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  );
}
