"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateDiscountCode, useDiscountCode } from "@/lib/discount-service"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DiscountCodeInputProps {
  onApplyDiscount: (discountPercentage: number) => void
}

export function DiscountCodeInput({ onApplyDiscount }: DiscountCodeInputProps) {
  const [code, setCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    discountPercentage?: number
    message?: string
  } | null>(null)
  const [discountApplied, setDiscountApplied] = useState(false)

  const handleApplyCode = () => {
    if (!code.trim()) return

    setIsValidating(true)
    setValidationResult(null)

    // Simular una pequeña demora para dar sensación de validación
    setTimeout(() => {
      const result = validateDiscountCode(code.trim())
      setValidationResult(result)

      if (result.valid && result.discountPercentage) {
        onApplyDiscount(result.discountPercentage)
        setDiscountApplied(true)
        useDiscountCode(code.trim())
      } else {
        setDiscountApplied(false)
      }

      setIsValidating(false)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="discount-code">Código de Descuento</Label>
        <div className="flex space-x-2">
          <Input
            id="discount-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingresa tu código"
            className="flex-1"
            disabled={isValidating || (validationResult?.valid ?? false)}
          />
          <Button
            onClick={handleApplyCode}
            disabled={!code.trim() || isValidating || (validationResult?.valid ?? false)}
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : validationResult?.valid ? (
              "Aplicado"
            ) : (
              "Aplicar"
            )}
          </Button>
        </div>
      </div>

      {validationResult && (
        <Alert variant={validationResult.valid ? "default" : "destructive"}>
          {validationResult.valid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {validationResult.valid
              ? `Código aplicado: ${validationResult.discountPercentage}% de descuento`
              : validationResult.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
