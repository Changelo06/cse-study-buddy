# Agent Context (AGENT.md)

**For AI Agent:** Read this file to instantly understand the state, structure, and rules of the CSE Ready codebase without having to explore the entire project from scratch.

## 1. Project Context
**CSE Ready** is a review web application for the Philippine Civil Service Examination. The goal is to provide a structured, Coursera-style learning path with topic-based modules, timed quizzes, and progress tracking.
- **Tech Stack:** TanStack Start, React 19, Tailwind CSS v4, shadcn/ui.
- **Database/Auth:** Using local mock data/state for the MVP. Supabase integration will happen in a later phase.
- **Design:** Playful, notebook-inspired learning dashboard. The fonts `Fredoka` and `Comica` must be used globally.

## 2. Current Project State (Timeline)
The project is currently in the **post-scaffolding phase**. A previous initialization (likely via a template or tool) has already set up the base routing, design system, and placeholder files for most pages. 
- **Days 1-8 of the `SCHEDULE.md` are partially scaffolded.** The files exist, but the internal logic, mock data wiring, and exact UI components need to be refined to match the strict project requirements.
- **Immediate Next Step:** Define standard mock data and wire it into the existing scaffolded routes.

## 3. Important Files & Directories

### Core Configurations
- `package.json` / `vite.config.ts`: Defines the Vite and TanStack Start setup.
- `src/styles.css`: Contains the Tailwind CSS configuration, theme variables (brand colors), playful fonts (`Fredoka`, `Comica`), and the notebook grid background (`bg-paper-grid`).

### Routing & Layout (`src/routes/`)
- `__root.tsx`: The root shell of the app. It contains the providers, `FloatingNav`, `InteractivePaperDots`, and the main layout.
- `index.tsx`: The Dashboard/Home page.
- `topics.index.tsx`: The main lessons listing page.
- `topics.$topicId.tsx`: The lesson detail page showing its modules.
- `topics.$topicId.modules.$moduleId.tsx`: The actual module reading page.
- `quizzes.tsx`: The quizzes listing page.
- `quizzes.$quizId.tsx`: The active quiz-taking interface.
- `profile.tsx`: The user profile and analytics dashboard.

### UI & Components (`src/components/`)
- `FloatingNav.tsx`: The main navigation pill.
- `ui/`: Contains reusable shadcn/ui components.

### Documentation
- `PROJECT.md`: Vision, target users, design rules.
- `ARCHITECTURE.md`: Logic flows for modules, quizzes, and readiness scores.
- `DATABASE.md`: Supabase database schema and integration plan.
- `STACK.md`: Tech stack details.
- `SCHEDULE.md`: Project timeline and MVP definitions.

## 4. Development Rules
1. **Mock Data First:** Do not write Supabase logic yet. Build out the frontend using a robust mock data file.
2. **Placeholder Content:** Use placeholder text (`lorem ipsum`) and placeholder questions. Do not spend time writing actual CSE review content; an admin dashboard will handle this later.
3. **Playful Fonts:** Keep `Fredoka` and `Comica` globally active. Do not revert to standard sans-serif fonts for the main UI.
4. **Follow Architecture:** Refer to `ARCHITECTURE.md` for how modules lock/unlock and how the quiz engine should behave.
5. **Clarify Before Implementing:** Before diving into executing any phase or writing code, ALWAYS review the relevant documentation and ask the user clarifying questions to ensure you fully understand the design and logic expectations. Do not assume requirements.
