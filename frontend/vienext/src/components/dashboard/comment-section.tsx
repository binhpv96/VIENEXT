"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Heart, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PostUser {
  name: string
  username: string
  avatar: string
  verified: boolean
}

interface Comment {
  id: number
  user: PostUser
  content: string
  time: string
  likes: number
}

interface CommentSectionProps {
  postId: number | null
  post: {
    id: number
    user: PostUser
    content: string
    image: string
    time: string
    comments: Comment[]
  } | null
  onClose: () => void
  onAddComment: (postId: number, comment: string) => void
}

export function CommentSection({ postId, post, onClose, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  if (!post || postId === null) return null

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

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(postId, newComment)
    setNewComment("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6 dark:bg-slate-900">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <h2 className="mb-4 text-xl font-semibold">Bình luận</h2>

        <div className="mb-4 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
            <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <p className="font-medium">{post.user.name}</p>
              {post.user.verified && <VerifiedBadge />}
            </div>
            <p className="text-xs text-slate-500">
              @{post.user.username} • {post.time}
            </p>
          </div>
        </div>

        <p className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">{post.content}</p>

        <div className="mb-6 space-y-4">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar>
                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{comment.user.name}</p>
                  {comment.user.verified && <VerifiedBadge />}
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="mt-1 flex items-center space-x-4 text-xs text-slate-500">
                  <span>{comment.time}</span>
                  <button className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white">
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="hover:text-slate-900 dark:hover:text-white">Trả lời</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=DDN" alt="Profile" />
            <AvatarFallback>DDN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && postId !== null) {
                  handleSubmitComment()
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
                Đăng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
