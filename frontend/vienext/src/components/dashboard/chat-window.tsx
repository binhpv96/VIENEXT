"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatMessage {
  id: number
  sender: string
  content: string
  time: string
  date: string
  seen: boolean
}

interface ChatUser {
  name: string
  username: string
  avatar: string
  online: boolean
  verified: boolean
  lastActive: string | null
}

interface ChatWindowProps {
  chatId: number
  user: ChatUser
  conversation: ChatMessage[]
  position: number
  onClose: (chatId: number) => void
  onSendMessage: (chatId: number, message: string) => void
  inputValue: string
  onInputChange: (chatId: number, value: string) => void
}

export function ChatWindow({
  chatId,
  user,
  conversation,
  position,
  onClose,
  onSendMessage,
  inputValue,
  onInputChange,
}: ChatWindowProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Emoji data
  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"]

  // Scroll to bottom of chat when opened or new message sent
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [conversation])

  // Format chat time
  const formatChatTime = (dateStr: string, timeStr: string) => {
    const messageDate = new Date(dateStr)
    const today = new Date()

    // Check if message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return timeStr
    }

    // Check if message is from yesterday
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Hôm qua, ${timeStr}`
    }

    // Format date for older messages
    return `${messageDate.getDate()}/${messageDate.getMonth() + 1}, ${timeStr}`
  }

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    onInputChange(chatId, (inputValue || "") + emoji)
    setShowEmojiPicker(false)
  }

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
    <div
      className="fixed bottom-0 z-10 w-80 rounded-t-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
      style={{ right: `${position * 320 + 24}px` }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {user.online && (
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-slate-900"></span>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-sm font-medium">{user.name}</p>
              {user.verified && <VerifiedBadge />}
            </div>
            {!user.online && user.lastActive && <p className="text-xs text-slate-500">{user.lastActive}</p>}
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-phone"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClose(chatId)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-60 overflow-y-auto p-3" ref={chatContainerRef}>
        {conversation.map((msg) => (
          <div key={msg.id} className={`mb-2 flex ${msg.sender === "datducnguyen" ? "justify-end" : "justify-start"}`}>
            {msg.sender !== "datducnguyen" && (
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                msg.sender === "datducnguyen"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="mt-1 text-right text-xs opacity-70">
                {formatChatTime(msg.date, msg.time)}
                {msg.sender === "datducnguyen" && <span className="ml-1">{msg.seen ? "✓✓" : "✓"}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-smile"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
              </Button>

              {showEmojiPicker && (
                <div className="absolute bottom-10 left-0 z-10 grid grid-cols-8 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {emojis.map((emoji, i) => (
                    <button
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-paperclip"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mic"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </Button>
          </div>

          <Input
            placeholder="Nhập tin nhắn..."
            className="h-8"
            value={inputValue}
            onChange={(e) => onInputChange(chatId, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSendMessage(chatId, inputValue)
              }
            }}
          />

          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onSendMessage(chatId, inputValue)}
            disabled={!inputValue?.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
