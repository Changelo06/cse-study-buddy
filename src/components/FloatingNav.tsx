import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { LogIn, LogOut, Shield, User } from "lucide-react";

export function FloatingNav() {
  const location = useLocation();
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const supabaseActive = isSupabaseConfigured();

  const links = [
    { label: "Home", to: "/" },
    { label: "Lessons", to: "/lessons" },
    { label: "Quizzes", to: "/quizzes" },
    { label: "Profile", to: "/profile" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setIsHidden(isScrollingDown && currentScrollY > 80);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 flex w-full items-center justify-between px-5 pb-1 pt-[15px] transition-transform duration-300 ease-out md:px-8 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link to="/" className="relative z-10 flex h-24 w-56 items-center overflow-visible md:h-28 md:w-72">
        <img
          src="/cse-ready-logo.svg"
          alt="CSE Ready Logo"
          className="h-28 w-auto origin-left scale-[1.53] object-contain drop-shadow-sm md:h-40 md:scale-[1.665]"
        />
      </Link>
      
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border-2 border-brand-ink bg-white px-5 py-2.5 shadow-[4px_4px_0_rgba(45,45,45,0.1)] md:min-w-[520px] md:justify-center">
        {links.map((link) => {
          const isActive =
            link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
          
          return (
            <Link
              key={link.label}
              to={link.to}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors md:px-5 md:py-2 md:text-lg ${
                isActive 
                  ? "bg-brand-purple text-brand-ink shadow-[inset_0_-2px_0_rgba(45,45,45,0.08)]"
                  : "text-brand-ink hover:bg-black/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Admin link - only visible to admins */}
        {isAdmin && (
          <Link
            to="/admin"
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors md:px-5 md:py-2 md:text-lg flex items-center gap-1.5 ${
              location.pathname.startsWith("/admin")
                ? "bg-brand-purple text-brand-ink shadow-[inset_0_-2px_0_rgba(45,45,45,0.08)]"
                : "text-brand-ink hover:bg-black/5"
            }`}
          >
            <Shield size={16} strokeWidth={3} />
            Admin
          </Link>
        )}
      </div>

      {/* Auth section */}
      <div className="relative z-10 flex w-56 items-center justify-end gap-2 md:w-72">
        {supabaseActive && user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full border-2 border-brand-ink/15 bg-white px-4 py-2 text-sm font-bold text-brand-ink transition-colors hover:border-brand-ink/30"
            >
              <User size={16} strokeWidth={3} />
              <span className="hidden md:inline">{user.email?.split("@")[0]}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-ink/15 bg-white text-brand-ink/60 transition-colors hover:border-brand-pink hover:text-brand-pink"
              title="Sign Out"
            >
              <LogOut size={16} strokeWidth={3} />
            </button>
          </div>
        ) : supabaseActive ? (
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-full border-2 border-brand-ink bg-brand-blue px-5 py-2 text-sm font-bold text-white shadow-[2px_2px_0_rgba(45,45,45,0.1)] transition-transform hover:-translate-y-0.5"
          >
            <LogIn size={16} strokeWidth={3} />
            Log In
          </Link>
        ) : null}
      </div>
    </div>
  );
}
