"use client";
import { motion, AnimatePresence } from "framer-motion";
// motion: tạo các phần tử có animation
// AnimatePresence: quản lý animation cho các phần tử khi chúng được thêm/xóa khỏi DOM
import { useEffect, useState } from "react";

// interface định nghĩa props của component
interface AnimatedAiBotProps {
  // trạng thái hiện tại của bot (idle: không hoạt động)
  state:
    | "idle"
    | "typing-identifier"
    | "typing-password"
    | "password-visible"
    | "password-hidden";
  // vị trí con trỏ chuột (x, y) để xác định vị trí mắt của bot
  cursorPosition?: { x: number; y: number };
}

export function AnimatedAiBot({ state, cursorPosition }: AnimatedAiBotProps) {
  // state để quản lý trạng thái nháy mắt của bot
  const [isBlinking, setIsBlinking] = useState(false);

  // hiệu ứng để nháy mắt bot ngẫu nhiên
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        // chỉ nháy mắt khi không trong trạng thái che mắt
        if (state !== "password-hidden" && state !== "typing-password") {
          setIsBlinking(true);
          // mỗi lần nháy mắt kéo dài 200ms
          setTimeout(() => setIsBlinking(false), 200);
        }
      },
      // thời gian nháy mắt ngẫu nhiên từ 2 đến 5 giây
      Math.random() * 4000 + 2000
    );

    // dọn dẹp interval khi component bị hủy, tránh rò rỉ bộ nhớ
    // phụ thuộc vào state để reset interval khi state thay đổi
    return () => clearInterval(blinkInterval);
  }, [state]);

  // Calculate eye position based on cursor position
  const getEyePosition = () => {
    if (!cursorPosition || state !== "typing-identifier") return { x: 0, y: 0 };

    // Limit the eye movement range
    const maxMove = 6;

    // Calculate normalized position (-1 to 1 range)
    const normalizedX = Math.max(Math.min(cursorPosition.x, 1), -1);
    const normalizedY = Math.max(Math.min(cursorPosition.y, 1), -1);

    return {
      x: normalizedX * maxMove,
      y: normalizedY * maxMove,
    };
  };

  const eyePosition = getEyePosition();

  // xác định đang trong trạng thái che mắt
  const isEyesCovered =
    state === "password-hidden" || state === "typing-password";

  // xác định đang trong trạng thái nhìn trộm
  const isPeeking = state === "password-visible";

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
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg dark:from-slate-700 dark:to-slate-800"
            animate={{
              scale: isEyesCovered ? [1, 0.98, 1] : 1,
            }}
            transition={{
              scale: {
                repeat: isEyesCovered ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
                duration: 1.5,
              },
            }}
          >
            {/* Ăng-ten */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
              <div className="h-6 w-1 bg-slate-400 dark:bg-slate-500"></div>
              <motion.div
                className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-green-400"
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

            {/* Hands covering eyes
                AnimatePresence quản lý animation khi bàn tay hiện/ẩn
                Animation xuất hiện: Di chuyển từ trên xuống (y: -20 -> 0) và mờ dần hiện ra
                Animation biến mất: Di chuyển lên trên (y: 0 -> -10) và mờ dần biến mất
                Sử dụng spring animation để tạo cảm giác tự nhiên 
            */}
            <AnimatePresence>
              {isEyesCovered && (
                <motion.div
                  className="absolute left-1/2 top-8 z-10 -translate-x-1/2 transform"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Left Hand */}
                  <motion.div
                    className="absolute -left-8 top-0"
                    // Animation: Xoay nhẹ liên tục để tạo cảm giác tự nhiên
                    // Khi nhìn trộm: Dịch chuyển ra xa hơn một chút (x: -2)
                    animate={{
                      rotate: [-5, -3, -5],
                      x: isPeeking ? -2 : 0,
                    }}
                    transition={{
                      rotate: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2,
                      },
                      x: { duration: 0.3 },
                    }}
                  >
                    {/* Lòng bàn tay */}
                    {/* Hình chữ nhật bo tròn màu slate */}
                    <div className="absolute left-0 top-0 h-8 w-6 rounded-md bg-slate-300 dark:bg-slate-500"></div>

                    {/* Ngón cái */}
                    {/* Khi nhìn trộm: Xoay -15 độ */}
                    <motion.div
                      className="absolute -left-2 top-2 h-3 w-2 rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? -15 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>

                    {/* Fingers */}
                    <motion.div
                      className="absolute left-1 -top-3 h-4 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? -25 : -5,
                        scaleY: isPeeking ? 0.9 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute left-3 -top-4 h-5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? -15 : 0,
                        scaleY: isPeeking ? 0.85 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute left-5 -top-3.5 h-4.5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? -5 : 5,
                        scaleY: isPeeking ? 0.9 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute left-7 -top-2 h-3.5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? 5 : 10,
                        scaleY: isPeeking ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </motion.div>

                  {/* Right Hand */}
                  <motion.div
                    className="absolute -right-8 top-0"
                    animate={{
                      rotate: [5, 3, 5],
                      x: isPeeking ? 2 : 0,
                    }}
                    transition={{
                      rotate: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2,
                        delay: 0.5,
                      },
                      x: { duration: 0.3 },
                    }}
                  >
                    {/* Palm */}
                    <div className="absolute right-0 top-0 h-8 w-6 rounded-md bg-slate-300 dark:bg-slate-500"></div>

                    {/* Thumb */}
                    <motion.div
                      className="absolute -right-2 top-2 h-3 w-2 rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? 15 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>

                    {/* Fingers */}
                    <motion.div
                      className="absolute right-1 -top-3 h-4 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? 25 : 5,
                        scaleY: isPeeking ? 0.9 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute right-3 -top-4 h-5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? 15 : 0,
                        scaleY: isPeeking ? 0.85 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute right-5 -top-3.5 h-4.5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? 5 : -5,
                        scaleY: isPeeking ? 0.9 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <motion.div
                      className="absolute right-7 -top-2 h-3.5 w-1.5 origin-bottom rounded-full bg-slate-300 dark:bg-slate-500"
                      animate={{
                        rotate: isPeeking ? -5 : -10,
                        scaleY: isPeeking ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Eyes Container: Đặt ở giữa mặt, chứa hai mắt cách nhau 6px */}
            <div className="absolute top-8 flex w-full justify-center space-x-6">
              {/* Mỗi mắt gồm hai phần
            Phần ngoài: Hình tròn màu đen (slate-800/900)
              - Animation chiều cao:
                  - Khi nhấp nháy: 2px
                  - Khi password visible: 10px
                  - Mặc định: 24px
              - Khi che mắt: Dịch xuống dưới 10px
              - Khi nhấp nháy: Thu nhỏ theo chiều dọc (scaleY: 0.2)
          
            Phần trong (tròng mắt): Hình tròn màu xanh
              - Di chuyển theo vị trí con trỏ khi đang nhập username
              - Thay đổi kích thước khi password visible (8x4px thay vì 12x12px)
              - Phóng to/thu nhỏ liên tục khi đang nhìn trộm */}

              {/* Left Eye */}
              <motion.div
                className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-900"
                animate={{
                  height: isBlinking
                    ? "2px"
                    : state === "password-visible"
                    ? "10px"
                    : "24px",
                  y: isEyesCovered ? 10 : 0,
                  scaleY: isBlinking ? 0.2 : 1,
                }}
                transition={{
                  duration: isBlinking ? 0.1 : 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
                  animate={{
                    x:
                      state === "typing-identifier"
                        ? eyePosition.x
                        : isPeeking
                        ? 0
                        : 0,
                    y:
                      state === "typing-identifier"
                        ? eyePosition.y
                        : isPeeking
                        ? 0
                        : 0,
                    width: state === "password-visible" ? "8px" : "12px",
                    height: state === "password-visible" ? "4px" : "12px",
                    scale: isPeeking ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.1,
                    scale: {
                      repeat: isPeeking ? Number.POSITIVE_INFINITY : 0,
                      duration: 0.5,
                    },
                  }}
                />
              </motion.div>

              {/* Right Eye */}
              <motion.div
                className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-900"
                animate={{
                  height: isBlinking
                    ? "2px"
                    : state === "password-visible"
                    ? "10px"
                    : "24px",
                  y: isEyesCovered ? 10 : 0,
                  scaleY: isBlinking ? 0.2 : 1,
                }}
                transition={{
                  duration: isBlinking ? 0.1 : 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"
                  animate={{
                    x:
                      state === "typing-identifier"
                        ? eyePosition.x
                        : isPeeking
                        ? 0
                        : 0,
                    y:
                      state === "typing-identifier"
                        ? eyePosition.y
                        : isPeeking
                        ? 0
                        : 0,
                    width: state === "password-visible" ? "8px" : "12px",
                    height: state === "password-visible" ? "4px" : "12px",
                    scale: isPeeking ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.1,
                    scale: {
                      repeat: isPeeking ? Number.POSITIVE_INFINITY : 0,
                      duration: 0.5,
                    },
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
            ></motion.div>
          </motion.div>

          {/* Ears */}
          <div className="absolute -left-2 top-10 h-8 w-2 rounded-l-lg bg-slate-300 dark:bg-slate-600"></div>
          <div className="absolute -right-2 top-10 h-8 w-2 rounded-r-lg bg-slate-300 dark:bg-slate-600"></div>

          {/* Đèn báo */}
          <div className="absolute -bottom-2 flex w-full justify-center space-x-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
              // animate thay đổi độ mờ và kích thước liên tục
              // độ delay khác nhau để tạo hiệu ứng lần lượt
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

      {/* Các vệ tinh xung quanh bot */}
      {/* container vòng tròn đặt phía sau bot (z-index: -10) */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 rounded-full border border-blue-500/30 dark:border-blue-500/50"
          animate={{
            // quay 360 độ
            rotate: 360,
          }}
          transition={{
            // thời gian quay 20 giây
            duration: 20,
            // lặp lại vô hạn
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* có một chấm tròn màu xanh ở bên phải */}
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
  );
}
