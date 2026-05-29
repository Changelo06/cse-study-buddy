import { Topic, Module, Lecture, Exam, Quiz, FinalExam } from "./types";

const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    question: "Identify the subject in the sentence: 'The quick brown fox jumps over the lazy dog.'",
    options: ["fox", "dog", "jumps", "brown"],
    correctAnswer: "fox",
    explanation: "The subject is the noun that is performing the action. In this case, the fox is doing the jumping.",
  },
  {
    id: "q2",
    question: "Which of the following is a compound sentence?",
    options: [
      "I like to read.",
      "I like to read, and I like to write.",
      "Because I like to read, I visit the library.",
      "Reading is my favorite hobby."
    ],
    correctAnswer: "I like to read, and I like to write.",
    explanation: "A compound sentence connects two independent clauses with a coordinating conjunction (like 'and').",
  }
];

const mockModuleExam: Exam = {
  id: "exam-eng-mod1",
  title: "Grammar Basics Exam",
  durationMinutes: 15,
  passingScore: 80,
  questions: mockQuizzes,
};

const mockLecture: Lecture = {
  id: "lec-eng-mod1",
  title: "Introduction to English Grammar",
  content: `
# English Grammar Basics

Welcome to the first lecture! Grammar is the structural foundation of our ability to express ourselves.

## Parts of Speech
Every word in the English language functions as a part of speech. The primary parts are:
1. **Nouns**: People, places, or things.
2. **Verbs**: Action words.
3. **Adjectives**: Words that describe nouns.

Review these carefully before attempting the inline quizzes!
  `,
  inlineQuizzes: mockQuizzes,
  moduleExam: mockModuleExam,
};

const mockModule: Module = {
  id: "mod-eng-1",
  title: "Grammar & Structure",
  lecture: mockLecture,
};

const finalExamEasy: FinalExam = {
  id: "easy",
  durationMinutes: 180,
  examData: {
    id: "final-eng-easy",
    title: "English Final Exam (Easy)",
    durationMinutes: 180,
    passingScore: 70,
    questions: mockQuizzes,
  }
};

const finalExamMedium: FinalExam = {
  id: "medium",
  durationMinutes: 90,
  examData: {
    id: "final-eng-medium",
    title: "English Final Exam (Medium)",
    durationMinutes: 90,
    passingScore: 75,
    questions: mockQuizzes,
  }
};

const finalExamHard: FinalExam = {
  id: "hard",
  durationMinutes: 45,
  examData: {
    id: "final-eng-hard",
    title: "English Final Exam (Hard)",
    durationMinutes: 45,
    passingScore: 80,
    questions: mockQuizzes,
  }
};

export const topicsData: Topic[] = [
  {
    id: "english",
    title: "English",
    description: "Grammar, vocabulary, reading comprehension, and paragraph organization.",
    bgColor: "bg-brand-blue",
    icon: "En",
    modules: [mockModule, { ...mockModule, id: "mod-eng-2", title: "Reading Comprehension" }],
    finalExams: [finalExamEasy, finalExamMedium, finalExamHard],
  },
  {
    id: "filipino",
    title: "Filipino",
    description: "Balarila, talasalitaan, pag-unawa sa binasa, at pagsasaayos ng mga pangungusap.",
    bgColor: "bg-brand-yellow",
    icon: "Fi",
    modules: [],
    finalExams: [],
  },
  {
    id: "math",
    title: "Mathematics",
    description: "Basic operations, word problems, fractions, percentages, ratios, and sequences.",
    bgColor: "bg-brand-pink",
    icon: "№",
    modules: [],
    finalExams: [],
  },
  {
    id: "clerical",
    title: "Clerical Ops",
    description: "Filing, spelling, and clerical accuracy for the Subprofessional level.",
    bgColor: "bg-brand-teal",
    icon: "Cl",
    modules: [],
    finalExams: [],
  },
  {
    id: "logic",
    title: "Logic Analysis",
    description: "Logical reasoning, analogies, syllogisms, and pattern analysis.",
    bgColor: "bg-brand-orange",
    icon: "Lo",
    modules: [],
    finalExams: [],
  },
  {
    id: "geninfo",
    title: "General Info",
    description: "Current events, Philippine history, geography, and cultural literacy.",
    bgColor: "bg-brand-orange",
    icon: "Gi",
    modules: [],
    finalExams: [],
  },
  {
    id: "ethics",
    title: "Ethics & Public",
    description: "RA 6713 norms of conduct for public officials and employees.",
    bgColor: "bg-brand-pink",
    icon: "Co",
    modules: [],
    finalExams: [],
  }
];

// Helper functions to fetch data
export const getTopicById = (id: string) => topicsData.find(t => t.id === id);
export const getModuleById = (topicId: string, moduleId: string) => {
  const topic = getTopicById(topicId);
  return topic?.modules.find(m => m.id === moduleId);
};
