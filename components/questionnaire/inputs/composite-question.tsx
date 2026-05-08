"use client"

import { CompositeField, QuestionOption } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CompositeQuestionProps {
  fields: CompositeField[]
  value: Record<string, unknown> | undefined
  onChange: (value: Record<string, unknown>) => void
}

export function CompositeQuestion({
  fields,
  value = {},
  onChange,
}: CompositeQuestionProps) {
  const handleFieldChange = (key: string, fieldValue: unknown) => {
    onChange({ ...value, [key]: fieldValue })
  }

  const handleOtherTextChange = (key: string, otherText: string) => {
    onChange({ ...value, [`${key}OtherText`]: otherText })
  }

  const renderField = (field: CompositeField) => {
    switch (field.type) {
      case "number":
        return (
          <Input
            id={field.key}
            type="number"
            value={(value[field.key] as number) ?? ""}
            onChange={(e) => {
              const val = e.target.value
              if (val === "") {
                handleFieldChange(field.key, undefined)
              } else {
                const num = parseFloat(val)
                if (!isNaN(num)) {
                  handleFieldChange(field.key, num)
                }
              }
            }}
            placeholder="Enter value"
          />
        )

      case "text":
        return (
          <Textarea
            id={field.key}
            value={(value[field.key] as string) || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder="Enter your response..."
            rows={3}
          />
        )

      case "select":
        const selectedValue = (value[field.key] as string) || ""
        const selectedOption = field.options?.find((option) => option.value === selectedValue)
        const selectOtherSelected = selectedOption ? isOtherOption(selectedOption) : false

        return (
          <div className="space-y-2">
            <Select
              value={selectedValue}
              onValueChange={(val) => {
                const option = field.options?.find((item) => item.value === val)
                const nextValue = { ...value, [field.key]: val }

                if (!option || !isOtherOption(option)) {
                  delete nextValue[`${field.key}OtherText`]
                }

                onChange(nextValue)
              }}
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: QuestionOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectOtherSelected && (
              <Input
                value={(value[`${field.key}OtherText`] as string) || ""}
                onChange={(event) => handleOtherTextChange(field.key, event.target.value)}
                placeholder="Please specify"
              />
            )}
          </div>
        )

      case "multi-select":
        const selectedValues = (value[field.key] as string[]) || []
        const multiSelectOtherSelected = field.options?.some(
          (option) => selectedValues.includes(option.value) && isOtherOption(option)
        )

        return (
          <div className="space-y-2">
            {field.options?.map((option: QuestionOption) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.key}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const nextValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value)
                    const stillHasOther = field.options?.some(
                      (item) => nextValues.includes(item.value) && isOtherOption(item)
                    )

                    if (checked) {
                      handleFieldChange(field.key, nextValues)
                      return
                    }

                    const nextValue = { ...value, [field.key]: nextValues }
                    if (!stillHasOther) {
                      delete nextValue[`${field.key}OtherText`]
                    }

                    onChange(nextValue)
                  }}
                />
                <Label
                  htmlFor={`${field.key}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}

            {multiSelectOtherSelected && (
              <Input
                value={(value[`${field.key}OtherText`] as string) || ""}
                onChange={(event) => handleOtherTextChange(field.key, event.target.value)}
                placeholder="Please specify"
              />
            )}
          </div>
        )

      case "percentage":
        return (
          <div className="flex items-center gap-2">
            <Input
              id={field.key}
              type="number"
              min={0}
              max={100}
              value={(value[field.key] as number) ?? ""}
              onChange={(e) => {
                const val = e.target.value
                if (val === "") {
                  handleFieldChange(field.key, undefined)
                } else {
                  const num = parseFloat(val)
                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    handleFieldChange(field.key, num)
                  }
                }
              }}
              className="w-24"
              placeholder="0-100"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )

      default:
        return (
          <Input
            id={field.key}
            type="text"
            value={(value[field.key] as string) || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder="Enter value"
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={field.key} className="text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  )
}

function isOtherOption(option: QuestionOption) {
  const value = option.value.toLowerCase()
  const label = option.label.toLowerCase()

  return value.includes("other") || label.includes("other")
}
