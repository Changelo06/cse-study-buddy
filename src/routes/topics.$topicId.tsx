import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getTopicById } from "@/data/mockData";

export const Route = createFileRoute("/topics/$topicId")({
  component: TopicOverviewPage,
});

function TopicOverviewPage() {
  const { topicId } = Route.useParams();
  const topic = getTopicById(topicId);

  if (!topic) {
    return <div className="container-page py-12">Topic not found.</div>;
  }

  return (
    <div className="container-page py-12">
      <Link to="/topics" className="text-brand-ink/60 hover:text-brand-ink mb-8 inline-block font-display font-bold">
        &larr; Back to Lessons
      </Link>
      
      <div className={`${topic.bgColor} rounded-[2.5rem] p-12 text-white shadow-soft relative overflow-hidden mb-12`}>
        <div className="absolute top-1/2 -translate-y-1/2 right-12 opacity-20 pointer-events-none text-9xl font-black font-display">
          {topic.icon}
        </div>
        <h1 className="font-display font-black text-6xl tracking-tight mb-4 relative z-10">{topic.title}</h1>
        <p className="text-xl opacity-90 max-w-2xl relative z-10">{topic.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-display font-black text-3xl text-brand-ink mb-6">Modules</h2>
          {topic.modules.length === 0 ? (
            <p className="text-brand-ink/60 font-display font-bold">No modules available yet.</p>
          ) : (
            topic.modules.map((module, i) => (
              <Link 
                key={module.id} 
                to="/topics/$topicId/modules/$moduleId"
                params={{ topicId: topic.id, moduleId: module.id }}
                className="bg-white rounded-2xl p-6 shadow-soft block hover:scale-[1.01] transition-transform border-2 border-transparent hover:border-brand-ink"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/50 block mb-1">Module {i + 1}</span>
                    <h3 className="font-display font-black text-xl text-brand-ink">{module.title}</h3>
                  </div>
                  <div className="bg-brand-ink/5 rounded-full w-10 h-10 flex items-center justify-center text-brand-ink">
                    &rarr;
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="md:col-span-1">
          <h2 className="font-display font-black text-3xl text-brand-ink mb-6">Final Exams</h2>
          <div className="bg-brand-ink rounded-[2rem] p-8 shadow-soft flex flex-col gap-4">
            {topic.finalExams.length === 0 ? (
              <p className="text-white/60 font-display font-bold">No final exams available yet.</p>
            ) : (
              topic.finalExams.map((exam) => (
                <Link
                  key={exam.id}
                  to="/topics/$topicId/final-exam/$levelId"
                  params={{ topicId: topic.id, levelId: exam.id }}
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl p-4 flex flex-col"
                >
                  <span className="text-white font-display font-bold uppercase tracking-wider text-sm mb-1">{exam.id} Level</span>
                  <span className="text-brand-yellow font-display font-black">{exam.durationMinutes} Minutes</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
