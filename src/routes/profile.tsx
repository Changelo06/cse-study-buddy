import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="container-page py-12 flex justify-center items-center min-h-[calc(100vh-120px)]">
      
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-soft overflow-hidden flex relative" style={{ minHeight: "600px" }}>
        
        {/* Sidebar */}
        <div className="w-64 bg-[#233f45] p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full mb-4 border-4 border-[#233f45] shadow-lg">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="Avatar" className="w-full h-full rounded-full" />
          </div>
          
          <h2 className="font-display font-black text-xl text-white tracking-wide">Juan Dela Cruz</h2>
          <p className="font-display font-bold text-xs text-brand-yellow uppercase tracking-widest mt-2 mb-10 text-center">
            Civil Service Reviewer
          </p>

          <div className="w-full flex flex-col gap-4 text-white/60 font-display font-bold text-sm tracking-wide">
            <button className="text-white bg-white/10 rounded-full py-2 px-4 text-left transition-colors">Summary</button>
            <button className="hover:text-white transition-colors py-2 px-4 text-left">Numerical</button>
            <button className="hover:text-white transition-colors py-2 px-4 text-left">Analytical</button>
            <button className="hover:text-white transition-colors py-2 px-4 text-left">Verbal</button>
            <button className="hover:text-white transition-colors py-2 px-4 text-left">General Info</button>
            
            <div className="h-px bg-white/10 my-2 w-full"></div>
            
            <button className="hover:text-white transition-colors py-2 px-4 text-left text-brand-teal">Strength</button>
            <button className="hover:text-white transition-colors py-2 px-4 text-left text-brand-pink">Weakness</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-12 relative bg-white">
          
          {/* 98% Stamp on top left inside the content area */}
          <div className="absolute top-8 left-8 pointer-events-none opacity-80 -rotate-12">
            <svg width="140" height="80" viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="90" cy="50" rx="85" ry="45" fill="none" stroke="#ff4f6a" strokeWidth="5" strokeDasharray="12 10" />
              <text x="50%" y="65%" textAnchor="middle" fill="#ff4f6a" fontFamily="Nunito" fontSize="56" fontWeight="900" style={{ letterSpacing: "-0.05em" }}>
                98%
              </text>
            </svg>
          </div>

          <div className="mt-24 h-full">
             <h3 className="font-display font-black text-3xl text-brand-ink mb-6">Performance Summary</h3>
             
             {/* Chart Placeholder Area */}
             <div className="bg-paper-grid w-full h-[300px] rounded-[2rem] border-2 border-brand-ink/10 flex items-end p-8 gap-4 justify-center relative">
                
                {/* Y Axis lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-8 px-4 opacity-10 pointer-events-none">
                  <div className="w-full h-px bg-brand-ink"></div>
                  <div className="w-full h-px bg-brand-ink"></div>
                  <div className="w-full h-px bg-brand-ink"></div>
                  <div className="w-full h-px bg-brand-ink"></div>
                </div>

                {/* Bars */}
                <div className="w-16 bg-brand-blue rounded-t-xl h-[40%] z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                </div>
                <div className="w-16 bg-brand-yellow rounded-t-xl h-[70%] z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">70%</div>
                </div>
                <div className="w-16 bg-brand-pink rounded-t-xl h-[90%] z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
                </div>
                <div className="w-16 bg-brand-teal rounded-t-xl h-[55%] z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">55%</div>
                </div>
                <div className="w-16 bg-brand-orange rounded-t-xl h-[85%] z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">85%</div>
                </div>
             </div>

             <div className="flex justify-center gap-6 mt-6 font-display font-bold text-xs uppercase tracking-widest text-brand-ink/60">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-blue"></div> Numerical</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-yellow"></div> Analytical</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-pink"></div> Verbal</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-teal"></div> General</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-orange"></div> Ethics</span>
             </div>

          </div>

        </div>

      </div>

    </div>
  );
}
