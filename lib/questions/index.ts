import { Questionnaire } from "@/lib/types"
import { industryQuestionnaire } from "./industry"
import { academiaQuestionnaire } from "./academia"
import { governmentQuestionnaire } from "./government"
import { startupsQuestionnaire } from "./startups"
import { investorsQuestionnaire } from "./investors"

export const questionnaires: Record<string, Questionnaire> = {
  industry: industryQuestionnaire,
  academia: academiaQuestionnaire,
  government: governmentQuestionnaire,
  startups: startupsQuestionnaire,
  investors: investorsQuestionnaire,
}

export function getQuestionnaire(sectorId: string): Questionnaire | undefined {
  return questionnaires[sectorId]
}

export function getAllSectorIds(): string[] {
  return Object.keys(questionnaires)
}

export {
  industryQuestionnaire,
  academiaQuestionnaire,
  governmentQuestionnaire,
  startupsQuestionnaire,
  investorsQuestionnaire,
}
