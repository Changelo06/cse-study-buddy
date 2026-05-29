export type Quiz = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Exam = {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  questions: Quiz[];
};

export type Lecture = {
  id: string;
  title: string;
  content: string; // Markdown or HTML string
  inlineQuizzes: Quiz[]; // Short quizzes embedded during the lecture
  moduleExam: Exam; // The overall exam at the end of the lecture/module
};

export type Module = {
  id: string;
  title: string;
  lecture: Lecture; 
};

export type FinalExam = {
  id: "hard" | "medium" | "easy";
  durationMinutes: 45 | 90 | 180; // Hard: 45 mins, Medium: 90 mins, Easy: 180 mins
  examData: Exam;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  finalExams: FinalExam[];
  // Metadata for the UI Grid
  bgColor?: string;
  icon?: string; 
};
