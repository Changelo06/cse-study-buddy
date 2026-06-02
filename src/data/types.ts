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

export type Module = {
  id: string;
  title: string;
  description: string;
  content: string; 
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

export type FinalExam = {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
};
