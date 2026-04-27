"use client"

import { use, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronLeft, Menu, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressTracker } from "@/components/questionnaire/progress-tracker"
import { QuestionRenderer } from "@/components/questionnaire/question-renderer"
import { getQuestionnaire } from "@/lib/questions"
import { useSession } from "@/hooks/use-session"
import { QuestionResponse } from "@/lib/types"

interface PageProps {
  params: Promise<{ sector: string }>
}

export default function QuestionnairePage({ params }: PageProps) {
  const { sector } = use(params)
  const router = useRouter()
  const questionnaire = getQuestionnaire(sector)
  const { session, updateResponse, getProgress, isLoading } = useSession()

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved progress
  useEffect(() => {
    if (session && questionnaire) {
      const progress = getProgress(sector)
      if (progress) {
        setCurrentSectionIndex(progress.currentSection)
        setCurrentQuestionIndex(progress.currentQuestion)
      }
    }
  }, [session, sector, questionnaire, getProgress])

  if (!questionnaire) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sector Not Found</CardTitle>
            <CardDescription>
              The questionnaire for &quot;{sector}&quot; does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentSection = questionnaire.sections[currentSectionIndex]
  const currentQuestionId = currentSection?.questionIds[currentQuestionIndex]
  const currentQuestion = currentQuestionId ? questionnaire.questions[currentQuestionId] : null

  // Get all question IDs for progress tracking
  const allQuestionIds = questionnaire.sections.flatMap((s) => s.questionIds)
  const totalQuestions = allQuestionIds.length

  // Get completed questions from session
  const progress = session ? getProgress(sector) : null
  const completedQuestions = new Set(
    progress ? Object.keys(progress.responses) : []
  )

  // Calculate current position
  const flatQuestionIndex = questionnaire.sections
    .slice(0, currentSectionIndex)
    .reduce((acc, s) => acc + s.questionIds.length, 0) + currentQuestionIndex

  const currentResponse = progress?.responses[currentQuestionId]

  const handleResponseChange = useCallback(
    async (value: unknown, confidence?: number, prascOptIn?: boolean) => {
      if (!currentQuestionId || !session) return
      setIsSaving(true)
      
      const response: QuestionResponse = {
        questionId: currentQuestionId,
        value,
        confidence,
        prascOptIn,
        updatedAt: new Date().toISOString(),
      }
      
      await updateResponse(sector, response, currentSectionIndex, currentQuestionIndex)
      setIsSaving(false)
    },
    [currentQuestionId, sector, currentSectionIndex, currentQuestionIndex, updateResponse]
  )

  const goToNext = () => {
    if (currentQuestionIndex < currentSection.questionIds.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSectionIndex < questionnaire.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentSectionIndex > 0) {
      const prevSection = questionnaire.sections[currentSectionIndex - 1]
      setCurrentSectionIndex(currentSectionIndex - 1)
      setCurrentQuestionIndex(prevSection.questionIds.length - 1)
    }
  }

  const isFirstQuestion = currentSectionIndex === 0 && currentQuestionIndex === 0
  const isLastQuestion =
    currentSectionIndex === questionnaire.sections.length - 1 &&
    currentQuestionIndex === currentSection.questionIds.length - 1

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to sectors</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {isSaving && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Save className="h-3 w-3 animate-pulse" />
                Saving...
              </span>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Question {flatQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-14 md:border-r md:bg-card">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h2 className="font-semibold text-foreground">{questionnaire.title}</h2>
              <p className="text-sm text-muted-foreground">{questionnaire.description}</p>
            </div>
            <ProgressTracker
              sections={questionnaire.sections}
              currentSectionIndex={currentSectionIndex}
              completedQuestions={completedQuestions}
              totalQuestions={totalQuestions}
            />
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed inset-y-0 left-0 w-80 border-r bg-card p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{questionnaire.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ProgressTracker
                sections={questionnaire.sections}
                currentSectionIndex={currentSectionIndex}
                completedQuestions={completedQuestions}
                totalQuestions={totalQuestions}
              />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-80">
          <div className="mx-auto max-w-3xl px-4 py-8">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>Section {currentSection.id}</span>
                <span>•</span>
                <span>Question {currentQuestionIndex + 1} of {currentSection.questionIds.length}</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">{currentSection.title}</h1>
              {currentSection.description && (
                <p className="mt-1 text-sm text-muted-foreground">{currentSection.description}</p>
              )}
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-primary/10 px-2 text-sm font-medium text-primary">
                      {currentQuestion.id}
                    </span>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-relaxed">
                        {currentQuestion.question}
                        {currentQuestion.required && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                      </CardTitle>
                      {currentQuestion.description && (
                        <CardDescription className="mt-2">
                          {currentQuestion.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <QuestionRenderer
                    question={currentQuestion}
                    value={currentResponse?.value}
                    confidence={currentResponse?.confidence}
                    prascOptIn={currentResponse?.prascOptIn}
                    onChange={handleResponseChange}
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={isFirstQuestion}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={() => router.push(`/questionnaire/${sector}/complete`)}
                  className="bg-primary"
                >
                  Complete Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={goToNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
