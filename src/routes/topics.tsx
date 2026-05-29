import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { topics, type Topic } from "@/data/topics";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Topics — CSE.review" },
      {
        name: "description",
        content:
          "Browse all Civil Service Exam review topics: English, Filipino, Numerical, Logic, General Information, Constitution, Ethics, and Clerical Operations.",
      },
      { property: "og:title", content: "Topics — CSE.review" },
      {
        property: "og:description",
        content: "All CSE review topics, with modules and practice questions.",
      },
    ],
  }),
  component: TopicsPage,
});

type Level = "all" | "professional" | "subprofessional";

function TopicsPage() {
  const [level, setLevel] = useState<Level>("all");

  const visible = topics.filter((t) => {
    if (level === "all") return true;
    return t.level === level || t.level === "both";
  });

  return (
    <div className="min-h-screen bg-background bg-paper-grid">
      <SiteHeader />

      <section className="border-b border-border/60 bg-surface">
        <div className="container-page py-16 md:py-24">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent">
            Topic selection
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
            Pick a topic. <span className="text-muted-foreground">Start studying.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Filter by exam level. Each topic includes structured modules, examples, and practice questions with answer explanations.
          </p>

          <div className="mt-8 inline-flex rounded-lg border border-border bg-card p-1 text-sm">
            {(
              [
                { id: "all", label: "All" },
                { id: "professional", label: "Professional" },
                { id: "subprofessional", label: "Subprofessional" },
              ] as { id: Level; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLevel(opt.id)}
                className={`rounded-md px-4 py-2 font-medium transition ${
                  level === opt.id
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-16">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((t) => (
              <TopicCard key={t.slug} topic={t} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="text-center text-muted-foreground">No topics for this filter.</p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  // demo progress
  const progress = Math.floor(((topic.slug.charCodeAt(0) * 13) % 70) + 5);

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card">
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface font-display text-lg font-semibold text-secondary">
          {topic.icon}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {topic.level === "both" ? "Pro · Sub" : topic.level}
        </span>
      </div>

      <h2 className="mt-5 font-display text-xl font-semibold">{topic.name}</h2>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{topic.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="rounded-lg bg-surface p-3">
          <div className="font-display text-base font-semibold text-foreground">{topic.modules}</div>
          modules
        </div>
        <div className="rounded-lg bg-surface p-3">
          <div className="font-display text-base font-semibold text-foreground">{topic.questions}</div>
          questions
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Link
        to="/topics"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:bg-secondary"
      >
        Start studying <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
