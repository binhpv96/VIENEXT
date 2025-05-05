"use client"

import { useState, useEffect } from "react"
import {
  X,
  Edit3,
  Circle,
  Star,
  Crown,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Wallet,
  ChevronRight,
  CreditCard,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThoughtBubble } from "@/components/thought-bubble"
import { useApp } from "@/contexts/app-context"
import { translations } from "@/lib/translations"

interface UserProfileDetailedProps {
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

export function UserProfileDetailed({ userData, userPlan, onClose }: UserProfileDetailedProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [showThought, setShowThought] = useState(false)

  const { language } = useApp()
  const t = translations[language]

  useEffect(() => {
    // Hiển thị bong bóng suy nghĩ sau một khoảng thời gian
    const timer = setTimeout(() => {
      setShowThought(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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

  const getPlanFeatures = () => {
    switch (userPlan) {
      case "premium":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t.storage}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">50GB / 100GB</span>
            </div>
            <Progress value={50} className="h-2" />

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.noAds}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.prioritySupport}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.advancedFeatures}</span>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                {t.upgradeToEnterprise}
              </Button>
            </div>
          </div>
        )
      case "enterprise":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t.storage}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">120GB / {t.unlimited}</span>
            </div>
            <Progress value={12} className="h-2" />

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.allPremiumFeatures}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.support24_7}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.customApi}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.unlimitedStorage}</span>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full text-green-600 hover:text-green-700">
                <Star className="mr-2 h-4 w-4" />
                {t.highestPlan}
              </Button>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t.storage}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">4.2GB / 5GB</span>
            </div>
            <Progress value={84} className="h-2" />

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-green-500/20">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{t.basicFeatures}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-red-500/20">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span>{t.hasAds}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="h-4 w-4 rounded-full bg-red-500/20">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span>{t.storageLimit}</span>
              </div>
            </div>

            <div className="mt-4">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                {t.upgradeToPremium}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t.detailedProfile}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <div className="h-32 w-full bg-gradient-to-r from-purple-600 to-blue-500"></div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform">
            <div className="relative">
              <img
                src={userData.avatar || "/placeholder.svg?height=96&width=96"}
                alt="Avatar"
                className="h-24 w-24 rounded-full border-4 border-white object-cover dark:border-slate-900"
              />

              {/* Bong bóng suy nghĩ */}
              <ThoughtBubble thought={userData.status} isVisible={showThought} delay={800} position="right" />

              <span
                className={cn(
                  "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900",
                  userData.isOnline ? "bg-green-500" : "bg-slate-400",
                )}
              ></span>
            </div>
          </div>
        </div>

        <div className="mt-16 px-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userData.name}</h3>
            {getPlanBadge()}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">@{userData.username}</p>
          <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">{userData.status}</p>
        </div>

        <div className="p-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">{t.info}</TabsTrigger>
              <TabsTrigger value="wallet">{t.wallet}</TabsTrigger>
              <TabsTrigger value="plan">{t.plan}</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4 space-y-4">
              <div className="space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.address}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hà Nội, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{userData.username}@example.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.phone}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">+84 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.joinDate}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">15 {t.march}, 2023</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.occupation}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.softwareEngineer}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Edit3 className="mr-2 h-4 w-4" />
                {t.editInfo}
              </Button>
            </TabsContent>

            <TabsContent value="wallet" className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 p-1">
                <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.walletBalance}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">2,450,000 đ</p>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-500" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      {t.deposit}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t.withdraw}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                  <h4 className="font-medium text-slate-900 dark:text-white">{t.paymentMethods}</h4>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                        <CreditCard className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Visa ****4289</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.expires}: 09/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button variant="ghost" className="mt-3 w-full">
                    <span className="text-sm">+ {t.addPaymentMethod}</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                  <h4 className="font-medium text-slate-900 dark:text-white">{t.transactionHistory}</h4>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t.premiumUpgrade}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">20 {t.april}, 2023</p>
                    </div>
                    <p className="font-medium text-red-500">-500,000 đ</p>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t.deposit}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">15 {t.april}, 2023</p>
                    </div>
                    <p className="font-medium text-green-500">+1,000,000 đ</p>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t.stickerPurchase}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">10 {t.april}, 2023</p>
                    </div>
                    <p className="font-medium text-red-500">-50,000 đ</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plan" className="mt-4">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">{getPlanFeatures()}</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <Button variant="outline" className="w-full" onClick={onClose}>
          {t.close}
        </Button>
      </div>
    </div>
  )
}
