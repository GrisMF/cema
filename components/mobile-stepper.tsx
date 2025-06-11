"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Step = {
  id: string
  label: string
  icon: React.ReactNode
}

type MobileStepperProps = {
  steps: Step[]
  currentStep: string
  onStepChange: (stepId: string) => void
}

export function MobileStepper({ steps, currentStep, onStepChange }: MobileStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="relative mb-8">
      {/* Barra de progreso */}
      <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Pasos */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = index < currentIndex

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center cursor-pointer pt-8",
                isActive && "scale-110 transition-transform duration-300",
              )}
              onClick={() => onStepChange(step.id)}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-400",
                )}
              >
                {step.icon}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium transition-colors duration-300",
                  isActive ? "text-blue-600" : isCompleted ? "text-green-500" : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
