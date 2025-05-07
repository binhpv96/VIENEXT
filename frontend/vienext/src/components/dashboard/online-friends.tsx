"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageUser {
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  verified: boolean;
  lastActive: string | null;
}

interface Message {
  id: number;
  user: MessageUser;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface MessagesCardProps {
  messages: Message[];
  onChatOpen: (messageId: number) => void;
}

export function OnlineFriends({ messages, onChatOpen }: MessagesCardProps) {
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
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Bạn bè đang online</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.slice(0, 3).map((message) => (
          <div
            key={message.id}
            className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-md"
            onClick={() => onChatOpen(message.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={message.user.avatar}
                    alt={message.user.name}
                  />
                  <AvatarFallback>
                    {message.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {message.user.online && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-slate-900"></span>
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium">{message.user.name}</p>
                  {message.user.verified && <VerifiedBadge />}
                </div>
                {!message.user.online && message.user.lastActive && (
                  <p className="text-xs text-slate-500">
                    {message.user.lastActive}
                  </p>
                )}
              </div>
            </div>
            {message.unread && (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-0.5 ml-1"></span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
