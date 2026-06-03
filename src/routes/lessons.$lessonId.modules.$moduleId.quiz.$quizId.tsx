import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getModuleById } from "@/data/mockData";
import { useState } from "react";

export const Route = createFileRoute("/lessons/$lessonId/modules/$moduleId/quiz/$quizId")({
  component: QuizPage,
});

function QuizPage() {
  const { lessonId, moduleId, quizId } = Route.useParams();
  const router = useRouter();
  const module = getModuleById(lessonId, moduleId);
  const quiz = module?.assessment.questions.find((q: any) => q.id === quizId);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!quiz) {
    return <div className="container-page py-12">Quiz not found.</div>;
  }

  const isCorrect = selectedOption === quiz.correctAnswer;

  return (
    <div className="container-page py-12 max-w-3xl">
      <button 
        onClick={() => router.history.back()}
        className="text-brand-ink/60 hover:text-brand-ink mb-8 inline-block font-display font-bold"
      >
        &larr; Back to Lecture
      </button>

      <div className="bg-white rounded-[2.5rem] p-12 shadow-soft border-4 border-brand-teal relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-brand-teal text-brand-ink px-6 py-2 font-display font-bold rounded-bl-3xl">
          Inline Quiz
        </div>

        <h2 className="font-display font-black text-3xl text-brand-ink mb-8 mt-4 leading-tight">
          {quiz.text}
        </h2>

        <div className="space-y-4 mb-8">
          {quiz.options.map((option: string) => (
            <button
              key={option}
              disabled={showResult}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-display font-bold text-lg border-2 transition-all ${
                showResult
                  ? option === quiz.correctAnswer
                    ? "bg-brand-teal/20 border-brand-teal text-brand-ink"
                    : option === selectedOption
                    ? "bg-brand-pink/20 border-brand-pink text-brand-ink"
                    : "border-brand-ink/10 text-brand-ink/40"
                  : selectedOption === option
                  ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                  : "border-brand-ink/10 text-brand-ink hover:border-brand-ink/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            disabled={!selectedOption}
            onClick={() => setShowResult(true)}
            className="w-full bg-brand-ink text-white rounded-full py-4 font-display font-black text-xl hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            Check Answer
          </button>
        ) : (
          <div className={`rounded-3xl p-6 ${isCorrect ? "bg-brand-teal/20" : "bg-brand-pink/20"}`}>
            <h3 className={`font-display font-black text-2xl mb-2 ${isCorrect ? "text-brand-teal" : "text-brand-pink"}`}>
              {isCorrect ? "Correct! 🎉" : "Not quite! 😢"}
            </h3>
            <p className="text-brand-ink font-bold">{quiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
