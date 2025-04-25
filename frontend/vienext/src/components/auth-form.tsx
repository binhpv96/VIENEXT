"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
  const [identifier, setIdentifier] = useState("") // Email hoặc số điện thoại
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("") // Username hoặc Fullname (không bắt buộc)
  const [showPassword, setShowPassword] = useState(false)
  const [isTypingIdentifier, setIsTypingIdentifier] = useState(false)
  const [isTypingPassword, setIsTypingPassword] = useState(false)
  const [botState, setBotState] = useState<
    "idle" | "typing-identifier" | "typing-password" | "password-visible" | "password-hidden"
  >("idle")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")

  const router = useRouter()
  const identifierInputRef = useRef<HTMLInputElement>(null)

  const t = translations[language]

  const updateCursorPosition = () => {
    if (!identifierInputRef.current || !isTypingIdentifier) return

    const input = identifierInputRef.current
    const caretPosition = input.selectionStart || 0

    const inputWidth = input.offsetWidth
    const charWidth = inputWidth / 30

    const x = ((caretPosition * charWidth) / inputWidth) * 2 - 1
    setCursorPosition({ x, y: 0 })
  }

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
    setIsTypingIdentifier(true)
    updateCursorPosition()
  }

  const handleIdentifierFocus = () => {
    setIsTypingIdentifier(true)
    setBotState("typing-identifier")
    updateCursorPosition()
  }

  const handleIdentifierBlur = () => {
    setIsTypingIdentifier(false)
    if (isTypingPassword) {
      setBotState(showPassword ? "password-visible" : "password-hidden")
    } else {
      setBotState("idle")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setIsTypingPassword(true)
    setBotState(showPassword ? "password-visible" : "password-hidden")
  }

  const handlePasswordFocus = () => {
    setIsTypingPassword(true)
    setBotState(showPassword ? "password-visible" : "password-hidden")
  }

  const handlePasswordBlur = () => {
    setIsTypingPassword(false)
    if (isTypingIdentifier) {
      setBotState("typing-identifier")
    } else {
      setBotState("idle")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    setBotState(!showPassword ? "password-visible" : "password-hidden")
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTypingIdentifier) {
      updateCursorPosition()
    }
  }

  const handleClick = () => {
    if (isTypingIdentifier) {
      updateCursorPosition()
    }
  }

  useEffect(() => {
    const identifierInput = identifierInputRef.current
    if (identifierInput) {
      identifierInput.addEventListener("click", updateCursorPosition)
      identifierInput.addEventListener("keyup", updateCursorPosition)

      return () => {
        identifierInput.removeEventListener("click", updateCursorPosition)
        identifierInput.removeEventListener("keyup", updateCursorPosition)
      }
    }
  }, [isTypingIdentifier])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!identifier.trim()) {
      setError(t.usernameRequired)
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError(t.passwordRequired)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier, // Email hoặc số điện thoại
          password: password,
          username: username || undefined, // Gửi username nếu có, nếu không thì để backend tạo random
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText ||"Registration failed")
      }

      setEmail(identifier) // Lưu email để dùng khi xác thực OTP
      setShowOtpInput(true) // Hiển thị form nhập OTP
      setError( "OTP has been sent to your email")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!otp.trim()) {
      setError("OTP is required")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "OTP verification failed")
      }

      router.push("/auth?mode=login") // Chuyển hướng về trang đăng nhập sau khi xác thực thành công
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isLogin) {
      return handleRegister(e) // Xử lý đăng ký
    }

    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!identifier.trim()) {
      setError(t.usernameRequired)
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError(t.passwordRequired)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || t.loginFailed)
      }

      const token = await response.text()
      localStorage.setItem("authToken", token)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || t.loginFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <AnimatedAiBot state={botState} cursorPosition={cursorPosition} />
      </div>

      {showOtpInput ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {error && (
            <div
              className={`text-sm text-center ${
                error.includes("OTP has been sent")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">{"Enter OTP"}</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={"Enter the OTP sent to your email"}
              className="pl-10"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400"
          >
            <span className="relative z-10">
              {isLoading ? t.loading : ("Verify OTP")}
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></span>
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">{t.emailOrPhoneNumber}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="identifier"
                ref={identifierInputRef}
                value={identifier}
                onChange={handleIdentifierChange}
                onFocus={handleIdentifierFocus}
                onBlur={handleIdentifierBlur}
                onClick={handleClick}
                onKeyUp={handleKeyUp}
                placeholder={t.usernamePlaceholder}
                className="pl-10"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username">{t.usernameOrFullName || "Username or Full Name"}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.usernameOrFullNamePlaceholder || "Enter your username or full name (optional)"}
                  className="pl-10"
                />
              </div>
            </div>
          )}

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

          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400"
          >
            <span className="relative z-10">
              {isLoading ? t.loading : (isLogin ? t.login : t.register)}
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></span>
          </Button>
        </form>
      )}
    </div>
  )
}