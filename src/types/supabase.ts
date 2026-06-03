/**
 * Supabase Database Types
 * 
 * Hand-written types matching the DATABASE.md schema.
 * Replace with auto-generated types via `npx supabase gen types typescript` once CLI is set up.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type QuestionOption = {
  id: string;        // e.g. "A", "B", "C", "D", "E"
  text: string;
  is_correct: boolean;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Relationships: any[];
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          bg_color: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon?: string;
          bg_color?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          bg_color?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: any[];
      };
      modules: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          description: string;
          content: string;
          difficulty: 'easy' | 'medium' | 'hard';
          estimated_minutes: number;
          order_index: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          description?: string;
          content?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          estimated_minutes?: number;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          description?: string;
          content?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          estimated_minutes?: number;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: any[];
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string;
          lesson_id: string | null;
          required_module_id: string | null;
          time_limit_minutes: number;
          is_final_exam: boolean;
          passing_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          lesson_id?: string | null;
          required_module_id?: string | null;
          time_limit_minutes?: number;
          is_final_exam?: boolean;
          passing_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          lesson_id?: string | null;
          required_module_id?: string | null;
          time_limit_minutes?: number;
          is_final_exam?: boolean;
          passing_score?: number;
          created_at?: string;
        };
        Relationships: any[];
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string | null;
          module_id: string | null;
          text: string;
          options: QuestionOption[];
          explanation: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id?: string | null;
          module_id?: string | null;
          text: string;
          options: QuestionOption[];
          explanation?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string | null;
          module_id?: string | null;
          text?: string;
          options?: QuestionOption[];
          explanation?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: any[];
      };
      user_module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          status: 'in_progress' | 'completed';
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          status?: 'in_progress' | 'completed';
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          status?: 'in_progress' | 'completed';
          completed_at?: string | null;
        };
        Relationships: any[];
      };
      user_quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string | null;
          module_id: string | null;
          score: number;
          total_questions: number;
          time_used_seconds: number;
          answers_data: Json;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id?: string | null;
          module_id?: string | null;
          score: number;
          total_questions: number;
          time_used_seconds?: number;
          answers_data?: Json;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string | null;
          module_id?: string | null;
          score?: number;
          total_questions?: number;
          time_used_seconds?: number;
          answers_data?: Json;
          completed_at?: string;
        };
        Relationships: any[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type Module = Database['public']['Tables']['modules']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type UserModuleProgress = Database['public']['Tables']['user_module_progress']['Row'];
export type UserQuizResult = Database['public']['Tables']['user_quiz_results']['Row'];
