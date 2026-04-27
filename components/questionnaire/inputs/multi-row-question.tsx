"use client"

import { RowField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface MultiRowQuestionProps {
  fields: RowField[]
  maxRows: number
  value: Record<string, unknown>[] | undefined
  onChange: (value: Record<string, unknown>[]) => void
}

export function MultiRowQuestion({
  fields,
  maxRows,
  value = [],
  onChange,
}: MultiRowQuestionProps) {
  const addRow = () => {
    if (value.length < maxRows) {
      const newRow: Record<string, unknown> = {}
      fields.forEach((field) => {
        newRow[field.key] = field.type === "number" ? undefined : ""
      })
      onChange([...value, newRow])
    }
  }

  const removeRow = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const updateRow = (index: number, key: string, fieldValue: unknown) => {
    const newValue = [...value]
    newValue[index] = { ...newValue[index], [key]: fieldValue }
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
          No entries yet. Click &quot;Add Entry&quot; to begin.
        </p>
      )}

      {value.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="relative rounded-lg border bg-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Entry {rowIndex + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeRow(rowIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`${rowIndex}-${field.key}`} className="text-xs">
                  {field.label}
                </Label>
                {field.type === "select" && field.options ? (
                  <Select
                    value={row[field.key] as string}
                    onValueChange={(val) => updateRow(rowIndex, field.key, val)}
                  >
                    <SelectTrigger id={`${rowIndex}-${field.key}`}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "number" ? (
                  <Input
                    id={`${rowIndex}-${field.key}`}
                    type="number"
                    value={row[field.key] as number ?? ""}
                    onChange={(e) =>
                      updateRow(
                        rowIndex,
                        field.key,
                        e.target.value === "" ? undefined : parseFloat(e.target.value)
                      )
                    }
                    placeholder={field.placeholder || "Enter number"}
                  />
                ) : (
                  <Input
                    id={`${rowIndex}-${field.key}`}
                    type="text"
                    value={row[field.key] as string}
                    onChange={(e) => updateRow(rowIndex, field.key, e.target.value)}
                    placeholder={field.placeholder || "Enter text"}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {value.length < maxRows && (
        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Entry ({value.length}/{maxRows})
        </Button>
      )}
    </div>
  )
}
