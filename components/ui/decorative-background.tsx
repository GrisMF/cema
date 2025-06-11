"use client"
import { motion } from "framer-motion"

export function DecorativeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blobs */}
      <div className="blob blob-1 pointer-events-none"></div>
      <div className="blob blob-2 pointer-events-none"></div>
      <div className="blob blob-3 pointer-events-none"></div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-[10%] w-8 h-8 rounded-full bg-blue-500/20 backdrop-blur-sm pointer-events-none"
        animate={{
          y: [0, -30, 0],
          opacity: [0.7, 0.4, 0.7],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-[15%] w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-sm pointer-events-none"
        animate={{
          y: [0, -40, 0],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-[20%] w-10 h-10 rounded-full bg-teal-500/20 backdrop-blur-sm pointer-events-none"
        animate={{
          y: [0, -25, 0],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-[30%] right-[5%] w-16 h-16 border-2 border-pink-500/30 rotate-45 pointer-events-none"
        animate={{
          rotate: [45, 90, 45],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[25%] w-20 h-20 border-2 border-blue-500/30 rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-[60%] left-[8%] w-12 h-12 border-2 border-purple-500/30 pointer-events-none"
        animate={{
          rotate: [0, 180, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none"></div>
    </div>
  )
}
