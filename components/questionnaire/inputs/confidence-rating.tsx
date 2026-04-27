"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface ConfidenceRatingProps {
  value: number | undefined
  onChange: (value: number) => void
}

const confidenceLabels = [
  "Very Uncertain",
  "Uncertain",
  "Neutral",
  "Confident",
  "Very Confident",
]

export function ConfidenceRating({ value, onChange }: ConfidenceRatingProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        How confident are you in this response?
      </Label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              "flex-1 rounded-md border py-2 text-center text-sm transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === num
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{confidenceLabels[0]}</span>
        <span>{confidenceLabels[4]}</span>
      </div>
    </div>
  )
}
