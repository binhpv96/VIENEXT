"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string, image: string) => void
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [newPost, setNewPost] = useState("")
  const [newPostImage, setNewPostImage] = useState("")

  const handleSubmit = () => {
    if (!newPost.trim()) return
    onSubmit(newPost, newPostImage)
    setNewPost("")
    setNewPostImage("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 dark:bg-slate-900">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <h2 className="mb-4 text-xl font-semibold">Tạo bài viết mới</h2>

        <div className="mb-4 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=DDN" alt="Profile" />
            <AvatarFallback>DDN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Dat Duc Nguyen</p>
            <p className="text-xs text-slate-500">Đăng công khai</p>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            className="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            placeholder="Bạn đang nghĩ gì?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </div>

        {newPostImage && (
          <div className="mb-4 relative">
            <img src={newPostImage || "/placeholder.svg"} alt="Post preview" className="rounded-lg w-full h-auto" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-slate-800/50 text-white hover:bg-slate-800/70 rounded-full"
              onClick={() => setNewPostImage("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm font-medium">Thêm vào bài viết</p>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-image"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </Button>
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={!newPost.trim()}>
          Đăng
        </Button>
      </div>
    </div>
  )
}
