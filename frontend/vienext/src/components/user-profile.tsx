"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Edit3, Circle, Star, Crown, Heart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThoughtBubble } from "@/components/thought-bubble"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"

interface UserProfileProps {
  userData: {
    id: string
    name: string
    username: string
    avatar: string
    status: string
    isOnline: boolean
  }
  userPlan: "free" | "premium" | "enterprise"
  onClose: () => void
}

export function UserProfile({ userData, userPlan, onClose }: UserProfileProps) {
  const [status, setStatus] = useState(userData.status)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [showThought, setShowThought] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const thoughtTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // const { language } = useApp()
  const { language } = useLanguage()
  const t = translations[language]

  // Hàm xử lý khi người dùng thay đổi trạng thái
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value)
  }

  // Lưu trạng thái mới
  const saveStatus = () => {
    setIsEditingStatus(false)
    // Đây là nơi bạn có thể gọi API để lưu trạng thái mới
  }

  // Hiệu ứng hiển thị bong bóng suy nghĩ
  useEffect(() => {
    // Hiển thị bong bóng suy nghĩ sau một khoảng thời gian
    thoughtTimeoutRef.current = setTimeout(() => {
      setShowThought(true)
    }, 1000)

    return () => {
      if (thoughtTimeoutRef.current) {
        clearTimeout(thoughtTimeoutRef.current)
      }
    }
  }, [status])

  // Mở dialog để chỉnh sửa suy nghĩ
  const openEditThoughtDialog = () => {
    setIsDialogOpen(true)
  }

  const getPlanBadge = () => {
    switch (userPlan) {
      case "premium":
        return (
          <div className="flex items-center space-x-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Star className="h-3 w-3" />
            <span>{t.premium}</span>
          </div>
        )
      case "enterprise":
        return (
          <div className="flex items-center space-x-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <Crown className="h-3 w-3" />
            <span>{t.enterprise}</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Circle className="h-3 w-3" />
            <span>{t.free}</span>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t.personalInfo || "persional infor"}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative mb-6">
          <div className="h-24 w-full rounded-t-lg bg-gradient-to-r from-purple-600 to-blue-500"></div>
          <div className="absolute -bottom-10 left-4">
            <div className="relative">
              <img
                src={userData.avatar || "/placeholder.svg?height=80&width=80"}
                alt="Avatar"
                className="h-20 w-20 rounded-full border-4 border-white object-cover dark:border-slate-900"
              />

              {/* Bong bóng suy nghĩ */}
              <ThoughtBubble thought={status} isVisible={showThought} onEdit={openEditThoughtDialog} />

              <span
                className={cn(
                  "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900",
                  userData.isOnline ? "bg-green-500" : "bg-slate-400",
                )}
              ></span>
            </div>
          </div>
          <div className="absolute -bottom-10 right-4">{getPlanBadge()}</div>
        </div>

        <div className="mt-12 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userData.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{userData.username}</p>
          </div>

          <div className="flex items-center space-x-2">
            {isEditingStatus ? (
              <div className="flex w-full items-center space-x-2">
                <input
                  type="text"
                  value={status}
                  onChange={handleStatusChange}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={t.setYourStatus}
                  autoFocus
                />
                <Button size="sm" onClick={saveStatus}>
                  {t.save}
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm italic text-slate-600 dark:text-slate-300">{status}</p>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingStatus(true)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4">
            <div className="rounded-lg bg-slate-100 p-3 text-center dark:bg-slate-800">
              <p className="text-lg font-bold text-slate-900 dark:text-white">254</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.following}</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-3 text-center dark:bg-slate-800">
              <p className="text-lg font-bold text-slate-900 dark:text-white">1.2k</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.followers}</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-3 text-center dark:bg-slate-800">
              <p className="text-lg font-bold text-slate-900 dark:text-white">45</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.posts}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">{t.recentActivity}</h4>

            <div className="space-y-2">
              <motion.div
                className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Heart className="m-1.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {t.likedPost} <span className="font-medium">Minh Anh</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.hoursAgo.replace("{hours}", "2")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30">
                    <MessageSquare className="m-1.5 h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {t.commentedPost} <span className="font-medium">Hoàng Nam</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.hoursAgo.replace("{hours}", "5")}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
          {t.viewFullProfile}
        </Button>
      </div>

      {/* Dialog chỉnh sửa suy nghĩ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.editThought}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={status}
              onChange={handleStatusChange}
              placeholder={t.whatAreYouThinking}
              className="border-slate-300 dark:border-slate-700"
            />
            <p className="mt-2 text-xs text-slate-500">{t.thoughtDescription}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                saveStatus()
                setIsDialogOpen(false)
              }}
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
