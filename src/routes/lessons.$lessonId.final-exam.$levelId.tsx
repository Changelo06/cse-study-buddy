import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getFinalExamForTopic, getFinalExamTier, getTopicById } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { Clock, Flag, Check, X, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Lock, Trophy, Star, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons/$lessonId/final-exam/$levelId")({
  component: FinalExamPage,
});

type ExamStatus = "idle" | "in-progress" | "submitted";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const tierConfig = {
  1: { color: "bg-brand-teal", textColor: "text-brand-teal", icon: Shield, label: "Tier 1 — Relaxed", tagline: "120 minutes for 60 items. Take your time." },
  2: { color: "bg-brand-orange", textColor: "text-brand-orange", icon: Zap, label: "Tier 2 — Moderate", tagline: "90 minutes for 60 items. Stay focused." },
  3: { color: "bg-brand-pink", textColor: "text-brand-pink", icon: Star, label: "Tier 3 — Challenge", tagline: "60 minutes for 60 items. Speed and accuracy." },
} as const;

function FinalExamPage() {
  const { lessonId, levelId } = Route.useParams();
  const router = useRouter();
  const topic = getTopicById(lessonId);
  const finalExam = getFinalExamForTopic(lessonId);
  const tier = getFinalExamTier(lessonId, levelId);
  const { isFinalExamUnlocked, saveFinalExamResult, finalExamResults, isAllTiersPassed } = useAppStore();

  const [status, setStatus] = useState<ExamStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const isUnlocked = isFinalExamUnlocked(lessonId);
  const previousResult = tier ? finalExamResults[tier.id] : undefined;
  const allTiersPassed = isAllTiersPassed(lessonId);

  // Timer
  useEffect(() => {
    if (status !== "in-progress" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("submitted");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  if (!topic || !finalExam || !tier) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-10 text-center shadow-sticker">
          <h1 className="font-display text-3xl font-black text-brand-ink">Exam not found</h1>
          <Link to="/lessons/$lessonId" params={{ lessonId }} className="mt-4 inline-block text-brand-blue font-bold hover:underline">
            ← Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  const questions = tier.questions;
  const cfg = tierConfig[tier.tier];
  const TierIcon = cfg.icon;

  const handleStart = () => {
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setTimeLeft(tier.durationMinutes * 60);
    setStartTime(Date.now());
    setStatus("in-progress");
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit your final exam? You won't be able to change your answers.")) {
      setStatus("submitted");
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const toggleReview = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setMarkedForReview((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  // Calculate results
  const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0), 0);
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = percentage >= tier.passingScore;
  const timeUsed = Math.round((Date.now() - startTime) / 1000);

  // Save result on submit
  useEffect(() => {
    if (status !== "submitted") return;
    saveFinalExamResult(tier.id, {
      score: correctCount,
      total: questions.length,
      passed: isPassed,
      timeSpentSeconds: timeUsed,
      completedAt: new Date().toISOString(),
    });
  }, [status]);

  // Timer urgency
  const timerColor =
    timeLeft <= 120 ? "text-red-500 bg-red-50 animate-pulse" :
    timeLeft <= 300 ? "text-brand-orange bg-orange-50" :
    "text-brand-pink bg-brand-pink/10";

  return (
    <main className="container-page pb-10 pt-3 md:pb-14">
      <section className="mx-auto max-w-[68rem] rounded-[1.45rem] bg-white/86 p-5 shadow-sticker md:p-7">

        {/* ═══════════════════ IDLE STATE ═══════════════════ */}
        {status === "idle" && (
          <div className="mx-auto max-w-3xl">
            <Link to="/lessons/$lessonId" params={{ lessonId }} className="text-sm font-bold text-brand-ink/58 hover:text-brand-ink">
              &lt; Back to {topic.title}
            </Link>

            {/* Tier Header */}
            <div className={cn("mt-6 rounded-[2rem] p-8 md:p-12 text-white text-center shadow-soft relative overflow-hidden", cfg.color)}>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <TierIcon size={48} className="mx-auto mb-4 opacity-80" strokeWidth={2} />
                <div className="inline-flex bg-white/20 px-6 py-2 rounded-full font-display font-bold uppercase tracking-widest text-sm mb-4">
                  {topic.title} Final Exam
                </div>
                <h1 className="font-display font-black text-4xl md:text-5xl mb-3 leading-tight">
                  {cfg.label}
                </h1>
                <p className="text-white/80 font-medium text-lg">{cfg.tagline}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#fff8df] p-5 text-center shadow-soft border border-brand-ink/5">
                <span className="block font-display text-3xl font-black text-brand-ink">{tier.itemCount}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/55">Items</span>
              </div>
              <div className="rounded-2xl bg-[#fff8df] p-5 text-center shadow-soft border border-brand-ink/5">
                <span className="block font-display text-3xl font-black text-brand-ink">{tier.durationMinutes}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/55">Minutes</span>
              </div>
              <div className="rounded-2xl bg-[#fff8df] p-5 text-center shadow-soft border border-brand-ink/5">
                <span className="block font-display text-3xl font-black text-brand-ink">{tier.passingScore}%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/55">To Pass</span>
              </div>
            </div>

            {/* Previous result */}
            {previousResult && (
              <div className={cn(
                "mt-4 rounded-2xl p-4 border-2 flex items-center justify-between",
                previousResult.passed
                  ? "bg-brand-teal/10 border-brand-teal/20"
                  : "bg-brand-pink/10 border-brand-pink/20"
              )}>
                <div>
                  <p className={cn("font-bold", previousResult.passed ? "text-brand-teal" : "text-brand-pink")}>
                    {previousResult.passed ? "✓ Previously Passed" : "✗ Previous Attempt Failed"}
                  </p>
                  <p className="text-sm font-medium text-brand-ink/60">
                    Score: {previousResult.score}/{previousResult.total} ({Math.round((previousResult.score / previousResult.total) * 100)}%)
                  </p>
                </div>
                <span className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold text-white",
                  previousResult.passed ? "bg-brand-teal" : "bg-brand-pink"
                )}>
                  {previousResult.passed ? "Passed" : "Failed"}
                </span>
              </div>
            )}

            {/* Lock / Start */}
            <div className="mt-6">
              {!isUnlocked ? (
                <div className="rounded-2xl bg-brand-ink/5 p-6 text-center border-2 border-dashed border-brand-ink/15">
                  <Lock size={32} className="mx-auto text-brand-ink/40 mb-3" />
                  <h3 className="font-display font-black text-xl text-brand-ink/70">Locked</h3>
                  <p className="mt-2 text-brand-ink/55 font-medium max-w-md mx-auto">
                    Complete all modules in {topic.title} to unlock the final exam. All 3 tiers will become available at once.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStart}
                  className={cn(
                    "w-full rounded-2xl py-5 font-display font-black text-2xl text-white shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:scale-[1.01] active:scale-100 transition-transform",
                    cfg.color
                  )}
                >
                  {previousResult ? "Retake Exam" : "Start Exam"}
                </button>
              )}
            </div>

            {/* Other tiers */}
            <div className="mt-6 rounded-2xl bg-[#fff5cc] p-5 shadow-soft">
              <h3 className="font-display font-black text-lg text-brand-ink mb-3">Other Tiers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {finalExam.tiers.filter(t => t.id !== tier.id).map(t => {
                  const tCfg = tierConfig[t.tier];
                  const tResult = finalExamResults[t.id];
                  return (
                    <Link
                      key={t.id}
                      to="/lessons/$lessonId/final-exam/$levelId"
                      params={{ lessonId, levelId: t.id }}
                      className={cn(
                        "rounded-xl p-4 text-center font-bold text-white transition-transform hover:-translate-y-0.5 shadow-sm",
                        tCfg.color
                      )}
                    >
                      <p className="font-display font-black">{tCfg.label.split("—")[0]}</p>
                      <p className="text-sm opacity-80">{t.durationMinutes} min</p>
                      {tResult && (
                        <p className="mt-1 text-xs bg-white/20 rounded-full px-2 py-0.5 inline-block">
                          {tResult.passed ? "✓ Passed" : "✗ Failed"}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ IN PROGRESS STATE ═══════════════════ */}
        {status === "in-progress" && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Main Question Area */}
            <div className="flex-1 rounded-[1.25rem] bg-white p-6 shadow-soft">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b-2 border-brand-ink/10 pb-4 mb-6">
                <div>
                  <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", cfg.textColor)}>
                    {cfg.label} — {topic.title}
                  </p>
                  <h2 className="font-display text-2xl font-black text-brand-ink">
                    Question {currentIndex + 1} of {questions.length}
                  </h2>
                </div>
                <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 font-display text-xl font-black tracking-wide", timerColor)}>
                  <Clock size={20} className="stroke-[3]" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {questions[currentIndex] && (
                <div>
                  <p className="text-xl font-medium leading-relaxed text-brand-ink">
                    {questions[currentIndex].text}
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {questions[currentIndex].options.map((opt) => {
                      const isSelected = answers[questions[currentIndex].id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionSelect(opt.id)}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:bg-[#f9f6e6]",
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10"
                              : "border-brand-ink/15 bg-white"
                          )}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 font-bold text-brand-ink">
                            {opt.id}
                          </span>
                          <span className="font-medium text-brand-ink">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nav controls */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t-2 border-brand-ink/10">
                <button
                  onClick={toggleReview}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 font-bold transition-colors",
                    markedForReview[questions[currentIndex]?.id]
                      ? "bg-brand-yellow text-brand-ink"
                      : "bg-brand-ink/5 text-brand-ink/60 hover:bg-brand-ink/10"
                  )}
                >
                  <Flag size={18} className={markedForReview[questions[currentIndex]?.id] ? "fill-current" : ""} />
                  {markedForReview[questions[currentIndex]?.id] ? "Marked" : "Flag"}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 rounded-xl bg-brand-ink/5 px-5 py-3 font-bold text-brand-ink disabled:opacity-50"
                  >
                    <ArrowLeft size={18} /> Prev
                  </button>
                  {currentIndex === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3 font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <CheckCircle2 size={20} /> Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
                      className="flex items-center gap-1 rounded-xl bg-brand-blue px-6 py-3 font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      Next <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Number Board Sidebar */}
            <div className="w-full lg:w-72 shrink-0 rounded-[1.25rem] bg-[#fff8df] p-5 shadow-inner">
              <h3 className="font-display text-lg font-black uppercase text-brand-ink/70">Navigator</h3>
              <div className="mt-4 grid grid-cols-5 gap-2 md:grid-cols-10 lg:grid-cols-5">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isMarked = markedForReview[q.id];
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all",
                        isActive ? "border-brand-ink scale-110 shadow-[2px_2px_0_rgba(45,45,45,1)] z-10" : "border-transparent",
                        isAnswered && !isMarked
                          ? "bg-brand-blue text-white"
                          : isMarked
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-white text-brand-ink hover:bg-brand-ink/5"
                      )}
                    >
                      {idx + 1}
                      {isMarked && <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-brand-pink" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col gap-2 text-xs font-medium text-brand-ink/80">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-brand-blue" /> Answered</div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-white border border-brand-ink/20" /> Unanswered</div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-brand-yellow" /> Flagged</div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-ink/10">
                <p className="text-xs font-bold text-brand-ink/50">
                  {Object.keys(answers).length}/{questions.length} answered
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ SUBMITTED STATE ═══════════════════ */}
        {status === "submitted" && (
          <div className="flex flex-col gap-6 mx-auto max-w-4xl">
            {/* All tiers passed celebration */}
            {allTiersPassed && isPassed && (
              <div className="rounded-[1.45rem] bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink p-6 text-center text-white shadow-soft">
                <Trophy size={40} className="mx-auto mb-2" />
                <h2 className="font-display text-3xl font-black">🏆 All Tiers Conquered!</h2>
                <p className="mt-2 font-medium opacity-90">
                  You've passed all 3 tiers of the {topic.title} Final Exam. Outstanding work!
                </p>
              </div>
            )}

            {/* Score Header */}
            <div className={cn(
              "flex flex-col items-center justify-center rounded-[1.45rem] p-8 text-center text-white shadow-soft relative overflow-hidden",
              isPassed ? "bg-brand-teal" : "bg-brand-pink"
            )}>
              {isPassed && <Trophy size={48} className="absolute top-4 right-6 text-white/20" strokeWidth={2} />}
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">{cfg.label}</p>
              <h2 className="font-display text-2xl font-black uppercase tracking-wide opacity-90">
                {isPassed ? "Exam Passed! 🎉" : "Needs More Practice"}
              </h2>
              <div className="mt-4 font-display text-[5rem] font-black leading-none drop-shadow-md">
                {percentage}%
              </div>
              <p className="mt-2 text-lg font-bold opacity-90">
                {correctCount} out of {questions.length} correct
              </p>
              <p className="mt-1 text-sm font-medium opacity-80">
                Passing: {tier.passingScore}% • Time: {formatTime(timeUsed)} / {formatTime(tier.durationMinutes * 60)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStart}
                className="flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] hover:-translate-y-0.5 transition-transform"
              >
                <RotateCcw size={18} /> Retake This Tier
              </button>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId }}
                className="flex items-center gap-2 rounded-2xl border-2 border-brand-ink px-6 py-3 font-bold text-brand-ink hover:bg-brand-ink/5 transition-colors"
              >
                Back to Lesson
              </Link>
            </div>

            {/* Try other tiers */}
            <div className="rounded-2xl bg-[#fff5cc] p-5 shadow-soft">
              <h3 className="font-display font-black text-lg text-brand-ink mb-3">Try Another Tier</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {finalExam.tiers.map(t => {
                  const tCfg = tierConfig[t.tier];
                  const tResult = finalExamResults[t.id];
                  const isCurrent = t.id === tier.id;
                  return (
                    <Link
                      key={t.id}
                      to="/lessons/$lessonId/final-exam/$levelId"
                      params={{ lessonId, levelId: t.id }}
                      className={cn(
                        "rounded-xl p-4 text-center font-bold text-white transition-transform hover:-translate-y-0.5 shadow-sm",
                        isCurrent ? "ring-2 ring-brand-ink ring-offset-2" : "",
                        tCfg.color
                      )}
                    >
                      <p className="font-display font-black">{tCfg.label.split("—")[0]}</p>
                      <p className="text-sm opacity-80">{t.durationMinutes} min • {t.itemCount} items</p>
                      {tResult && (
                        <p className="mt-1 text-xs bg-white/20 rounded-full px-2 py-0.5 inline-block">
                          {tResult.passed ? "✓ Passed" : "✗ Failed"}
                        </p>
                      )}
                      {isCurrent && <p className="mt-1 text-[10px] uppercase tracking-wider opacity-70">Current</p>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Detailed Review */}
            <div className="border-t-2 border-brand-ink/10 pt-6">
              <h3 className="font-display text-2xl font-black text-brand-ink mb-6">Detailed Review</h3>
              <div className="flex flex-col gap-5">
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctOptionId;
                  const isOmitted = !userAnswer;

                  return (
                    <div key={q.id} className="rounded-[1.25rem] bg-white p-5 shadow-sm border-2 border-brand-ink/5">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold text-white",
                          isCorrect ? "border-brand-teal bg-brand-teal" : isOmitted ? "border-brand-ink/20 bg-brand-ink/20" : "border-brand-pink bg-brand-pink"
                        )}>
                          {isCorrect ? <Check size={16} strokeWidth={3} /> : isOmitted ? "-" : <X size={16} strokeWidth={3} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-brand-ink">
                            <span className="text-brand-ink/50 mr-1">Q{idx + 1}.</span> {q.text}
                          </h4>

                          <div className="mt-3 flex flex-col gap-1.5">
                            {q.options.map(opt => {
                              const isThisUser = opt.id === userAnswer;
                              const isThisCorrect = opt.id === q.correctOptionId;

                              let cls = "border-brand-ink/8 bg-brand-ink/3 text-brand-ink";
                              if (isThisCorrect) cls = "border-brand-teal bg-brand-teal/15 text-brand-teal font-bold";
                              else if (isThisUser && !isCorrect) cls = "border-brand-pink bg-brand-pink/15 text-brand-pink font-bold";

                              return (
                                <div key={opt.id} className={cn("flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm", cls)}>
                                  <span className="flex h-6 w-6 items-center justify-center rounded bg-white/50 text-xs font-bold">{opt.id}</span>
                                  <span className="flex-1">{opt.text}</span>
                                  {isThisCorrect && <Check size={14} />}
                                  {isThisUser && !isCorrect && <X size={14} />}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 rounded-lg bg-[#fff8df] p-3 text-xs font-medium text-brand-ink/75 border border-[#f7eab0]">
                            <span className="font-bold uppercase text-brand-ink">Explanation:</span> {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
