"use client"

import { Check, Circle, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Section } from "@/lib/types"

interface ProgressTrackerProps {
  sections: Section[]
  currentSectionIndex: number
  completedQuestions: Set<string>
  totalQuestions: number
}

export function ProgressTracker({
  sections,
  currentSectionIndex,
  completedQuestions,
  totalQuestions,
}: ProgressTrackerProps) {
  const completedCount = completedQuestions.size
  const progressPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  return (
    <div className="w-full space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Overall Progress</span>
          <span className="text-muted-foreground">
            {completedCount} of {totalQuestions} questions ({progressPercentage}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Section Progress */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Sections</h3>
        <nav aria-label="Progress">
          <ol className="space-y-2">
            {sections.map((section, index) => {
              const sectionCompletedCount = section.questionIds.filter((qId) =>
                completedQuestions.has(qId)
              ).length
              const sectionTotal = section.questionIds.length
              const isComplete = sectionCompletedCount === sectionTotal
              const isCurrent = index === currentSectionIndex
              const isPast = index < currentSectionIndex

              return (
                <li key={section.id}>
                  <div
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-3 transition-colors",
                      isCurrent && "bg-primary/5 border border-primary/20",
                      !isCurrent && "hover:bg-muted/50"
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isComplete ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : isCurrent ? (
                        <CircleDot className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            isCurrent ? "text-primary" : isComplete || isPast ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {section.title}
                        </p>
                        <span
                          className={cn(
                            "text-xs whitespace-nowrap",
                            isComplete ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {sectionCompletedCount}/{sectionTotal}
                        </span>
                      </div>
                      {section.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
