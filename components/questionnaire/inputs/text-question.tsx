"use client"

import { Textarea } from "@/components/ui/textarea"

interface TextQuestionProps {
  value: string | undefined
  maxChars?: number
  onChange: (value: string) => void
}

export function TextQuestion({ value = "", maxChars = 280, onChange }: TextQuestionProps) {
  const charCount = value.length
  const isOverLimit = charCount > maxChars

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your response..."
        rows={4}
        className={isOverLimit ? "border-destructive" : ""}
      />
      <div className="flex justify-end">
        <span
          className={`text-xs ${
            isOverLimit
              ? "text-destructive"
              : charCount > maxChars * 0.9
              ? "text-amber-500"
              : "text-muted-foreground"
          }`}
        >
          {charCount}/{maxChars} characters
        </span>
      </div>
    </div>
  )
}
