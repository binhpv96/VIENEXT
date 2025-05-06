"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"



export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function verifyLogin() {
      try {
        const response = await apiClient.get("/user/681911a6d1a9156bf9253e96")
        console.log("Login verified:", response)
        router.push("/dashboard")
      } catch (error) {
        console.log("Error verifying login:", error)
        router.push("/")
      }
    }

    verifyLogin()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <p className="text-lg text-slate-900 dark:text-white">Đang xử lý đăng nhập...</p>
    </div>
  )
}