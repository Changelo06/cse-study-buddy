import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes")({
  component: QuizzesPage,
});

export type QuizDifficulty = "easy" | "medium" | "hard";

export type PracticeQuiz = {
  id: string;
  title: string;
  difficulty: QuizDifficulty;
  duration: string;
  type: "verbal" | "multiple" | "numerical" | "gen info";
  subject: string;
  itemCount: number;
  passingScore: number;
  color: string;
  group: "blue" | "yellow" | "red";
};

export const quizzes: PracticeQuiz[] = [
  quiz("quiz-verbal-1", "Didy Language", "easy", "10 mins", "verbal", "English", 10, "#3F73F2", "blue"),
  quiz("quiz-verbal-2", "Alquin Language", "medium", "30 mins", "verbal", "English", 15, "#3F73F2", "blue"),
  quiz("quiz-verbal-3", "Winston's Theory", "hard", "1 hour", "verbal", "English", 20, "#3F73F2", "blue"),
  quiz("quiz-terms-1", "Terms & Definition", "easy", "10 mins", "verbal", "General", 10, "#32C7B8", "blue"),
  quiz("quiz-hr-1", "Kat's HR Analysis", "medium", "30 mins", "multiple", "General", 15, "#32C7B8", "blue"),
  quiz("quiz-interest-1", "Basic Interest", "hard", "1 hour", "numerical", "Mathematics", 20, "#32C7B8", "blue"),

  quiz("quiz-yellow-1", "Didy Language", "easy", "10 mins", "verbal", "Filipino", 10, "#F7C933", "yellow"),
  quiz("quiz-yellow-2", "Alquin Language", "medium", "30 mins", "verbal", "Filipino", 15, "#F7C933", "yellow"),
  quiz("quiz-yellow-3", "Winston's Theory", "hard", "1 hour", "verbal", "Filipino", 20, "#F7C933", "yellow"),
  quiz("quiz-orange-1", "Didy Language", "easy", "10 mins", "multiple", "Logic", 10, "#FFA51F", "yellow"),
  quiz("quiz-orange-2", "Alquin Language", "medium", "30 mins", "gen info", "General Info", 15, "#FFA51F", "yellow"),
  quiz("quiz-orange-3", "Winston's Theory", "hard", "1 hour", "gen info", "General Info", 20, "#FFA51F", "yellow"),

  quiz("quiz-red-1", "Didy Language", "easy", "10 mins", "multiple", "Logic", 10, "#FF4D5A", "red"),
  quiz("quiz-red-2", "Alquin Language", "medium", "30 mins", "multiple", "Logic", 15, "#FF4D5A", "red"),
  quiz("quiz-red-3", "Winston's Theory", "hard", "1 hour", "multiple", "Logic", 20, "#FF4D5A", "red"),
  quiz("quiz-pink-1", "Didy Language", "easy", "10 mins", "gen info", "General Info", 10, "#FF3366", "red"),
  quiz("quiz-pink-2", "Alquin Language", "medium", "30 mins", "gen info", "General Info", 15, "#FF3366", "red"),
  quiz("quiz-pink-3", "Winston's Theory", "hard", "1 hour", "gen info", "General Info", 20, "#FF3366", "red"),
];

const listFilters = ["All", "Easy", "Medium", "Hard", "Verbal", "Numerical", "Gen Info", "Multiple"] as const;

function quiz(
  id: string,
  title: string,
  difficulty: QuizDifficulty,
  duration: string,
  type: PracticeQuiz["type"],
  subject: string,
  itemCount: number,
  color: string,
  group: PracticeQuiz["group"],
): PracticeQuiz {
  return {
    id,
    title,
    difficulty,
    duration,
    type,
    subject,
    itemCount,
    passingScore: Math.ceil(itemCount * 0.8),
    color,
    group,
  };
}

function QuizzesPage() {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof listFilters)[number]>("All");

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quizItem) => {
      const matchesSearch =
        !query ||
        [quizItem.title, quizItem.difficulty, quizItem.duration, quizItem.type, quizItem.subject]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const normalizedFilter = activeFilter.toLowerCase();
      const matchesFilter =
        activeFilter === "All" ||
        quizItem.difficulty === normalizedFilter ||
        quizItem.type === normalizedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search]);

  return (
    <main className="container-page pb-10 pt-2 md:pb-14">
      <QuizPageHeader viewMode={viewMode} onToggle={() => setViewMode((mode) => (mode === "cards" ? "list" : "cards"))} />

      {viewMode === "cards" ? (
        <QuizGrid />
      ) : (
        <QuizList
          activeFilter={activeFilter}
          filteredQuizzes={filteredQuizzes}
          search={search}
          setActiveFilter={setActiveFilter}
          setSearch={setSearch}
        />
      )}
    </main>
  );
}

