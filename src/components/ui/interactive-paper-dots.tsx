import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InteractivePaperDotsProps {
  /** Radius of each dot in pixels. Default: 2.5 */
  dotSize?: number;
  /** Gap between dots — matches the CSS paper-grid spacing. Default: 46 */
  gridGap?: number;
  /** Radius of cursor influence in pixels. Default: 175 */
  mouseRadius?: number;
  /** Additional CSS classes for the canvas wrapper */
  className?: string;
}

/**
 * Draws an interactive dot grid on a fixed canvas.
 * Dots push away from the cursor and spring back with bouncy physics,
 * creating a "magnetic paper" effect that fits the notebook theme.
 */
const InteractivePaperDots = ({
  dotSize = 2.5,
  gridGap = 46,
  mouseRadius = 175,
  className,
}: InteractivePaperDotsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Brand colors at low opacity — subtle enough to feel like pencil marks on paper
    const dotColors = [
      "rgba(45, 45, 45, 0.10)",
      "rgba(74, 120, 245, 0.12)",
      "rgba(255, 79, 106, 0.11)",
      "rgba(63, 202, 186, 0.12)",
      "rgba(246, 187, 57, 0.12)",
      "rgba(176, 163, 246, 0.13)",
      "rgba(255, 157, 58, 0.11)",
    ];

    // Physics constants
    const TENSION = 0.03; // How quickly dots spring back (lower = slower, bouncier)
    const FRICTION = 0.88; // How quickly velocity decays (lower = more damping)
    const FORCE_STRENGTH = 7; // How strongly dots push away from cursor

    interface Dot {
      originX: number;
      originY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
    }

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const mouse = { x: -1000, y: -1000, active: false };

    const initDots = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];

      const cols = Math.ceil(width / gridGap) + 2;
      const rows = Math.ceil(height / gridGap) + 2;
      const offsetX = (width % gridGap) / 2;
      const offsetY = (height % gridGap) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * gridGap;
          const y = offsetY + r * gridGap;
          dots.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            color: dotColors[Math.floor(Math.random() * dotColors.length)],
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // --- Mouse repulsion ---
        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = mouseRadius * mouseRadius;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / mouseRadius;
            // Quadratic falloff for a softer, more natural feel
            const force = falloff * falloff * FORCE_STRENGTH;
            dot.vx += (dx / dist) * force;
            dot.vy += (dy / dist) * force;
          }
        }

        // --- Spring back to origin ---
        dot.vx += (dot.originX - dot.x) * TENSION;
        dot.vy += (dot.originY - dot.y) * TENSION;

        // --- Friction ---
        dot.vx *= FRICTION;
        dot.vy *= FRICTION;

        // --- Update position ---
        dot.x += dot.vx;
        dot.y += dot.vy;

        // --- Draw ---
        // Dots grow slightly when displaced for a juicy feel
        const displacementSq =
          (dot.x - dot.originX) ** 2 + (dot.y - dot.originY) ** 2;
        const scale = 1 + Math.min(displacementSq / 2500, 1.8);
        const currentSize = dotSize * scale;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // --- Event handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      initDots();
    };

    // --- Init ---
    initDots();
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dotSize, gridGap, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0", className)}
    />
  );
};

export default InteractivePaperDots;
