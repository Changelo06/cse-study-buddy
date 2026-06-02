import { Topic, Quiz, FinalExam, Question } from "./types";

const dummyQuestions: Question[] = [
  {
    id: "q1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A",
    explanation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Option A is the correct answer based on the reading.",
  },
  {
    id: "q2",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option C",
    explanation: "Option C is correct because sed do eiusmod tempor incididunt.",
  },
  {
    id: "q3",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option B",
    explanation: "Option B is correct due to nostrud exercitation ullamco.",
  }
];

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

export const mockTopics: Topic[] = [
  {
    id: "english",
    title: "English",
    description: "Grammar, vocabulary, reading comprehension, and paragraph organization.",
    bgColor: "bg-brand-blue",
    icon: "En",
    modules: [
      {
        id: "mod-eng-1",
        title: "Grammar Basics",
        description: "Learn the foundational rules of English grammar.",
        content: loremContent,
        difficulty: "Easy",
        estimatedMinutes: 15,
        assessment: {
          id: "asm-eng-1",
          title: "Grammar Basics Assessment",
          passingScore: 70,
          durationMinutes: 15,
          questions: dummyQuestions,
        }
      },
      {
        id: "mod-eng-2",
        title: "Sentence Structure",
        description: "Understand complex and compound sentences.",
        content: loremContent,
        difficulty: "Medium",
        estimatedMinutes: 20,
        assessment: {
          id: "asm-eng-2",
          title: "Sentence Structure Assessment",
          passingScore: 70,
          durationMinutes: 20,
          questions: dummyQuestions,
        }
      },
      {
        id: "mod-eng-3",
        title: "Reading Comprehension",
        description: "Strategies for quickly understanding written passages.",
        content: loremContent,
        difficulty: "Hard",
        estimatedMinutes: 25,
        assessment: {
          id: "asm-eng-3",
          title: "Reading Comprehension Assessment",
          passingScore: 75,
          durationMinutes: 25,
          questions: dummyQuestions,
        }
      }
    ]
  },
  {
    id: "math",
    title: "Mathematics",
    description: "Basic operations, word problems, fractions, percentages, ratios, and sequences.",
    bgColor: "bg-brand-pink",
    icon: "№",
    modules: [
      {
        id: "mod-math-1",
        title: "Fractions & Decimals",
        description: "Mastering fractions and decimal operations.",
        content: loremContent,
        difficulty: "Medium",
        estimatedMinutes: 30,
        assessment: {
          id: "asm-math-1",
          title: "Fractions & Decimals Assessment",
          passingScore: 75,
          durationMinutes: 20,
          questions: dummyQuestions,
        }
      }
    ]
  },
  {
    id: "logic",
    title: "Logic Analysis",
    description: "Logical reasoning, analogies, syllogisms, and pattern analysis.",
    bgColor: "bg-brand-orange",
    icon: "Lo",
    modules: []
  },
  {
    id: "filipino",
    title: "Filipino",
    description: "Balarila, talasalitaan, pag-unawa sa binasa, at pagsasaayos ng mga pangungusap.",
    bgColor: "bg-brand-yellow",
    icon: "Fi",
    modules: []
  },
  {
    id: "clerical",
    title: "Clerical Ops",
    description: "Filing, spelling, and clerical accuracy for the Subprofessional level.",
    bgColor: "bg-brand-teal",
    icon: "Cl",
    modules: []
  },
  {
    id: "geninfo",
    title: "General Info",
    description: "Current events, Philippine history, geography, and cultural literacy.",
    bgColor: "bg-[#ff3f77]",
    icon: "Gi",
    modules: []
  }
];

export const mockStandaloneQuizzes: Quiz[] = [
  {
    id: "quiz-eng-1",
    title: "English Mastery Quiz",
    description: "Test your grammar and vocabulary knowledge.",
    topicId: "english",
    requiredModuleIds: ["mod-eng-1", "mod-eng-2"],
    durationMinutes: 15,
    questions: [...dummyQuestions, ...dummyQuestions], // just doubling for length
  },
  {
    id: "quiz-math-1",
    title: "Math Fundamentals",
    description: "Speed test on basic mathematical operations.",
    topicId: "math",
    requiredModuleIds: ["mod-math-1"],
    durationMinutes: 20,
    questions: dummyQuestions,
  }
];

export const mockFinalExams: FinalExam[] = [
  {
    id: "final-mock-1",
    title: "CSE Full Mock Exam 1",
    durationMinutes: 180,
    questions: [...dummyQuestions, ...dummyQuestions, ...dummyQuestions], // simplified
  }
];

// Helper functions for easy access
export const getTopicById = (id: string) => mockTopics.find(t => t.id === id);
export const getModuleById = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find(m => m.id === moduleId);
};
export const getQuizById = (id: string) => mockStandaloneQuizzes.find(q => q.id === id);
export const getFinalExamById = (id: string) => mockFinalExams.find(e => e.id === id);
