# Tech Stack

The project is built on a modern, high-performance web stack utilizing SSR (Server-Side Rendering) and edge deployment capabilities.

## Core Framework
- **Framework**: [TanStack Start](https://tanstack.com/start) (React framework with full-stack capabilities)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe routing)
- **UI Library**: React 19
- **Build Tool**: Vite 7

## Styling & UI Components
- **Styling**: Tailwind CSS v4
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives + Tailwind)
- **Icons**: Lucide React
- **Animations**: `tw-animate-css`
- **Charts**: Recharts (for Profile/Analytics graphs)
- **Utility Libraries**: `clsx`, `tailwind-merge`, `class-variance-authority`

## State Management & Data
- **Data Fetching/Caching**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Forms**: React Hook Form
- **Validation**: Zod (Type-safe schema validation)

## Backend & Database
- **Database / BaaS**: [Supabase](https://supabase.com/) (See `DATABASE.md` for full schema design)
  - **PostgreSQL** Database for user progress, modules, quizzes, and analytics
  - **Supabase Auth** for user management and login sessions
  - **Supabase Storage** (if needed for assets/images)
- **API**: Built-in TanStack Start Server Functions / API Routes

## Deployment
- **Hosting**: [Vercel](https://vercel.com/) (Optimized for TanStack Start and Edge functions)

## Tooling
- **Package Manager**: Bun (indicated by `bun.lock`)
- **Linting**: ESLint (v9)
- **Formatting**: Prettier
- **TypeScript**: Strict type-checking enabled
