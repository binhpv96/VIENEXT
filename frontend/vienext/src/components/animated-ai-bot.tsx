"use client"
import { motion } from "framer-motion"

interface AnimatedAiBotProps {
  state: "idle" | "typing-username" | "typing-password" | "password-visible" | "password-hidden"
  cursorPosition?: { x: number; y: number }
}

export function AnimatedAiBot({ state, cursorPosition }: AnimatedAiBotProps) {
  // Calculate eye position based on cursor position
  const getEyePosition = () => {
    if (!cursorPosition || state !== "typing-username") return { x: 0, y: 0 }

    // Limit the eye movement range
    const maxMove = 4

    // Calculate normalized position (-1 to 1 range)
    const normalizedX = Math.max(Math.min(cursorPosition.x, 1), -1)
    const normalizedY = Math.max(Math.min(cursorPosition.y, 1), -1)

    return {
      x: normalizedX * maxMove,
      y: normalizedY * maxMove,
    }
  }

  const eyePosition = getEyePosition()

  return (
    <div className="relative h-48 w-48">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30"></div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        {/* Robot Head */}
        <div className="relative h-32 w-32">
          {/* Robot Face */}
          <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg dark:from-slate-700 dark:to-slate-800">
            {/* Antenna */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
              <div className="h-6 w-1 bg-slate-400 dark:bg-slate-500"></div>
              <motion.div
                className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-blue-500"
                animate={{
                  scale: state !== "idle" ? [1, 1.3, 1] : 1,
                  opacity: state !== "idle" ? [0.7, 1, 0.7] : 0.7,
                }}
                transition={{
                  duration: 1,
                  repeat: state !== "idle" ? Number.POSITIVE_INFINITY : 0,
                }}
              ></motion.div>
            </div>

            {/* Hands for covering eyes - only visible when password is hidden or typing password */}
            {(state === "password-hidden" || state === "typing-password") && (
              <>
                <motion.div
                  className="absolute left-4 top-8 h-3 w-10 rounded-full bg-slate-300 dark:bg-slate-600"
                  initial={{ x: -20, rotate: -20 }}
                  animate={{ x: 0, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
                <motion.div
                  className="absolute right-4 top-8 h-3 w-10 rounded-full bg-slate-300 dark:bg-slate-600"
                  initial={{ x: 20, rotate: 20 }}
                  animate={{ x: 0, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </>
            )}

            {/* Eyes Container */}
            <div className="absolute top-8 flex w-full justify-center space-x-6">
              {/* Left Eye */}
              <motion.div
                className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-900"
                animate={{
                  height:
                    state === "password-hidden" || state === "typing-password"
                      ? "4px"
                      : state === "password-visible"
                        ? "10px"
                        : "24px",
                  y: state === "password-hidden" || state === "typing-password" ? 10 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
                  animate={{
                    x: state === "typing-username" ? eyePosition.x : 0,
                    y: state === "typing-username" ? eyePosition.y : 0,
                    width: state === "password-visible" ? "8px" : "12px",
                    height: state === "password-visible" ? "4px" : "12px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.1,
                  }}
                />
              </motion.div>

              {/* Right Eye */}
              <motion.div
                className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-900"
                animate={{
                  height:
                    state === "password-hidden" || state === "typing-password"
                      ? "4px"
                      : state === "password-visible"
                        ? "10px"
                        : "24px",
                  y: state === "password-hidden" || state === "typing-password" ? 10 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
                  animate={{
                    x: state === "typing-username" ? eyePosition.x : 0,
                    y: state === "typing-username" ? eyePosition.y : 0,
                    width: state === "password-visible" ? "8px" : "12px",
                    height: state === "password-visible" ? "4px" : "12px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.1,
                  }}
                />
              </motion.div>
            </div>

            {/* Mouth */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 transform rounded-full bg-slate-800 dark:bg-slate-900"
              animate={{
                width: state === "password-visible" ? 20 : 16,
                height: state === "password-visible" ? 8 : 4,
              }}
              transition={{ duration: 0.3 }}
            >
              {state === "password-visible" && (
                <motion.div
                  className="absolute left-1/2 top-1/2 h-2 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>

            {/* Cheeks - only visible when password is visible (blushing) */}
            {state === "password-visible" && (
              <>
                <motion.div
                  className="absolute bottom-8 left-4 h-3 w-3 rounded-full bg-pink-400/60"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-8 right-4 h-3 w-3 rounded-full bg-pink-400/60"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </>
            )}
          </motion.div>

          {/* Ears */}
          <div className="absolute -left-2 top-10 h-8 w-2 rounded-l-lg bg-slate-300 dark:bg-slate-600"></div>
          <div className="absolute -right-2 top-10 h-8 w-2 rounded-r-lg bg-slate-300 dark:bg-slate-600"></div>

          {/* Status Indicators */}
          <div className="absolute -bottom-2 flex w-full justify-center space-x-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-purple-500"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-cyan-500"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1.5,
                delay: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Tech circles around the bot */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 rounded-full border border-blue-500/30 dark:border-blue-500/50"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
        </motion.div>

        <motion.div
          className="absolute inset-2 rounded-full border border-dashed border-purple-500/30 dark:border-purple-500/50"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="absolute left-1/2 -top-1 h-2 w-2 -translate-x-1/2 transform rounded-full bg-purple-500"></div>
        </motion.div>
      </div>
    </div>
  )
}
