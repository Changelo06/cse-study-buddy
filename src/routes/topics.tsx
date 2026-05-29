import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/topics")({
  component: LessonsPage,
});

const lessonCards = [
  {
    id: "english",
    title: "English",
    bgColor: "bg-brand-blue",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v12H4z" />
      </svg>
    ),
  },
  {
    id: "filipino",
    title: "Filipino",
    bgColor: "bg-brand-yellow",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h20L12 2z" />
      </svg>
    ),
  },
  {
    id: "math",
    title: "Mathematics",
    bgColor: "bg-brand-pink",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V9H8v3H6v2h2v3h2v-3h2v-2zm-6 7h12v-2H6v2z" />
      </svg>
    ),
  },
  {
    id: "clerical",
    title: "Clerical Ops",
    bgColor: "bg-brand-teal",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z" />
      </svg>
    ),
  },
  {
    id: "geninfo",
    title: "General Info",
    bgColor: "bg-brand-orange",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "ethics",
    title: "Ethics & Public",
    bgColor: "bg-brand-pink",
    icon: (
      <svg className="w-32 h-32 text-white/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2zM12 5.8L18.4 18H5.6L12 5.8zM11 10h2v4h-2zm0 5h2v2h-2z" />
      </svg>
    ),
  },
];

function LessonsPage() {
  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessonCards.map((card) => (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-[2.5rem] ${card.bgColor} p-8 shadow-soft cursor-pointer hover:scale-[1.02] transition-transform`}
            style={{ minHeight: "320px" }}
          >
            {/* Top Right Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1 text-brand-ink font-display font-black text-sm">
              10 Modules
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Sub-topics list */}
            <div className="absolute top-20 right-8 text-white/70 font-display font-bold text-[10px] tracking-wider leading-relaxed text-right flex flex-col items-start uppercase">
              <span>Grammar</span>
              <span>Storytelling</span>
              <span>Verbal</span>
              <span>Communication</span>
              <span>DiddyBlud</span>
              <span>TungTungsahur</span>
            </div>

            {/* Watermark Icon */}
            <div className="absolute top-10 left-6 pointer-events-none">
              {card.icon}
            </div>

            {/* Title */}
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="font-display font-black text-4xl text-white tracking-tight drop-shadow-md">
                {card.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
