import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/AuthGuard";
import { BookOpen, Layers, HelpCircle, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminDashboard />
    </AuthGuard>
  );
}

function AdminDashboard() {
  const cards = [
    {
      title: "Lessons",
      description: "Manage lesson categories, ordering, and metadata.",
      icon: BookOpen,
      color: "bg-brand-blue",
      to: "/admin/lessons",
      count: "–",
    },
    {
      title: "Modules",
      description: "Create and edit module content, set difficulty, toggle publishing.",
      icon: Layers,
      color: "bg-brand-pink",
      to: "/admin/modules",
      count: "–",
    },
    {
      title: "Questions",
      description: "Manage multiple-choice questions for quizzes and module assessments.",
      icon: HelpCircle,
      color: "bg-brand-orange",
      to: "/admin/questions",
      count: "–",
    },
  ];

  return (
    <main className="container-page pb-12 pt-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-5xl font-black text-brand-ink md:text-6xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg font-medium text-brand-ink/60">
            Manage content for CSE Ready. Create lessons, modules, and questions.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-6 shadow-sticker">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
                <BarChart3 size={24} className="text-brand-blue" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/50">Total Lessons</p>
                <p className="font-display text-3xl font-black text-brand-ink">–</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 shadow-sticker">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink/10">
                <Layers size={24} className="text-brand-pink" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/50">Total Modules</p>
                <p className="font-display text-3xl font-black text-brand-ink">–</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 shadow-sticker">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                <HelpCircle size={24} className="text-brand-orange" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink/50">Total Questions</p>
                <p className="font-display text-3xl font-black text-brand-ink">–</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group rounded-[1.5rem] bg-white/90 p-8 shadow-sticker transition-transform hover:-translate-y-1"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${card.color} shadow-[3px_3px_0_rgba(45,45,45,0.12)]`}>
                <card.icon size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl font-black text-brand-ink">{card.title}</h2>
              <p className="mt-2 text-sm font-medium text-brand-ink/60">{card.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-blue group-hover:underline">
                Manage →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
