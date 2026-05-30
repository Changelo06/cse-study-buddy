import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

export function FloatingNav() {
  const location = useLocation();
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);

  const links = [
    { label: "Home", to: "/" },
    { label: "Lessons", to: "/topics" },
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
      </div>

      <div className="w-56 md:w-72" />
    </div>
  );
}
