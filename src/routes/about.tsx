import { createFileRoute } from "@tanstack/react-router";
import { PageDoodles } from "@/components/Doodles";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="container-page relative pb-10 pt-6 md:pb-14">
      <PageDoodles variant="dashboard" />
      <section className="relative z-10 mx-auto max-w-3xl rounded-[1.65rem] bg-white p-8 shadow-sticker md:p-12">
        <header className="mb-8 border-b-2 border-brand-ink/10 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow shadow-soft">
            <span className="font-display text-3xl font-black text-brand-ink">!</span>
          </div>
          <h1 className="font-display text-4xl font-black leading-tight text-brand-ink md:text-5xl">
            About CSE Ready
          </h1>
          <p className="mt-2 text-lg font-bold text-brand-ink/60 uppercase tracking-wide">
            Important Disclaimer
          </p>
        </header>

        <div className="prose prose-lg prose-brand max-w-none text-brand-ink/80">
          <p className="font-medium">
            <strong>CSE Ready</strong> is an independent review platform created to help individuals prepare for the Philippine Civil Service Examination (CSE). 
          </p>

          <div className="my-8 rounded-[1.25rem] bg-brand-pink/10 border-2 border-brand-pink/20 p-6">
            <h3 className="font-display text-2xl font-black text-brand-pink mb-2">Not Government Affiliated</h3>
            <p className="text-brand-ink font-medium leading-relaxed">
              This platform is <strong>NOT</strong> affiliated, associated, authorized, endorsed by, or in any way officially connected with the <strong>Civil Service Commission (CSC)</strong> of the Philippines or any of its subsidiaries or its affiliates.
            </p>
          </div>

          <h3 className="font-display text-2xl font-black text-brand-ink mt-8 mb-4">Original Practice Content Only</h3>
          <p className="font-medium">
            To uphold the integrity of the actual Civil Service Examination and adhere to ethical standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 font-medium marker:text-brand-blue">
            <li>We <strong>do not</strong> use, distribute, or provide actual past or leaked examination questions from the CSC.</li>
            <li>All questions, modules, and quizzes found on this platform are <strong>original, simulated practice items</strong> designed to test concepts and skills that are generally assessed in civil service and aptitude exams.</li>
            <li>Any resemblance of our practice questions to actual exam questions is purely coincidental.</li>
          </ul>

          <h3 className="font-display text-2xl font-black text-brand-ink mt-8 mb-4">Readiness Score is an Estimate</h3>
          <p className="font-medium">
            The "Readiness Score" provided on your dashboard is a mathematical estimate based purely on your interactions, quiz performance, and completion rates within this app. It is designed to guide your study habits, but it is <strong>not a guarantee</strong> of passing the actual Civil Service Examination.
          </p>
        </div>
      </section>
    </main>
  );
}
