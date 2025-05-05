"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  User,
  Settings,
  Bell,
  Bookmark,
  Calendar,
  MessageSquare,
  Heart,
  Wallet,
  ChevronRight,
  Star,
  Crown,
  Globe,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserProfile } from "@/components/user-profile"
import { UserProfileDetailed } from "@/components/user-profile-detailed"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/app-context"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"

interface SidebarProps {
  userPlan: "free" | "premium" | "enterprise"
  userData: {
    id: string
    name: string
    username: string
    avatar: string
    status: string
    isOnline: boolean
  }
}

export function Sidebar({ userPlan, userData }: SidebarProps) {
  const pathname = usePathname()
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showDetailedProfile, setShowDetailedProfile] = useState(false)
  const { toggleTheme } = useApp()
  const { language, setLanguage, t } = useLanguage()
  const { theme } = useTheme()

  const toggleUserProfile = () => {
    if (showDetailedProfile) {
      setShowDetailedProfile(false)
      return
    }

    if (showUserProfile) {
      setShowUserProfile(false)
      setShowDetailedProfile(true)
    } else {
      setShowUserProfile(true)
    }
  }

  const closeProfiles = () => {
    setShowUserProfile(false)
    setShowDetailedProfile(false)
  }

  const navItems = [
    {
      href: "/dashboard",
      label: t.home || "Trang chủ",
      icon: Home,
      badge: null,
    },
    {
      href: "/profile",
      label: t.profile || "Hồ sơ",
      icon: User,
      badge: null,
    },
    {
      href: "/messages",
      label: t.messages || "Tin nhắn",
      icon: MessageSquare,
      badge: "12",
    },
    {
      href: "/notifications",
      label: t.notifications || "Thông báo",
      icon: Bell,
      badge: "5",
    },
    {
      href: "/bookmarks",
      label: t.bookmarks || "Đã lưu",
      icon: Bookmark,
      badge: null,
    },
    {
      href: "/memories",
      label: t.memories || "Kỷ niệm",
      icon: Calendar,
      badge: null,
    },
    {
      href: "/likes",
      label: t.likes || "Đã thích",
      icon: Heart,
      badge: null,
    },
    {
      href: "/wallet",
      label: t.wallet || "Ví tiền",
      icon: Wallet,
      badge: null,
    },
    {
      href: "/settings",
      label: t.settings || "Cài đặt",
      icon: Settings,
      badge: null,
    },
  ]

  const getPlanIcon = () => {
    switch (userPlan) {
      case "premium":
        return <Star className="h-4 w-4 text-yellow-400" />
      case "enterprise":
        return <Crown className="h-4 w-4 text-purple-400" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-white shadow-md dark:bg-slate-900">
        <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TechAuth</span>
          </div>
          {getPlanIcon() && <div className="ml-2">{getPlanIcon()}</div>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeProfiles}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                pathname === item.href && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && <Badge className="ml-auto bg-red-500 hover:bg-red-600">{item.badge}</Badge>}
            </Link>
          ))}
        </nav>

        {/* Language and Theme Controls */}
        <div className="border-t border-slate-200 p-2 dark:border-slate-800">
          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>{t.language || "Ngôn ngữ"}</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setLanguage("vi")}
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  language === "vi"
                    ? "bg-slate-200 font-medium text-slate-900 dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                )}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  language === "en"
                    ? "bg-slate-200 font-medium text-slate-900 dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                )}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>{t.theme || "Giao diện"}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-900 dark:bg-slate-700 dark:text-white"
            >
              {theme === "dark" ? t.light || "Sáng" : t.dark || "Tối"}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 p-2 dark:border-slate-800">
          <button
            onClick={toggleUserProfile}
            className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <div className="relative">
              <img
                src={userData.avatar || "/placeholder.svg?height=40&width=40"}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
                  userData.isOnline ? "bg-green-500" : "bg-slate-400",
                )}
              ></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-slate-900 dark:text-white">{userData.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userData.status}</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showUserProfile && (
          <motion.div
            className="fixed inset-y-0 left-64 z-30 w-72 bg-white shadow-lg dark:bg-slate-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserProfile userData={userData} userPlan={userPlan} onClose={() => setShowUserProfile(false)} />
          </motion.div>
        )}

        {showDetailedProfile && (
          <motion.div
            className="fixed inset-y-0 left-64 z-30 w-80 bg-white shadow-lg dark:bg-slate-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserProfileDetailed
              userData={userData}
              userPlan={userPlan}
              onClose={() => setShowDetailedProfile(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when profile is open */}
      {(showUserProfile || showDetailedProfile) && (
        <div className="fixed inset-0 z-20 bg-black/20 dark:bg-black/50" onClick={closeProfiles} />
      )}
    </>
  )
}
