"use client"

import { QuestionOption } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MultiSelectQuestionProps {
  options: QuestionOption[]
  value: string[] | undefined
  onChange: (value: string[]) => void
}

export function MultiSelectQuestion({ options, value = [], onChange }: MultiSelectQuestionProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <Checkbox
            id={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => handleChange(option.value, checked as boolean)}
          />
          <Label
            htmlFor={option.value}
            className="text-sm font-normal cursor-pointer flex-1"
          >
            {option.label}
          </Label>
        </div>
      ))}
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground pt-2">
          {value.length} selected
        </p>
      )}
    </div>
  )
}
