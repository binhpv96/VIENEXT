"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { translations } from "@/lib/translations"
import { AnimatedAiBot } from "@/components/animated-ai-bot"

interface AuthFormProps {
  isLogin: boolean
  language: "en" | "vi"
}

export function AuthForm({ isLogin, language }: AuthFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isTypingUsername, setIsTypingUsername] = useState(false)
  const [isTypingPassword, setIsTypingPassword] = useState(false)
  const [botState, setBotState] = useState<
    "idle" | "typing-username" | "typing-password" | "password-visible" | "password-hidden"
  >("idle")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const usernameInputRef = useRef<HTMLInputElement>(null)

  const t = translations[language]

  // Update cursor position based on caret position in the username input
  const updateCursorPosition = () => {
    if (!usernameInputRef.current || !isTypingUsername) return

    const input = usernameInputRef.current
    const caretPosition = input.selectionStart || 0

    // Calculate normalized position based on input width and caret position
    const inputWidth = input.offsetWidth
    const charWidth = inputWidth / 30 // Approximate width of a character

    // Calculate x position (-1 to 1 range)
    const x = ((caretPosition * charWidth) / inputWidth) * 2 - 1

    setCursorPosition({ x, y: 0 })
  }

  // Handle username typing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setIsTypingUsername(true)
    updateCursorPosition()
  }

  // Handle username input focus
  const handleUsernameFocus = () => {
    setIsTypingUsername(true)
    setBotState("typing-username")
    updateCursorPosition()
  }

  // Handle username input blur
  const handleUsernameBlur = () => {
    setIsTypingUsername(false)
    if (isTypingPassword) {
      setBotState(showPassword ? "password-visible" : "password-hidden")
    } else {
      setBotState("idle")
    }
  }

  // Handle password typing
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setIsTypingPassword(true)
    setBotState(showPassword ? "password-visible" : "password-hidden")
  }

  // Handle password input focus
  const handlePasswordFocus = () => {
    setIsTypingPassword(true)
    setBotState(showPassword ? "password-visible" : "password-hidden")
  }

  // Handle password input blur
  const handlePasswordBlur = () => {
    setIsTypingPassword(false)
    if (isTypingUsername) {
      setBotState("typing-username")
    } else {
      setBotState("idle")
    }
  }

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    setBotState(!showPassword ? "password-visible" : "password-hidden")
  }

  // Update cursor position on key press
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    
    if (isTypingUsername) {
      updateCursorPosition()
    }
  }

  // Update cursor position on click
  const handleClick = () => {
    if (isTypingUsername) {
      updateCursorPosition()
    }
  }

  // Set up event listeners for cursor movement
  useEffect(() => {
    const usernameInput = usernameInputRef.current
    if (usernameInput) {
      usernameInput.addEventListener("click", updateCursorPosition)
      usernameInput.addEventListener("keyup", updateCursorPosition)

      return () => {
        usernameInput.removeEventListener("click", updateCursorPosition)
        usernameInput.removeEventListener("keyup", updateCursorPosition)
      }
    }
  }, [isTypingUsername])

  return (
    <div className="space-y-6">
      {/* Animated AI Bot */}
      <div className="flex justify-center mb-6">
        <AnimatedAiBot state={botState} cursorPosition={cursorPosition} />
      </div>

      <div className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">{t.fullName}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="name" placeholder={t.fullNamePlaceholder} className="pl-10" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">{t.username}</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="username"
              ref={usernameInputRef}
              value={username}
              onChange={handleUsernameChange}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              onClick={handleClick}
              onKeyUp={handleKeyUp}
              placeholder={t.usernamePlaceholder}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.password}</Label>
            {isLogin && (
              <a
                href="#"
                className="text-xs text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                {t.forgotPassword}
              </a>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              placeholder={t.passwordPlaceholder}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400">
          <span className="relative z-10">{isLogin ? t.login : t.register}</span>
          <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></span>
        </Button>
      </div>
    </div>
  )
}