function QuizPageHeader({ viewMode, onToggle }: { viewMode: "cards" | "list"; onToggle: () => void }) {
  return (
    <div className="mb-4 flex justify-end pr-1 md:pr-2">
      <button
        type="button"
        onClick={onToggle}
        className="border-b-2 border-brand-pink text-xl font-bold leading-none text-brand-pink md:text-2xl"
      >
        {viewMode === "cards" ? "View Full List" : "View Quiz Cards"}
      </button>
    </div>
  );
}

function QuizGrid() {
  const columns = [
    quizzes.filter((quizItem) => quizItem.group === "blue"),
    quizzes.filter((quizItem) => quizItem.group === "yellow"),
    quizzes.filter((quizItem) => quizItem.group === "red"),
  ];

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {columns.map((column, index) => (
        <div key={index} className="space-y-4">
          {column.map((quizItem) => (
            <QuizCard key={quizItem.id} quiz={quizItem} />
          ))}
        </div>
      ))}
    </section>
  );
}

function QuizCard({ quiz }: { quiz: PracticeQuiz }) {
  return (
    <Link
      to="/quizzes/$quizId"
      params={{ quizId: quiz.id }}
      className="group relative flex min-h-[118px] items-center justify-between overflow-hidden rounded-[1.45rem] px-6 py-5 text-white shadow-sticker transition-all hover:-translate-y-1 hover:shadow-[5px_8px_0_rgba(45,45,45,0.1),0_18px_30px_rgba(45,45,45,0.16)]"
      style={{ backgroundColor: quiz.color }}
    >
      <div className="min-w-0 pr-5">
        <h2 className="font-display text-3xl font-black leading-none drop-shadow-sm md:text-[2.15rem]">
          {quiz.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <QuizBadge kind="difficulty" value={quiz.difficulty} />
          <QuizBadge kind="time" value={quiz.duration} group={quiz.group} />
          <QuizBadge kind="type" value={quiz.type} />
        </div>
      </div>

      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/18 text-4xl font-black leading-none transition-transform group-hover:translate-x-1">
        &gt;
      </span>
    </Link>
  );
}

function QuizBadge({
  group,
  kind,
  value,
}: {
  group?: PracticeQuiz["group"];
  kind: "difficulty" | "time" | "type";
  value: string;
}) {
  const className =
    kind === "type"
      ? "bg-[#3D3D3D] text-white"
      : kind === "difficulty"
        ? difficultyClass(value as QuizDifficulty)
        : group === "blue"
          ? "bg-brand-teal text-brand-ink"
          : group === "yellow"
            ? "bg-brand-yellow text-brand-ink"
            : "bg-brand-pink text-white";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${className}`}>{value}</span>;
}

function QuizList({
  activeFilter,
  filteredQuizzes,
  search,
  setActiveFilter,
  setSearch,
}: {
  activeFilter: (typeof listFilters)[number];
  filteredQuizzes: PracticeQuiz[];
  search: string;
  setActiveFilter: (filter: (typeof listFilters)[number]) => void;
  setSearch: (value: string) => void;
}) {
  return (
    <section className="mx-auto max-w-[70rem] rounded-[1.45rem] bg-white/82 p-4 shadow-sticker md:p-6">
      <label>
        <span className="sr-only">Search quizzes</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search quizzes..."
          className="h-13 w-full rounded-2xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 text-base font-medium text-brand-ink outline-none transition focus:border-brand-purple"
        />
      </label>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {listFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
              activeFilter === filter
                ? "border-brand-ink bg-brand-purple text-brand-ink"
                : "border-brand-ink/12 bg-[#fff5cc] text-brand-ink/70 hover:border-brand-ink/25"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-3 divide-y divide-brand-ink/12">
        {filteredQuizzes.length === 0 ? (
          <p className="py-8 text-center font-bold text-brand-ink/65">No quizzes match your search yet.</p>
        ) : (
          filteredQuizzes.map((quizItem) => (
            <Link
              key={quizItem.id}
              to="/quizzes/$quizId"
              params={{ quizId: quizItem.id }}
              className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_100px_100px_100px_90px] md:items-center"
            >
              <div>
                <h2 className="text-xl font-bold text-brand-ink">{quizItem.title}</h2>
                <p className="text-sm font-medium text-brand-ink/55">
                  {quizItem.subject} • {quizItem.itemCount} items • Pass {quizItem.passingScore}/{quizItem.itemCount}
                </p>
              </div>
              <QuizBadge kind="difficulty" value={quizItem.difficulty} />
              <span className="font-bold text-brand-ink/68">{quizItem.duration}</span>
              <QuizBadge kind="type" value={quizItem.type} />
              <span className="rounded-xl bg-brand-blue px-4 py-2 text-center text-sm font-bold text-white">Start</span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function difficultyClass(difficulty: QuizDifficulty) {
  if (difficulty === "easy") return "bg-brand-teal text-brand-ink";
  if (difficulty === "medium") return "bg-brand-yellow text-brand-ink";
  return "bg-brand-pink text-white";
}
