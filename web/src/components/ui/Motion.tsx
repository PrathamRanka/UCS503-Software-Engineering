import {
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
    return () => animation.cancel();
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
