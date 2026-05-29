import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { topics } from "@/data/topics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CSE.review — Free Civil Service Exam Review for Filipinos" },
      {
        name: "description",
        content:
          "Free and structured Civil Service Examination review: study by topic, practice with explanations, and track your readiness — Professional & Subprofessional.",
      },
      { property: "og:title", content: "CSE.review — Free Civil Service Exam Review" },
      {
        property: "og:description",
        content: "Free modules, practice questions, flashcards, and mock exams for Filipino CSE takers.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = topics.slice(0, 6);

  return (
    <div className="min-h-screen bg-background bg-paper-grid">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 bg-mesh opacity-80" aria-hidden />
        <div className="container-page relative grid gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Free · Independent · Filipino-made
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Study smarter for the <span className="text-gold">Civil Service</span> Exam.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Free modules, practice questions, flashcards, and mock exams for Filipino CSE takers — Professional and Subprofessional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/topics"
                className="inline-flex h-12 items-center rounded-md bg-gold px-6 font-medium text-primary shadow-elegant transition hover:brightness-105"
              >
                Start reviewing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#diagnostic"
                className="inline-flex h-12 items-center rounded-md border border-white/20 bg-white/5 px-6 font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                Take diagnostic quiz
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm text-white/70">
              <Stat label="Practice questions" value="1,400+" />
              <Stat label="Topic modules" value="70+" />
              <Stat label="Review levels" value="Pro · Sub" />
            </div>
          </div>

          {/* Level cards */}
          <div className="md:col-span-5">
            <div className="grid gap-4">
              <LevelCard
                level="Professional"
                blurb="For bachelor's degree holders. Includes logical reasoning, advanced math, and analytical ability."
                href="/topics"
                accent
              />
              <LevelCard
                level="Subprofessional"
                blurb="For high school graduates. Includes clerical operations and core literacy skills."
                href="/topics"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section id="topics" className="border-b border-border/60">
        <div className="container-page py-24">
          <SectionHeading
            eyebrow="Major review areas"
            title="Study the full coverage — broken down."
            subtitle="Every topic on the CSE has a dedicated track with lessons, examples, practice items, and explanations."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <Link
                key={t.slug}
                to="/topics"
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-surface font-display text-base font-semibold text-secondary">
                    {t.icon}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.level === "both" ? "Pro · Sub" : t.level}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.modules} modules · {t.questions} items</span>
                  <span className="inline-flex items-center gap-1 text-accent transition group-hover:translate-x-0.5">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/topics" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              See all topics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-b border-border/60 bg-surface">
        <div className="container-page py-24">
          <SectionHeading
            eyebrow="How it works"
            title="A structured path from diagnostic to mock exam."
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Diagnose", d: "Take a short diagnostic quiz to find your weak areas." },
              { n: "02", t: "Study", d: "Work through focused modules with examples and key terms." },
              { n: "03", t: "Practice", d: "Answer practice questions with full explanations." },
              { n: "04", t: "Mock exam", d: "Simulate the timed CSE and get a readiness score." },
            ].map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="font-display text-3xl font-bold text-accent/80">{s.n}</div>
                <div className="mt-4 font-display text-lg font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DIAGNOSTIC CTA */}
      <section id="diagnostic" className="border-b border-border/60">
        <div className="container-page py-24">
          <div className="relative overflow-hidden rounded-3xl bg-hero p-10 text-primary-foreground md:p-16">
            <div className="absolute inset-0 bg-mesh opacity-70" aria-hidden />
            <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <h2 className="font-display text-3xl font-bold md:text-5xl">
                  Not sure where to start?
                </h2>
                <p className="mt-4 max-w-xl text-white/75">
                  Take the 15-minute diagnostic and we'll point you to the modules that need the most work.
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Link
                  to="/topics"
                  className="inline-flex h-12 items-center rounded-md bg-gold px-6 font-medium text-primary shadow-elegant transition hover:brightness-105"
                >
                  Start diagnostic <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section id="disclaimer">
        <div className="container-page py-20">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Disclaimer</div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              CSE.review is an independent study resource. It is <strong className="text-foreground">not affiliated with, endorsed by, or officially connected with the Civil Service Commission</strong>.
              All practice items are original material created for study purposes and do not reproduce actual Civil Service Examination questions.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-white">{value}</div>
      <div className="text-xs uppercase tracking-widest">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function LevelCard({
  level,
  blurb,
  href,
  accent,
}: {
  level: string;
  blurb: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`group relative block overflow-hidden rounded-2xl border p-6 backdrop-blur transition hover:-translate-y-0.5 ${accent
          ? "border-gold/40 bg-white/10"
          : "border-white/15 bg-white/5 hover:bg-white/10"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-white/70">Exam level</div>
        {accent && (
          <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Popular
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-2xl font-semibold text-white">{level}</div>
      <p className="mt-2 text-sm text-white/70">{blurb}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold transition group-hover:translate-x-0.5">
        Browse topics <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
