import { Topic, Quiz, FinalExam, FinalExamTier, Question, ModuleContent, Module } from "./types";
import { generateMockQuestions } from "./mockQuestions";

// ---------------------------------------------------------------------------
// Placeholder question generator (A-D simple format for module assessments)
// ---------------------------------------------------------------------------
const dummyQuestions: Question[] = [
  {
    id: "q1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: "Option A",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Option A is the correct answer based on the reading.",
  },
  {
    id: "q2",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: "Option C",
    explanation: "Option C is correct because sed do eiusmod tempor incididunt.",
  },
  {
    id: "q3",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris?",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: "Option B",
    explanation: "Option B is correct due to nostrud exercitation ullamco.",
  },
  {
    id: "q4",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore?",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: "Option D",
    explanation: "Option D is correct as per the established rules of irure dolor.",
  },
  {
    id: "q5",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa?",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    correctAnswer: "Option E",
    explanation: "Option E is correct. Excepteur sint occaecat explains the reasoning.",
  },
];

// ---------------------------------------------------------------------------
// Structured module content builder
// ---------------------------------------------------------------------------
function makeStructuredContent(topicLabel: string, moduleLabel: string): ModuleContent {
  return {
    overview: `This module covers the essential concepts of ${moduleLabel} within the ${topicLabel} subject area. By the end of this module, you will understand the key principles, be able to apply them to practice problems, and identify common patterns that appear in Civil Service Examinations.`,
    discussion: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    keyTerms: [
      { term: "Lorem Ipsum", definition: "A placeholder term representing the foundational concept of this module." },
      { term: "Consectetur", definition: "Refers to the process of building upon basic principles to form complex understanding." },
      { term: "Adipiscing", definition: "The method of analyzing problems step by step to reach a conclusion." },
      { term: "Tempor Incididunt", definition: "A strategy for managing time-sensitive questions during timed exams." },
    ],
    examples: [
      {
        title: "Example 1: Basic Application",
        content: "Given the concept of Lorem Ipsum, determine which of the following best applies to a real-world scenario. The answer is Option A because the foundational rule dictates that the base concept applies first before any modifications.",
      },
      {
        title: "Example 2: Exception to the Rule",
        content: "In certain cases, the standard Lorem Ipsum rule does not apply. For instance, when Consectetur is combined with Adipiscing, the result follows a different pattern. This is important for questions that test edge cases.",
      },
    ],
    references: [
      { title: "Philippine Civil Service Examination Guide", source: "Civil Service Commission" },
      { title: `${topicLabel}: A Comprehensive Review`, source: "CSE Review Materials, 2024 Edition" },
      { title: "Republic Act No. 6713", source: "Official Gazette of the Republic of the Philippines" },
    ],
  };
}

const loremContent = `
# Lorem Ipsum Module

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

## Key Terms
- **Lorem**: Ipsum dolor sit amet.
- **Consectetur**: Adipiscing elit sed do.

## Examples
1. Example one demonstrates how to apply the concept of lorem.
2. Example two shows the exception to the ipsum rule.

> **Note**: Always remember to check your work when doing consectetur adipiscing.
`;

// ---------------------------------------------------------------------------
// Module builder
// ---------------------------------------------------------------------------
function makeModule(
  id: string,
  title: string,
  description: string,
  difficulty: Module["difficulty"],
  estimatedMinutes: number,
  topicTitle: string,
  assessmentId: string,
  assessmentTitle: string,
  passingScore: number,
  assessmentDuration: number,
): Module {
  return {
    id,
    title,
    description,
    content: loremContent,
    structuredContent: makeStructuredContent(topicTitle, title),
    difficulty,
    estimatedMinutes,
    assessment: {
      id: assessmentId,
      title: assessmentTitle,
      passingScore,
      durationMinutes: assessmentDuration,
      questions: dummyQuestions,
    },
  };
}

