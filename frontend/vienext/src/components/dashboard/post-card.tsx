"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

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

interface PostCardProps {
  post: {
    id: number
    user: PostUser
    content: string
    image: string
    time: string
    likes: number
    comments: Comment[]
    shares: number
    liked: boolean
    saved: boolean
  }
  onLike: (postId: number) => void
  onSave: (postId: number) => void
  onShowComments: (postId: number) => void
  onShowPostDetail: (postId: number) => void
}

export function PostCard({ post, onLike, onSave, onShowComments, onShowPostDetail }: PostCardProps) {
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <div className="font-medium">{post.user.name}</div>
                  {post.user.verified && <VerifiedBadge />}
                </div>
                <div className="text-xs text-slate-500">
                  @{post.user.username} • {post.time}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="mb-4">{post.content}</p>
          {post.image && (
            <div className="cursor-pointer overflow-hidden rounded-lg" onClick={() => onShowPostDetail(post.id)}>
              <img src={post.image} alt="Post" className="w-full object-cover" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={post.liked ? "text-red-500" : ""}
          >
            <Heart className={`mr-1 h-4 w-4 ${post.liked ? "fill-red-500" : ""}`} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShowComments(post.id)}>
            <MessageSquare className="mr-1 h-4 w-4" />
            {post.comments?.length || 0}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-1 h-4 w-4" />
            {post.shares}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
            className={post.saved ? "text-blue-500" : ""}
          >
            <Bookmark className={`h-4 w-4 ${post.saved ? "fill-blue-500" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
