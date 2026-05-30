import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageDoodles } from "@/components/Doodles";

export const Route = createFileRoute("/topics/")({
  component: LessonsPage,
});

type ModuleStatus = "Not Started" | "In Progress" | "Completed" | "Locked" | "Weak Area";

type LessonModule = {
  number: number;
  title: string;
  description: string;
  status: ModuleStatus;
  progress: number;
  time: string;
  note?: string;
  keywords: string[];
};

type Subject = {
  id: string;
  title: string;
  color: string;
  indicator: string;
  icon: React.ReactNode;
  modules: LessonModule[];
};

const moduleTopics = [
  "Grammar",
  "Storytelling",
  "Verbal",
  "Communication",
  "DiddyBlud",
  "TungTungsahur",
];

const subjects: Subject[] = [
  {
    id: "english",
    title: "English",
    color: "bg-brand-blue",
    indicator: "bg-brand-blue",
    icon: <BookIcon />,
    modules: [
      moduleItem(1, "Grammar and Language", "Covers parts of speech, sentence correction, and basic grammar rules.", "In Progress", 60, "15 min", "Quiz Score: 8/10", ["grammar", "language", "sentence"]),
      moduleItem(2, "Reading Comprehension", "Practice main ideas, context clues, and short passage analysis.", "Completed", 100, "18 min", "Last opened: Today", ["reading", "passage", "context"]),
      moduleItem(3, "Vocabulary Builder", "Review synonyms, antonyms, and exam-inspired word usage.", "Weak Area", 35, "12 min", "Quiz Score: 5/10", ["vocabulary", "words", "weak"]),
    ],
  },
  {
    id: "filipino",
    title: "Filipino",
    color: "bg-brand-yellow",
    indicator: "bg-brand-yellow",
    icon: <SalakotIcon />,
    modules: [
      moduleItem(1, "Balarila Basics", "Review bahagi ng pananalita, wastong gamit, and sentence clarity.", "Completed", 100, "15 min", "Quiz Score: 9/10", ["balarila", "filipino", "pananalita"]),
      moduleItem(2, "Pag-unawa sa Binasa", "Build confidence with short passages and careful inference.", "In Progress", 45, "20 min", "Last opened: Yesterday", ["pagbasa", "inference", "filipino"]),
      moduleItem(3, "Talasalitaan", "Practice vocabulary, kahulugan, and contextual word choices.", "Not Started", 0, "12 min", "New module", ["talasalitaan", "vocabulary"]),
    ],
  },
  {
    id: "math",
    title: "Mathematics",
    color: "bg-brand-pink",
    indicator: "bg-brand-pink",
    icon: <MathIcon />,
    modules: [
      moduleItem(1, "Percentages and Ratios", "Solve quick percent, ratio, and proportion problems.", "Weak Area", 25, "18 min", "Quiz Score: 4/10", ["percent", "ratio", "math"]),
      moduleItem(2, "Number Sequences", "Find missing terms and simple number patterns.", "In Progress", 50, "14 min", "Last opened: May 12", ["sequence", "patterns"]),
      moduleItem(3, "Word Problems", "Translate everyday situations into operations and equations.", "Locked", 0, "20 min", "Unlock after Module 2", ["word problems", "equations"]),
    ],
  },
  {
    id: "clerical",
    title: "Clerical Ops",
    color: "bg-brand-teal",
    indicator: "bg-brand-teal",
    icon: <ClericalIcon />,
    modules: [
      moduleItem(1, "Filing Order", "Practice alphabetic ordering, record matching, and office logic.", "Completed", 100, "10 min", "Quiz Score: 10/10", ["filing", "clerical"]),
      moduleItem(2, "Spelling Accuracy", "Spot misspellings and common clerical typos quickly.", "In Progress", 70, "12 min", "Quiz Score: 7/10", ["spelling", "accuracy"]),
      moduleItem(3, "Data Checking", "Compare names, numbers, and records with care.", "Not Started", 0, "15 min", "New module", ["data", "records"]),
    ],
  },
  {
    id: "logic",
    title: "Logic Analysis",
    color: "bg-brand-orange",
    indicator: "bg-brand-orange",
    icon: <InfoIcon />,
    modules: [
      moduleItem(1, "Analogies", "Identify relationships between words, ideas, and patterns.", "In Progress", 55, "14 min", "Last opened: Today", ["logic", "analogies"]),
      moduleItem(2, "Syllogisms", "Work through statements, conclusions, and validity checks.", "Weak Area", 30, "18 min", "Quiz Score: 5/10", ["syllogism", "reasoning"]),
      moduleItem(3, "Pattern Analysis", "Practice visual and number pattern recognition.", "Not Started", 0, "16 min", "New module", ["patterns", "analysis"]),
    ],
  },
  {
    id: "geninfo",
    title: "General Info",
    color: "bg-[#ff3f77]",
    indicator: "bg-[#ff3f77]",
    icon: <ScaleIcon />,
    modules: [
      moduleItem(1, "Philippine Government", "Review branches of government and civic responsibilities.", "Completed", 100, "16 min", "Quiz Score: 9/10", ["government", "civics"]),
      moduleItem(2, "Current Events Primer", "Study safe, verifiable general-information review notes.", "In Progress", 40, "15 min", "Last opened: May 10", ["current events", "general"]),
      moduleItem(3, "History and Culture", "Refresh key Philippine history and cultural literacy themes.", "Not Started", 0, "18 min", "New module", ["history", "culture"]),
    ],
  },
  {
    id: "ethics",
    title: "Ethics & Laws",
    color: "bg-red-500",
    indicator: "bg-red-500",
    icon: <ScaleIcon />,
    modules: [
      moduleItem(1, "RA 6713 Overview", "Review conduct standards for public officials and employees.", "Weak Area", 20, "15 min", "Quiz Score: 4/10", ["ethics", "law", "ra 6713"]),
      moduleItem(2, "Accountability", "Study responsibility, transparency, and public trust scenarios.", "Locked", 0, "14 min", "Unlock after Module 1", ["accountability", "public trust"]),
    ],
  },
];

