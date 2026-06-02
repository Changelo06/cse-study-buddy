# Implementation Prompts (PROMPT.md)

This file contains pre-written prompts organized by development phases. Copy and paste these prompts to the AI agent to systematically implement the CSE Ready platform based on the established plans and the current scaffolded state.

**Important Note for the AI:** Upon receiving any of these prompts, your first step must ALWAYS be to ask clarifying questions about the design, components, or logic before starting the actual code implementation. Do not assume requirements.

---

## Phase 1: Mock Data & State Foundation
**Context:** The app has scaffolded routes but lacks a centralized data source.
**Prompt:**
> "Review the current scaffolding in `src/routes/` and set up a structured mock data file in `src/data/mockData.ts` or a local state store (e.g., Zustand or React Context) for lessons, modules, and quizzes. Ensure the mock data strictly follows the logic described in `ARCHITECTURE.md`. Use placeholder content (lorem ipsum and fake questions). Do not implement Supabase."

---

## Phase 2: Core Learning Flow (Lessons & Modules)
**Context:** Wiring the lessons and modules pages to the mock data.
**Prompt:**
> "Using our mock data, fully implement the `topics.index.tsx` (lesson listing), `topics.$topicId.tsx` (lesson details), and `topics.$topicId.modules.$moduleId.tsx` (module reading) pages. 
> 1. Apply the playful design system (cards, colors).
> 2. Implement the lock/unlock logic: users cannot access a module if the previous one is incomplete.
> 3. Add a mock 'Mark as Completed' button at the end of the module reading page to update the local progress state."

---

## Phase 3: Quiz Engine Implementation
**Context:** Building the timed test experience.
**Prompt:**
> "Implement the quiz-taking logic in `quizzes.$quizId.tsx`. Following `ARCHITECTURE.md`, the quiz must include:
> 1. A timer.
> 2. A number board navigation to jump between questions.
> 3. A skip/return feature.
> 4. Multiple choice questions (A, B, C, D, E).
> Answers should only be shown after final submission. Build a simple `Quiz Result` component to show the score breakdown once submitted."

---

## Phase 4: Dashboard & Profile Integration
**Context:** Tying user progress into the main hubs.
**Prompt:**
> "Update `src/routes/index.tsx` (Dashboard) and `src/routes/profile.tsx` (Profile) to read from the local mock progress state. 
> - For the Dashboard: Show a readiness score estimate (using the MVP formula in `ARCHITECTURE.md`), display 'continue learning' shortcuts, and next suggested tasks.
> - For the Profile: Build out the analytics placeholders (mock charts using Recharts for subject performance and time metrics)."

---

## Phase 5: Polish & Trust Layer
**Context:** Finalizing the MVP requirements.
**Prompt:**
> "Perform a final polish on the MVP. 
> 1. Ensure the playful typography (`Fredoka` / `Comica`) is applied consistently.
> 2. Build the 'About / Disclaimer' page emphasizing that this platform is not affiliated with the Civil Service Commission.
> 3. Verify mobile responsiveness across all core pages. 
> 4. Ensure no real CSE questions are being used in the placeholders."

---

## Phase 6: Supabase & Admin Integration (Post-MVP)
**Context:** Moving away from local mock data.
**Prompt:**
> "We are now moving past the MVP. Please review the Supabase schema and integration plan outlined in `DATABASE.md`. Implement Supabase Auth, connect the frontend to fetch/write to the real database instead of our mock state, and begin drafting the Admin dashboard routes for content management."
