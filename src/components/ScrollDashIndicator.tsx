import { useEffect, useState } from "react";

export function ScrollDashIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable <= 0 ? 100 : Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-hidden="true">
      <div className="flex h-44 w-4 flex-col-reverse gap-1 rounded-full bg-white/50 px-1 py-2 shadow-[2px_2px_0_rgba(45,45,45,0.08)]">
        {Array.from({ length: 12 }).map((_, index) => {
          const isActive = ((index + 1) / 12) * 100 <= progress;

          return (
            <span
              key={index}
              className={`h-2.5 rounded-full transition-colors ${isActive ? "bg-brand-purple" : "bg-[#eadfb7]"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
