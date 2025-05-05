"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useTheme } from "next-themes"

type Language = "en" | "vi"
type ThemeMode = "light" | "dark" | "system"

interface AppContextType {
  language: Language
  setLanguage: (language: Language) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")
  const { theme, setTheme } = useTheme()

  // Lấy ngôn ngữ từ localStorage nếu có
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}


// Đơn giản hóa AppContext để chỉ chứa hàm `toggleTheme`
// Sử dụng `useTheme` từ next-themes để thực hiện chức năng chuyển đổi theme

// "use client"

// import type React from "react"
// import { createContext, useContext } from "react"
// import { useTheme } from "next-themes"

// type AppContextType = {
//   toggleTheme: () => void
// }

// const AppContext = createContext<AppContextType | undefined>(undefined)

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const { theme, setTheme } = useTheme()

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark")
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         toggleTheme,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useApp() {
//   const context = useContext(AppContext)
//   if (context === undefined) {
//     throw new Error("useApp must be used within an AppProvider")
//   }
//   return context
// }
