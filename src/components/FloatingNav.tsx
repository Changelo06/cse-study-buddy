import { Link, useLocation } from "@tanstack/react-router";

export function FloatingNav() {
  const location = useLocation();

  const links = [
    { label: "Home", to: "/" },
    { label: "Lessons", to: "/topics" },
    { label: "Quizes", to: "/quizzes" },
    { label: "Profile", to: "/profile" },
  ];

  return (
    <div className="w-full pt-8 pb-4 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="font-display font-bold text-lg text-brand-ink">
        CSE Ready Logo
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border-3 border-brand-ink rounded-full px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        {links.map((link) => {
          // Exact match for Home, partial match for others if needed, but exact is safer here
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.label}
              to={link.to}
              className={`px-5 py-2 rounded-full font-display font-bold transition-colors ${
                isActive 
                  ? "bg-brand-purple text-brand-ink" 
                  : "text-brand-ink hover:bg-black/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Empty div to balance flex-between */}
      <div className="w-[120px]"></div>
    </div>
  );
}
