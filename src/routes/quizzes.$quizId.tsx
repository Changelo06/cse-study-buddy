import { createFileRoute, Link } from "@tanstack/react-router";
import { quizzes } from "./quizzes";

export const Route = createFileRoute("/quizzes/$quizId")({
  component: QuizTakingPage,
});

function QuizTakingPage() {
  const { quizId } = Route.useParams();
  const quiz = quizzes.find((item) => item.id === quizId);

  if (!quiz) {
    return <div className="container-page py-12 font-bold text-brand-ink">Quiz not found.</div>;
  }

  return (
    <main className="container-page pb-10 pt-3 md:pb-14">
      <section className="mx-auto max-w-4xl rounded-[1.45rem] bg-white/86 p-5 shadow-sticker md:p-7">
        <Link to="/quizzes" className="text-sm font-bold text-brand-ink/58 hover:text-brand-ink">
          &lt; Back to Quizzes
        </Link>

        <div className="mt-6 rounded-[1.45rem] p-6 text-white shadow-soft" style={{ backgroundColor: quiz.color }}>
          <p className="text-sm font-bold uppercase tracking-wide text-white/75">Practice Quiz</p>
          <h1 className="mt-2 font-display text-5xl font-black leading-none">{quiz.title}</h1>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
            <span className="rounded-full bg-white/22 px-4 py-2">{quiz.difficulty}</span>
            <span className="rounded-full bg-white/22 px-4 py-2">{quiz.duration}</span>
            <span className="rounded-full bg-[#3D3D3D] px-4 py-2">{quiz.type}</span>
            <span className="rounded-full bg-white/22 px-4 py-2">{quiz.itemCount} items</span>
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] bg-[#fff8df] p-5">
          <h2 className="text-2xl font-bold text-brand-ink">Ready to start?</h2>
          <p className="mt-2 font-medium leading-7 text-brand-ink/68">
            This is a practice quiz selector screen. Opening this quiz does not mark any module as completed.
            Official module completion still requires passing the module-end quiz.
          </p>
          <button
            type="button"
            className="mt-5 rounded-2xl bg-brand-blue px-7 py-4 text-lg font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.12)]"
          >
            Start Quiz
          </button>
        </div>
      </section>
    </main>
  );
}
