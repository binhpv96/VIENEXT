"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ThoughtBubbleProps {
  thought: string
  isVisible: boolean
  delay?: number
  position?: "top" | "right" | "bottom" | "left"
  onEdit?: () => void
}

export function ThoughtBubble({ thought, isVisible, delay = 0, position = "top", onEdit }: ThoughtBubbleProps) {
  const [showThought, setShowThought] = useState(false)

  // Hiển thị bubble với độ trễ
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowThought(true)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setShowThought(false)
    }
  }, [isVisible, delay])

  // Xác định vị trí của bong bóng
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "-top-16 left-1/2 -translate-x-1/2"
      case "right":
        return "top-1/2 -right-48 -translate-y-1/2"
      case "bottom":
        return "-bottom-16 left-1/2 -translate-x-1/2"
      case "left":
        return "top-1/2 -left-48 -translate-y-1/2"
      default:
        return "-top-16 left-1/2 -translate-x-1/2"
    }
  }

  // Xác định các bubble nhỏ tạo hiệu ứng suy nghĩ
  const getThoughtDotsPosition = () => {
    switch (position) {
      case "top":
        return "bottom-0 left-1/2 -translate-x-1/2 flex-col"
      case "right":
        return "top-1/2 left-0 -translate-y-1/2"
      case "bottom":
        return "top-0 left-1/2 -translate-x-1/2 flex-col"
      case "left":
        return "top-1/2 right-0 -translate-y-1/2"
      default:
        return "bottom-0 left-1/2 -translate-x-1/2 flex-col"
    }
  }

  return (
    <AnimatePresence>
      {showThought && (
        <div className={`absolute z-10 ${getPositionClasses()}`}>
          <div className="relative">
            {/* Bubble chính */}
            <motion.div
              className="min-w-[120px] max-w-[180px] rounded-2xl bg-pink-200 px-4 py-2 text-center text-sm text-slate-800 shadow-md dark:bg-pink-900 dark:text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              onClick={onEdit}
            >
              <span>{thought}</span>
            </motion.div>

            {/* Các bubble nhỏ tạo hiệu ứng suy nghĩ */}
            <div className={`absolute flex ${getThoughtDotsPosition()}`}>
              <motion.div
                className="mx-1 my-0.5 h-2 w-2 rounded-full bg-pink-200 dark:bg-pink-900"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  delay: 0,
                  repeatDelay: 0.2,
                }}
              />
              <motion.div
                className="mx-1 my-0.5 h-3 w-3 rounded-full bg-pink-200 dark:bg-pink-900"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  delay: 0.3,
                  repeatDelay: 0.2,
                }}
              />
              <motion.div
                className="mx-1 my-0.5 h-4 w-4 rounded-full bg-pink-200 dark:bg-pink-900"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  delay: 0.6,
                  repeatDelay: 0.2,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
