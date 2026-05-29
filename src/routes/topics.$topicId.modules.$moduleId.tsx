import { createFileRoute, Link } from "@tanstack/react-router";
import { getModuleById, getTopicById } from "@/data/mockData";

export const Route = createFileRoute("/topics/$topicId/modules/$moduleId")({
  component: ModuleViewPage,
});

type ModuleStatus = "not-started" | "viewing-pdf" | "quiz-available" | "completed" | "needs-review" | "missing-pdf";

type QuizAttempt = {
  score: number;
  totalItems: number;
  attemptedAt: string;
};

type PDFModule = {
  id: string;
  subject: string;
  moduleNumber: number;
  title: string;
  description: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
  pdfPageCount?: number;
  quizItemCount: 10 | 15;
  passingRate: 0.8;
  attempts: number;
  lastAttempt: QuizAttempt | null;
  status: ModuleStatus;
};

function ModuleViewPage() {
  const { topicId, moduleId } = Route.useParams();
  const topic = getTopicById(topicId);
  const module = getModuleById(topicId, moduleId);

  if (!topic || !module) {
    return <div className="container-page py-12 font-bold text-brand-ink">Module not found.</div>;
  }

  const moduleData: PDFModule = {
    id: module.id,
    subject: topic.title,
    moduleNumber: moduleId.includes("2") ? 2 : 1,
    title: moduleId === "mod-eng-1" ? "Grammar and Language" : module.title,
    description:
      moduleId === "mod-eng-1"
        ? "Covers parts of speech, sentence correction, and basic grammar rules."
        : "Read the uploaded lesson file, then pass the module quiz to complete this lesson.",
    pdfUrl: null,
    pdfFileName: null,
    quizItemCount: 10,
    passingRate: 0.8,
    attempts: 0,
    lastAttempt: null,
    status: "missing-pdf",
  };

  const hasPassed = moduleData.lastAttempt
    ? moduleData.lastAttempt.score / moduleData.lastAttempt.totalItems >= moduleData.passingRate
    : false;
  const moduleStatus = getModuleStatus(moduleData, hasPassed);

  return (
    <main className="container-page pb-10 pt-3 md:pb-14">
      <ModuleHeader module={moduleData} topicId={topicId} />

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-5">
          <PDFModuleViewer module={moduleData} />
          <ModuleQuizGate module={moduleData} topicId={topicId} moduleId={moduleId} />
          {moduleData.lastAttempt && (
            <QuizResultCard
              attempt={moduleData.lastAttempt}
              moduleId={moduleId}
              passed={hasPassed}
              topicId={topicId}
            />
          )}
        </div>

        <ModuleStatusSidebar module={moduleData} moduleStatus={moduleStatus} quizPassed={hasPassed} />
      </section>
    </main>
  );
}

