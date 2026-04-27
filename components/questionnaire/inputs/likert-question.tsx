"use client"

import { cn } from "@/lib/utils"

interface LikertQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
  labels?: string[]
}

const defaultLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
]

export function LikertQuestion({
  value,
  onChange,
  labels = defaultLabels,
}: LikertQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              "flex-1 rounded-lg border-2 p-4 text-center transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === num
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <span className="block text-2xl font-bold">{num}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[2]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  )
}