const filterOptions = ["All", "Not Started", "In Progress", "Completed", "Weak Areas", "Bookmarked"] as const;

function moduleItem(
  number: number,
  title: string,
  description: string,
  status: ModuleStatus,
  progress: number,
  time: string,
  note: string,
  keywords: string[],
): LessonModule {
  return { number, title, description, status, progress, time, note, keywords };
}

function LessonsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("All");
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(subjects.map((subject) => [subject.id, subject.id === "english"])),
  );

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects
      .map((subject) => {
        const modules = subject.modules.filter((module) => {
          const matchesSearch =
            !query ||
            [subject.title, module.title, module.description, module.status, ...module.keywords]
              .join(" ")
              .toLowerCase()
              .includes(query);
          const matchesFilter =
            activeFilter === "All" ||
            (activeFilter === "Weak Areas" && module.status === "Weak Area") ||
            (activeFilter === "Bookmarked" && module.status === "Weak Area") ||
            module.status === activeFilter;

          return matchesSearch && matchesFilter;
        });

        return { ...subject, modules };
      })
      .filter((subject) => subject.modules.length > 0);
  }, [activeFilter, search]);

  const hasActiveSearch = search.trim().length > 0 || activeFilter !== "All";

  return (
    <main className="container-page relative pb-9 pt-2 md:pb-12">
      <PageDoodles variant="lessons" />
      <div className="relative z-10 mb-3 flex justify-end pr-1 md:mb-4 md:pr-2">
        <button
          type="button"
          onClick={() => setViewMode((current) => (current === "grid" ? "list" : "grid"))}
          className="border-b-2 border-brand-pink text-xl font-bold leading-none text-brand-pink md:text-2xl"
        >
          {viewMode === "grid" ? "View Toggle List" : "View Card Grid"}
        </button>
      </div>

      {viewMode === "grid" ? (
        <CardGrid />
      ) : (
        <LessonsLibrary
          activeFilter={activeFilter}
          filteredSubjects={filteredSubjects}
          hasActiveSearch={hasActiveSearch}
          openSubjects={openSubjects}
          search={search}
          setActiveFilter={setActiveFilter}
          setOpenSubjects={setOpenSubjects}
          setSearch={setSearch}
        />
      )}
    </main>
  );
}

