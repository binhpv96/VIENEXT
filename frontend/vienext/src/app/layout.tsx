"use client";

   import type React from "react";
   import "@/app/globals.css";
   import { MainLayout } from "@/components/main-layout";
   import { ThemeProvider } from "next-themes";
   import { usePathname, useRouter } from "next/navigation";
   import { useAppStore } from "@/contexts/store";
   import { useEffect } from "react";

   export default function RootLayout({ children }) {
     const pathname = usePathname();
     const router = useRouter();
     const { language, setLanguage, isAuthenticated, theme, setTheme } = useAppStore();

     // Danh sách các trang không cần sidebar
     const noSidebarPages = ["/auth", "/404", "/500", "/"];

     // Kiểm tra xem trang hiện tại có nằm trong danh sách không cần sidebar không
     const shouldShowSidebar = !noSidebarPages.includes(pathname);

     // Chuyển hướng ngay lập tức nếu chưa xác thực
     useEffect(() => {
       if (!isAuthenticated && pathname === "/") {
         router.replace("/auth");
       }
       const protectedRoutes = ["/dashboard", "/profile"];
       if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
         router.replace("/auth");
       }
     }, [pathname, isAuthenticated, router]);

     // Đồng bộ theme với next-themes
     useEffect(() => {
       setTheme(theme);
     }, [theme, setTheme]);

     return (
       <html lang={language} suppressHydrationWarning>
         <body>
           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
             {shouldShowSidebar ? (
               <MainLayout language={language} setLanguage={setLanguage}>
                 {children}
               </MainLayout>
             ) : (
               children
             )}
           </ThemeProvider>
         </body>
       </html>
     );
   }
