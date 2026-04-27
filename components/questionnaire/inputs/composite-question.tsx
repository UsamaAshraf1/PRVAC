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
        return (
          <Select
            value={(value[field.key] as string) || ""}
            onValueChange={(val) => handleFieldChange(field.key, val)}
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
        )

      case "multi-select":
        const selectedValues = (value[field.key] as string[]) || []
        return (
          <div className="space-y-2">
            {field.options?.map((option: QuestionOption) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.key}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleFieldChange(field.key, [...selectedValues, option.value])
                    } else {
                      handleFieldChange(
                        field.key,
                        selectedValues.filter((v) => v !== option.value)
                      )
                    }
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
