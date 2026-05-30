import type { CSSProperties } from "react";

type DoodleKind = "plant" | "paperPlane" | "pencil" | "paperclip" | "star" | "notebook";

type DoodleProps = {
  className?: string;
  color?: string;
  kind: DoodleKind;
  rotate?: number;
  size?: number;
};

export function PageDoodles({ variant }: { variant: "dashboard" | "lessons" | "quizzes" | "profile" }) {
  if (variant === "dashboard") {
    return (
      <DoodleLayer>
        <Doodle kind="paperPlane" color="#4a78f5" size={150} rotate={-8} className="right-[8%] top-3 opacity-[0.24]" />
        <Doodle kind="plant" color="#3fcaba" size={158} rotate={3} className="bottom-3 right-[3%] opacity-[0.26]" />
        <Doodle kind="pencil" color="#ff9d3a" size={112} rotate={18} className="bottom-[24%] left-[2%] opacity-[0.2]" />
        <HashtagDoodle className="right-[27%] bottom-[2%] rotate-[-4deg] text-brand-blue/30" text="#cseready" />
        <HashtagDoodle className="left-[4%] top-[22%] rotate-[7deg] text-brand-pink/25" text="#ready4cse" />
        <HashtagDoodle className="right-[5%] top-[38%] rotate-[10deg] text-brand-teal/25" text="#cseready" />
        <HashtagDoodle className="left-[20%] bottom-[9%] rotate-[-8deg] text-brand-orange/25" text="#ready4cse" />
        <HashtagDoodle className="right-[42%] top-[3%] rotate-[4deg] text-brand-purple/25" text="#cseready" />
      </DoodleLayer>
    );
  }

  if (variant === "lessons") {
    return (
      <DoodleLayer>
        <Doodle kind="paperclip" color="#ff4f6a" size={120} rotate={-16} className="right-[3%] top-14 opacity-[0.23]" />
        <Doodle kind="plant" color="#3fcaba" size={145} rotate={7} className="bottom-6 left-[2%] opacity-[0.23]" />
        <Doodle kind="star" color="#f6bb39" size={88} rotate={18} className="left-[9%] top-[38%] opacity-[0.2]" />
        <HashtagDoodle className="right-[8%] bottom-[3%] rotate-[5deg] text-brand-pink/30" text="#ready4cse" />
        <HashtagDoodle className="left-[5%] top-[14%] rotate-[-8deg] text-brand-blue/25" text="#cseready" />
        <HashtagDoodle className="right-[25%] top-[26%] rotate-[8deg] text-brand-orange/25" text="#ready4cse" />
        <HashtagDoodle className="left-[24%] bottom-[8%] rotate-[4deg] text-brand-teal/25" text="#cseready" />
        <HashtagDoodle className="right-[42%] bottom-[1%] rotate-[-6deg] text-brand-purple/25" text="#ready4cse" />
      </DoodleLayer>
    );
  }

  if (variant === "quizzes") {
    return (
      <DoodleLayer>
        <Doodle kind="star" color="#f6bb39" size={116} rotate={12} className="right-[17%] top-6 opacity-[0.24]" />
        <Doodle kind="paperPlane" color="#b0a3f6" size={140} rotate={-18} className="bottom-8 left-[5%] opacity-[0.23]" />
        <Doodle kind="paperclip" color="#3fcaba" size={94} rotate={14} className="right-[6%] bottom-[18%] opacity-[0.2]" />
        <HashtagDoodle className="left-[12%] top-[11%] rotate-[-6deg] text-brand-orange/30" text="#cseready" />
        <HashtagDoodle className="right-[10%] top-[30%] rotate-[6deg] text-brand-pink/25" text="#ready4cse" />
        <HashtagDoodle className="left-[4%] bottom-[25%] rotate-[9deg] text-brand-blue/25" text="#cseready" />
        <HashtagDoodle className="right-[31%] bottom-[6%] rotate-[-7deg] text-brand-teal/25" text="#ready4cse" />
        <HashtagDoodle className="left-[33%] top-[3%] rotate-[3deg] text-brand-purple/25" text="#cseready" />
      </DoodleLayer>
    );
  }

  return (
    <DoodleLayer>
      <Doodle kind="plant" color="#3fcaba" size={150} rotate={-5} className="left-[4%] top-16 opacity-[0.22]" />
      <Doodle kind="notebook" color="#f6bb39" size={122} rotate={10} className="bottom-4 right-[6%] opacity-[0.23]" />
      <Doodle kind="star" color="#ff4f6a" size={82} rotate={-12} className="right-[16%] top-[12%] opacity-[0.19]" />
      <HashtagDoodle className="left-[13%] bottom-[7%] rotate-[4deg] text-brand-purple/30" text="#ready4cse" />
      <HashtagDoodle className="right-[8%] top-[28%] rotate-[-7deg] text-brand-blue/25" text="#cseready" />
      <HashtagDoodle className="left-[26%] top-[6%] rotate-[5deg] text-brand-pink/25" text="#ready4cse" />
      <HashtagDoodle className="right-[24%] bottom-[5%] rotate-[8deg] text-brand-orange/25" text="#cseready" />
      <HashtagDoodle className="left-[4%] top-[46%] rotate-[-4deg] text-brand-teal/25" text="#ready4cse" />
    </DoodleLayer>
  );
}

export function Doodle({ className = "", color = "#2d2d2d", kind, rotate = 0, size = 100 }: DoodleProps) {
  const style = {
    "--doodle-color": color,
    "--doodle-rotate": `${rotate}deg`,
    width: size,
    height: size,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute hidden text-[var(--doodle-color)] md:block ${className}`}
      style={style}
    >
      <DoodleShape kind={kind} />
    </span>
  );
}

function DoodleLayer({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {children}
    </div>
  );
}

function HashtagDoodle({ className = "", text }: { className?: string; text: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute hidden text-2xl font-black lowercase leading-none md:block ${className}`}
    >
      {text}
    </span>
  );
}

function DoodleShape({ kind }: { kind: DoodleKind }) {
  const className = "h-full w-full rotate-[var(--doodle-rotate)]";

  if (kind === "paperPlane") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none">
        <path d="M15 58 103 20 74 101 54 68 15 58Z" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 68 103 20 42 61" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "plant") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none">
        <path d="M39 76h43l-6 27H45l-6-27Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
        <path d="M60 76V39" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path d="M60 50c-19-20-35-17-39-1 15 8 28 8 39 1ZM61 56c18-19 34-15 38 1-14 8-27 7-38-1ZM58 39c-9-22 3-33 18-25 0 15-6 24-18 25Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "pencil") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none">
        <path d="M25 91 34 69 78 25l18 18-44 44-27 4Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
        <path d="m70 33 18 18M34 69l18 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "paperclip") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none">
        <path d="M77 35 43 72c-8 9-8 22 1 30 9 8 22 7 31-2l28-31c12-13 11-33-2-45-14-13-34-12-47 3L24 60c-16 18-15 45 3 61" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none">
        <path d="m60 15 11 30 32 2-25 20 8 31-26-17-27 17 8-31-25-20 32-2 12-30Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 120 120" fill="none">
      <path d="M29 22h54c7 0 12 5 12 12v61c0 7-5 12-12 12H29c-7 0-12-5-12-12V34c0-7 5-12 12-12Z" stroke="currentColor" strokeWidth="7" />
      <path d="M39 22v85M51 43h28M51 61h28M51 79h18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
