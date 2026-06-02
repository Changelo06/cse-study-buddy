import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTopics, mockStandaloneQuizzes } from '../data/mockData';

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
};

type AppState = {
  // Progress tracking
  completedModules: string[];
  readModules: string[];
  assessmentResults: Record<string, QuizResult>; // key: assessment id
  quizResults: Record<string, QuizResult>; // key: quiz id
  
  // Actions
  completeModule: (moduleId: string) => void;
  markModuleAsRead: (moduleId: string) => void;
  saveAssessmentResult: (assessmentId: string, result: QuizResult) => void;
  saveQuizResult: (quizId: string, result: QuizResult) => void;
  resetProgress: () => void;

  // Derived state calculations (helpers)
  isModuleUnlocked: (topicId: string, moduleId: string) => boolean;
  isQuizUnlocked: (quizId: string) => boolean;
  getReadinessScore: () => number;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      completedModules: [],
      readModules: [],
      assessmentResults: {},
      quizResults: {},

      completeModule: (moduleId) => set((state) => ({
        completedModules: state.completedModules.includes(moduleId) 
          ? state.completedModules 
          : [...state.completedModules, moduleId]
      })),

      markModuleAsRead: (moduleId) => set((state) => ({
        readModules: state.readModules.includes(moduleId)
          ? state.readModules
          : [...state.readModules, moduleId]
      })),

      saveAssessmentResult: (assessmentId, result) => set((state) => ({
        assessmentResults: {
          ...state.assessmentResults,
          [assessmentId]: result
        }
      })),

      saveQuizResult: (quizId, result) => set((state) => ({
        quizResults: {
          ...state.quizResults,
          [quizId]: result
        }
      })),

      resetProgress: () => set({
        completedModules: [],
        readModules: [],
        assessmentResults: {},
        quizResults: {}
      }),

      isModuleUnlocked: (topicId, moduleId) => {
        const topic = mockTopics.find(t => t.id === topicId);
        if (!topic) return false;
        
        const moduleIndex = topic.modules.findIndex(m => m.id === moduleId);
        if (moduleIndex <= 0) return true; // First module is always unlocked

        // Previous module must be completed
        const prevModule = topic.modules[moduleIndex - 1];
        return get().completedModules.includes(prevModule.id);
      },

      isQuizUnlocked: (quizId) => {
        const quiz = mockStandaloneQuizzes.find(q => q.id === quizId);
        if (!quiz) return false;
        
        // All required modules must be in completedModules
        return quiz.requiredModuleIds.every(id => get().completedModules.includes(id));
      },

      getReadinessScore: () => {
        const state = get();
        // MVP Formula from ARCHITECTURE.md
        // Quiz accuracy: 30%, Module completion: 25%, Timed quiz: 15%, Weakness: 15%, Recent: 10%, Flashcards: 5%
        // We'll do a simplified calculation based on current mock capabilities
        
        let totalModules = 0;
        mockTopics.forEach(t => totalModules += t.modules.length);
        
        const moduleCompletionRatio = totalModules > 0 ? state.completedModules.length / totalModules : 0;
        
        const quizScores = Object.values(state.quizResults);
        const avgQuizScore = quizScores.length > 0 
          ? quizScores.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / quizScores.length
          : 0;
          
        const score = (avgQuizScore * 0.3) + (moduleCompletionRatio * 0.25) + (quizScores.length > 0 ? 0.15 : 0);
        
        // Scale to 100
        return Math.round(score * 100);
      }
    }),
    {
      name: 'cse-ready-storage',
    }
  )
);
