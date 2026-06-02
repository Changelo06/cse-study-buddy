import { Link, createFileRoute } from "@tanstack/react-router";
import { PageDoodles } from "@/components/Doodles";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const lessonRows = [
  { name: "English", topicId: "english", modules: 58, quiz: 38, rIndex: 37, trend: "up" },
  { name: "Filipino", topicId: "filipino", modules: 86, quiz: 82, rIndex: 86, trend: "up" },
  { name: "Mathematics", topicId: "math", modules: 24, quiz: 9, rIndex: 20, trend: "down" },
  { name: "Clerical Ops", topicId: "clerical", modules: 62, quiz: 25, rIndex: 56, trend: "up" },
  { name: "Gen Info", topicId: "geninfo", modules: 79, quiz: 66, rIndex: 79, trend: "up" },
  { name: "Logic Analysis", topicId: "logic", modules: 12, quiz: 13, rIndex: 15, trend: "down" },
];

const planActions = [
  { label: "Ethics & Laws", meta: "Weakness", color: "bg-brand-pink", to: "/topics/ethics", status: true },
  { label: "Filipino", meta: "Strength", color: "bg-brand-yellow", to: "/topics/filipino", status: true },
  { label: "Flashcards", color: "bg-brand-blue", to: "/topics" },
  { label: "Timed challenge", color: "bg-brand-teal", to: "/quizzes" },
  { label: "Games", color: "bg-brand-purple", to: "/quizzes" },
];

function ProgressPill({ value }: { value: number }) {
  return (
    <div className="h-5 w-full overflow-hidden rounded-full bg-[#fff4ca]">
      <div className="h-full rounded-full bg-brand-purple" style={{ width: `${value}%` }} />
    </div>
  );
}

function DashboardPage() {
  return (
    <main className="container-page relative pb-8 pt-3 md:pb-12">
      <PageDoodles variant="dashboard" />
      <section className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-[170px_230px_minmax(330px,1fr)_minmax(330px,1fr)] lg:gap-5">
        <div className="flex min-h-[138px] flex-col items-center justify-center rounded-[1.45rem] bg-brand-teal p-4 shadow-sticker">
          <div className="font-display text-6xl font-black leading-none text-cartoon md:text-[4.6rem]">98.2</div>
          <p className="mt-3 text-center text-sm font-bold uppercase leading-4 text-brand-ink">
            Readiness
            <br />
            Score
          </p>
        </div>

        <div className="grid min-h-[138px] grid-cols-2 overflow-hidden rounded-[1.45rem] bg-brand-pink shadow-sticker">
          <div className="flex flex-col items-center justify-center border-r-2 border-brand-ink/55 px-4 py-5">
            <span className="font-display text-6xl font-black leading-none text-cartoon md:text-[4.6rem]">30</span>
            <span className="mt-3 text-sm font-bold uppercase text-brand-ink">Modules</span>
          </div>
          <div className="flex flex-col items-center justify-center px-4 py-5">
            <span className="font-display text-6xl font-black leading-none text-cartoon md:text-[4.6rem]">13</span>
            <span className="mt-3 text-sm font-bold uppercase text-brand-ink">Tests</span>
          </div>
        </div>

        <div className="flex min-h-[138px] flex-col justify-between rounded-[1.45rem] bg-brand-yellow p-5 shadow-sticker">
          <h2 className="max-w-[26rem] font-display text-[1.7rem] font-black uppercase leading-[1.02] text-cartoon md:text-[2rem]">
            Module 1: Grammar and Language
          </h2>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">Last lesson opened</p>
            <Link
              to="/topics/$topicId/modules/$moduleId"
              params={{ topicId: "english", moduleId: "mod-eng-1" }}
              className="rounded-xl bg-brand-pink px-4 py-2 text-sm font-bold uppercase text-white shadow-[3px_3px_0_rgba(45,45,45,0.16)] transition-transform hover:-translate-y-0.5"
            >
              Continue
            </Link>
          </div>
        </div>

        <div className="flex min-h-[138px] flex-col justify-between rounded-[1.45rem] bg-brand-blue p-5 shadow-sticker">
          <h2 className="max-w-[24rem] font-display text-[1.7rem] font-black uppercase leading-[1.02] text-cartoon md:text-[2rem]">
            ENG5261: Diddy Language
          </h2>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">New tests available</p>
            <Link
              to="/quizzes"
              className="rounded-xl bg-brand-pink px-4 py-2 text-sm font-bold uppercase text-white shadow-[3px_3px_0_rgba(45,45,45,0.16)] transition-transform hover:-translate-y-0.5"
            >
              Continue
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2.05fr)_minmax(340px,0.95fr)]">
        <div className="rounded-[1.65rem] bg-white p-5 shadow-sticker md:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-brand-ink md:text-[2.35rem]">My Lessons</h1>
            <Link
              to="/topics"
              className="border-b-2 border-brand-pink text-sm font-bold text-brand-pink"
            >
              View Lessons
            </Link>
          </div>

          <div className="hidden grid-cols-[1.3fr_120px_120px_90px_34px] items-center gap-8 px-3 pb-1 text-center text-lg font-bold text-brand-ink md:grid">
            <span />
            <span>Modules</span>
            <span>Quiz</span>
            <span>R-Index</span>
            <span />
          </div>

          <div className="divide-y divide-brand-ink/65">
            {lessonRows.map((lesson) => (
              <div
                key={lesson.name}
                className="grid gap-3 py-2.5 md:grid-cols-[1.3fr_120px_120px_90px_34px] md:items-center md:gap-8"
              >
                <p className="text-lg font-bold uppercase text-brand-ink">{lesson.name}</p>
                <ProgressPill value={lesson.modules} />
                <ProgressPill value={lesson.quiz} />
                <div className="flex items-center gap-2 md:justify-center">
                  <span className="text-2xl font-bold text-brand-ink">{lesson.rIndex}%</span>
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-black text-white ${
                      lesson.trend === "up" ? "bg-brand-teal" : "bg-brand-pink"
                    }`}
                  >
                    {lesson.trend === "up" ? "^" : "!"}
                  </span>
                </div>
                <Link
                  to="/topics/$topicId"
                  params={{ topicId: lesson.topicId }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-brand-ink/65 text-lg font-black text-white transition-transform hover:-translate-y-0.5"
                  aria-label={`Open ${lesson.name}`}
                >
                  &gt;
                </Link>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.65rem] bg-[#fff5cc] p-6 shadow-sticker">
          <h2 className="text-3xl font-bold text-brand-ink md:text-[2.35rem]">My study plan</h2>
          <div className="mt-6 space-y-3">
            {planActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`${action.color} flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white shadow-[3px_4px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5`}
              >
                <span>{action.label}</span>
                {action.status ? (
                  <span className="text-sm">{action.meta}</span>
                ) : (
                  <span className="text-2xl leading-none">-&gt;</span>
                )}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
