"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { translations } from "@/lib/translations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCodeLogin } from "@/components/qr-code-login"
import { SocialLogin } from "@/components/social-login"

export function AuthPage() {
  const [language, setLanguage] = useState<"en" | "vi">("en")
  const [isLogin, setIsLogin] = useState(true)
  const { theme } = useTheme()

  const t = translations[language]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl filter dark:bg-purple-500/20"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl filter dark:bg-cyan-500/20"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/10 blur-3xl filter dark:bg-blue-500/20"></div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-30"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme === "dark" ? "#1e293b" : "#e2e8f0"} 1px, transparent 1px), 
                                 linear-gradient(to bottom, ${theme === "dark" ? "#1e293b" : "#e2e8f0"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Header with controls */}
      <header className="relative z-10 flex w-full items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">NexusAuth</span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-800/70">
            <div className="p-8">
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isLogin ? t.login : t.register}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isLogin ? t.loginSubtitle : t.registerSubtitle}
                </p>
              </div>

              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="credentials" className="text-xs sm:text-sm">
                    {t.credentials}
                  </TabsTrigger>
                  <TabsTrigger value="qrcode" className="text-xs sm:text-sm">
                    {t.qrCode}
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-xs sm:text-sm">
                    {t.social}
                  </TabsTrigger>
                </TabsList>

                {/* Credentials Tab */}
                <TabsContent value="credentials" className="space-y-4 pt-4">
                  <AuthForm isLogin={isLogin} language={language} />
                </TabsContent>

                {/* QR Code Tab */}
                <TabsContent value="qrcode" className="pt-4">
                  <QrCodeLogin language={language} />
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="pt-4">
                  <SocialLogin isLogin={isLogin} language={language} />
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  {isLogin ? t.noAccount : t.haveAccount}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-sm text-slate-600 dark:text-slate-400">
        © 2025 Vienext. {t.allRightsReserved}
      </footer>
    </div>
  )
}
