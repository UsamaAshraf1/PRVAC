"use client"

import { QuestionOption } from "@/lib/types"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RankQuestionProps {
  options: QuestionOption[]
  rankCount: number
  value: string[] | undefined
  onChange: (value: string[]) => void
}

export function RankQuestion({
  options,
  rankCount,
  value = [],
  onChange,
}: RankQuestionProps) {
  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // Remove from selection
      onChange(value.filter((v) => v !== optionValue))
    } else if (value.length < rankCount) {
      // Add to selection
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const getOptionLabel = (optionValue: string) => {
    return options.find((o) => o.value === optionValue)?.label || optionValue
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <p className="text-sm text-muted-foreground">
        Select your top {rankCount} in order of priority. Click to add, click again to remove.
      </p>

      {/* Selected items display */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: rankCount }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-2 min-w-[120px]",
              value[index]
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/30"
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            {value[index] ? (
              <>
                <span className="flex-1 text-sm truncate max-w-[150px]">
                  {getOptionLabel(value[index])}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                Select rank {index + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Options grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = value.includes(option.value)
          const rankPosition = value.indexOf(option.value)
          const isDisabled = !isSelected && value.length >= rankCount

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : isDisabled
                  ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {isSelected ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {rankPosition + 1}
                </span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30" />
              )}
              <span className="text-sm">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
