"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Bookmark, MessageSquare, Heart, Share2, Clock, Star, Crown, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Mock user data
const userData = {
  id: "1",
  name: "Dat Duc Nguyen",
  username: "datducnguyen",
  avatar: "/placeholder.svg?height=128&width=128",
  status: "newbie in new world",
  isOnline: true,
  plan: "premium" as "free" | "premium" | "enterprise",
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const { t } = useLanguage()

  const getPlanBadge = () => {
    switch (userData.plan) {
      case "premium":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-yellow-400 text-yellow-500 dark:border-yellow-500 dark:text-yellow-400"
          >
            <Star className="mr-1 h-3 w-3" />
            {t.premium}
          </Badge>
        )
      case "enterprise":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-purple-400 text-purple-500 dark:border-purple-500 dark:text-purple-400"
          >
            <Crown className="mr-1 h-3 w-3" />
            {t.enterprise}
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg"></div>
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={userData.avatar || "/placeholder.svg"}
              alt="Avatar"
              className="h-32 w-32 rounded-full border-4 border-white object-cover dark:border-slate-900"
            />
            <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white bg-green-500 dark:border-slate-900"></span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            {t.editInfo || "Edit Info"}
          </Button>
        </div>
      </div>

      <div className="mt-20 flex items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{userData.name}</h1>
        {getPlanBadge()}
      </div>
      <p className="text-slate-500 dark:text-slate-400">@{userData.username}</p>
      <p className="mt-2 italic text-slate-600 dark:text-slate-300">{userData.status}</p>

      <div className="mt-6 flex space-x-4">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">254</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.following || "Following"}</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">1.2k</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.followers || "Followers"}</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">45</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.posts || "Posts"}</p>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-5">
            <TabsTrigger value="posts">{t.posts || "Posts"}</TabsTrigger>
            <TabsTrigger value="following">{t.following || "Following"}</TabsTrigger>
            <TabsTrigger value="memories">{t.memories || "Memories"}</TabsTrigger>
            <TabsTrigger value="saved">{t.saved || "Saved"}</TabsTrigger>
            <TabsTrigger value="liked">{t.liked || "Liked"}</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={userData.avatar || "/placeholder.svg"}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-sm">{userData.name}</CardTitle>
                          <CardDescription className="text-xs">
                            2 {t.hoursAgo?.replace("{hours}", "") || "hours ago"}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      Chia sẻ một số kinh nghiệm làm việc với React và Next.js mới nhất...
                    </p>
                    <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        src="/placeholder.svg?height=160&width=320"
                        alt="Post image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Heart className="mr-1 h-4 w-4" />
                          <span>124</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          <span>36</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Share2 className="mr-1 h-4 w-4" />
                        <span>{t.share || "Share"}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline">{t.viewMore || "View More"}</Button>
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`/placeholder.svg?height=64&width=64&text=User${item}`}
                        alt="User avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {t.user || "User"} {item}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">@user{item}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {item % 2 === 0
                            ? t.softwareEngineer || "Software Engineer"
                            : t.uiDesigner || "UI/UX Designer"}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {t.following || "Following"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline">{t.viewMore || "View More"}</Button>
            </div>
          </TabsContent>

          <TabsContent value="memories" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">1 {t.yearAgo || "year ago"}</CardTitle>
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <CardDescription>15 {t.may || "May"}, 2022</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        src={`/placeholder.svg?height=160&width=320&text=Memory${item}`}
                        alt="Memory"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t.memoryAbout || "Memory about trip"} {item} {t.yearAgo || "year ago"}...
                    </p>
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      {t.shareAgain || "Share Again"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {userData.plan === "free" && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="mb-4 rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                    <Lock className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                    {t.upgradeToViewMemories || "Upgrade to view more memories"}
                  </h3>
                  <p className="mb-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    {t.memoriesUpgradeInfo || "Premium and Enterprise users can view and store unlimited memories."}
                  </p>
                  <Button>
                    <Star className="mr-2 h-4 w-4" />
                    {t.upgradeNow || "Upgrade Now"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`/placeholder.svg?height=32&width=32&text=U${item}`}
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-sm">
                            {t.user || "User"} {item}
                          </CardTitle>
                          <CardDescription className="text-xs">{t.savedDaysAgo || "Saved 3 days ago"}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      {t.goodArticleAbout || "Good article about"}{" "}
                      {item % 2 === 0 ? t.technology || "technology" : t.design || "design"}{" "}
                      {t.thatYouSaved || "that you saved"}...
                    </p>
                    <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        src={`/placeholder.svg?height=160&width=320&text=Saved${item}`}
                        alt="Saved post"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`/placeholder.svg?height=32&width=32&text=U${item}`}
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-sm">
                            {t.user || "User"} {item}
                          </CardTitle>
                          <CardDescription className="text-xs">{t.likedDaysAgo || "Liked 5 days ago"}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      {t.likedPostContent || "Content of the post you liked about"}{" "}
                      {item % 3 === 0
                        ? t.technology || "technology"
                        : item % 3 === 1
                          ? t.design || "design"
                          : t.personalDevelopment || "personal development"}
                      ...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Thêm component Lock cho phần Memories
function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
