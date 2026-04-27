"use client"

import { use } from "react"
import Link from "next/link"
import { CheckCircle2, Download, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuestionnaire } from "@/lib/questions"
import { useSession } from "@/hooks/use-session"

interface PageProps {
  params: Promise<{ sector: string }>
}

const sectorLabels: Record<string, string> = {
  industry: "Industry",
  academia: "Academia",
  government: "Government",
  startups: "Start-ups",
  investors: "Investors",
}

export default function CompletePage({ params }: PageProps) {
  const { sector } = use(params)
  const questionnaire = getQuestionnaire(sector)
  const { session, getProgress } = useSession()

  const progress = session ? getProgress(sector) : null
  const completedCount = progress ? Object.keys(progress.responses).length : 0
  const totalQuestions = questionnaire
    ? questionnaire.sections.reduce((acc, s) => acc + s.questionIds.length, 0)
    : 0

  const isComplete = completedCount === totalQuestions

  const handleExportData = () => {
    if (!progress) return

    const data = {
      sector,
      questionnaire: questionnaire?.title,
      completedAt: new Date().toISOString(),
      sessionId: session?.id,
      responses: progress.responses,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ntfras-${sector}-responses-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isComplete ? "Questionnaire Complete!" : "Review Your Progress"}
          </CardTitle>
          <CardDescription>
            {isComplete
              ? `Thank you for completing the ${sectorLabels[sector] || sector} questionnaire.`
              : `You have completed ${completedCount} of ${totalQuestions} questions.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Summary */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalQuestions} questions
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(completedCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Session Info */}
          {session && (
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="text-sm font-medium">Session Information</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Session ID:</span>
                  <p className="font-mono truncate">{session.id.slice(0, 12)}...</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <p>{new Date(session.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your progress is saved. You can return anytime using the same browser to continue or review.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {!isComplete && (
              <Link href={`/questionnaire/${sector}`}>
                <Button className="w-full" variant="default">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Continue Questionnaire
                </Button>
              </Link>
            )}

            <Button variant="outline" className="w-full" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Responses (JSON)
            </Button>

            <Link href="/">
              <Button variant="ghost" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Note about data */}
          <p className="text-xs text-center text-muted-foreground">
            Your responses are stored locally and will be submitted when the backend API is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
