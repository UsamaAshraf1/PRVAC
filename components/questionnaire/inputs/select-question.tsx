"use client"

import { QuestionOption } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface SelectOtherValue {
  selected: string
  otherText: string
}

interface SelectQuestionProps {
  options: QuestionOption[]
  value: string | SelectOtherValue | undefined
  onChange: (value: string | SelectOtherValue) => void
}

export function SelectQuestion({ options, value, onChange }: SelectQuestionProps) {
  const selectedValue = typeof value === "object" ? value.selected : value || ""
  const otherText = typeof value === "object" ? value.otherText : ""
  const selectedOption = options.find((option) => option.value === selectedValue)
  const isOtherSelected = selectedOption ? isOtherOption(selectedOption) : false

  const handleValueChange = (newValue: string) => {
    const option = options.find((item) => item.value === newValue)

    if (option && isOtherOption(option)) {
      onChange({
        selected: newValue,
        otherText: selectedValue === newValue ? otherText : "",
      })
      return
    }

    onChange(newValue)
  }

  const handleOtherTextChange = (otherValue: string) => {
    onChange({
      selected: selectedValue,
      otherText: otherValue,
    })
  }

  return (
    <div className="space-y-3">
      <RadioGroup value={selectedValue} onValueChange={handleValueChange} className="space-y-3">
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

      {isOtherSelected && (
        <Input
          value={otherText}
          onChange={(event) => handleOtherTextChange(event.target.value)}
          placeholder="Please specify"
          className="max-w-md"
        />
      )}
    </div>
  )
}

function isOtherOption(option: QuestionOption) {
  const value = option.value.toLowerCase()
  const label = option.label.toLowerCase()

  return value.includes("other") || label.includes("other")
}
