import { useState, type ReactNode, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageDoodles } from "@/components/Doodles";
import { useAppStore } from "@/store/useAppStore";
import { mockTopics, mockStandaloneQuizzes } from "@/data/mockData";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function useProfileData() {
  const { completedModules, quizResults, getReadinessScore } = useAppStore();
  
  const data = useMemo(() => {
    let totalModules = 0;
    mockTopics.forEach(t => totalModules += t.modules.length);

    const subjectScores = mockTopics.map(topic => {
      const topicQuizzes = mockStandaloneQuizzes.filter(q => q.topicId === topic.id);
      let quizScoreSum = 0;
      let quizzesAttempted = 0;
      topicQuizzes.forEach(q => {
        const result = quizResults[q.id];
        if (result) {
          quizzesAttempted++;
          quizScoreSum += Math.round((result.score / result.total) * 100);
        }
      });
      const score = quizzesAttempted > 0 ? Math.round(quizScoreSum / quizzesAttempted) : 0;
      return {
        label: topic.title,
        short: topic.title.substring(0, 4).toUpperCase(),
        score,
        color: topic.bgColor,
        hex: topic.bgColor === "bg-brand-blue" ? "#4a78f5" : topic.bgColor === "bg-brand-yellow" ? "#f6bb39" : topic.bgColor === "bg-brand-pink" ? "#ff4f6a" : topic.bgColor === "bg-brand-teal" ? "#3fcaba" : topic.bgColor === "bg-brand-orange" ? "#ff9d3a" : "#ff3f77" 
      };
    });

    const validScores = subjectScores.filter(s => s.score > 0);
    const sorted = [...subjectScores].sort((a,b) => b.score - a.score);
    const strongestSubjects = sorted.slice(0, 2).map(s => s.label);
    const weakestSubjects = [...subjectScores].sort((a,b) => a.score - b.score).slice(0, 2).map(s => s.label);
    
    let totalTime = 0;
    let totalItems = 0;
    Object.values(quizResults).forEach(res => {
      totalTime += res.timeSpentSeconds;
      totalItems += res.total;
    });
    const avgTime = totalItems > 0 ? Math.round(totalTime / totalItems) : 0;
    
    const overallAvg = validScores.length > 0 ? Math.round(validScores.reduce((acc, curr) => acc + curr.score, 0) / validScores.length) : 0;

    return {
      name: "Juan Dela Cruz",
      role: "Civil Service Reviewer",
      examTrack: "Professional Track",
      learnerId: "CSE-READY-2026-014",
      readinessScore: getReadinessScore(),
      modulesCompleted: completedModules.length,
      totalModules,
      quizzesCompleted: Object.keys(quizResults).length,
      averageScore: overallAvg,
      averageTimePerItem: avgTime > 0 ? `${avgTime}s` : "0s",
      status: "Active Learner",
      strongestSubjects: strongestSubjects.length > 0 ? strongestSubjects : ["None yet"],
      weakestSubjects: weakestSubjects.length > 0 ? weakestSubjects : ["None yet"],
      recommendedLessons: ["Percentages Application", "Number Series", "RA 6713"],
      studyPlan: ["Review " + (weakestSubjects[0] || "Math"), "Take one easy quiz", "Review wrong answers"],
      subjectScores,
      quizReadiness: validScores.length > 0 ? validScores : subjectScores
    };
  }, [completedModules, quizResults, getReadinessScore]);

  return data;
}

type ProfileData = ReturnType<typeof useProfileData>;

function ProfilePage() {
  const profile = useProfileData();
  return (
    <main className="container-page relative pb-6 pt-1 md:pb-8">
      <PageDoodles variant="profile" />
      <section className="relative z-10 mx-auto max-w-[64rem]">
        <div className="text-center">
          <h1 className="font-display text-[2rem] font-black leading-none text-brand-ink md:text-[2.5rem]">
            Your CSE Ready Card
          </h1>
          <p className="mt-1 text-sm font-bold text-brand-ink/60">
            Click the learner card to switch between ID and performance report.
          </p>
        </div>

        <SwitchProfileCard profile={profile} />
      </section>
    </main>
  );
}