// ---------------------------------------------------------------------------
// Topics & Modules
// ---------------------------------------------------------------------------
export const mockTopics: Topic[] = [
  {
    id: "english",
    title: "English",
    description: "Grammar, vocabulary, reading comprehension, and paragraph organization.",
    bgColor: "bg-brand-blue",
    icon: "En",
    modules: [
      makeModule("mod-eng-1", "Grammar Basics", "Learn the foundational rules of English grammar.", "Easy", 15, "English", "asm-eng-1", "Grammar Basics Assessment", 70, 15),
      makeModule("mod-eng-2", "Sentence Structure", "Understand complex and compound sentences.", "Medium", 20, "English", "asm-eng-2", "Sentence Structure Assessment", 70, 20),
      makeModule("mod-eng-3", "Reading Comprehension", "Strategies for quickly understanding written passages.", "Hard", 25, "English", "asm-eng-3", "Reading Comprehension Assessment", 75, 25),
    ],
  },
  {
    id: "math",
    title: "Mathematics",
    description: "Basic operations, word problems, fractions, percentages, ratios, and sequences.",
    bgColor: "bg-brand-pink",
    icon: "№",
    modules: [
      makeModule("mod-math-1", "Fractions & Decimals", "Mastering fractions and decimal operations.", "Medium", 30, "Mathematics", "asm-math-1", "Fractions & Decimals Assessment", 75, 20),
    ],
  },
  {
    id: "logic",
    title: "Logic Analysis",
    description: "Logical reasoning, analogies, syllogisms, and pattern analysis.",
    bgColor: "bg-brand-orange",
    icon: "Lo",
    modules: [],
  },
  {
    id: "filipino",
    title: "Filipino",
    description: "Balarila, talasalitaan, pag-unawa sa binasa, at pagsasaayos ng mga pangungusap.",
    bgColor: "bg-brand-yellow",
    icon: "Fi",
    modules: [],
  },
  {
    id: "clerical",
    title: "Clerical Ops",
    description: "Filing, spelling, and clerical accuracy for the Subprofessional level.",
    bgColor: "bg-brand-teal",
    icon: "Cl",
    modules: [],
  },
  {
    id: "geninfo",
    title: "General Info",
    description: "Current events, Philippine history, geography, and cultural literacy.",
    bgColor: "bg-[#ff3f77]",
    icon: "Gi",
    modules: [],
  },
];

// ---------------------------------------------------------------------------
// Standalone Quizzes
// ---------------------------------------------------------------------------
export const mockStandaloneQuizzes: Quiz[] = [
  {
    id: "quiz-eng-1",
    title: "English Mastery Quiz",
    description: "Test your grammar and vocabulary knowledge.",
    topicId: "english",
    requiredModuleIds: ["mod-eng-1", "mod-eng-2"],
    durationMinutes: 15,
    questions: [...dummyQuestions, ...dummyQuestions],
  },
  {
    id: "quiz-math-1",
    title: "Math Fundamentals",
    description: "Speed test on basic mathematical operations.",
    topicId: "math",
    requiredModuleIds: ["mod-math-1"],
    durationMinutes: 20,
    questions: dummyQuestions,
  },
];

// ---------------------------------------------------------------------------
// Final Exam Tier builder
// ---------------------------------------------------------------------------
function makeFinalExamTier(
  topicId: string,
  tier: 1 | 2 | 3,
  durationMinutes: number,
): FinalExamTier {
  const id = `${topicId}-tier-${tier}`;
  return {
    id,
    tier,
    label: `Tier ${tier}`,
    itemCount: 60,
    durationMinutes,
    passingScore: 70,
    questions: generateMockQuestions(`final-${id}`, 60),
  };
}

// ---------------------------------------------------------------------------
// Final Exams — one per topic with 3 freely-selectable tiers
// Each tier has 60 items at different time limits:
//   Tier 1: 120 minutes (relaxed)
//   Tier 2:  90 minutes (moderate)
//   Tier 3:  60 minutes (challenge)
// ---------------------------------------------------------------------------
function makeFinalExam(topicId: string, title: string): FinalExam {
  return {
    id: `final-${topicId}`,
    topicId,
    title,
    tiers: [
      makeFinalExamTier(topicId, 1, 120),
      makeFinalExamTier(topicId, 2, 90),
      makeFinalExamTier(topicId, 3, 60),
    ],
  };
}

export const mockFinalExams: FinalExam[] = [
  makeFinalExam("english", "English Final Exam"),
  makeFinalExam("math", "Mathematics Final Exam"),
  makeFinalExam("logic", "Logic Analysis Final Exam"),
  makeFinalExam("filipino", "Filipino Final Exam"),
  makeFinalExam("clerical", "Clerical Ops Final Exam"),
  makeFinalExam("geninfo", "General Info Final Exam"),
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
export const getTopicById = (id: string) => mockTopics.find((t) => t.id === id);

export const getModuleById = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find((m) => m.id === moduleId);
};

export const getQuizById = (id: string) => mockStandaloneQuizzes.find((q) => q.id === id);

export const getFinalExamForTopic = (topicId: string) =>
  mockFinalExams.find((e) => e.topicId === topicId);

export const getFinalExamTier = (topicId: string, tierId: string) => {
  const exam = getFinalExamForTopic(topicId);
  return exam?.tiers.find((t) => t.id === tierId);
};

// Legacy — kept for backwards compat but prefer getFinalExamForTopic
export const getFinalExamById = (id: string) => mockFinalExams.find((e) => e.id === id);
