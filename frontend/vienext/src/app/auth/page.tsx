"use client";

import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCodeLogin } from "@/components/qr-code-login";
import { SocialLogin } from "@/components/social-login";
import { Logo } from "@/components/logo";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useAppStore } from "@/contexts/store";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, t, setIsAuthenticated } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleOAuthCallback = async () => {
      console.log("Starting OAuth Callback");
      const startTime = Date.now();
      try {
        const response = await apiClient.get("/users/me");
        console.log("OAuth Callback Response:", response);
        if (response?.id) {
          setIsAuthenticated(true);
          router.push("/dashboard");
        } else {
          setIsAuthenticated(false);
          router.push("/auth");
        }
      } catch (err) {
        console.error("OAuth Callback Error:", err);
        setIsAuthenticated(false);
        router.push("/auth");
      } finally {
        console.log("OAuth Callback Duration:", Date.now() - startTime, "ms");
      }
    };

    if (searchParams.get("code") || searchParams.get("state")) {
      handleOAuthCallback();
    }
  }, [searchParams, setIsAuthenticated, router, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="dark">
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl filter"></div>
          <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl filter"></div>
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/20 blur-3xl filter"></div>

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), 
                               linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <header className="relative z-10 flex w-full items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Logo />
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </header>

        <main className="relative z-10 flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/70 backdrop-blur-xl">
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                    {isLogin ? t.login : t.register}
                  </h1>
                  <p className="text-sm text-slate-400">
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

                  <TabsContent value="credentials" className="space-y-4 pt-4">
                    <AuthForm isLogin={isLogin} language={language} />
                  </TabsContent>

                  <TabsContent value="qrcode" className="pt-4">
                    <QrCodeLogin language={language} />
                  </TabsContent>

                  <TabsContent value="social" className="pt-4">
                    <SocialLogin isLogin={isLogin} language={language} />
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {isLogin ? t.noAccount : t.haveAccount}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 p-6 text-center text-sm text-slate-400">
          © 2025 Vienext. {t.allRightsReserved}
        </footer>
      </div>
    </div>
  );
}