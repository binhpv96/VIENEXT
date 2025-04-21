"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  language: "en" | "vi"
  setLanguage: (language: "en" | "vi") => void
}

export function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-slate-100 dark:bg-slate-700" : ""}
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("vi")}
          className={language === "vi" ? "bg-slate-100 dark:bg-slate-700" : ""}
        >
          <span className="mr-2">🇻🇳</span> Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