function CardGrid() {
  return (
    <section className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {subjects.slice(0, 6).map((card) => (
        <Link
          key={card.id}
          to="/topics/$topicId"
          params={{ topicId: card.id }}
          className={`${card.color} group relative min-h-[240px] overflow-hidden rounded-[1.35rem] p-6 shadow-sticker transition-transform hover:-translate-y-1 md:min-h-[250px] xl:min-h-[252px]`}
        >
          <div className="absolute left-5 top-8 text-white/30">{card.icon}</div>

          <div className="absolute right-5 top-5 flex items-center gap-1.5 text-base font-bold text-brand-ink/65">
            <span>10 Modules</span>
            <span className="text-3xl leading-none text-brand-ink/65">&gt;</span>
          </div>

          <ul className="absolute right-7 top-[4.55rem] w-[10rem] space-y-0.5 text-left text-sm font-bold uppercase leading-tight text-white/60 md:right-8">
            {moduleTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <h2 className="absolute bottom-6 left-6 right-6 font-display text-[3.15rem] font-black leading-none text-white drop-shadow-sm md:text-[3.35rem]">
            {card.title}
          </h2>
        </Link>
      ))}
    </section>
  );
}

function LessonsLibrary({
  activeFilter,
  filteredSubjects,
  hasActiveSearch,
  openSubjects,
  search,
  setActiveFilter,
  setOpenSubjects,
  setSearch,
}: {
  activeFilter: (typeof filterOptions)[number];
  filteredSubjects: Subject[];
  hasActiveSearch: boolean;
  openSubjects: Record<string, boolean>;
  search: string;
  setActiveFilter: (filter: (typeof filterOptions)[number]) => void;
  setOpenSubjects: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setSearch: (value: string) => void;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-[70rem]">
      <div className="rounded-[1.45rem] bg-white/80 p-4 shadow-sticker md:p-6">
        <h1 className="font-display text-4xl font-black leading-none text-brand-ink md:text-5xl">
          Lessons Library
        </h1>
        <p className="mt-2 text-base font-medium text-brand-ink/65">
          Browse, search, and continue your modules.
        </p>

        <label className="mt-5 block w-full">
          <span className="sr-only">Search modules</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search modules, lessons, or topics..."
            className="h-13 w-full rounded-2xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 text-base font-medium text-brand-ink shadow-[inset_0_2px_0_rgba(45,45,45,0.04)] outline-none transition focus:border-brand-purple"
          />
        </label>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {filterOptions.map((filter) => (
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
      </div>

      <div className="mt-5 space-y-3">
        {filteredSubjects.length === 0 ? (
          <div className="rounded-[1.25rem] bg-[#fff5cc] p-6 text-center font-bold text-brand-ink/70 shadow-soft">
            No modules match your search yet.
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const completed = subject.modules.filter((module) => module.status === "Completed").length;
            const total = subjects.find((item) => item.id === subject.id)?.modules.length ?? subject.modules.length;
            const progress = total ? Math.round((completed / total) * 100) : 0;
            const isOpen = hasActiveSearch || openSubjects[subject.id];

            return (
              <article key={subject.id} className="overflow-hidden rounded-[1.1rem] bg-[#fff8df] shadow-soft">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSubjects((current) => ({ ...current, [subject.id]: !current[subject.id] }))
                  }
                  className="grid w-full gap-3 p-4 text-left md:grid-cols-[minmax(0,1fr)_auto_170px_54px_28px] md:items-center md:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-8 w-8 shrink-0 rounded-xl ${subject.indicator} shadow-[2px_2px_0_rgba(45,45,45,0.1)]`} />
                    <div>
                      <h2 className="text-2xl font-bold text-brand-ink">{subject.title}</h2>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-brand-ink/58 md:text-right">
                    {completed}/{total} completed
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eadfb7] md:w-[170px]">
                      <div className={`h-full rounded-full ${subject.indicator}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <span className="text-sm font-black text-brand-ink/70 md:text-right">{progress}%</span>
                  <span className="text-2xl font-black leading-none text-brand-ink/65 md:text-right">
                    {isOpen ? "^" : "v"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-brand-ink/12 px-4 pb-2 md:px-5">
                    {subject.modules.map((module) => (
                      <ModuleRow
                        key={`${subject.id}-${module.number}`}
                        module={module}
                        progressColor={subject.indicator}
                      />
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function ModuleRow({ module, progressColor }: { module: LessonModule; progressColor: string }) {
  return (
    <div className="grid gap-3 border-b border-brand-ink/10 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px] md:items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-bold text-brand-ink">
            Module {module.number}: {module.title}
          </h3>
          <StatusPill status={module.status} />
        </div>
        <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-brand-ink/65">
          {module.description}
        </p>

        <p className="mt-2 text-sm font-bold text-brand-ink/58">
          {module.time}
          {module.note ? ` • ${module.note}` : ""}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eadfb7]">
            <div
              className={`h-full rounded-full ${module.status === "Weak Area" ? "bg-brand-purple" : progressColor}`}
              style={{ width: `${module.progress}%` }}
            />
          </div>
          <span className="w-10 text-right text-sm font-black text-brand-ink/68">{module.progress}%</span>
        </div>
      </div>

      <Link
        to="/topics"
        className={`rounded-xl px-5 py-3 text-center text-sm font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] md:min-w-28 ${
          module.status === "Locked" ? "bg-brand-ink/35" : "bg-brand-blue"
        }`}
      >
        {getAction(module.status)}
      </Link>
    </div>
  );
}

function StatusPill({ status }: { status: ModuleStatus }) {
  const className =
    status === "Completed"
      ? "bg-brand-teal text-white"
      : status === "In Progress"
        ? "bg-brand-blue text-white"
        : status === "Weak Area"
          ? "bg-brand-pink text-white"
          : status === "Locked"
            ? "bg-brand-ink/20 text-brand-ink/60"
            : "bg-brand-yellow text-brand-ink";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>{status}</span>;
}

function getAction(status: ModuleStatus) {
  if (status === "Completed") return "Review";
  if (status === "In Progress" || status === "Weak Area") return "Continue";
  if (status === "Locked") return "Locked";
  return "Start";
}

function BookIcon() {
  return (
    <svg className="h-32 w-44 md:h-36 md:w-48" viewBox="0 0 180 140" fill="none">
      <path d="M18 32c27-10 44-5 70 14v73c-26-19-46-24-70-14V32Z" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
      <path d="M162 32c-27-10-44-5-70 14v73c26-19 46-24 70-14V32Z" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
      <path d="M90 47v78" stroke="currentColor" strokeWidth="7" />
      <path d="M8 44v72h72M172 44v72h-72" stroke="currentColor" strokeWidth="7" />
    </svg>
  );
}

function SalakotIcon() {
  return (
    <svg className="h-36 w-44 md:h-40 md:w-48" viewBox="0 0 190 150" fill="none">
      <path d="M21 67c47-34 102-34 148 0-22 15-121 15-148 0Z" fill="currentColor" />
      <path d="M51 68c12-30 27-45 44-45s32 15 44 45M78 76c-2 30 2 49 17 62M112 76c1 30-3 49-17 62" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 129l-18 13M122 129l18 13" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

function MathIcon() {
  return (
    <svg className="h-36 w-36 md:h-40 md:w-40" viewBox="0 0 150 150" fill="none">
      {[
        ["20", "18", "+"],
        ["88", "18", "-"],
        ["20", "86", "%"],
        ["88", "86", "x"],
      ].map(([x, y, label]) => (
        <g key={label}>
          <rect x={x} y={y} width="44" height="44" rx="8" stroke="currentColor" strokeWidth="7" />
          <text x={Number(x) + 22} y={Number(y) + 31} textAnchor="middle" fill="currentColor" fontSize="32" fontWeight="800">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ClericalIcon() {
  return (
    <svg className="h-36 w-40 md:h-40 md:w-44" viewBox="0 0 170 150" fill="currentColor">
      <circle cx="75" cy="31" r="19" />
      <path d="M48 58h42c19 0 34 15 34 34v38H31V75c0-9 8-17 17-17Z" />
      <rect x="24" y="95" width="104" height="41" rx="4" />
      <path d="M112 43c12 7 19 16 21 29l-16 4c-1-8-5-14-12-18l7-15Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-36 w-36 md:h-40 md:w-40" viewBox="0 0 150 150" fill="currentColor">
      <circle cx="75" cy="75" r="58" />
      <circle cx="75" cy="45" r="7" fill="white" opacity="0.22" />
      <rect x="67" y="62" width="16" height="50" rx="8" fill="white" opacity="0.22" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="h-36 w-44 md:h-40 md:w-48" viewBox="0 0 180 150" fill="none">
      <path d="M91 24v104M48 47h86M91 47 54 60M91 47l37 13" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M35 103h38L54 61 35 103ZM111 103h38l-19-42-19 42Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <path d="M75 128h32" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
