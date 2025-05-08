"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, CheckCircle, Bell, MessageSquare, Heart, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NotificationUser {
  id: number
  name: string
  avatar: string
  verified?: boolean
}

interface Notification {
  id: number
  type: "message" | "like" | "comment" | "follow" | "mention"
  user: NotificationUser
  content: string
  time: string
  unread: boolean
  postId?: number
  messageId?: number
}

interface NotificationCenterProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAsRead: (id: number) => void
  onAction: (notification: Notification) => void
  onViewAll: () => void
}

export function NotificationCenter({
  notifications,
  onClose,
  onMarkAsRead,
  onAction,
  onViewAll,
}: NotificationCenterProps) {
  const [expanded, setExpanded] = useState(false)

  // Lấy các thông báo chưa đọc
  const unreadNotifications = notifications.filter((n) => n.unread)

  // Chỉ hiển thị tối đa 2 thông báo
  const displayNotifications = expanded ? unreadNotifications.slice(0, 2) : [unreadNotifications[0]].filter(Boolean)

  // Đếm số thông báo chưa đọc
  const unreadCount = unreadNotifications.length

  // Render verified badge
  const VerifiedBadge = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle className="ml-1 h-4 w-4 text-[#00ffaa] drop-shadow-[0_0_2px_rgba(0,255,170,0.7)]" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Tài khoản đã xác minh</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  // Lấy icon cho từng loại thông báo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case "mention":
        return <Bell className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Lấy nội dung cho từng loại thông báo
  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "message":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span> đã gửi cho bạn một tin nhắn
            {notification.content && (
              <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1 italic">
                "{notification.content}"
              </span>
            )}
          </p>
        )
      case "like":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span> đã thích bài viết của bạn
          </p>
        )
      case "comment":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span> đã bình luận về bài viết của bạn
            {notification.content && (
              <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1 italic">
                "{notification.content}"
              </span>
            )}
          </p>
        )
      case "follow":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span> đã theo dõi bạn
          </p>
        )
      case "mention":
        return (
          <p className="text-sm">
            <span className="font-medium">{notification.user.name}</span> đã nhắc đến bạn
          </p>
        )
      default:
        return <p className="text-sm">{notification.content}</p>
    }
  }

  // Nếu không có thông báo chưa đọc
  if (unreadNotifications.length === 0) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 w-80 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 space-y-2">
        {displayNotifications.map((notification) => (
          <div key={notification.id} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={notification.user.avatar || "/api/placeholder"} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-medium text-sm">{notification.user.name}</p>
                  {notification.user.verified && <VerifiedBadge />}
                </div>
                {getNotificationContent(notification)}
                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>

                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      onMarkAsRead(notification.id)
                      onAction(notification)
                    }}
                  >
                    Xem ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        {unreadCount > displayNotifications.length && !expanded ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-500 hover:text-blue-600"
            onClick={() => setExpanded(true)}
          >
            Xem thêm ({unreadCount - displayNotifications.length})
          </Button>
        ) : (
          <Button className="w-full" size="sm" onClick={onViewAll}>
            Xem tất cả thông báo
          </Button>
        )}
      </div>
    </motion.div>
  )
}
