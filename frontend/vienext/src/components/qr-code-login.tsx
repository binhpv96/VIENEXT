"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scan, RefreshCw } from "lucide-react"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"
import Image from "next/image"

interface QrCodeLoginProps {
  language: "en" | "vi"
}

export function QrCodeLogin({ language }: QrCodeLoginProps) {
  const [isScanning, setIsScanning] = useState(false)
  const t = translations[language]

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border-2 border-dashed border-slate-300 p-2 dark:border-slate-700">
        {isScanning ? (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src="/placeholder.svg?height=200&width=200" alt="QR Code" className="h-full w-full object-cover" />

              {/* Scanning animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
                initial={{ y: -220 }}
                animate={{ y: 220 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "linear",
                }}
                style={{ height: "2px" }}
              />

              <motion.div
                className="absolute inset-0 border-2 border-blue-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  repeatType: "reverse",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-slate-400">
            <Scan className="h-12 w-12" />
            <p className="text-center text-sm">{t.scanQrCodePrompt}</p>
          </div>
        )}
      </div>

      <Button
        onClick={() => setIsScanning(!isScanning)}
        variant={isScanning ? "destructive" : "default"}
        className={
          isScanning ? "" : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400"
        }
      >
        {isScanning ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.cancelScan}
          </>
        ) : (
          <>
            <Scan className="mr-2 h-4 w-4" />
            {t.startScan}
          </>
        )}
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">{t.qrCodeInstructions}</p>
    </div>
  )
}
