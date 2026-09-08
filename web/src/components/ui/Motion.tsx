import {
  useEffect,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type MotionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
  distance?: number;
  scale?: number;
};

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useInViewMotion<T extends HTMLElement>(
  distance = 10,
  delay = 0,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const animation = element.animate(
          [
            { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: 280,
            delay,
            easing: "cubic-bezier(.2,.8,.2,1)",
          },
        );
        animation.onfinish = () => animation.cancel();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, distance]);

  return ref;
}

type SpotlightSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  glow?: string;
};

export function SpotlightSurface({
  children,
  glow = "rgba(237,17,28,.16)",
  className = "",
  ...props
}: SpotlightSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const moveLight = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion() || !surfaceRef.current || !lightRef.current) return;
    const bounds = surfaceRef.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    lightRef.current.style.background = `radial-gradient(360px circle at ${x}px ${y}px, ${glow}, transparent 68%)`;
    lightRef.current.style.opacity = "1";
  };

  return (
    <div
      ref={surfaceRef}
      className={`relative overflow-hidden ${className}`}
      onPointerMove={moveLight}
      onPointerLeave={() => {
        if (lightRef.current) lightRef.current.style.opacity = "0";
      }}
      {...props}
    >
      <div
        ref={lightRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 motion-reduce:hidden"
      />
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

export function MotionReveal({
  children,
  delay = 0,
  distance = 8,
  scale = 0.99,
  ...props
}: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion()) return;
    const animation = element.animate(
      [
        {
          opacity: 0,
          transform: `translate3d(0, ${distance}px, 0) scale(${scale})`,
        },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      {
        duration: 220,
        delay,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "both",
      },
    );
    animation.onfinish = () => animation.cancel();
    return () => animation.cancel();
  }, [delay, distance, scale]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

export function MotionBackdrop({
  children,
  delay: _delay,
  distance: _distance,
  scale: _scale,
  ...props
}: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion()) return;
    const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 180,
      easing: "ease-out",
      fill: "both",
    });
    animation.onfinish = () => animation.cancel();
    return () => animation.cancel();
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
