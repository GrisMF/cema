"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

type StepperProps = {
  steps: Step[]
  currentStep: string
  onStepChange: (stepId: string) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepChange, className }: StepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className={cn("w-full overflow-x-auto py-4", className)}>
      <div className="flex min-w-max">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = index < currentIndex
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-all duration-200",
                  isActive && "scale-110",
                )}
                onClick={() => onStepChange(step.id)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : isCompleted
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-400 border-gray-300",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500",
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && <div className="text-xs text-gray-400 mt-1">{step.description}</div>}
                </div>
              </div>

              {!isLast && (
                <div className="mx-2 w-12 h-[2px] bg-gray-200 flex-shrink-0">
                  {isCompleted && (
                    <motion.div className="h-full bg-green-600" initial={{ width: 0 }} animate={{ width: "100%" }} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
