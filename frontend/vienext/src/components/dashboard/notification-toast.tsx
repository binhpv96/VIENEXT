"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NotificationToastProps {
  show: boolean
  onClose: () => void
  onAction: () => void
}

export function NotificationToast({ show, onClose, onAction }: NotificationToastProps) {
  if (!show) return null

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

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="flex items-start space-x-3">
        <Avatar>
          <AvatarImage src="/api/placeholder?height=40&width=40&text=MA" alt="Minh Anh" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-medium">Minh Anh</p>
              <VerifiedBadge />
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm">Đã gửi cho bạn một tin nhắn mới</p>
          <p className="text-xs text-slate-500">Vừa xong</p>
        </div>
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Để sau
        </Button>
        <Button size="sm" onClick={onAction}>
          Xem ngay
        </Button>
      </div>
    </motion.div>
  )
}