function ModuleHeader({ module, topicId }: { module: PDFModule; topicId: string }) {
  return (
    <header className="rounded-[1.45rem] bg-white/82 p-5 shadow-sticker md:p-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-brand-ink/55">
        <Link to="/topics" className="hover:text-brand-ink">
          Lessons
        </Link>
        <span>&gt;</span>
        <Link to="/topics/$topicId" params={{ topicId }} className="hover:text-brand-ink">
          {module.subject}
        </Link>
        <span>&gt;</span>
        <span className="text-brand-ink">Module {module.moduleNumber}</span>
      </nav>

      <div className="mt-4 max-w-4xl">
        <h1 className="font-display text-4xl font-black leading-none text-brand-ink md:text-5xl">
          Module {module.moduleNumber}: {module.title}
        </h1>
        <p className="mt-3 text-base font-medium leading-7 text-brand-ink/68 md:text-lg">{module.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <MetaPill>{module.subject}</MetaPill>
        <MetaPill>PDF lesson</MetaPill>
        <MetaPill>{module.quizItemCount}-item quiz</MetaPill>
        <MetaPill>Passing score: {Math.round(module.passingRate * 100)}%</MetaPill>
      </div>
    </header>
  );
}

function PDFModuleViewer({ module }: { module: PDFModule }) {
  const isMissing = !module.pdfUrl;

  return (
    <section id="lesson-pdf" className="overflow-hidden rounded-[1.45rem] bg-white shadow-sticker">
      <div className="flex flex-col gap-3 border-b border-brand-ink/10 bg-[#fff8df] p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-ink/55">Lesson PDF</p>
          <h2 className="text-2xl font-bold text-brand-ink">
            {module.pdfFileName ?? "No lesson file uploaded"}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <PDFAction disabled={isMissing}>View PDF</PDFAction>
          {module.pdfUrl ? (
            <a
              href={module.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_rgba(45,45,45,0.12)]"
            >
              Open in new tab
            </a>
          ) : (
            <PDFAction disabled>Open in new tab</PDFAction>
          )}
          <PDFAction disabled={isMissing}>Download PDF</PDFAction>
          <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/65">
            {module.pdfPageCount ? `${module.pdfPageCount} pages` : "Page count pending"}
          </span>
        </div>
      </div>

      {module.pdfUrl ? (
        <div className="h-[72vh] min-h-[620px] bg-[#f7efd3]">
          <object data={module.pdfUrl} type="application/pdf" className="h-full w-full">
            <PDFErrorState pdfUrl={module.pdfUrl} />
          </object>
        </div>
      ) : (
        <MissingPDFPlaceholder />
      )}
    </section>
  );
}

function MissingPDFPlaceholder() {
  return (
    <div className="grid min-h-[560px] place-items-center bg-[#fffdf3] p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-28 w-24 place-items-center rounded-2xl bg-brand-cream shadow-[5px_6px_0_rgba(45,45,45,0.08)]">
          <div className="rounded-lg border-4 border-brand-pink px-3 py-5 text-2xl font-black text-brand-pink">
            PDF
          </div>
        </div>
        <h2 className="mt-6 font-display text-4xl font-black leading-none text-brand-ink">
          Waiting for admin PDF upload
        </h2>
        <p className="mt-3 text-lg font-bold text-brand-ink">No PDF module has been uploaded for this lesson yet.</p>
        <p className="mt-2 text-sm font-medium leading-6 text-brand-ink/60">
          This module will become available once an admin uploads the lesson file.
        </p>
      </div>
    </div>
  );
}

function ModuleStatusSidebar({
  module,
  moduleStatus,
  quizPassed,
}: {
  module: PDFModule;
  moduleStatus: string;
  quizPassed: boolean;
}) {
  const pdfStatus = module.pdfUrl ? "Uploaded" : "Missing";
  const quizStatus = module.lastAttempt ? (quizPassed ? "Passed" : "Failed") : "Not Taken";

  return (
    <aside className="rounded-[1.45rem] bg-[#fff8df] p-5 shadow-sticker lg:sticky lg:top-28">
      <h2 className="font-display text-3xl font-black text-brand-ink">Module Details</h2>

      <dl className="mt-5 space-y-3">
        <DetailRow label="Subject" value={module.subject} />
        <DetailRow label="Module number" value={`Module ${module.moduleNumber}`} />
        <DetailRow label="PDF status" value={pdfStatus} tone={module.pdfUrl ? "ok" : "warn"} />
        <DetailRow label="Quiz status" value={quizStatus} tone={quizPassed ? "ok" : module.lastAttempt ? "warn" : undefined} />
        <DetailRow label="Module status" value={moduleStatus} tone={quizPassed ? "ok" : module.pdfUrl ? undefined : "warn"} />
        <DetailRow label="Passing score" value={`${Math.round(module.passingRate * 100)}%`} />
        <DetailRow label="Attempts" value={`${module.attempts}`} />
        <DetailRow
          label="Last attempt"
          value={module.lastAttempt ? `${module.lastAttempt.score}/${module.lastAttempt.totalItems}` : "None yet"}
        />
      </dl>

      <div className="mt-6 rounded-[1.15rem] bg-white p-4">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-ink/55">Completion rule</p>
        <p className="mt-2 text-sm font-medium leading-6 text-brand-ink/68">
          Opening the PDF does not complete the module. Completion happens only after passing the module quiz.
        </p>
      </div>
    </aside>
  );
}

function ModuleQuizGate({
  module,
  topicId,
  moduleId,
}: {
  module: PDFModule;
  topicId: string;
  moduleId: string;
}) {
  const quizAvailable = Boolean(module.pdfUrl);
  const requiredScore = Math.ceil(module.quizItemCount * module.passingRate);

  return (
    <section className="rounded-[1.45rem] bg-[#fff8df] p-5 shadow-sticker md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-ink">Ready for the Module Quiz?</h2>
          <p className="mt-2 text-base font-medium leading-7 text-brand-ink/68">
            Answer 10-15 questions to complete this module. You need at least 80% to pass.
          </p>
          <p className="mt-1 text-sm font-bold text-brand-ink/55">
            For this module: pass at {requiredScore}/{module.quizItemCount} or higher.
          </p>
          {!quizAvailable && (
            <p className="mt-3 rounded-2xl bg-brand-pink/12 px-4 py-3 text-sm font-bold text-brand-pink">
              Quiz is unavailable until an admin uploads the PDF lesson file.
            </p>
          )}
        </div>

        {quizAvailable ? (
          <Link
            to="/topics/$topicId/modules/$moduleId/exam"
            params={{ topicId, moduleId }}
            className="rounded-2xl bg-brand-blue px-7 py-4 text-center text-lg font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.12)]"
          >
            Start Quiz
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="rounded-2xl bg-brand-ink/25 px-7 py-4 text-lg font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.08)]"
          >
            Start Quiz
          </button>
        )}
      </div>
    </section>
  );
}

function QuizResultCard({
  attempt,
  moduleId,
  passed,
  topicId,
}: {
  attempt: QuizAttempt;
  moduleId: string;
  passed: boolean;
  topicId: string;
}) {
  return (
    <section className={`rounded-[1.45rem] p-5 shadow-sticker md:p-6 ${passed ? "bg-brand-teal/25" : "bg-brand-pink/14"}`}>
      <h2 className="text-3xl font-bold text-brand-ink">{passed ? "Passed" : "Not Passed"}</h2>
      <p className="mt-2 text-lg font-bold text-brand-ink">
        Score: {attempt.score}/{attempt.totalItems}
      </p>

      {passed ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link to="/topics/$topicId/modules/$moduleId/exam" params={{ topicId, moduleId }} className="rounded-xl bg-brand-blue px-5 py-3 text-center font-bold text-white">
            Review Answers
          </Link>
          <Link to="/topics/$topicId" params={{ topicId }} className="rounded-xl bg-brand-teal px-5 py-3 text-center font-bold text-white">
            Go to Next Module
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-base font-medium text-brand-ink/68">
            This module is still marked as undone. Review the PDF lesson and try again.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a href="#lesson-pdf" className="rounded-xl bg-brand-yellow px-5 py-3 text-center font-bold text-brand-ink">
              Review PDF
            </a>
            <Link to="/topics/$topicId/modules/$moduleId/exam" params={{ topicId, moduleId }} className="rounded-xl bg-brand-pink px-5 py-3 text-center font-bold text-white">
              Retake Quiz
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function PDFAction({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-ink/70 shadow-[2px_2px_0_rgba(45,45,45,0.08)] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  );
}

function PDFErrorState({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-brand-ink">PDF could not be loaded.</h2>
        <a href={pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-xl bg-brand-blue px-5 py-3 font-bold text-white">
          Open PDF in new tab
        </a>
      </div>
    </div>
  );
}

function DetailRow({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
      <dt className="text-sm font-bold text-brand-ink/55">{label}</dt>
      <dd
        className={`text-right text-sm font-bold ${
          tone === "ok" ? "text-brand-teal" : tone === "warn" ? "text-brand-pink" : "text-brand-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-brand-ink/70">{children}</span>;
}

function getModuleStatus(module: PDFModule, hasPassed: boolean) {
  if (!module.pdfUrl) return "Missing PDF";
  if (hasPassed) return "Completed";
  if (module.lastAttempt) return "Needs Review";
  return "Quiz Available";
}
