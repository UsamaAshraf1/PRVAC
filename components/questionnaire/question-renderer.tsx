"use client"

import { Question } from "@/lib/types"
import { SelectQuestion } from "./inputs/select-question"
import { MultiSelectQuestion } from "./inputs/multi-select-question"
import { NumberQuestion } from "./inputs/number-question"
import { PercentageQuestion } from "./inputs/percentage-question"
import { TextQuestion } from "./inputs/text-question"
import { LikertQuestion } from "./inputs/likert-question"
import { LikertMatrixQuestion } from "./inputs/likert-matrix-question"
import { RankQuestion } from "./inputs/rank-question"
import { MultiRowQuestion } from "./inputs/multi-row-question"
import { MultiNumberQuestion } from "./inputs/multi-number-question"
import { CompositeQuestion } from "./inputs/composite-question"
import { ConfidenceRating } from "./inputs/confidence-rating"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface QuestionRendererProps {
  question: Question
  value: unknown
  confidence?: number
  prascOptIn?: boolean
  onChange: (value: unknown, confidence?: number, prascOptIn?: boolean) => void
}

export function QuestionRenderer({
  question,
  value,
  confidence,
  prascOptIn,
  onChange,
}: QuestionRendererProps) {
  const handleValueChange = (newValue: unknown) => {
    onChange(newValue, confidence, prascOptIn)
  }

  const handleConfidenceChange = (newConfidence: number) => {
    onChange(value, newConfidence, prascOptIn)
  }

  const handlePrascOptInChange = (checked: boolean) => {
    onChange(value, confidence, checked)
  }

  const renderQuestion = () => {
    switch (question.type) {
      case "select":
        return (
          <SelectQuestion
            options={question.options || []}
            value={value as string}
            onChange={handleValueChange}
          />
        )
      case "multi-select":
        return (
          <MultiSelectQuestion
            options={question.options || []}
            value={value as string[]}
            onChange={handleValueChange}
          />
        )
      case "number":
        return (
          <NumberQuestion
            value={value as number}
            onChange={handleValueChange}
          />
        )
      case "percentage":
        return (
          <PercentageQuestion
            value={value as number}
            onChange={handleValueChange}
          />
        )
      case "text":
        return (
          <TextQuestion
            value={value as string}
            maxChars={question.maxChars}
            onChange={handleValueChange}
          />
        )
      case "likert":
        return (
          <LikertQuestion
            value={value as number}
            onChange={handleValueChange}
          />
        )
      case "likert-matrix":
        return (
          <LikertMatrixQuestion
            items={question.items || []}
            value={value as Record<string, number>}
            onChange={handleValueChange}
          />
        )
      case "rank":
        return (
          <RankQuestion
            options={question.options || []}
            rankCount={question.rankCount || 3}
            value={value as string[]}
            onChange={handleValueChange}
          />
        )
      case "multi-row":
        return (
          <MultiRowQuestion
            fields={question.rowFields || []}
            maxRows={question.maxRows || 5}
            value={value as Record<string, unknown>[]}
            onChange={handleValueChange}
          />
        )
      case "multi-number":
        return (
          <MultiNumberQuestion
            fields={question.numberFields || []}
            value={value as Record<string, number>}
            onChange={handleValueChange}
          />
        )
      case "composite":
        return (
          <CompositeQuestion
            fields={question.compositeFields || []}
            value={value as Record<string, unknown>}
            onChange={handleValueChange}
          />
        )
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Unsupported question type: {question.type}
          </p>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderQuestion()}

      {/* Confidence Rating */}
      {question.confidenceLikert && (
        <div className="border-t pt-4">
          <ConfidenceRating
            value={confidence}
            onChange={handleConfidenceChange}
          />
        </div>
      )}

      {/* PRASC Opt-in */}
      {question.prascOptIn && (
        <div className="border-t pt-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="prasc-optin"
              checked={prascOptIn || false}
              onCheckedChange={handlePrascOptInChange}
            />
            <Label
              htmlFor="prasc-optin"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I am interested in being contacted by PRASC to discuss potential 
              collaboration or partnership opportunities related to this capability.
            </Label>
          </div>
        </div>
      )}
    </div>
  )
}
