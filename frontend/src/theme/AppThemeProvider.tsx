import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getTheme, Mode } from "./theme";

type Ctx = { mode: Mode; toggleMode: () => void; setMode: (m: Mode) => void };
const AppThemeContext = createContext<Ctx>({ mode: "light", toggleMode: () => {}, setMode: () => {} });

export const useAppTheme = () => useContext(AppThemeContext);

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  // Start from system preference
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  // React to system preference changes (optional)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? "dark" : "light");
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  const value = useMemo(() => ({
    mode,
    toggleMode: () => setMode(p => (p === "light" ? "dark" : "light")),
    setMode
  }), [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <AppThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppThemeContext.Provider>
  );
}
