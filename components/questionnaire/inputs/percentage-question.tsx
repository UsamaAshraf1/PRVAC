"use client"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface PercentageQuestionProps {
  value: number | undefined
  onChange: (value: number) => void
}

export function PercentageQuestion({ value = 0, onChange }: PercentageQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          max={100}
          min={0}
          step={1}
          className="flex-1"
        />
        <div className="flex items-center gap-1 min-w-[80px]">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val) && val >= 0 && val <= 100) {
                onChange(val)
              }
            }}
            min={0}
            max={100}
            className="w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}
