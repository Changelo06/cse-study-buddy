import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { getTopicById, getFinalExamForTopic } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { ArrowRight, Lock, CheckCircle2, Shield, Zap, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons/$lessonId")({
  component: LessonLayout,
});

const tierIcons = { 1: Shield, 2: Zap, 3: Star } as const;
const tierColors = {
  1: { bg: "bg-brand-teal", text: "text-brand-teal" },
  2: { bg: "bg-brand-orange", text: "text-brand-orange" },
  3: { bg: "bg-brand-pink", text: "text-brand-pink" },
} as const;

/**
 * Layout route for /lessons/$lessonId.
 * When a child route is active (modules, final-exam, etc.), renders <Outlet />.
 * Otherwise renders the lesson overview page.
 */
function LessonLayout() {
  const matches = useMatches();
  // If there's a match deeper than this route, a child is active
  const hasChildRoute = matches.some(
    (m) => m.routeId !== "/lessons/$lessonId" && m.routeId.startsWith("/lessons/$lessonId/")
  );

  if (hasChildRoute) {
    return <Outlet />;
  }

  return <LessonOverviewPage />;
}

function LessonOverviewPage() {
  const { lessonId } = Route.useParams();
  const topic = getTopicById(lessonId);
  const finalExam = getFinalExamForTopic(lessonId);
  const { completedModules, isModuleUnlocked, isFinalExamUnlocked, finalExamResults, isAllTiersPassed } = useAppStore();

  if (!topic) {
    return <div className="container-page py-12">Lesson not found.</div>;
  }

  const examUnlocked = isFinalExamUnlocked(lessonId);
  const allPassed = isAllTiersPassed(lessonId);
  const completedCount = topic.modules.filter((m) => completedModules.includes(m.id)).length;
  const totalModules = topic.modules.length;

  return (
    <div className="container-page py-12">
      <Link to="/lessons" className="text-brand-ink/60 hover:text-brand-ink mb-8 inline-block font-display font-bold">
        &larr; Back to Lessons
      </Link>

      {/* Topic hero banner */}
      <div className={`${topic.bgColor} rounded-[2.5rem] p-8 md:p-12 text-white shadow-soft relative overflow-hidden mb-12`}>
        <div className="absolute top-1/2 -translate-y-1/2 right-12 opacity-20 pointer-events-none text-9xl font-black font-display">
          {topic.icon}
        </div>
        <h1 className="font-display font-black text-4xl md:text-6xl tracking-tight mb-4 relative z-10">{topic.title}</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl relative z-10">{topic.description}</p>
        {totalModules > 0 && (
          <div className="mt-6 flex items-center gap-3 relative z-10">
            <div className="h-3 flex-1 max-w-xs overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${totalModules > 0 ? (completedCount / totalModules) * 100 : 0}%` }}
              />
            </div>
            <span className="font-bold text-sm">{completedCount}/{totalModules} modules</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-black text-3xl text-brand-ink mb-6">Modules</h2>
          {topic.modules.length === 0 ? (
            <p className="text-brand-ink/60 font-display font-bold">No modules available yet.</p>
          ) : (
            topic.modules.map((module, i) => {
              const isUnlocked = isModuleUnlocked(topic.id, module.id);
              const isCompleted = completedModules.includes(module.id);

              return (
                <Link
                  key={module.id}
                  to="/lessons/$lessonId/modules/$moduleId"
                  params={{ lessonId: topic.id, moduleId: module.id }}
                  disabled={!isUnlocked}
                  className={cn(
                    "bg-white rounded-2xl p-6 shadow-soft block transition-all border-2",
                    isUnlocked
                      ? "hover:scale-[1.01] hover:border-brand-ink border-transparent hover:shadow-[4px_6px_0_rgba(45,45,45,0.08)]"
                      : "opacity-60 pointer-events-none border-transparent"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/50">
                          Module {i + 1}
                        </span>
                        {!isUnlocked && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-ink/10 text-brand-ink/60 px-2 py-0.5 rounded-full">
                            Locked
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-teal text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={10} /> Completed
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-black text-xl text-brand-ink">{module.title}</h3>
                      <p className="text-sm text-brand-ink/55 font-medium mt-1">{module.description}</p>
                    </div>
                    <div className={cn(
                      "rounded-full w-10 h-10 flex items-center justify-center",
                      isUnlocked ? "bg-brand-ink/5 text-brand-ink" : "bg-brand-ink/10 text-brand-ink/40"
                    )}>
                      {isUnlocked ? <ArrowRight size={20} strokeWidth={3} /> : <Lock size={16} strokeWidth={3} />}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Final Exam sidebar */}
        <div className="lg:col-span-1">
          <h2 className="font-display font-black text-3xl text-brand-ink mb-6">Final Exam</h2>

          {allPassed && (
            <div className="mb-4 rounded-2xl bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink p-4 text-center text-white shadow-soft">
              <Trophy size={28} className="mx-auto mb-1" />
              <p className="font-display font-black">All Tiers Passed! 🏆</p>
            </div>
          )}

          <div className="bg-brand-ink rounded-[2rem] p-6 shadow-soft">
            {!examUnlocked && (
              <div className="mb-4 rounded-xl bg-white/10 p-4 text-center">
                <Lock size={24} className="mx-auto text-white/50 mb-2" />
                <p className="text-white/70 text-sm font-bold">
                  Complete all {totalModules} modules to unlock
                </p>
                <p className="text-white/50 text-xs font-medium mt-1">
                  {completedCount}/{totalModules} completed
                </p>
              </div>
            )}

            <div className="space-y-3">
              {finalExam ? (
                finalExam.tiers.map((tier) => {
                  const TierIcon = tierIcons[tier.tier];
                  const colors = tierColors[tier.tier];
                  const result = finalExamResults[tier.id];

                  return (
                    <Link
                      key={tier.id}
                      to="/lessons/$lessonId/final-exam/$levelId"
                      params={{ lessonId: topic.id, levelId: tier.id }}
                      className={cn(
                        "block rounded-xl p-4 transition-all",
                        examUnlocked
                          ? "bg-white/10 hover:bg-white/20 hover:-translate-y-0.5"
                          : "bg-white/5 opacity-60 pointer-events-none"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-white", colors.bg)}>
                          <TierIcon size={18} strokeWidth={2.5} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-display font-bold text-sm">{tier.label}</span>
                            {result?.passed && (
                              <span className="text-[10px] font-bold bg-brand-teal text-white px-2 py-0.5 rounded-full">✓</span>
                            )}
                          </div>
                          <span className="text-white/60 text-xs font-medium">
                            {tier.itemCount} items • {tier.durationMinutes} min
                          </span>
                        </div>
                        {result && (
                          <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full",
                            result.passed ? "bg-brand-teal/30 text-brand-teal" : "bg-brand-pink/30 text-brand-pink"
                          )}>
                            {Math.round((result.score / result.total) * 100)}%
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-white/60 font-display font-bold text-center py-4">No final exam available.</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider text-center">
                60 items per tier • All tiers freely selectable
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
