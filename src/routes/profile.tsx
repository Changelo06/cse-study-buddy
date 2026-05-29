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
          
          {/* 98% Stamp */}
          <div className="absolute top-6 right-8 pointer-events-none opacity-90 rotate-12 z-20">
            <svg width="140" height="80" viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="90" cy="50" rx="85" ry="45" fill="none" stroke="#ff4f6a" strokeWidth="5" strokeDasharray="12 10" />
              <text x="50%" y="65%" textAnchor="middle" fill="#ff4f6a" fontFamily="Nunito" fontSize="56" fontWeight="900" style={{ letterSpacing: "-0.05em" }}>
                98%
              </text>
            </svg>
          </div>

          <div className="mt-16 h-full flex flex-col px-4">
             <h3 className="font-display font-black text-3xl text-brand-ink mb-8">Performance Summary</h3>
             
             {/* Chart Area */}
             <div className="w-full rounded-[2rem] border-2 border-brand-ink/10 bg-white p-8 pb-6">
                
                {/* The Graph Grid */}
                <div className="relative w-full h-[300px] border border-brand-ink/10">
                   
                   {/* Horizontal Grid Lines (3 inner lines to make 4 rows) */}
                   <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                     <div className="w-full h-px bg-brand-ink/10"></div>
                     <div className="w-full h-px bg-brand-ink/10"></div>
                     <div className="w-full h-px bg-brand-ink/10"></div>
                   </div>

                   {/* 5 Columns with vertical dividers and centered bars */}
                   <div className="absolute inset-0 grid grid-cols-5 divide-x divide-brand-ink/10">
                     
                     <div className="h-full flex justify-center items-end">
                       <div className="w-16 bg-brand-blue rounded-t-[1.25rem] h-[40%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                       </div>
                     </div>

                     <div className="h-full flex justify-center items-end">
                       <div className="w-16 bg-brand-yellow rounded-t-[1.25rem] h-[65%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">65%</div>
                       </div>
                     </div>

                     <div className="h-full flex justify-center items-end">
                       <div className="w-16 bg-brand-pink rounded-t-[1.25rem] h-[85%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">85%</div>
                       </div>
                     </div>

                     <div className="h-full flex justify-center items-end">
                       <div className="w-16 bg-brand-teal rounded-t-[1.25rem] h-[55%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">55%</div>
                       </div>
                     </div>

                     <div className="h-full flex justify-center items-end">
                       <div className="w-16 bg-brand-orange rounded-t-[1.25rem] h-[80%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">80%</div>
                       </div>
                     </div>

                   </div>
                </div>

                {/* Legends */}
                <div className="flex justify-around mt-8 font-display font-bold text-xs uppercase tracking-widest text-brand-ink/60 px-4">
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

    </div>
  );
}
