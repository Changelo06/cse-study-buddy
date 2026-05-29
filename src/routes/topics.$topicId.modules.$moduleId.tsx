import { createFileRoute, Link } from "@tanstack/react-router";
import { getModuleById } from "@/data/mockData";

export const Route = createFileRoute("/topics/$topicId/modules/$moduleId")({
  component: LecturePage,
});

function LecturePage() {
  const { topicId, moduleId } = Route.useParams();
  const module = getModuleById(topicId, moduleId);

  if (!module) {
    return <div className="container-page py-12">Module not found.</div>;
  }

  return (
    <div className="container-page py-12 max-w-4xl">
      <Link to="/topics/$topicId" params={{ topicId }} className="text-brand-ink/60 hover:text-brand-ink mb-8 inline-block font-display font-bold">
        &larr; Back to Topic
      </Link>
      
      <div className="bg-white rounded-[2.5rem] p-12 shadow-soft mb-12">
        <h1 className="font-display font-black text-5xl text-brand-ink mb-2 tracking-tight">{module.lecture.title}</h1>
        <p className="text-brand-ink/50 font-bold uppercase tracking-widest text-sm mb-8">Module: {module.title}</p>
        
        <div className="prose prose-lg prose-headings:font-display prose-headings:font-black prose-headings:text-brand-ink text-brand-ink max-w-none mb-12 whitespace-pre-wrap">
          {module.lecture.content}
        </div>

        {module.lecture.inlineQuizzes.length > 0 && (
          <div className="bg-brand-paper border-2 border-brand-ink/10 rounded-3xl p-8 mb-12">
            <h3 className="font-display font-black text-2xl text-brand-ink mb-6">Inline Knowledge Checks</h3>
            <div className="flex flex-wrap gap-4">
              {module.lecture.inlineQuizzes.map((quiz, i) => (
                <Link
                  key={quiz.id}
                  to="/topics/$topicId/modules/$moduleId/quiz/$quizId"
                  params={{ topicId, moduleId, quizId: quiz.id }}
                  className="bg-brand-blue text-white rounded-full px-6 py-3 font-display font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  Quiz {i + 1}
                  <div className="w-5 h-5 bg-white text-brand-blue rounded-full flex items-center justify-center text-xs">?</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-8 border-t-2 border-brand-ink/10">
          <Link
            to="/topics/$topicId/modules/$moduleId/exam"
            params={{ topicId, moduleId }}
            className="bg-brand-pink text-white rounded-full px-10 py-4 font-display font-black text-xl hover:scale-[1.02] transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.1)] border-2 border-brand-ink"
          >
            Take Module Exam &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
