-- ============================================================
-- CSE Ready: Database Initialization Script
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 1a. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1b. Lessons (main topic categories)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  bg_color TEXT NOT NULL DEFAULT 'bg-brand-blue',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1c. Modules (reading materials within lessons)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_minutes INT NOT NULL DEFAULT 15,
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1d. Quizzes (standalone timed assessments)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  required_module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  time_limit_minutes INT NOT NULL DEFAULT 15,
  is_final_exam BOOLEAN NOT NULL DEFAULT FALSE,
  passing_score INT NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1e. Questions (multiple-choice items)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  explanation TEXT NOT NULL DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT question_parent_check CHECK (quiz_id IS NOT NULL OR module_id IS NOT NULL)
);

-- 1f. User Module Progress
CREATE TABLE IF NOT EXISTS public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- 1g. User Quiz Results
CREATE TABLE IF NOT EXISTS public.user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  time_used_seconds INT NOT NULL DEFAULT 0,
  answers_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_modules_lesson_id ON public.modules(lesson_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_module_id ON public.questions(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON public.user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_results_user ON public.user_quiz_results(user_id);


-- ============================================================
-- 3. AUTO-CREATE PROFILE TRIGGER
-- When a new user signs up via Supabase Auth, automatically
-- insert a corresponding row in public.profiles.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present to avoid duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;

-- Helper: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- Profiles ----
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ---- Lessons (public read) ----
CREATE POLICY "Anyone can read lessons"
  ON public.lessons FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_admin());

-- ---- Modules (public read for published) ----
CREATE POLICY "Anyone can read published modules"
  ON public.modules FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can read all modules"
  ON public.modules FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage modules"
  ON public.modules FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update modules"
  ON public.modules FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete modules"
  ON public.modules FOR DELETE
  USING (public.is_admin());

-- ---- Quizzes (public read) ----
CREATE POLICY "Anyone can read quizzes"
  ON public.quizzes FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (public.is_admin());

-- ---- Questions (public read) ----
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (public.is_admin());

-- ---- User Module Progress (private) ----
CREATE POLICY "Users can view their own progress"
  ON public.user_module_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_module_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.user_module_progress FOR SELECT
  USING (public.is_admin());

-- ---- User Quiz Results (private) ----
CREATE POLICY "Users can view their own quiz results"
  ON public.user_quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
  ON public.user_quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz results"
  ON public.user_quiz_results FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- 5. SEED DATA (Light)
-- 3 lessons, 3 modules total, 3 questions per module
-- ============================================================

-- Lesson 1: English
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'English',
  'Grammar, vocabulary, reading comprehension, and paragraph organization.',
  'En',
  'bg-brand-blue',
  1
);

-- Lesson 2: Mathematics
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Mathematics',
  'Basic operations, word problems, fractions, percentages, ratios, and sequences.',
  '№',
  'bg-brand-pink',
  2
);

-- Lesson 3: Logic Analysis
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Logic Analysis',
  'Logical reasoning, analogies, syllogisms, and pattern analysis.',
  'Lo',
  'bg-brand-orange',
  3
);

-- Lesson 4: Filipino
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Filipino',
  'Wastong gamit, kasingkahulugan, kasalungat, at pag-unawa sa binasa.',
  'Fil',
  'bg-brand-yellow',
  4
);

-- Lesson 5: Clerical Ops
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Clerical Ops',
  'Filing, alphabetizing, general clerical operations, and accuracy tests. (Subprofessional only)',
  'Cl',
  'bg-brand-teal',
  5
);

-- Lesson 6: General Info
INSERT INTO public.lessons (id, title, description, icon, bg_color, order_index)
VALUES (
  'a1b2c3d4-0006-4000-8000-000000000006',
  'General Info',
  'Philippine Constitution, RA 6713, peace and human rights, environmental management.',
  'GI',
  'bg-[#ff3f77]',
  6
);

-- Module 1: English - Grammar Basics
INSERT INTO public.modules (id, lesson_id, title, description, content, difficulty, estimated_minutes, order_index, is_published)
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Grammar Basics',
  'Learn the foundational rules of English grammar.',
  E'# Grammar Basics\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Key Terms\n- **Subject**: The noun performing the action in a sentence.\n- **Predicate**: The part of the sentence containing the verb.\n- **Object**: The noun receiving the action.\n\n## Examples\n1. **Simple sentence**: The dog (subject) ran (predicate) quickly.\n2. **Compound sentence**: She studied hard, and she passed the exam.\n\n> **Note**: Always identify the subject and predicate first when analyzing sentence structure.',
  'easy',
  15,
  1,
  TRUE
);

