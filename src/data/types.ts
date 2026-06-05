import type { QuizQuestion } from "./mockQuestions";

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Assessment = {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number; 
  durationMinutes: number;
};

/** Structured content sections for a module reading page */
export type ModuleContent = {
  overview: string;
  discussion: string;
  keyTerms: { term: string; definition: string }[];
  examples: { title: string; content: string }[];
  references: { title: string; source: string }[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  content: string;           // Legacy flat content string
  structuredContent: ModuleContent; // Structured sections for the reading page
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  assessment: Assessment;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  modules: Module[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  topicId: string | "mixed"; // can be a specific topic or mixed topics
  requiredModuleIds: string[]; // prerequisites
  durationMinutes: number;
  questions: Question[];
};

/**
 * A single tier of a final exam.
 * All 3 tiers unlock simultaneously once the user completes all modules in the lesson.
 * The user can freely choose any tier in any order.
 *
 * Note: questions use the QuizQuestion format (from mockQuestions.ts) which has
 * structured A-E options as { id, text } objects and correctOptionId.
 * This is a different shape from the simple `Question` type used in module assessments.
 */
export type FinalExamTier = {
  id: string;             // e.g. "tier-1", "tier-2", "tier-3"
  tier: 1 | 2 | 3;
  label: string;          // "Tier 1", "Tier 2", "Tier 3"
  itemCount: number;      // Always 60
  durationMinutes: number; // Tier 1: 120, Tier 2: 90, Tier 3: 60
  passingScore: number;   // percentage threshold
  questions: QuizQuestion[];
};

/**
 * A final exam for a specific lesson/topic.
 * Contains 3 tiers, each with 60 items at different time limits.
 */
export type FinalExam = {
  id: string;
  topicId: string;
  title: string;
  tiers: FinalExamTier[];
};
