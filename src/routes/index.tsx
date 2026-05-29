import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container-page py-12 relative">
      {/* 98% Stamp on top right corner */}
      <div className="absolute -top-4 right-8 pointer-events-none opacity-80 rotate-12">
        <svg width="180" height="100" viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="50" rx="85" ry="45" fill="none" stroke="#ff4f6a" strokeWidth="4" strokeDasharray="10 8" />
          <text x="50%" y="65%" textAnchor="middle" fill="#ff4f6a" fontFamily="Nunito" fontSize="56" fontWeight="900" style={{ letterSpacing: "-0.05em" }}>
            98%
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Top Row */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stats Block */}
          <div className="bg-brand-teal rounded-[2rem] p-6 shadow-soft flex justify-between items-center relative overflow-hidden" style={{ minHeight: "140px" }}>
            <div className="flex-1 flex flex-col items-center justify-center border-r-2 border-brand-ink/50 border-dashed border-spacing-2 relative">
              <span className="font-display font-black text-5xl text-brand-ink leading-none">14</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink mt-2">MODULES</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border-r-2 border-brand-ink/50 border-dashed relative">
              <span className="font-display font-black text-5xl text-brand-ink leading-none">5</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink mt-2">TESTS</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <span className="font-display font-black text-5xl text-brand-ink leading-none">5</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink mt-2">TESTS</span>
            </div>
          </div>

          {/* Yellow Block */}
          <div className="bg-brand-yellow rounded-[2rem] p-6 shadow-soft relative" style={{ minHeight: "140px" }}>
             <div className="absolute bottom-4 right-4 bg-brand-pink rounded-full w-16 h-6"></div>
          </div>

          {/* Blue Block */}
          <div className="bg-brand-blue rounded-[2rem] p-6 shadow-soft relative" style={{ minHeight: "140px" }}>
             <div className="absolute bottom-4 right-4 bg-brand-pink rounded-full w-16 h-6"></div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-soft h-full min-h-[400px]">
            <h2 className="font-display font-black text-3xl text-brand-ink mb-8">My Lessons</h2>
            
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-end">
                  <div className="bg-brand-ink/60 rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="bg-brand-ink rounded-[2rem] p-8 shadow-soft h-full min-h-[400px]">
            <h2 className="font-display font-black text-3xl text-white mb-8">My study plan</h2>
            
            <div className="space-y-4">
              <div className="bg-brand-pink h-12 rounded-full w-full"></div>
              <div className="bg-brand-yellow h-12 rounded-full w-full"></div>
              <div className="bg-brand-blue h-12 rounded-full w-full"></div>
              <div className="bg-brand-teal h-12 rounded-full w-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
