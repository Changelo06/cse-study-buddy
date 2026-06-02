# Database Schema & Integration Plan (DATABASE.md)

This document outlines the planned database structure for CSE Ready. We will use **Supabase** (PostgreSQL) for our backend, utilizing Supabase Auth for user management and its robust Row Level Security (RLS) for data protection.

## Core Schema Design

### 1. `profiles`
Extends the default `auth.users` table provided by Supabase.
- `id` (uuid, primary key, references `auth.users.id`)
- `email` (text)
- `full_name` (text, nullable)
- `created_at` (timestamp, default now())

### 2. `lessons`
Represents the main topic categories (e.g., English, Math/Logic).
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `order_index` (int) - For sequential display
- `created_at` (timestamp)

### 3. `modules`
The individual reading materials and stepping stones within a lesson.
- `id` (uuid, primary key)
- `lesson_id` (uuid, references `lessons.id`)
- `title` (text)
- `content` (text) - Stored as markdown or HTML
- `difficulty` (text) - 'easy', 'medium', 'hard'
- `order_index` (int) - For sequential module locking logic
- `is_published` (boolean)
- `created_at` (timestamp)

### 4. `quizzes`
Standalone timed quizzes, tests, and the final exam.
- `id` (uuid, primary key)
- `title` (text)
- `lesson_id` (uuid, references `lessons.id`, nullable for final exam)
- `required_module_id` (uuid, references `modules.id`, nullable) - Prerequisite unlocking
- `time_limit_minutes` (int)
- `is_final_exam` (boolean, default false)
- `created_at` (timestamp)

### 5. `questions`
Holds the individual multiple-choice items. Associated with either a Quiz or a Module (for end-of-module assessments).
- `id` (uuid, primary key)
- `quiz_id` (uuid, references `quizzes.id`, nullable)
- `module_id` (uuid, references `modules.id`, nullable)
- `text` (text) - The question body
- `options` (jsonb) - E.g., `[{"id": "A", "text": "...", "is_correct": false}, {"id": "B", "text": "...", "is_correct": true}]`
- `explanation` (text) - Shown only after completion
- `order_index` (int)
- `created_at` (timestamp)

### 6. `user_module_progress`
Tracks which modules a user has finished.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`)
- `module_id` (uuid, references `modules.id`)
- `status` (text) - 'in_progress', 'completed'
- `completed_at` (timestamp, nullable)

### 7. `user_quiz_results`
Stores the results, scores, and specific answer tracking for completed quizzes and module assessments.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`)
- `quiz_id` (uuid, references `quizzes.id`, nullable)
- `module_id` (uuid, references `modules.id`, nullable)
- `score` (int)
- `total_questions` (int)
- `time_used_seconds` (int)
- `answers_data` (jsonb) - Snapshot of user's chosen options for analytics
- `completed_at` (timestamp, default now())

## Row Level Security (RLS) Rules
- **Public/Read-only Data**: `lessons`, `modules` (where `is_published = true`), `quizzes`, `questions` (Options should be sanitized on the frontend or backend function to hide `is_correct` until submission).
- **Private User Data**: `user_module_progress`, `user_quiz_results`, `profiles`. Users can only `SELECT`, `INSERT`, `UPDATE` rows where `user_id == auth.uid()`.
- **Admin**: All tables have full CRUD access if `auth.uid()` belongs to an admin role.

## Supabase Integration Plan (Post-MVP)
1. **Initialize Supabase**: Set up project, run SQL scripts to create tables and RLS policies.
2. **Setup Types**: Generate TypeScript types via Supabase CLI and place them in `src/types/supabase.ts`.
3. **Data Hydration**: Build an admin route or use Supabase Studio to inject the initial sample content (lessons, modules, questions).
4. **Auth Flow**: Implement Supabase Auth (Sign Up, Log In) in `Landing/Login` pages.
5. **State Migration**: Replace local mock data fetching in TanStack Query with `supabase-js` client queries.
