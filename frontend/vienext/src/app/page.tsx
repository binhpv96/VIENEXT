"use client";

   import { useEffect } from "react";
   import { useRouter } from "next/navigation";
   import { useAppStore } from "@/contexts/store";

   export default function Home() {
     const router = useRouter();
     const { isAuthenticated } = useAppStore();

     useEffect(() => {
       if (!isAuthenticated) {
         router.replace("/auth");
       }
     }, [isAuthenticated, router]);

     if (!isAuthenticated) return null; // Tránh render giao diện khi chưa xác thực

     return (
       <div className="flex min-h-screen items-center justify-center">
         <div className="text-center">
           <h1>Dashboard Placeholder</h1>
         </div>
       </div>
     );
   }