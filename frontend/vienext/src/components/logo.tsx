"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  textContent?: string
}

export function Logo({ size = "md", showText = true, textContent = "VIENEXT" }: LogoProps) {
  const { theme } = useTheme()

  // Kích thước dựa trên prop size
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = dimensions[size]

    const logoSrc = theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"

  return (
    <div className="relative flex items-center">
      <motion.div
        className="relative"
        style={{ width, height }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={logoSrc || "/placeholder.svg"}
          alt="Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />

        {/* Hiệu ứng ánh sáng (tùy chọn) */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-500/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>
      </motion.div>

      {showText && (
        <motion.span
          className="ml-2 text-xl font-bold text-slate-900 dark:text-white"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {textContent}
        </motion.span>
      )}
    </div>
  )
}
