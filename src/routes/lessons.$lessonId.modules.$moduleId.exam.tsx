import { createFileRoute, Link } from "@tanstack/react-router";
import { getModuleById } from "@/data/mockData";

export const Route = createFileRoute("/lessons/$lessonId/modules/$moduleId/exam")({
  component: ModuleExamPage,
});

function ModuleExamPage() {
  const { lessonId, moduleId } = Route.useParams();
  const module = getModuleById(lessonId, moduleId);

  if (!module) {
    return <div className="container-page py-12">Module not found.</div>;
  }

  const exam = module.assessment;

  return (
    <div className="container-page py-12 flex justify-center items-center min-h-[calc(100vh-120px)]">
      <div className="bg-brand-blue rounded-[3rem] p-12 text-white max-w-2xl w-full text-center shadow-soft relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="inline-flex bg-white/20 px-6 py-2 rounded-full font-display font-bold uppercase tracking-widest text-sm mb-6">
          Module Exam
        </div>
        
        <h1 className="font-display font-black text-5xl mb-6 leading-tight">
          {exam.title}
        </h1>
        
        <div className="flex justify-center gap-8 mb-12">
          <div className="bg-brand-ink/20 rounded-2xl p-6 min-w-[120px]">
            <span className="block text-4xl font-display font-black">{exam.durationMinutes}</span>
            <span className="text-xs uppercase tracking-widest font-bold opacity-80 mt-2 block">Minutes</span>
          </div>
          <div className="bg-brand-ink/20 rounded-2xl p-6 min-w-[120px]">
            <span className="block text-4xl font-display font-black">{exam.questions.length}</span>
            <span className="text-xs uppercase tracking-widest font-bold opacity-80 mt-2 block">Items</span>
          </div>
          <div className="bg-brand-ink/20 rounded-2xl p-6 min-w-[120px]">
            <span className="block text-4xl font-display font-black">{exam.passingScore}%</span>
            <span className="text-xs uppercase tracking-widest font-bold opacity-80 mt-2 block">To Pass</span>
          </div>
        </div>

        <button className="w-full bg-brand-yellow text-brand-ink rounded-full py-5 font-display font-black text-2xl hover:scale-[1.02] transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-brand-ink mb-6">
          Start Exam
        </button>

        <Link to="/lessons/$lessonId/modules/$moduleId" params={{ lessonId, moduleId }} className="text-white/60 hover:text-white font-display font-bold inline-block">
          Not ready? Go back to lecture
        </Link>
      </div>
    </div>
  );
}
