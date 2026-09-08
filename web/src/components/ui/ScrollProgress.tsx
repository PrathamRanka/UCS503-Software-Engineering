import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bar = barRef.current;
        if (!bar) return;
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? Math.min(window.scrollY / available, 1) : 0;
        bar.style.transform = `scaleX(${progress})`;
        bar.style.opacity = progress > 0.002 ? "1" : "0";
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left scale-x-0 bg-[#ed111c] opacity-0 shadow-[0_0_12px_rgba(237,17,28,.45)] transition-opacity duration-200 motion-reduce:hidden"
      aria-hidden="true"
    />
  );
}
