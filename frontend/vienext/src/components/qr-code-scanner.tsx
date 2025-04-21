"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scan, RefreshCw } from "lucide-react"
import { translations } from "@/lib/translations"
import Image from "next/image"

interface QrCodeScannerProps {
  language: "en" | "vi"
}

export function QrCodeScanner({ language }: QrCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const t = translations[language]

  // Simulate QR code for demo purposes
  const qrCodeUrl = "/placeholder.svg?height=200&width=200"

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border-2 border-dashed border-slate-300 p-2 dark:border-slate-700">
        {isScanning ? (
          <div className="relative h-full w-full">
            <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-40 animate-pulse rounded-lg border-2 border-purple-500 dark:border-purple-400"></div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 text-slate-400">
            <Scan className="h-10 w-10" />
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
