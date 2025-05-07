"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SuggestedUser {
  id: number
  name: string
  username: string
  avatar: string
  mutual: number
  verified: boolean
}

interface SuggestedUsersProps {
  users: SuggestedUser[]
}

export function SuggestedUsers({ users }: SuggestedUsersProps) {
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
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Gợi ý cho bạn</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{user.name}</p>
                  {user.verified && <VerifiedBadge />}
                </div>
                <p className="text-xs text-slate-500">{user.mutual} bạn chung</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Theo dõi
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