function SwitchProfileCard({ profile }: { profile: ProfileData }) {
  const [view, setView] = useState<"front" | "back">("front");
  const isBack = view === "back";
  const toggleView = () => setView((current) => (current === "front" ? "back" : "front"));

  return (
    <section className="mt-4">
      <div
        role="button"
        tabIndex={0}
        aria-label={isBack ? "View learner ID card front" : "View performance report card back"}
        onClick={toggleView}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleView();
          }
        }}
        className="relative mx-auto aspect-auto min-h-[730px] w-full max-w-[60rem] cursor-pointer overflow-hidden rounded-[1.45rem] border-[3px] border-white bg-[#fffaf0] shadow-[9px_11px_0_rgba(45,45,45,0.1),0_24px_38px_rgba(45,45,45,0.18)] outline-none ring-1 ring-brand-ink/10 transition-shadow hover:shadow-[10px_13px_0_rgba(45,45,45,0.12),0_26px_42px_rgba(45,45,45,0.2)] lg:aspect-[1.58/1] lg:min-h-0"
      >
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isBack ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <ProfileCardFront profile={profile} onToggle={toggleView} />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isBack ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <ProfileCardBack profile={profile} onToggle={toggleView} />
        </div>
      </div>
    </section>
  );
}

function ProfileCardFront({ profile, onToggle }: { profile: ProfileData; onToggle: () => void }) {
  const progress = profile.totalModules > 0 ? Math.round((profile.modulesCompleted / profile.totalModules) * 100) : 0;

  return (
    <article className="relative flex h-full flex-col overflow-hidden bg-[#fff9e7] text-brand-ink">
      <CardWatermark />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b-2 border-brand-ink/12 bg-brand-blue px-4 py-3 text-white md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/cse-ready-icon.svg" alt="CSE Ready" className="h-12 w-12 object-contain drop-shadow-sm" />
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">CSE-style practice profile</p>
            <h2 className="truncate text-xl font-black uppercase leading-none md:text-2xl">CSE Ready Learner Card</h2>
          </div>
        </div>
        <ReadinessSeal score={profile.readinessScore} />
      </header>

      <div className="relative z-10 grid flex-1 lg:grid-cols-[31%_69%]">
        <aside className="flex flex-col justify-between bg-[#244248] px-4 py-4 text-white md:px-5">
          <div>
            <div className="grid place-items-center">
              <div className="relative grid h-32 w-32 place-items-center rounded-[1.1rem] border-[5px] border-white bg-brand-yellow text-5xl font-black text-brand-ink shadow-[5px_5px_0_rgba(0,0,0,0.16)]">
                JD
                <span className="absolute -bottom-3 rounded-full bg-brand-teal px-3 py-1 text-[10px] font-black uppercase text-brand-ink">
                  Photo ID
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Learner name</p>
              <h3 className="text-2xl font-black leading-none">{profile.name}</h3>
              <p className="mt-1 text-xs font-black uppercase tracking-wide text-brand-yellow">{profile.role}</p>
            </div>
          </div>

          <div className="grid gap-2 text-xs font-black">
            <PrintedField label="Track" value={profile.examTrack} dark />
            <PrintedField label="Learner ID" value={profile.learnerId} dark />
            <PrintedField label="Status" value={profile.status} dark />
          </div>
        </aside>

        <section className="flex flex-col justify-between px-4 py-4 md:px-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-ink/50">Official learner pass</p>
                <h3 className="mt-1 font-display text-3xl font-black leading-none md:text-4xl">Front ID Card</h3>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggle();
                }}
                className="rounded-full bg-brand-purple px-4 py-2 text-xs font-black uppercase text-brand-ink shadow-[3px_3px_0_rgba(45,45,45,0.1)]"
              >
                View Details
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-[1.05rem] border-2 border-brand-ink/12 bg-white/70 sm:grid-cols-3">
              <IdField label="Readiness estimate" value={`${profile.readinessScore}%`} color="text-brand-pink" />
              <IdField label="Overall progress" value={`${progress}%`} />
              <IdField label="Modules completed" value={`${profile.modulesCompleted}/${profile.totalModules}`} />
              <IdField label="Quizzes completed" value={`${profile.quizzesCompleted}`} />
              <IdField label="Average score" value={`${profile.averageScore}%`} />
              <IdField label="Avg. time / item" value={`${profile.averageTimePerItem}/item`} />
            </div>

            <div className="mt-4 rounded-[1rem] border-2 border-dashed border-brand-ink/15 bg-[#fff2bf] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-ink/45">Status label</p>
                  <p className="text-base font-black">On track, focus on {profile.weakestSubjects[0] || 'consistency'}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase text-brand-ink/70">
                  Estimate, not a guarantee
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-ink/45">Subject mastery strip</p>
              <p className="text-[10px] font-black uppercase text-brand-ink/45">Tap card to switch</p>
            </div>
            <SubjectMasteryStrip profile={profile} />
          </div>
        </section>
      </div>

      <footer className="relative z-10 grid gap-2 border-t-2 border-brand-ink/12 bg-white/72 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-brand-ink/55 md:grid-cols-[1fr_auto] md:px-6">
        <p>Independent reviewer - Original CSE-style practice only - Not government affiliated</p>
        <div className="flex items-center gap-3">
          <Barcode />
          <span>Serial: CR-2026-014</span>
        </div>
      </footer>
    </article>
  );
}

