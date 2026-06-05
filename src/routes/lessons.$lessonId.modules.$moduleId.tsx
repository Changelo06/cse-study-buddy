import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getModuleById, getTopicById } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect, useRef } from "react";
import { BookOpen, Key, Lightbulb, BookMarked, ArrowRight, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/lessons/$lessonId/modules/$moduleId")({
  component: ModuleReadingPage,
});

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "discussion", label: "Discussion", icon: BookMarked },
  { id: "key-terms", label: "Key Terms", icon: Key },
  { id: "examples", label: "Examples", icon: Lightbulb },
  { id: "references", label: "References", icon: BookMarked },
] as const;

function ModuleReadingPage() {
  const { lessonId, moduleId } = Route.useParams();
  const router = useRouter();
  const topic = getTopicById(lessonId);
  const module = getModuleById(lessonId, moduleId);

  const { markModuleAsRead, readModules, completedModules } = useAppStore();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, scrolled / total) : 1;
      setScrollProgress(Math.round(progress * 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [module]);

  if (!topic || !module) {
    return <div className="container-page py-12 font-bold text-brand-ink">Module not found.</div>;
  }

  const sc = module.structuredContent;
  const isRead = readModules.includes(moduleId);
  const isCompleted = completedModules.includes(moduleId);

  // Find the current module index to show module number
  const moduleIndex = topic.modules.findIndex((m) => m.id === moduleId);

  const handleTakeAssessment = () => {
    markModuleAsRead(moduleId);
    router.navigate({
      to: "/lessons/$lessonId/modules/$moduleId/exam",
      params: { lessonId, moduleId },
    });
  };

  return (
    <main className="container-page pb-10 pt-3 md:pb-14" ref={contentRef}>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div
          className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-brand-ink/55 mb-6">
        <Link to="/lessons" className="hover:text-brand-ink transition-colors">
          Lessons
        </Link>
        <span>&gt;</span>
        <Link to="/lessons/$lessonId" params={{ lessonId }} className="hover:text-brand-ink transition-colors">
          {topic.title}
        </Link>
        <span>&gt;</span>
        <span className="text-brand-ink">{module.title}</span>
      </nav>

      <div className="flex gap-8 items-start">
        {/* Sticky sidebar — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-20">
          <div className="rounded-[1.25rem] bg-white/90 p-4 shadow-sticker border border-brand-ink/5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-ink/45 mb-3">
              Sections
            </p>
            <nav className="flex flex-col gap-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#section-${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                    activeSection === id
                      ? "bg-brand-blue/10 text-brand-blue shadow-sm"
                      : "text-brand-ink/55 hover:text-brand-ink hover:bg-brand-ink/5"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-brand-ink/10">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-ink/45 mb-2">
                Progress
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-ink/10">
                <div
                  className="h-full rounded-full bg-brand-blue transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs font-bold text-brand-ink/50">{scrollProgress}% read</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-4xl">
          {/* Module header card */}
          <header className="rounded-[1.45rem] bg-[#fff8df] p-6 md:p-8 shadow-sticker mb-8 border border-brand-ink/5">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`rounded-full ${topic.bgColor} px-4 py-2 text-sm font-bold text-white shadow-sm`}>
                {topic.title}
              </span>
              <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/70 flex items-center gap-1.5">
                <Clock size={14} strokeWidth={2.5} />
                {module.estimatedMinutes} mins
              </span>
              <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/70 flex items-center gap-1.5">
                <BarChart3 size={14} strokeWidth={2.5} />
                {module.difficulty}
              </span>
              {isCompleted && (
                <span className="rounded-full bg-brand-teal text-white px-4 py-2 text-sm font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-ink/45 mb-1">
              Module {moduleIndex + 1}
            </p>
            <h1 className="font-display text-3xl font-black leading-tight text-brand-ink md:text-4xl lg:text-5xl mb-3">
              {module.title}
            </h1>
            <p className="text-lg font-medium text-brand-ink/70 max-w-2xl">{module.description}</p>
          </header>

          {/* Section: Overview */}
          <section id="section-overview" className="mb-8 scroll-mt-24">
            <SectionHeader icon={BookOpen} label="Overview" color="bg-brand-blue" />
            <div className="bg-white rounded-[1.25rem] p-6 md:p-8 shadow-sticker border border-brand-ink/5">
              <p className="text-lg font-medium leading-relaxed text-brand-ink/80">{sc.overview}</p>
            </div>
          </section>

          {/* Section: Discussion */}
          <section id="section-discussion" className="mb-8 scroll-mt-24">
            <SectionHeader icon={BookMarked} label="Discussion" color="bg-brand-purple" />
            <div className="bg-white rounded-[1.25rem] p-6 md:p-8 shadow-sticker border border-brand-ink/5">
              <div className="prose prose-lg prose-brand max-w-none whitespace-pre-wrap text-brand-ink/80 font-medium leading-relaxed">
                {sc.discussion}
              </div>
            </div>
          </section>

          {/* Section: Key Terms */}
          <section id="section-key-terms" className="mb-8 scroll-mt-24">
            <SectionHeader icon={Key} label="Key Terms" color="bg-brand-yellow" />
            <div className="grid gap-3">
              {sc.keyTerms.map((term, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[1.25rem] p-5 md:p-6 shadow-sticker border-2 border-brand-yellow/20 hover:border-brand-yellow/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/20 text-brand-yellow font-display font-black text-lg">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-display font-black text-xl text-brand-ink mb-1">{term.term}</h4>
                      <p className="text-brand-ink/70 font-medium leading-relaxed">{term.definition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Examples */}
          <section id="section-examples" className="mb-8 scroll-mt-24">
            <SectionHeader icon={Lightbulb} label="Examples" color="bg-brand-teal" />
            <div className="space-y-4">
              {sc.examples.map((example, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[1.25rem] p-6 md:p-8 shadow-sticker border-l-4 border-brand-teal"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal/15 text-brand-teal font-bold text-sm">
                      {i + 1}
                    </span>
                    <h4 className="font-display font-black text-lg text-brand-ink">{example.title}</h4>
                  </div>
                  <p className="text-brand-ink/75 font-medium leading-relaxed">{example.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: References */}
          <section id="section-references" className="mb-8 scroll-mt-24">
            <SectionHeader icon={BookMarked} label="References" color="bg-brand-pink" />
            <div className="bg-white rounded-[1.25rem] p-6 shadow-sticker border border-brand-ink/5">
              <ul className="space-y-3">
                {sc.references.map((ref, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-brand-pink/15 flex items-center justify-center text-brand-pink text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-brand-ink">{ref.title}</p>
                      <p className="text-sm text-brand-ink/55 font-medium">{ref.source}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Assessment CTA */}
          <div className="rounded-[1.45rem] p-6 md:p-8 shadow-sticker bg-gradient-to-br from-brand-blue/10 via-brand-purple/5 to-brand-pink/10 border-2 border-brand-blue/20">
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div>
                <h3 className="font-display font-black text-2xl md:text-3xl text-brand-ink">
                  Ready for the Assessment?
                </h3>
                <p className="text-brand-ink/70 font-medium mt-1 max-w-md">
                  You must pass the assessment ({module.assessment.questions.length} items, {module.assessment.durationMinutes} minutes, {module.assessment.passingScore}% to pass) to complete this module and unlock the next one.
                </p>
              </div>
              <button
                onClick={handleTakeAssessment}
                className="w-full sm:w-auto bg-brand-blue text-white rounded-2xl px-8 py-4 font-display font-black text-lg hover:scale-[1.02] active:scale-100 transition-transform shadow-[4px_4px_0_rgba(45,45,45,0.15)] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isRead ? "Retake Assessment" : "Take Assessment"}
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`${color} h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm`}>
        <Icon size={18} strokeWidth={2.5} />
      </span>
      <h2 className="font-display font-black text-2xl text-brand-ink">{label}</h2>
    </div>
  );
}
