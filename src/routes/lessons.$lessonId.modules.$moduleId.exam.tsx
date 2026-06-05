import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getModuleById, getTopicById } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { Clock, Flag, Check, X, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons/$lessonId/modules/$moduleId/exam")({
  component: ModuleExamPage,
});

type ExamStatus = "idle" | "in-progress" | "submitted";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ModuleExamPage() {
  const { lessonId, moduleId } = Route.useParams();
  const router = useRouter();
  const topic = getTopicById(lessonId);
  const module = getModuleById(lessonId, moduleId);
  const { completeModule, saveAssessmentResult } = useAppStore();

  const [status, setStatus] = useState<ExamStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);

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

  if (!topic || !module) {
    return <div className="container-page py-12 font-bold text-brand-ink">Module not found.</div>;
  }

  const exam = module.assessment;
  const questions = exam.questions;

  const handleStart = () => {
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setTimeLeft(exam.durationMinutes * 60);
    setStartTime(Date.now());
    setStatus("in-progress");
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit? You won't be able to change your answers.")) {
      setStatus("submitted");
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  const toggleReview = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setMarkedForReview((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  // Calculate result on submit
  const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0);
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = percentage >= exam.passingScore;
  const timeUsed = Math.round((Date.now() - startTime) / 1000);

  // Save result and complete module when submitted
  useEffect(() => {
    if (status !== "submitted") return;
    const result = {
      score: correctCount,
      total: questions.length,
      passed: isPassed,
      timeSpentSeconds: timeUsed,
      completedAt: new Date().toISOString(),
    };
    saveAssessmentResult(exam.id, result);
    if (isPassed) {
      completeModule(moduleId);
    }
  }, [status]);

  // Timer urgency color
  const timerColor =
    timeLeft <= 120 ? "text-red-500 bg-red-50" :
    timeLeft <= 300 ? "text-brand-orange bg-orange-50" :
    "text-brand-pink bg-brand-pink/10";

  return (
    <main className="container-page pb-10 pt-3 md:pb-14">
      <section className="mx-auto max-w-[68rem] rounded-[1.45rem] bg-white/86 p-5 shadow-sticker md:p-7">

        {/* IDLE STATE — Landing */}
        {status === "idle" && (
          <div className="mx-auto max-w-2xl">
            <Link
              to="/lessons/$lessonId/modules/$moduleId"
              params={{ lessonId, moduleId }}
              className="text-sm font-bold text-brand-ink/58 hover:text-brand-ink"
            >
              &lt; Back to Lesson
            </Link>

            <div className="mt-6 rounded-[2rem] bg-brand-blue p-8 md:p-12 text-white text-center shadow-soft relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

              <div className="inline-flex bg-white/20 px-6 py-2 rounded-full font-display font-bold uppercase tracking-widest text-sm mb-6 relative z-10">
                Module Assessment
              </div>

              <h1 className="font-display font-black text-4xl md:text-5xl mb-4 leading-tight relative z-10">
                {exam.title}
              </h1>
              <p className="text-white/80 font-medium mb-8 relative z-10">
                {topic.title} — {module.title}
              </p>

              <div className="flex justify-center gap-6 mb-10 relative z-10">
                <StatBox value={`${exam.durationMinutes}`} label="Minutes" />
                <StatBox value={`${questions.length}`} label="Items" />
                <StatBox value={`${exam.passingScore}%`} label="To Pass" />
              </div>

              <button
                onClick={handleStart}
                className="w-full max-w-sm mx-auto bg-brand-yellow text-brand-ink rounded-full py-5 font-display font-black text-2xl hover:scale-[1.02] active:scale-100 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-brand-ink relative z-10"
              >
                Start Assessment
              </button>
            </div>
          </div>
        )}

        {/* IN PROGRESS STATE */}
        {status === "in-progress" && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Main Question Area */}
            <div className="flex-1 rounded-[1.25rem] bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between border-b-2 border-brand-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-brand-ink">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
                <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 font-display text-xl font-black tracking-wide", timerColor)}>
                  <Clock size={20} className="stroke-[3]" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {questions[currentIndex] && (
                <div className="mt-6">
                  <p className="text-xl font-medium leading-relaxed text-brand-ink">
                    {questions[currentIndex].text}
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {questions[currentIndex].options.map((option, optIdx) => {
                      const isSelected = answers[questions[currentIndex].id] === option;
                      const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D, E
                      return (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:bg-[#f9f6e6]",
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10"
                              : "border-brand-ink/15 bg-white"
                          )}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 font-bold text-brand-ink">
                            {optionLabel}
                          </span>
                          <span className="font-medium text-brand-ink">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
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
                  {markedForReview[questions[currentIndex]?.id] ? "Marked" : "Mark for Review"}
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
                      <CheckCircle2 size={20} /> Submit
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
              <h3 className="font-display text-lg font-black uppercase text-brand-ink/70">Question Navigator</h3>
              <div className="mt-4 grid grid-cols-5 gap-2 md:grid-cols-8 lg:grid-cols-5">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isMarked = markedForReview[q.id];
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-lg border-2 font-bold transition-all",
                        isActive ? "border-brand-ink scale-110 shadow-[2px_2px_0_rgba(45,45,45,1)] z-10" : "border-transparent",
                        isAnswered && !isMarked
                          ? "bg-brand-blue text-white"
                          : isMarked
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-white text-brand-ink hover:bg-brand-ink/5"
                      )}
                    >
                      {idx + 1}
                      {isMarked && (
                        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-white bg-brand-pink" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-brand-ink/80">
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-brand-blue" /> Answered</div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-white border border-brand-ink/20" /> Unanswered</div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-brand-yellow" /> Marked for Review</div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMITTED / RESULTS STATE */}
        {status === "submitted" && (
          <div className="flex flex-col gap-6 mx-auto max-w-4xl">
            {/* Score Header */}
            <div className={cn(
              "flex flex-col items-center justify-center rounded-[1.45rem] p-8 text-center text-white shadow-soft relative overflow-hidden",
              isPassed ? "bg-brand-teal" : "bg-brand-pink"
            )}>
              {isPassed && (
                <Trophy size={48} className="absolute top-4 right-6 text-white/20" strokeWidth={2} />
              )}
              <h2 className="font-display text-2xl font-black uppercase tracking-wide opacity-90">
                {isPassed ? "Assessment Passed! 🎉" : "Not Quite There Yet"}
              </h2>
              <div className="mt-4 font-display text-[5rem] font-black leading-none drop-shadow-md">
                {percentage}%
              </div>
              <p className="mt-2 text-lg font-bold opacity-90">
                You scored {correctCount} out of {questions.length}
              </p>
              <p className="mt-1 text-sm font-medium opacity-80">
                Passing score: {exam.passingScore}% • Time used: {formatTime(timeUsed)}
              </p>
              {isPassed && (
                <p className="mt-3 bg-white/20 rounded-full px-4 py-1.5 text-sm font-bold">
                  ✓ Module completed — next module unlocked!
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isPassed && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] hover:-translate-y-0.5 transition-transform"
                >
                  <RotateCcw size={18} /> Retake Assessment
                </button>
              )}
              <Link
                to="/lessons/$lessonId/modules/$moduleId"
                params={{ lessonId, moduleId }}
                className="flex items-center gap-2 rounded-2xl border-2 border-brand-ink px-6 py-3 font-bold text-brand-ink hover:bg-brand-ink/5 transition-colors"
              >
                Review Lesson
              </Link>
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId }}
                className="flex items-center gap-2 rounded-2xl bg-brand-ink px-6 py-3 font-bold text-white shadow-[3px_3px_0_rgba(45,45,45,0.12)] hover:-translate-y-0.5 transition-transform"
              >
                Back to Modules <ArrowRight size={18} />
              </Link>
            </div>

            {/* Detailed review */}
            <div className="border-t-2 border-brand-ink/10 pt-6">
              <h3 className="font-display text-2xl font-black text-brand-ink mb-6">Detailed Review</h3>
              <div className="flex flex-col gap-5">
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  const isOmitted = !userAnswer;

                  return (
                    <div key={q.id} className="rounded-[1.25rem] bg-white p-6 shadow-sm border-2 border-brand-ink/5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-white",
                          isCorrect ? "border-brand-teal bg-brand-teal" : isOmitted ? "border-brand-ink/20 bg-brand-ink/20" : "border-brand-pink bg-brand-pink"
                        )}>
                          {isCorrect ? <Check size={20} strokeWidth={3} /> : isOmitted ? "-" : <X size={20} strokeWidth={3} />}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-brand-ink">
                            <span className="text-brand-ink/50 mr-2">Q{idx + 1}.</span>{q.text}
                          </h4>

                          <div className="mt-4 flex flex-col gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isThisUserAnswer = opt === userAnswer;
                              const isThisCorrectAnswer = opt === q.correctAnswer;
                              const optionLabel = String.fromCharCode(65 + optIdx);

                              let optionClass = "border-brand-ink/10 bg-brand-ink/5 text-brand-ink";
                              if (isThisCorrectAnswer) {
                                optionClass = "border-brand-teal bg-brand-teal/15 text-brand-teal font-bold";
                              } else if (isThisUserAnswer && !isCorrect) {
                                optionClass = "border-brand-pink bg-brand-pink/15 text-brand-pink font-bold";
                              }

                              return (
                                <div key={opt} className={cn("flex items-center gap-3 rounded-lg border-2 p-3", optionClass)}>
                                  <span className="flex h-7 w-7 items-center justify-center rounded bg-white/50 font-bold">
                                    {optionLabel}
                                  </span>
                                  <span>{opt}</span>
                                  {isThisCorrectAnswer && <Check size={18} className="ml-auto" />}
                                  {isThisUserAnswer && !isCorrect && <X size={18} className="ml-auto" />}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-5 rounded-xl bg-[#fff8df] p-4 text-sm font-medium text-brand-ink/80 border border-[#f7eab0]">
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

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-brand-ink/20 rounded-2xl p-5 min-w-[100px]">
      <span className="block text-3xl font-display font-black">{value}</span>
      <span className="text-xs uppercase tracking-widest font-bold opacity-80 mt-1 block">{label}</span>
    </div>
  );
}
