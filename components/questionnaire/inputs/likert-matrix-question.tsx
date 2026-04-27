"use client"

import { LikertItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LikertMatrixQuestionProps {
  items: LikertItem[]
  value: Record<string, number> | undefined
  onChange: (value: Record<string, number>) => void
}

export function LikertMatrixQuestion({
  items,
  value = {},
  onChange,
}: LikertMatrixQuestionProps) {
  const handleChange = (itemId: string, rating: number) => {
    onChange({ ...value, [itemId]: rating })
  }

  // Group items by category if they have one
  const groupedItems = items.reduce<Record<string, LikertItem[]>>((acc, item) => {
    const category = item.category || "General"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const categories = Object.keys(groupedItems)
  const hasCategories = categories.length > 1 || categories[0] !== "General"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 bg-card z-10 pb-2">
        <div className="flex items-end gap-4">
          <div className="flex-1 text-sm font-medium text-muted-foreground">
            Capability
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="w-10 text-center text-xs font-medium text-muted-foreground"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <span className="w-10 text-center text-[10px] text-muted-foreground">Low</span>
            <span className="w-10" />
            <span className="w-10 text-center text-[10px] text-muted-foreground">Mid</span>
            <span className="w-10" />
            <span className="w-10 text-center text-[10px] text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      {/* Items grouped by category */}
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          {hasCategories && (
            <h4 className="text-sm font-semibold text-foreground bg-muted/50 px-3 py-2 rounded-md -mx-1">
              {category}
            </h4>
          )}
          <div className="space-y-1">
            {groupedItems[category].map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-2 px-1 rounded hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 text-sm">{item.label}</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleChange(item.id, rating)}
                      className={cn(
                        "w-10 h-10 rounded-md border transition-all flex items-center justify-center",
                        "hover:border-primary/50 hover:bg-primary/5",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                        value[item.id] === rating
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      )}
                    >
                      {value[item.id] === rating && (
                        <span className="text-sm font-medium">{rating}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Progress indicator */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Completed</span>
          <span className="font-medium">
            {Object.keys(value).length} of {items.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(Object.keys(value).length / items.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