function ProfileCardBack({ profile, onToggle }: { profile: ProfileData; onToggle: () => void }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden bg-[#fff8df] text-brand-ink">
      <CardWatermark />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b-2 border-brand-ink/12 bg-[#244248] px-4 py-3 text-white md:px-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Back side - learner report</p>
          <h2 className="font-display text-3xl font-black uppercase leading-none">Performance Report</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-white/50">Readiness</p>
          <p className="text-3xl font-black text-brand-yellow">{profile.readinessScore}%</p>
        </div>
      </header>

      <div className="relative z-10 grid flex-1 gap-0 lg:grid-cols-[52%_48%]">
        <section className="border-b-2 border-brand-ink/10 p-4 md:p-5 lg:border-b-0 lg:border-r-2 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-ink/45">Subject performance</p>
                <h3 className="text-xl font-black">Mastery map</h3>
              </div>
              <span className="rounded-full bg-brand-cream px-3 py-1 text-[10px] font-black uppercase text-brand-ink/60">
                Updated: Today
              </span>
            </div>
            
            {/* Recharts integration for Subject Performance */}
            <SubjectPerformanceRows profile={profile} />
          </div>

          <div className="mt-3 grid grid-cols-6 overflow-hidden rounded-full border-2 border-white shadow-[2px_2px_0_rgba(45,45,45,0.06)]">
            {profile.subjectScores.map((subject) => (
              <span key={subject.short} className={`h-4 ${subject.color}`} title={`${subject.label}: ${subject.score}%`} />
            ))}
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-brand-ink/45">
            Color legend: ENG - FIL - MATH - CLK - GEN - ETH
          </p>
          
          {/* Recharts integration for Quiz Readiness */}
          <QuizReadinessIndex profile={profile} />
        </section>

        <section className="grid content-between gap-3 p-4 md:p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <ReportBlock title="Strongest">
              <PillList color="bg-brand-teal" items={profile.strongestSubjects} />
            </ReportBlock>
            <ReportBlock title="Weakest">
              <PillList color="bg-brand-pink" items={profile.weakestSubjects} />
            </ReportBlock>
            <ReportBlock title="Recommended Next" wide>
              <NumberedList items={profile.recommendedLessons} />
            </ReportBlock>
            <ReportBlock title="3-Step Study Plan" wide>
              <div className="grid gap-2 sm:grid-cols-3">
                {profile.studyPlan.map((item, index) => (
                  <div key={item} className="rounded-xl bg-white/80 px-3 py-2 text-xs font-black shadow-[2px_2px_0_rgba(45,45,45,0.05)]">
                    <span className="mr-1 text-brand-pink">0{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </ReportBlock>
          </div>

          <div className="rounded-[1rem] border-2 border-brand-ink/12 bg-[#fff0b9] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-ink/45">Final exam status</p>
                <p className="text-sm font-black">
                  Locked until the 180-item, 3-hour readiness exam is completed.
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggle();
                }}
                className="rounded-full bg-brand-purple px-4 py-2 text-xs font-black uppercase text-brand-ink shadow-[3px_3px_0_rgba(45,45,45,0.1)]"
              >
                View Card Front
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t-2 border-brand-ink/12 bg-white/72 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-brand-ink/55 md:px-6">
        <span>Verification: learner progress estimate for CSE-style practice only</span>
        <span>Back serial: CR-BACK-2026-014</span>
      </footer>
    </article>
  );
}

function PrintedField({ dark, label, value }: { dark?: boolean; label: string; value: string }) {
  return (
    <div className={dark ? "rounded-xl bg-white/10 px-3 py-2" : "rounded-xl bg-white/70 px-3 py-2"}>
      <span className={dark ? "block text-[9px] uppercase tracking-wide text-white/45" : "block text-[9px] uppercase tracking-wide text-brand-ink/45"}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

function IdField({ color = "text-brand-ink", label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className="min-h-[4.4rem] border-b-2 border-r-2 border-brand-ink/10 px-3 py-2.5 last:border-r-0">
      <p className="text-[10px] font-black uppercase tracking-wide text-brand-ink/45">{label}</p>
      <p className={`mt-1 text-2xl font-black leading-none ${color}`}>{value}</p>
    </div>
  );
}

function SubjectMasteryStrip({ profile }: { profile: ProfileData }) {
  return (
    <div className="overflow-hidden rounded-[0.9rem] border-2 border-white bg-white/72 shadow-[3px_3px_0_rgba(45,45,45,0.06)]">
      <div className="grid grid-cols-6">
        {profile.subjectScores.map((subject) => (
          <div key={subject.short} className={`${subject.color} px-2 py-2 text-center`}>
            <p className="text-[10px] font-black uppercase text-white drop-shadow-sm">{subject.short}</p>
            <p className="text-sm font-black text-white drop-shadow-sm">{subject.score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectPerformanceRows({ profile }: { profile: ProfileData }) {
  return (
    <div className="h-44 w-full mt-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={profile.subjectScores} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis dataKey="short" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
            contentStyle={{ borderRadius: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            formatter={(value: number) => [`${value}%`, 'Score']}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={14}>
            {profile.subjectScores.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.hex} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function QuizReadinessIndex({ profile }: { profile: ProfileData }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-ink/45">Quiz readiness index</p>
          <p className="text-[10px] font-black leading-tight text-brand-ink/58">Subject performance radar.</p>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={profile.quizReadiness}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="short" tick={{ fill: '#1e293b', fontSize: 10, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Readiness" dataKey="score" stroke="#4a78f5" strokeWidth={2} fill="#4a78f5" fillOpacity={0.3} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value}%`, 'Readiness']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReadinessSeal({ score }: { score: number }) {
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-brand-pink bg-white text-center text-brand-pink shadow-[3px_3px_0_rgba(45,45,45,0.12)]">
      <span className="text-[9px] font-black uppercase leading-none">Ready</span>
      <span className="font-display text-2xl font-black leading-none">{score}%</span>
    </div>
  );
}

function ReportBlock({ children, title, wide }: { children: ReactNode; title: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 border-t-2 border-brand-ink/10 pt-3" : ""}>
      <h3 className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand-ink/45">{title}</h3>
      {children}
    </div>
  );
}

function PillList({ color, items }: { color: string; items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded-full ${color} px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0_rgba(45,45,45,0.08)]`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-1 text-xs font-black text-brand-ink/75">
      {items.map((item, index) => (
        <li key={item}>
          <span className="mr-2 text-brand-pink">0{index + 1}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}

function Barcode() {
  return (
    <div className="flex h-8 items-end gap-[3px] rounded bg-white px-2 py-1">
      {[12, 22, 15, 28, 18, 24, 13, 30, 16, 22].map((height, index) => (
        <span key={`${height}-${index}`} className="w-[3px] bg-brand-ink/75" style={{ height }} />
      ))}
    </div>
  );
}

function CardWatermark() {
  return (
    <div className="pointer-events-none absolute right-8 top-20 z-0 h-64 w-64 rounded-full border-[28px] border-brand-blue/5" />
  );
}
