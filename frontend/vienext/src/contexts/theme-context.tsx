"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useTheme } from "next-themes"

interface AppContextType {
  toggleTheme: () => void
}

const ThemeContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useApp() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
