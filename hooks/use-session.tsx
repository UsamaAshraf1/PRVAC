'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { supabase } from "@/lib/supabase"
import { UserSession, QuestionnaireProgress, QuestionResponse } from "@/lib/types"

const SESSION_STORAGE_KEY = "ntfras_session"

interface SessionContextType {
  session: UserSession | null
  isLoading: boolean
  updateResponse: (
    sectorId: string,
    response: QuestionResponse,
    currentSection: number,
    currentQuestion: number
  ) => Promise<void>
  getProgress: (sectorId: string) => QuestionnaireProgress | null
  clearSession: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

function generateId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

function loadSession(): UserSession | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    return stored ? JSON.parse(stored) as UserSession : null
  } catch {
    return null
  }
}

function saveSession(session: UserSession): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {}
}

function createNewSession(): UserSession {
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    progress: {},
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const existing = loadSession()
    if (existing) {
      setSession(existing)
    } else {
      const newSession = createNewSession()
      setSession(newSession)
      saveSession(newSession)
    }
    setIsLoading(false)
  }, [])

  const updateResponse = useCallback(
    async (
      sectorId: string,
      response: QuestionResponse,
      currentSection: number,
      currentQuestion: number
    ) => {
      if (!session) return

      // === 1. Update Local Storage / Browser Session ===
      const updatedSession = { ...session }

      if (!updatedSession.progress[sectorId]) {
        updatedSession.progress[sectorId] = {
          sectorId,
          responses: {},
          currentSection: 0,
          currentQuestion: 0,
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        }
      }

      const progress = updatedSession.progress[sectorId]
      progress.responses[response.questionId] = response
      progress.currentSection = currentSection
      progress.currentQuestion = currentQuestion
      progress.lastUpdatedAt = new Date().toISOString()

      setSession(updatedSession)
      saveSession(updatedSession)

      // === 2. Save to Supabase - Dynamic Table per Sector ===
      const tableName = `questionnaire_answers_${sectorId.toLowerCase()}`

      try {
        const { error } = await supabase
          .from(tableName)
          .upsert(
            {
              session_id: session.id,
              question_id: response.questionId,
              value: response.value,
              confidence: response.confidence,
              prasc_opt_in: response.prascOptIn,
              updated_at: new Date().toISOString(),
            },
            { 
              onConflict: 'session_id,question_id' 
            }
          )

        if (error) {
          console.error(`Failed to save to table ${tableName}:`, error.message)
        } else {
          console.log(`✅ Saved to ${tableName} | Q: ${response.questionId}`)
        }
      } catch (err) {
        console.error(`Error saving to Supabase table "${tableName}":`, err)
        // Don't block UI if Supabase fails
      }
    },
    [session]
  )

  const getProgress = useCallback(
    (sectorId: string): QuestionnaireProgress | null => {
      return session?.progress[sectorId] || null
    },
    [session]
  )

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    const newSession = createNewSession()
    setSession(newSession)
    saveSession(newSession)
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        updateResponse,
        getProgress,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}