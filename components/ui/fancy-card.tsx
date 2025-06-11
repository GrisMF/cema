"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FancyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "neon" | "gradient" | "brutalism"
  glowColor?: "blue" | "purple" | "teal" | "pink"
  children: React.ReactNode
  animate?: boolean
}

export function FancyCard({
  variant = "glass",
  glowColor = "blue",
  children,
  className,
  animate = false,
  ...props
}: FancyCardProps) {
  const glowMap = {
    blue: "shadow-neon-blue",
    purple: "shadow-neon-purple",
    teal: "shadow-neon-teal",
    pink: "shadow-neon-pink",
  }

  const variantClasses = {
    glass: "glass-card",
    neon: `bg-white/90 backdrop-blur-md border border-${glowColor}-200 ${glowMap[glowColor]}`,
    gradient: "gradient-border bg-white/90 backdrop-blur-md",
    brutalism: "neo-brutalism",
  }

  const content = (
    <div className={cn("rounded-xl p-6", variantClasses[variant], animate && "hover-lift", className)} {...props}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="contents"
      >
        {content}
      </motion.div>
    )
  }

  return content
}
