"use client"

import Link from "next/link"
import  { useState, useEffect } from "react"
import { Building2, GraduationCap, Landmark, Rocket, TrendingUp, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"   // your browser client

const sectors = [
  {
    id: "industry",
    title: "Industry",
    description: "For manufacturing firms, exporters, and industrial enterprises deploying or planning RAS solutions",
    icon: Building2,
    totalQuestions: 28,
    sections: ["Firm Profile", "RAS Deployment & Needs", "Pivot Questions", "Investment Capacity", "Workforce", "Economic Outcome"],
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    hoverColor: "hover:border-blue-400 hover:bg-blue-50/50",
  },
  {
    id: "academia",
    title: "Academia",
    description: "For universities, research institutions, NCRA labs, and technical institutes with RAS programmes",
    icon: GraduationCap,
    totalQuestions: 24,
    sections: ["Institutional Profile", "Research Capabilities", "Industry Linkage", "Pivot Questions", "Translation & Commitment"],
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    hoverColor: "hover:border-emerald-400 hover:bg-emerald-50/50",
  },
  {
    id: "government",
    title: "Government",
    description: "For federal and provincial ministries, regulators, SOEs, and public sector organizations",
    icon: Landmark,
    totalQuestions: 17,
    sections: ["Organisation & Mandate", "Current RAS Activity", "Regulatory Posture", "Pivot Questions", "Consolidation & Commitment"],
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    hoverColor: "hover:border-amber-400 hover:bg-amber-50/50",
  },
  {
    id: "startups",
    title: "Start-ups",
    description: "For robotics and automation start-ups bridging academia and industry in Pakistan",
    icon: Rocket,
    totalQuestions: 19,
    sections: ["Company Profile", "Technology & Product", "Ecosystem & Pivot", "Investment Readiness"],
    color: "bg-rose-500/10 text-rose-600 border-rose-200",
    hoverColor: "hover:border-rose-400 hover:bg-rose-50/50",
  },
  {
    id: "investors",
    title: "Investors",
    description: "For banks, VCs, family offices, DFIs, and other capital providers interested in RAS ecosystem",
    icon: TrendingUp,
    totalQuestions: 16,
    sections: ["Investor Profile", "Appetite & Conditions", "Blockers & Exit", "Commitment & Policy"],
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    hoverColor: "hover:border-indigo-400 hover:bg-indigo-50/50",
  },
]

async function getCompletedQuestions(sessionId: string, sectorId: string): Promise<number> {
  if (!sessionId) return 0

  const tableName = `questionnaire_answers_${sectorId.toLowerCase()}`

  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)

  if (error) {
    console.error(`Error checking ${tableName}:`, error)
    return 0
  }

  return count || 0
}

export default function LandingPage() {
  // Get session ID from localStorage (client-side only)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const stored = localStorage.getItem("ntfras_session")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSessionId(parsed.id)

        // Check completion status for all sectors
        const checkAll = async () => {
          const counts: Record<string, number> = {}
          for (const sector of sectors) {
            const answered = await getCompletedQuestions(parsed.id, sector.id)
            counts[sector.id] = answered
          }
          setCompletedCounts(counts)
        }

        checkAll()
      } catch (e) {
        console.error("Failed to parse session", e)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">NTFRAS Questionnaire</h1>
            <p className="text-sm text-muted-foreground">
              National Task Force on Robotics and Automation Systems
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Select Your Sector
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
            Choose the instrument that best matches your organization type. Each questionnaire is tailored 
            to capture sector-specific data for Pakistan&apos;s RAS ecosystem assessment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => {
            const Icon = sector.icon
            const answered = completedCounts[sector.id] || 0
            const isCompleted = answered >= sector.totalQuestions

            return (
              <Link
                key={sector.id}
                href={isCompleted 
                  ? `/questionnaire/${sector.id}/complete` 
                  : `/questionnaire/${sector.id}`}
                className="group block"
              >
                <Card className={`h-full transition-all duration-200 ${sector.hoverColor} border-2 relative overflow-hidden ${isCompleted ? 'border-green-500 bg-green-50/50' : ''}`}>
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  )}

                  <CardHeader>
                    <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${sector.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                      {sector.title}
                      {isCompleted && <span className="text-sm text-green-600 font-normal">(Completed)</span>}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {sector.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-medium">
                          {answered} / {sector.totalQuestions}
                          {isCompleted && " ✓"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Sections covered:</span>
                        <div className="flex flex-wrap gap-1">
                          {sector.sections.slice(0, 3).map((section) => (
                            <span
                              key={section}
                              className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {section}
                            </span>
                          ))}
                          {sector.sections.length > 3 && (
                            <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              +{sector.sections.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* About Section */}
        <div className="mt-12 rounded-lg border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground">About This Assessment</h3>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            This questionnaire is part of the NTFRAS initiative to assess Pakistan&apos;s robotics and automation 
            ecosystem. Your responses will help shape national policy and identify opportunities for growth. 
            All data is collected anonymously and your progress is saved automatically.
          </p>
        </div>
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            NTFRAS Questionnaire v2.0 - Five Instruments + 14-Area Assessor Framework
          </p>
        </div>
      </footer>
    </div>
  )
}