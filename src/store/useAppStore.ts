import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTopics, mockStandaloneQuizzes } from '../data/mockData';
import { saveModuleProgress, saveQuizResult as saveQuizResultApi, fetchUserProgress, fetchUserQuizResults } from '@/lib/api';

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
};

type AppState = {
  // Auth (synced from useAuth)
  userId: string | null;

  // Progress tracking
  completedModules: string[];
  readModules: string[];
  assessmentResults: Record<string, QuizResult>; // key: assessment id
  quizResults: Record<string, QuizResult>; // key: quiz id
  
  // Actions
  setUserId: (userId: string | null) => void;
  completeModule: (moduleId: string) => void;
  markModuleAsRead: (moduleId: string) => void;
  saveAssessmentResult: (assessmentId: string, result: QuizResult) => void;
  saveQuizResult: (quizId: string, result: QuizResult) => void;
  resetProgress: () => void;

  // Hydrate from Supabase
  hydrateFromSupabase: (userId: string) => Promise<void>;

  // Derived state calculations (helpers)
  isModuleUnlocked: (topicId: string, moduleId: string) => boolean;
  isQuizUnlocked: (quizId: string) => boolean;
  getReadinessScore: () => number;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      completedModules: [],
      readModules: [],
      assessmentResults: {},
      quizResults: {},

      setUserId: (userId) => set({ userId }),

      completeModule: (moduleId) => {
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId) 
            ? state.completedModules 
            : [...state.completedModules, moduleId]
        }));

        // Write-through to Supabase
        const userId = get().userId;
        if (userId) {
          saveModuleProgress(userId, moduleId, 'completed').catch((err) =>
            console.error('[store] Failed to sync module progress:', err)
          );
        }
      },

      markModuleAsRead: (moduleId) => {
        set((state) => ({
          readModules: state.readModules.includes(moduleId)
            ? state.readModules
            : [...state.readModules, moduleId]
        }));

        // Write-through to Supabase
        const userId = get().userId;
        if (userId) {
          saveModuleProgress(userId, moduleId, 'in_progress').catch((err) =>
            console.error('[store] Failed to sync module read:', err)
          );
        }
      },

      saveAssessmentResult: (assessmentId, result) => {
        set((state) => ({
          assessmentResults: {
            ...state.assessmentResults,
            [assessmentId]: result
          }
        }));

        // Write-through to Supabase
        const userId = get().userId;
        if (userId) {
          saveQuizResultApi(userId, {
            moduleId: assessmentId,
            score: result.score,
            totalQuestions: result.total,
            timeUsedSeconds: result.timeSpentSeconds,
            answersData: {},
          }).catch((err) =>
            console.error('[store] Failed to sync assessment result:', err)
          );
        }
      },

      saveQuizResult: (quizId, result) => {
        set((state) => ({
          quizResults: {
            ...state.quizResults,
            [quizId]: result
          }
        }));

        // Write-through to Supabase
        const userId = get().userId;
        if (userId) {
          saveQuizResultApi(userId, {
            quizId,
            score: result.score,
            totalQuestions: result.total,
            timeUsedSeconds: result.timeSpentSeconds,
            answersData: {},
          }).catch((err) =>
            console.error('[store] Failed to sync quiz result:', err)
          );
        }
      },

      resetProgress: () => set({
        completedModules: [],
        readModules: [],
        assessmentResults: {},
        quizResults: {}
      }),

      /**
       * Hydrate local state from Supabase on login.
       * Merges remote data with any local-only progress (offline resilience).
       */
      hydrateFromSupabase: async (userId: string) => {
        try {
          const [progressRows, quizResultRows] = await Promise.all([
            fetchUserProgress(userId),
            fetchUserQuizResults(userId),
          ]);

          if (progressRows) {
            const completedFromDb = progressRows
              .filter((p) => p.status === 'completed')
              .map((p) => p.module_id);
            const readFromDb = progressRows.map((p) => p.module_id);

            set((state) => ({
              completedModules: [...new Set([...state.completedModules, ...completedFromDb])],
              readModules: [...new Set([...state.readModules, ...readFromDb])],
            }));
          }

          if (quizResultRows) {
            const quizResultsFromDb: Record<string, QuizResult> = {};
            for (const row of quizResultRows) {
              const key = row.quiz_id || row.module_id || row.id;
              // Only keep the latest result per quiz/module
              if (!quizResultsFromDb[key]) {
                quizResultsFromDb[key] = {
                  score: row.score,
                  total: row.total_questions,
                  passed: row.score >= (row.total_questions * 0.7),
                  timeSpentSeconds: row.time_used_seconds,
                  completedAt: row.completed_at,
                };
              }
            }

            set((state) => ({
              quizResults: { ...quizResultsFromDb, ...state.quizResults },
            }));
          }
        } catch (err) {
          console.error('[store] Failed to hydrate from Supabase:', err);
        }
      },

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
