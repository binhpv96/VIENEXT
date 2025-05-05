"use client"

import { useState } from "react"
import type React from "react"
import "@/app/globals.css"
import { MainLayout } from "@/components/main-layout"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AppProvider } from "@/contexts/app-context"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const pathname = usePathname()
  
  // Chỉ hiển thị MainLayout nếu không phải trang đăng nhập
  const isAuthPage = pathname === "/"
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AppProvider>
              {isAuthPage ? (
                children
              ) : (
                <MainLayout language={language} setLanguage={setLanguage}>
                  {children}
                </MainLayout>
              )}
            </AppProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}