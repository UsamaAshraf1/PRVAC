"use client"

import { QuestionOption } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SelectQuestionProps {
  options: QuestionOption[]
  value: string | undefined
  onChange: (value: string) => void
}

export function SelectQuestion({ options, value, onChange }: SelectQuestionProps) {
  return (
    <RadioGroup value={value || ""} onValueChange={onChange} className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label
            htmlFor={option.value}
            className="text-sm font-normal cursor-pointer flex-1"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
