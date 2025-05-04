"use client"

import { useState } from "react"
import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainLayout } from "@/components/main-layout"
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
          {isAuthPage ? (
            children
          ) : (
            <MainLayout language={language} setLanguage={setLanguage}>
              {children}
            </MainLayout>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}