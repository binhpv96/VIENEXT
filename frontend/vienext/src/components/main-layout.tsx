"use client"

import { useState, ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Home, User, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface MainLayoutProps {
  children: ReactNode
  language: "en" | "vi"
  setLanguage: (language: "en" | "vi") => void
}

export function MainLayout({ children, language, setLanguage }: MainLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => pathname === path
  
  const navItems = [
    { path: "/", label: { en: "Home", vi: "Trang chủ" }, icon: Home },
    { path: "/dashboard", label: { en: "Dashboard", vi: "Bảng điều khiển" }, icon: Home },
    { path: "/profile", label: { en: "Profile", vi: "Hồ sơ" }, icon: User },
    { path: "/settings", label: { en: "Settings", vi: "Cài đặt" }, icon: Settings },
  ]
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl filter dark:bg-purple-500/20"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl filter dark:bg-cyan-500/20"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/10 blur-3xl filter dark:bg-blue-500/20"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex w-full items-center justify-between border-b border-slate-200 bg-white/70 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
        <Logo size="sm" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={isActive(item.path) ? "bg-blue-600 text-white" : ""}
                    size="sm"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label[language]}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-white/90 dark:bg-slate-900/90 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex h-full flex-col p-6 pt-20">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={`w-full justify-start ${isActive(item.path) ? "bg-blue-600 text-white" : ""}`}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label[language]}
                      </Button>
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Button variant="destructive" className="w-full justify-start">
                    <LogOut className="mr-2 h-5 w-5" />
                    {language === "en" ? "Logout" : "Đăng xuất"}
                  </Button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="relative z-10 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}