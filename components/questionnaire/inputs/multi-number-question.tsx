"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberField {
  key: string
  label: string
}

interface MultiNumberQuestionProps {
  fields: NumberField[]
  value: Record<string, number> | undefined
  onChange: (value: Record<string, number>) => void
}

export function MultiNumberQuestion({
  fields,
  value = {},
  onChange,
}: MultiNumberQuestionProps) {
  const handleChange = (key: string, numValue: number | undefined) => {
    const newValue = { ...value }
    if (numValue === undefined) {
      delete newValue[key]
    } else {
      newValue[key] = numValue
    }
    onChange(newValue)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={field.key} className="text-sm">
            {field.label}
          </Label>
          <Input
            id={field.key}
            type="number"
            value={value[field.key] ?? ""}
            onChange={(e) => {
              const val = e.target.value
              if (val === "") {
                handleChange(field.key, undefined)
              } else {
                const num = parseFloat(val)
                if (!isNaN(num)) {
                  handleChange(field.key, num)
                }
              }
            }}
            placeholder="Enter value"
          />
        </div>
      ))}
    </div>
  )
}
