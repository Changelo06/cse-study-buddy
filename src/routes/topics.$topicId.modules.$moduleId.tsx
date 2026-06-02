import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getModuleById, getTopicById } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/topics/$topicId/modules/$moduleId")({
  component: ModuleReadingPage,
});

function ModuleReadingPage() {
  const { topicId, moduleId } = Route.useParams();
  const router = useRouter();
  const topic = getTopicById(topicId);
  const module = getModuleById(topicId, moduleId);
  
  const { markModuleAsRead, readModules, completedModules } = useAppStore();

  if (!topic || !module) {
    return <div className="container-page py-12 font-bold text-brand-ink">Module not found.</div>;
  }

  const isRead = readModules.includes(moduleId);
  const isCompleted = completedModules.includes(moduleId); // Means assessment passed

  const handleMarkComplete = () => {
    markModuleAsRead(moduleId);
    router.navigate({ 
      to: "/topics/$topicId/modules/$moduleId/exam",
      params: { topicId, moduleId }
    });
  };

  return (
    <main className="container-page pb-10 pt-3 md:pb-14 max-w-4xl">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-brand-ink/55 mb-6">
        <Link to="/topics" className="hover:text-brand-ink">
          Lessons
        </Link>
        <span>&gt;</span>
        <Link to="/topics/$topicId" params={{ topicId }} className="hover:text-brand-ink">
          {topic.title}
        </Link>
        <span>&gt;</span>
        <span className="text-brand-ink">{module.title}</span>
      </nav>

      <header className="rounded-[1.45rem] bg-[#fff8df] p-8 shadow-sticker mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/70">{topic.title}</span>
          <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/70">Estimated: {module.estimatedMinutes} mins</span>
          {isCompleted && (
            <span className="rounded-full bg-brand-teal text-white px-4 py-2 text-sm font-bold">Module Completed</span>
          )}
        </div>
        <h1 className="font-display text-4xl font-black leading-tight text-brand-ink md:text-5xl mb-4">
          {module.title}
        </h1>
        <p className="text-lg font-medium text-brand-ink/70">{module.description}</p>
      </header>

      <section className="bg-white rounded-[1.45rem] p-8 md:p-12 shadow-sticker mb-8">
        <div className="prose prose-lg prose-brand max-w-none whitespace-pre-wrap text-brand-ink/80 font-medium">
          {module.content}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-blue/10 rounded-[1.45rem] p-6 shadow-soft border-2 border-brand-blue/20">
        <div>
          <h3 className="font-display font-black text-2xl text-brand-ink">Ready for the Assessment?</h3>
          <p className="text-brand-ink/70 font-medium mt-1">You must pass the assessment to complete this module.</p>
        </div>
        <button
          onClick={handleMarkComplete}
          className="w-full sm:w-auto bg-brand-blue text-white rounded-xl px-8 py-4 font-display font-black text-lg hover:scale-[1.02] transition-transform shadow-[4px_4px_0_rgba(45,45,45,0.15)] whitespace-nowrap"
        >
          {isRead ? "Retake Assessment" : "Mark as Read & Take Assessment"}
        </button>
      </div>
    </main>
  );
}