-- Module 2: English - Sentence Structure
INSERT INTO public.modules (id, lesson_id, title, description, content, difficulty, estimated_minutes, order_index, is_published)
VALUES (
  'b1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Sentence Structure',
  'Understand complex and compound sentences.',
  E'# Sentence Structure\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Types of Sentences\n- **Simple**: Contains one independent clause.\n- **Compound**: Two independent clauses joined by a conjunction.\n- **Complex**: One independent clause and one or more dependent clauses.\n- **Compound-Complex**: Combines compound and complex structures.\n\n## Practice Tips\n1. Identify the clauses in each sentence.\n2. Look for conjunctions and subordinating words.\n\n> **Tip**: Compound sentences use coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so).',
  'medium',
  20,
  2,
  TRUE
);

-- Module 3: Math - Fractions & Decimals
INSERT INTO public.modules (id, lesson_id, title, description, content, difficulty, estimated_minutes, order_index, is_published)
VALUES (
  'b1b2c3d4-0003-4000-8000-000000000003',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Fractions & Decimals',
  'Mastering fractions and decimal operations.',
  E'# Fractions & Decimals\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Key Concepts\n- **Fraction**: A number expressed as a ratio of two integers (e.g., 3/4).\n- **Decimal**: A number expressed in base-10 notation (e.g., 0.75).\n- **Conversion**: To convert a fraction to decimal, divide the numerator by the denominator.\n\n## Examples\n1. 1/2 = 0.5\n2. 3/4 = 0.75\n3. 2/5 = 0.4\n\n> **Remember**: When adding fractions, find a common denominator first.',
  'medium',
  30,
  1,
  TRUE
);

-- Questions for Grammar Basics module
INSERT INTO public.questions (module_id, text, options, explanation, order_index) VALUES
(
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Which of the following is the subject in the sentence: "The quick brown fox jumps over the lazy dog"?',
  '[{"id": "A", "text": "jumps", "is_correct": false}, {"id": "B", "text": "The quick brown fox", "is_correct": true}, {"id": "C", "text": "the lazy dog", "is_correct": false}, {"id": "D", "text": "over", "is_correct": false}]'::jsonb,
  'The subject is "The quick brown fox" because it is the noun phrase performing the action (jumps).',
  1
),
(
  'b1b2c3d4-0001-4000-8000-000000000001',
  'What part of speech is the word "quickly" in the sentence: "She ran quickly"?',
  '[{"id": "A", "text": "Noun", "is_correct": false}, {"id": "B", "text": "Verb", "is_correct": false}, {"id": "C", "text": "Adverb", "is_correct": true}, {"id": "D", "text": "Adjective", "is_correct": false}]'::jsonb,
  '"Quickly" is an adverb because it modifies the verb "ran" and describes how the action was performed.',
  2
),
(
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Which sentence is grammatically correct?',
  '[{"id": "A", "text": "Him and me went to the store.", "is_correct": false}, {"id": "B", "text": "He and I went to the store.", "is_correct": true}, {"id": "C", "text": "Him and I went to the store.", "is_correct": false}, {"id": "D", "text": "He and me went to the store.", "is_correct": false}]'::jsonb,
  '"He and I" uses the correct subject pronouns. When pronouns are used as subjects, use "I" instead of "me" and "he" instead of "him".',
  3
);

-- Questions for Sentence Structure module
INSERT INTO public.questions (module_id, text, options, explanation, order_index) VALUES
(
  'b1b2c3d4-0002-4000-8000-000000000002',
  'Which type of sentence contains one independent clause and at least one dependent clause?',
  '[{"id": "A", "text": "Simple", "is_correct": false}, {"id": "B", "text": "Compound", "is_correct": false}, {"id": "C", "text": "Complex", "is_correct": true}, {"id": "D", "text": "Fragment", "is_correct": false}]'::jsonb,
  'A complex sentence has one independent clause and one or more dependent (subordinate) clauses.',
  1
),
(
  'b1b2c3d4-0002-4000-8000-000000000002',
  'What conjunction type connects two independent clauses in a compound sentence?',
  '[{"id": "A", "text": "Subordinating conjunction", "is_correct": false}, {"id": "B", "text": "Coordinating conjunction", "is_correct": true}, {"id": "C", "text": "Correlative conjunction", "is_correct": false}, {"id": "D", "text": "Conjunctive adverb", "is_correct": false}]'::jsonb,
  'Coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) join independent clauses in compound sentences.',
  2
),
(
  'b1b2c3d4-0002-4000-8000-000000000002',
  'Identify the sentence type: "Although it was raining, we went to the park, and we had a great time."',
  '[{"id": "A", "text": "Simple", "is_correct": false}, {"id": "B", "text": "Compound", "is_correct": false}, {"id": "C", "text": "Complex", "is_correct": false}, {"id": "D", "text": "Compound-Complex", "is_correct": true}]'::jsonb,
  'This is compound-complex: it has a dependent clause ("Although it was raining") and two independent clauses joined by "and".',
  3
);

