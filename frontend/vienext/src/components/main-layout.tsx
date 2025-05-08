"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import type { Language } from "@/lib/translations"

interface MainLayoutProps {
  children: React.ReactNode
  language: Language
  setLanguage: (language: Language) => void
}

// Mock user data
const userData = {
  id: "1",
  name: "Dat Duc Nguyen",
  username: "datducnguyen",
  avatar: "/api/placeholder?height=128&width=128",
  status: "newbie in new world",
  isOnline: true,
  plan: "enterprise" as "free" | "premium" | "enterprise",
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar userPlan={userData.plan} userData={userData} />
      <div className="ml-64 p-6 md:p-8">{children}</div>
    </div>
  )
}
