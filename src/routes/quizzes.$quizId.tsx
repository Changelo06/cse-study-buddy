import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { quizzes, PracticeQuiz } from "./quizzes.index";
import { generateMockQuestions, QuizQuestion } from "@/data/mockQuestions";
import { Clock, Flag, Check, X, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quizzes/$quizId")({
  component: QuizTakingPage,
});

type QuizStatus = "idle" | "in-progress" | "submitted";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseDurationToSeconds(duration: string) {
  // Simple parser: "10 mins" -> 600, "1 hour" -> 3600, "30 mins" -> 1800
  if (duration.includes("hour")) {
    const hours = parseInt(duration) || 1;
    return hours * 3600;
  }
  const mins = parseInt(duration) || 10;
  return mins * 60;
}

function QuizTakingPage() {
  const { quizId } = Route.useParams();
  const quiz = quizzes.find((item) => item.id === quizId);

  const [status, setStatus] = useState<QuizStatus>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer effect
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

  if (!quiz) {
    return <div className="container-page py-12 font-bold text-brand-ink">Quiz not found.</div>;
  }

  const handleStart = () => {
    const generated = generateMockQuestions(quiz.id, quiz.itemCount);
    setQuestions(generated);
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setTimeLeft(parseDurationToSeconds(quiz.duration));
    setStatus("in-progress");
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit? You won't be able to change your answers.")) {
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

  return (
    <main className="container-page pb-10 pt-3 md:pb-14">
      <section className="mx-auto max-w-[68rem] rounded-[1.45rem] bg-white/86 p-5 shadow-sticker md:p-7">
        
        {/* IDLE STATE */}
        {status === "idle" && (
          <div className="mx-auto max-w-4xl">
            <Link to="/quizzes" className="text-sm font-bold text-brand-ink/58 hover:text-brand-ink">
              &lt; Back to Quizzes
            </Link>

            <div className="mt-6 rounded-[1.45rem] p-6 text-white shadow-soft" style={{ backgroundColor: quiz.color }}>
              <p className="text-sm font-bold uppercase tracking-wide text-white/75">Practice Quiz</p>
              <h1 className="mt-2 font-display text-4xl font-black leading-none md:text-5xl">{quiz.title}</h1>
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
                This is a practice quiz. You will have {quiz.duration} to complete {quiz.itemCount} items.
                The timer will start as soon as you click the button below. Good luck!
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="mt-5 rounded-2xl bg-brand-blue px-7 py-4 text-lg font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              >
                Start Quiz
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
                <h2 className="font-display text-2xl font-black text-brand-ink">Question {currentIndex + 1} of {questions.length}</h2>
                <div className="flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-2 text-brand-pink">
                  <Clock size={20} className="stroke-[3]" />
                  <span className="font-display text-xl font-black tracking-wide">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {questions[currentIndex] && (
                <div className="mt-6">
                  <p className="text-xl font-medium leading-relaxed text-brand-ink">
                    {questions[currentIndex].text}
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {questions[currentIndex].options.map((opt) => {
                      const isSelected = answers[questions[currentIndex].id] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all hover:bg-[#f9f6e6]",
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10"
                              : "border-brand-ink/15 bg-white"
                          )}
                        >
                          <input
                            type="radio"
                            name={`question-${questions[currentIndex].id}`}
                            value={opt.id}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(opt.id)}
                            className="h-5 w-5 accent-brand-purple"
                          />
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 font-bold text-brand-ink">
                            {opt.id}
                          </span>
                          <span className="font-medium text-brand-ink">{opt.text}</span>
                        </label>
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
                  {markedForReview[questions[currentIndex]?.id] ? "Marked for Review" : "Mark for Review"}
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
                      <CheckCircle2 size={20} /> Submit Quiz
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
                        isActive
                          ? "border-brand-ink scale-110 shadow-[2px_2px_0_rgba(45,45,45,1)] z-10"
                          : "border-transparent",
                        isAnswered && !isMarked
                          ? "bg-brand-blue text-white"
                          : isMarked
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-white text-brand-ink hover:bg-brand-ink/5"
                      )}
                    >
                      {idx + 1}
                      {/* Little flag indicator if marked but also answered, etc. */}
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

        {/* SUBMITTED (RESULT) STATE */}
        {status === "submitted" && (
          <QuizResultView quiz={quiz} questions={questions} answers={answers} />
        )}

      </section>
    </main>
  );
}

function QuizResultView({ quiz, questions, answers }: { quiz: PracticeQuiz; questions: QuizQuestion[]; answers: Record<string, string> }) {
  const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0), 0);
  const percentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = correctCount >= quiz.passingScore;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Score Header */}
      <div className={cn(
        "flex flex-col items-center justify-center rounded-[1.45rem] p-8 text-center text-white shadow-soft",
        isPassed ? "bg-brand-teal" : "bg-brand-pink"
      )}>
        <h2 className="font-display text-2xl font-black uppercase tracking-wide opacity-90">
          {isPassed ? "Great Job!" : "Needs More Practice"}
        </h2>
        <div className="mt-4 font-display text-[5rem] font-black leading-none drop-shadow-md">
          {percentage}%
        </div>
        <p className="mt-2 text-lg font-bold opacity-90">
          You scored {correctCount} out of {questions.length}
        </p>
        <p className="mt-1 text-sm font-medium opacity-80">
          Passing score is {quiz.passingScore}
        </p>
      </div>

      <div className="flex items-center justify-between border-b-2 border-brand-ink/10 pb-4 pt-4">
        <h3 className="font-display text-2xl font-black text-brand-ink">Detailed Review</h3>
        <button onClick={() => window.location.reload()} className="rounded-xl border-2 border-brand-ink px-5 py-2 font-bold text-brand-ink hover:bg-brand-ink/5">
          Retake Quiz
        </button>
      </div>

      {/* Question Breakdown */}
      <div className="flex flex-col gap-6">
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctOptionId;
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
                  <h4 className="text-lg font-bold text-brand-ink"><span className="text-brand-ink/50 mr-2">Q{idx + 1}.</span>{q.text}</h4>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map(opt => {
                      const isThisUserAnswer = opt.id === userAnswer;
                      const isThisCorrectAnswer = opt.id === q.correctOptionId;

                      let optionClass = "border-brand-ink/10 bg-brand-ink/5 text-brand-ink";
                      if (isThisCorrectAnswer) {
                        optionClass = "border-brand-teal bg-brand-teal/15 text-brand-teal font-bold";
                      } else if (isThisUserAnswer && !isCorrect) {
                        optionClass = "border-brand-pink bg-brand-pink/15 text-brand-pink font-bold";
                      }

                      return (
                        <div key={opt.id} className={cn("flex items-center gap-3 rounded-lg border-2 p-3", optionClass)}>
                          <span className="flex h-7 w-7 items-center justify-center rounded bg-white/50 font-bold">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
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
  );
}
