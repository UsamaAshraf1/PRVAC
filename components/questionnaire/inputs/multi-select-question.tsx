"use client"

import { QuestionOption } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface MultiSelectOtherValue {
  selected: string[]
  otherText: string
}

interface MultiSelectQuestionProps {
  options: QuestionOption[]
  value: string[] | MultiSelectOtherValue | undefined
  onChange: (value: string[] | MultiSelectOtherValue) => void
}

export function MultiSelectQuestion({ options, value = [], onChange }: MultiSelectQuestionProps) {
  const selectedValues = Array.isArray(value) ? value : value.selected
  const otherText = Array.isArray(value) ? "" : value.otherText
  const selectedOtherOption = options.find(
    (option) => selectedValues.includes(option.value) && isOtherOption(option)
  )
  const isOtherSelected = Boolean(selectedOtherOption)

  const handleChange = (optionValue: string, checked: boolean) => {
    const option = options.find((item) => item.value === optionValue)
    if (checked) {
      const newValues = [...selectedValues, optionValue]
      onChange(
        option && isOtherOption(option)
          ? { selected: newValues, otherText: "" }
          : isOtherSelected
          ? { selected: newValues, otherText }
          : newValues
      )
    } else {
      const newValues = selectedValues.filter((v) => v !== optionValue)
      const stillHasOther = options.some(
        (item) => newValues.includes(item.value) && isOtherOption(item)
      )

      onChange(stillHasOther ? { selected: newValues, otherText } : newValues)
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <Checkbox
            id={option.value}
            checked={selectedValues.includes(option.value)}
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

      {isOtherSelected && (
        <Input
          value={otherText}
          onChange={(event) =>
            onChange({ selected: selectedValues, otherText: event.target.value })
          }
          placeholder="Please specify"
          className="max-w-md"
        />
      )}

      {selectedValues.length > 0 && (
        <p className="text-xs text-muted-foreground pt-2">
          {selectedValues.length} selected
        </p>
      )}
    </div>
  )
}

function isOtherOption(option: QuestionOption) {
  const value = option.value.toLowerCase()
  const label = option.label.toLowerCase()

  return value.includes("other") || label.includes("other")
}
