"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("authToken", token)
      router.push("/dashboard")
    } else {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      router.push("/auth")
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <p className="text-lg text-slate-900 dark:text-white">Đang xử lý đăng nhập...</p>
    </div>
  )
}