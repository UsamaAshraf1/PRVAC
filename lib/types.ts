// Question Types for NTFRAS Questionnaire

export type QuestionType =
  | "select" // Single selection from options
  | "multi-select" // Multiple selection from options
  | "number" // Numeric input
  | "percentage" // 0-100% input
  | "text" // Free text input
  | "likert" // 1-5 scale rating
  | "likert-matrix" // Matrix of 1-5 ratings for multiple items
  | "rank" // Rank top N from options
  | "multi-row" // Multiple row entries (e.g., vendor details)
  | "multi-number" // Multiple numeric inputs (e.g., Y1, Y2, Y3)
  | "percentage-split" // Percentage distribution across options (must sum to 100)
  | "composite" // Combination of multiple input types

export interface QuestionOption {
  value: string
  label: string
}

export interface LikertItem {
  id: string
  label: string
  category?: string // For grouping in matrix view
}

export interface RowField {
  key: string
  label: string
  type: "text" | "number" | "select"
  options?: QuestionOption[]
  placeholder?: string
}

export interface CompositeField {
  key: string
  label: string
  type: QuestionType
  options?: QuestionOption[]
  items?: LikertItem[]
  required?: boolean
}

export interface Question {
  id: string
  section: string
  sectionTitle: string
  question: string
  description?: string
  type: QuestionType
  options?: QuestionOption[]
  items?: LikertItem[] // For likert-matrix
  rowFields?: RowField[] // For multi-row
  maxRows?: number // For multi-row
  numberFields?: { key: string; label: string }[] // For multi-number
  compositeFields?: CompositeField[] // For composite
  rankCount?: number // For rank type
  maxChars?: number // For text type
  required?: boolean
  confidenceLikert?: boolean // Add confidence rating
  prascOptIn?: boolean // Add PRASC opt-in checkbox
}

export interface Section {
  id: string
  title: string
  description?: string
  questionIds: string[]
}

export interface Questionnaire {
  id: string
  title: string
  description: string
  sections: Section[]
  questions: Record<string, Question>
}

export interface QuestionResponse {
  questionId: string
  value: unknown
  confidence?: number
  prascOptIn?: boolean
  updatedAt: string
}

export interface QuestionnaireProgress {
  sectorId: string
  responses: Record<string, QuestionResponse>
  currentSection: number
  currentQuestion: number
  startedAt: string
  lastUpdatedAt: string
  completedAt?: string
}

export interface UserSession {
  id: string
  createdAt: string
  progress: Record<string, QuestionnaireProgress>
}

// RAS Capability Families - Used across multiple questionnaires
export const RAS_CAPABILITIES = {
  mechanical: {
    title: "Mechanical Robotics & Hardware",
    items: [
      { id: "industrial_robot_arms", label: "Industrial robot arms (6-axis manipulators)" },
      { id: "cobots", label: "Collaborative robots (cobots)" },
      { id: "mobile_robots", label: "Mobile robots (AGV/AMR/UGV)" },
      { id: "aerial_platforms", label: "Aerial platforms (UAVs/drones)" },
      { id: "end_effectors", label: "End-effectors & grippers" },
      { id: "mechanical_design", label: "Mechanical design & kinematics" },
      { id: "actuation_motor", label: "Actuation & motor control" },
      { id: "sensor_hardware", label: "Sensor hardware & integration" },
      { id: "hardware_miniaturisation", label: "Hardware miniaturisation & embedded systems" },
    ],
  },
  perception: {
    title: "Perception, AI & Software",
    items: [
      { id: "computer_vision", label: "Computer vision systems" },
      { id: "ai_defect", label: "AI defect classification & quality inspection" },
      { id: "predictive_maintenance", label: "Predictive maintenance (AI/ML)" },
      { id: "slam_navigation", label: "SLAM & autonomous navigation" },
      { id: "edge_ai", label: "Edge AI inference" },
      { id: "sensor_fusion", label: "Sensor fusion & multimodal perception" },
      { id: "digital_twin", label: "Digital twin & simulation" },
      { id: "generative_ai", label: "Generative AI & LLM applications" },
    ],
  },
  integration: {
    title: "Systems Integration & Compliance",
    items: [
      { id: "system_integration", label: "System integration (end-to-end)" },
      { id: "industrial_iot", label: "Industrial IoT & connectivity" },
      { id: "cybersecurity", label: "Cybersecurity (OT/ICS)" },
      { id: "hri_safety", label: "Human-Robot Interaction & safety" },
      { id: "aftermarket_service", label: "Aftermarket service & lifecycle support" },
      { id: "validation_testing", label: "Validation, testing & certification" },
      { id: "standards_compliance", label: "Standards compliance (ISO 10218, ISO 13482, IEC 61508)" },
    ],
  },
}

// All RAS capabilities flattened
export const ALL_RAS_CAPABILITIES: LikertItem[] = [
  ...RAS_CAPABILITIES.mechanical.items.map((item) => ({
    ...item,
    category: RAS_CAPABILITIES.mechanical.title,
  })),
  ...RAS_CAPABILITIES.perception.items.map((item) => ({
    ...item,
    category: RAS_CAPABILITIES.perception.title,
  })),
  ...RAS_CAPABILITIES.integration.items.map((item) => ({
    ...item,
    category: RAS_CAPABILITIES.integration.title,
  })),
]