-- Questions for Fractions & Decimals module
INSERT INTO public.questions (module_id, text, options, explanation, order_index) VALUES
(
  'b1b2c3d4-0003-4000-8000-000000000003',
  'What is 3/8 expressed as a decimal?',
  '[{"id": "A", "text": "0.25", "is_correct": false}, {"id": "B", "text": "0.375", "is_correct": true}, {"id": "C", "text": "0.38", "is_correct": false}, {"id": "D", "text": "0.333", "is_correct": false}]'::jsonb,
  '3 divided by 8 equals 0.375.',
  1
),
(
  'b1b2c3d4-0003-4000-8000-000000000003',
  'What is the result of 1/4 + 1/3?',
  '[{"id": "A", "text": "2/7", "is_correct": false}, {"id": "B", "text": "7/12", "is_correct": true}, {"id": "C", "text": "1/2", "is_correct": false}, {"id": "D", "text": "5/12", "is_correct": false}]'::jsonb,
  'Find the LCD (12): 1/4 = 3/12, 1/3 = 4/12. So 3/12 + 4/12 = 7/12.',
  2
),
(
  'b1b2c3d4-0003-4000-8000-000000000003',
  'Which fraction is equivalent to 0.6?',
  '[{"id": "A", "text": "2/3", "is_correct": false}, {"id": "B", "text": "3/5", "is_correct": true}, {"id": "C", "text": "4/6", "is_correct": false}, {"id": "D", "text": "1/6", "is_correct": false}]'::jsonb,
  '0.6 = 6/10 = 3/5 when simplified by dividing both numerator and denominator by 2.',
  3
);

-- Standalone Quiz: English Mastery
INSERT INTO public.quizzes (id, title, description, lesson_id, time_limit_minutes, passing_score)
VALUES (
  'c1b2c3d4-0001-4000-8000-000000000001',
  'English Mastery Quiz',
  'Test your grammar and vocabulary knowledge across all English modules.',
  'a1b2c3d4-0001-4000-8000-000000000001',
  15,
  70
);

-- Questions for the standalone quiz
INSERT INTO public.questions (quiz_id, text, options, explanation, order_index) VALUES
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'Choose the correct form: "Neither the students nor the teacher ___ present."',
  '[{"id": "A", "text": "were", "is_correct": false}, {"id": "B", "text": "was", "is_correct": true}, {"id": "C", "text": "are", "is_correct": false}, {"id": "D", "text": "be", "is_correct": false}]'::jsonb,
  'With "neither...nor," the verb agrees with the nearest subject. "Teacher" is singular, so use "was."',
  1
),
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'What is the antonym of "benevolent"?',
  '[{"id": "A", "text": "Kind", "is_correct": false}, {"id": "B", "text": "Generous", "is_correct": false}, {"id": "C", "text": "Malevolent", "is_correct": true}, {"id": "D", "text": "Charitable", "is_correct": false}]'::jsonb,
  '"Benevolent" means well-meaning and kindly. Its antonym is "malevolent," meaning having evil intent.',
  2
),
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'Which word is a conjunction in the sentence: "I will go if you come with me"?',
  '[{"id": "A", "text": "will", "is_correct": false}, {"id": "B", "text": "go", "is_correct": false}, {"id": "C", "text": "if", "is_correct": true}, {"id": "D", "text": "with", "is_correct": false}]'::jsonb,
  '"If" is a subordinating conjunction that introduces the dependent clause "if you come with me."',
  3
),
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'Select the sentence with correct punctuation:',
  '[{"id": "A", "text": "Its a beautiful day, isnt it?", "is_correct": false}, {"id": "B", "text": "It''s a beautiful day, isn''t it?", "is_correct": true}, {"id": "C", "text": "Its'' a beautiful day, isnt'' it?", "is_correct": false}, {"id": "D", "text": "It''s a beautiful day isnt it.", "is_correct": false}]'::jsonb,
  '"It''s" is the contraction of "it is" and "isn''t" is the contraction of "is not." Both require apostrophes.',
  4
),
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'What figure of speech compares two things using "like" or "as"?',
  '[{"id": "A", "text": "Metaphor", "is_correct": false}, {"id": "B", "text": "Simile", "is_correct": true}, {"id": "C", "text": "Hyperbole", "is_correct": false}, {"id": "D", "text": "Personification", "is_correct": false}]'::jsonb,
  'A simile explicitly compares two things using "like" or "as" (e.g., "She runs like the wind").',
  5
);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
