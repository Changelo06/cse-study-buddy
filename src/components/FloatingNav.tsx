import { Link } from "@tanstack/react-router";
import { Home, Library, LayoutDashboard, CheckSquare } from "lucide-react";

export function FloatingNav() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-full border border-border/40 bg-background/80 p-1.5 shadow-elegant backdrop-blur-xl">
        <NavLink to="/" icon={<Home className="h-[18px] w-[18px]" />} label="Home" exact />
        <NavLink to="/dashboard" icon={<LayoutDashboard className="h-[18px] w-[18px]" />} label="Dashboard" />
        <NavLink to="/topics" icon={<Library className="h-[18px] w-[18px]" />} label="Topics" />
        <NavLink to="/quizzes" icon={<CheckSquare className="h-[18px] w-[18px]" />} label="Quizzes" />
      </nav>
    </div>
  );
}

function NavLink({
  to,
  icon,
  label,
  exact = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className: "bg-surface text-foreground font-medium shadow-sm",
      }}
      activeOptions={{ exact }}
      className="group flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 text-muted-foreground transition-all hover:bg-surface/50 hover:text-foreground md:flex-row md:gap-2.5 md:px-5 md:py-2"
    >
      <div className="transition-transform group-hover:scale-110 group-active:scale-95">
        {icon}
      </div>
      <span className="text-[10px] md:text-sm">{label}</span>
    </Link>
  );
}
