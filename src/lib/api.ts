/**
 * Supabase Data Layer
 * 
 * All database queries go through this module.
 * When Supabase is not configured, functions return null and callers
 * should fall back to mock data.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type {
  Lesson,
  Module,
  Quiz,
  Question,
  UserModuleProgress,
  UserQuizResult,
} from '@/types/supabase';

// ============================================================
// Lessons
// ============================================================

export async function fetchLessons(): Promise<Lesson[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchLessons:', error.message); return null; }
  return data;
}

export async function fetchLessonById(id: string): Promise<Lesson | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('[api] fetchLessonById:', error.message); return null; }
  return data;
}

// ============================================================
// Modules
// ============================================================

export async function fetchModulesByLesson(lessonId: string): Promise<Module[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchModulesByLesson:', error.message); return null; }
  return data;
}

export async function fetchModuleById(moduleId: string): Promise<Module | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single();
  if (error) { console.error('[api] fetchModuleById:', error.message); return null; }
  return data;
}

// ============================================================
// Quizzes
// ============================================================

export async function fetchQuizzes(): Promise<Quiz[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('[api] fetchQuizzes:', error.message); return null; }
  return data;
}

export async function fetchQuizById(quizId: string): Promise<Quiz | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
  if (error) { console.error('[api] fetchQuizById:', error.message); return null; }
  return data;
}

// ============================================================
// Questions
// ============================================================

export async function fetchQuestionsByQuiz(quizId: string): Promise<Question[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchQuestionsByQuiz:', error.message); return null; }
  return data;
}

export async function fetchQuestionsByModule(moduleId: string): Promise<Question[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchQuestionsByModule:', error.message); return null; }
  return data;
}

// ============================================================
// User Module Progress
// ============================================================

export async function fetchUserProgress(userId: string): Promise<UserModuleProgress[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('user_module_progress')
    .select('*')
    .eq('user_id', userId);
  if (error) { console.error('[api] fetchUserProgress:', error.message); return null; }
  return data;
}

export async function saveModuleProgress(
  userId: string,
  moduleId: string,
  status: 'in_progress' | 'completed'
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;
  const { error } = await supabase
    .from('user_module_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,module_id' }
    );
  if (error) { console.error('[api] saveModuleProgress:', error.message); return false; }
  return true;
}

// ============================================================
// User Quiz Results
// ============================================================

export async function fetchUserQuizResults(userId: string): Promise<UserQuizResult[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase
    .from('user_quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  if (error) { console.error('[api] fetchUserQuizResults:', error.message); return null; }
  return data;
}

export async function saveQuizResult(
  userId: string,
  result: {
    quizId?: string;
    moduleId?: string;
    score: number;
    totalQuestions: number;
    timeUsedSeconds: number;
    answersData: Record<string, string>;
  }
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;
  const { error } = await supabase
    .from('user_quiz_results')
    .insert({
      user_id: userId,
      quiz_id: result.quizId || null,
      module_id: result.moduleId || null,
      score: result.score,
      total_questions: result.totalQuestions,
      time_used_seconds: result.timeUsedSeconds,
      answers_data: result.answersData,
    });
  if (error) { console.error('[api] saveQuizResult:', error.message); return false; }
  return true;
}

// ============================================================
// Admin: CRUD Operations
// ============================================================

export async function createLesson(lesson: { title: string; description: string; icon: string; bg_color: string; order_index: number }) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('lessons').insert(lesson).select().single();
  if (error) { console.error('[api] createLesson:', error.message); return null; }
  return data;
}

export async function updateLesson(id: string, updates: Partial<Lesson>) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('lessons').update(updates).eq('id', id).select().single();
  if (error) { console.error('[api] updateLesson:', error.message); return null; }
  return data;
}

export async function deleteLesson(id: string) {
  if (!supabase) return false;
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) { console.error('[api] deleteLesson:', error.message); return false; }
  return true;
}

export async function createModule(module: { lesson_id: string; title: string; description: string; content: string; difficulty: 'easy' | 'medium' | 'hard'; estimated_minutes: number; order_index: number; is_published: boolean }) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('modules').insert(module).select().single();
  if (error) { console.error('[api] createModule:', error.message); return null; }
  return data;
}

export async function updateModule(id: string, updates: Partial<Module>) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('modules').update(updates).eq('id', id).select().single();
  if (error) { console.error('[api] updateModule:', error.message); return null; }
  return data;
}

export async function deleteModule(id: string) {
  if (!supabase) return false;
  const { error } = await supabase.from('modules').delete().eq('id', id);
  if (error) { console.error('[api] deleteModule:', error.message); return false; }
  return true;
}

export async function createQuestion(question: { quiz_id?: string; module_id?: string; text: string; options: any; explanation: string; order_index: number }) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('questions').insert(question).select().single();
  if (error) { console.error('[api] createQuestion:', error.message); return null; }
  return data;
}

export async function updateQuestion(id: string, updates: Partial<Question>) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('questions').update(updates).eq('id', id).select().single();
  if (error) { console.error('[api] updateQuestion:', error.message); return null; }
  return data;
}

export async function deleteQuestion(id: string) {
  if (!supabase) return false;
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) { console.error('[api] deleteQuestion:', error.message); return false; }
  return true;
}

// Fetch all modules (for admin, unfiltered by published status)
export async function fetchAllModules(): Promise<Module[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('lesson_id')
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchAllModules:', error.message); return null; }
  return data;
}

// Fetch all questions (for admin)
export async function fetchAllQuestions(): Promise<Question[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) { console.error('[api] fetchAllQuestions:', error.message); return null; }
  return data;
}
