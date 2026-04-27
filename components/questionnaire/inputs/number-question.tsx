"use client"

import { Input } from "@/components/ui/input"

interface NumberQuestionProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  placeholder?: string
}

export function NumberQuestion({
  value,
  onChange,
  min,
  max,
  placeholder = "Enter a number",
}: NumberQuestionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      onChange(undefined)
    } else {
      const num = parseFloat(val)
      if (!isNaN(num)) {
        onChange(num)
      }
    }
  }

  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      min={min}
      max={max}
      placeholder={placeholder}
      className="max-w-xs"
    />
  )
}
