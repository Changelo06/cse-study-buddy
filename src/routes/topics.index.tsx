import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageDoodles } from "@/components/Doodles";
import { mockTopics } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/topics/")({
  component: LessonsPage,
});

const filterOptions = ["All", "Not Started", "In Progress", "Completed", "Weak Areas", "Bookmarked"] as const;

function LessonsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("All");
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockTopics.map((topic) => [topic.id, topic.id === "english"])),
  );

  const { completedModules, isModuleUnlocked } = useAppStore();

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockTopics
      .map((topic) => {
        const modules = topic.modules.filter((module) => {
          const isCompleted = completedModules.includes(module.id);
          const isUnlocked = isModuleUnlocked(topic.id, module.id);
          const status = isCompleted ? "Completed" : isUnlocked ? "In Progress" : "Locked";

          const matchesSearch =
            !query ||
            [topic.title, module.title, module.description, status]
              .join(" ")
              .toLowerCase()
              .includes(query);

          const matchesFilter =
            activeFilter === "All" ||
            (activeFilter === "Completed" && status === "Completed") ||
            (activeFilter === "In Progress" && status === "In Progress") ||
            (activeFilter === "Not Started" && status === "In Progress" && !isCompleted);
            // Ignore Weak Areas and Bookmarked for now

          return matchesSearch && matchesFilter;
        });

        return { ...topic, filteredModules: modules };
      })
      .filter((subject) => subject.filteredModules.length > 0 || subject.modules.length === 0);
  }, [activeFilter, search, completedModules, isModuleUnlocked]);

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
      {mockTopics.map((card) => (
        <Link
          key={card.id}
          to="/topics/$topicId"
          params={{ topicId: card.id }}
          className={`${card.bgColor} group relative min-h-[240px] overflow-hidden rounded-[1.35rem] p-6 shadow-sticker transition-transform hover:-translate-y-1 md:min-h-[250px] xl:min-h-[252px]`}
        >
          <div className="absolute left-5 top-8 text-white/30 text-8xl font-black font-display">{card.icon}</div>

          <div className="absolute right-5 top-5 flex items-center gap-1.5 text-base font-bold text-brand-ink/65">
            <span>{card.modules.length} Modules</span>
            <span className="text-3xl leading-none text-brand-ink/65">&gt;</span>
          </div>

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
}: any) {
  const { completedModules, isModuleUnlocked } = useAppStore();

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
              disabled={filter === "Weak Areas" || filter === "Bookmarked"}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
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
          filteredSubjects.map((subject: any) => {
            const completed = subject.modules.filter((m: any) => completedModules.includes(m.id)).length;
            const total = subject.modules.length;
            const progress = total ? Math.round((completed / total) * 100) : 0;
            const isOpen = hasActiveSearch || openSubjects[subject.id];

            return (
              <article key={subject.id} className="overflow-hidden rounded-[1.1rem] bg-[#fff8df] shadow-soft">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSubjects((current: any) => ({ ...current, [subject.id]: !current[subject.id] }))
                  }
                  className="grid w-full gap-3 p-4 text-left md:grid-cols-[minmax(0,1fr)_auto_170px_54px_28px] md:items-center md:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-8 w-8 shrink-0 rounded-xl ${subject.bgColor} shadow-[2px_2px_0_rgba(45,45,45,0.1)] flex items-center justify-center font-black text-white text-xs`}>
                      {subject.icon}
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-brand-ink">{subject.title}</h2>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-brand-ink/58 md:text-right">
                    {completed}/{total} completed
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eadfb7] md:w-[170px]">
                      <div className={`h-full rounded-full ${subject.bgColor}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <span className="text-sm font-black text-brand-ink/70 md:text-right">{progress}%</span>
                  <span className="text-2xl font-black leading-none text-brand-ink/65 md:text-right">
                    {isOpen ? "^" : "v"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-brand-ink/12 px-4 pb-2 md:px-5">
                    {subject.filteredModules.length === 0 ? (
                      <p className="py-4 text-brand-ink/50 font-bold">No modules available.</p>
                    ) : (
                      subject.filteredModules.map((module: any, index: number) => {
                        const isCompleted = completedModules.includes(module.id);
                        const isUnlocked = isModuleUnlocked(subject.id, module.id);
                        const status = isCompleted ? "Completed" : isUnlocked ? "In Progress" : "Locked";

                        return (
                          <div key={module.id} className={`grid gap-3 border-b border-brand-ink/10 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px] md:items-center ${!isUnlocked && "opacity-60"}`}>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-bold text-brand-ink">
                                  Module {index + 1}: {module.title}
                                </h3>
                                <StatusPill status={status} />
                              </div>
                              <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-brand-ink/65">
                                {module.description}
                              </p>
                              <p className="mt-2 text-sm font-bold text-brand-ink/58">
                                {module.estimatedMinutes} min
                              </p>
                            </div>
                            
                            <Link
                              to="/topics/$topicId/modules/$moduleId"
                              params={{ topicId: subject.id, moduleId: module.id }}
                              disabled={!isUnlocked}
                              className={`rounded-xl px-5 py-3 text-center text-sm font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] md:min-w-28 ${
                                status === "Locked" ? "bg-brand-ink/35 pointer-events-none" : "bg-brand-blue hover:scale-105 transition-transform"
                              }`}
                            >
                              {status === "Completed" ? "Review" : status === "Locked" ? "Locked" : "Start"}
                            </Link>
                          </div>
                        );
                      })
                    )}
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

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Completed"
      ? "bg-brand-teal text-white"
      : status === "In Progress"
        ? "bg-brand-blue text-white"
        : "bg-brand-ink/20 text-brand-ink/60";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>{status}</span>;
}
