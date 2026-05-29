import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes")({
  component: QuizzesPage,
});

const quizzes = [
  { id: 1, title: "English Language", color: "text-brand-blue", difficulty: "Easy", difficultyColor: "bg-brand-teal text-brand-ink", time: "10m", timeBorder: "border-brand-pink text-brand-pink" },
  { id: 2, title: "Filipino Language", color: "text-brand-yellow", difficulty: "Medium", difficultyColor: "bg-brand-orange text-brand-ink", time: "15m", timeBorder: "border-brand-pink text-brand-pink" },
  { id: 3, title: "Math & Logic", color: "text-brand-pink", difficulty: "Hard", difficultyColor: "bg-brand-pink text-brand-ink", time: "30m", timeBorder: "border-brand-blue text-brand-blue" },
  { id: 4, title: "Clerical Ops", color: "text-brand-teal", difficulty: "Easy", difficultyColor: "bg-brand-teal text-brand-ink", time: "10m", timeBorder: "border-brand-yellow text-brand-yellow" },
  { id: 5, title: "General Info", color: "text-brand-orange", difficulty: "Medium", difficultyColor: "bg-brand-orange text-brand-ink", time: "20m", timeBorder: "border-brand-pink text-brand-pink" },
  { id: 6, title: "Ethics Code", color: "text-brand-pink", difficulty: "Hard", difficultyColor: "bg-brand-pink text-brand-ink", time: "25m", timeBorder: "border-brand-teal text-brand-teal" },
  { id: 7, title: "Reading Comp", color: "text-brand-blue", difficulty: "Medium", difficultyColor: "bg-brand-orange text-brand-ink", time: "15m", timeBorder: "border-brand-pink text-brand-pink" },
  { id: 8, title: "Data Sufficiency", color: "text-brand-pink", difficulty: "Hard", difficultyColor: "bg-brand-pink text-brand-ink", time: "20m", timeBorder: "border-brand-blue text-brand-blue" },
];

function QuizzesPage() {
  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-full p-4 pl-8 pr-4 shadow-soft flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform">
            
            <h3 className={`font-display font-black text-xl ${quiz.color}`}>
              {quiz.title}
            </h3>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full font-display font-bold text-xs uppercase tracking-widest ${quiz.difficultyColor}`}>
                {quiz.difficulty}
              </span>
              
              <span className={`px-4 py-1.5 rounded-full font-display font-bold text-xs border-2 ${quiz.timeBorder}`}>
                {quiz.time}
              </span>
              
              <div className="bg-black/5 rounded-full w-10 h-10 flex items-center justify-center text-brand-ink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
