import { Camera } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className="flex w-fit items-center text-black dark:text-white no-underline"
      href="#top"
      aria-label="Thapar Talks home"
    >
      <Camera
        className={compact ? "hidden size-7 lg:block xl:hidden" : "hidden"}
        strokeWidth={2.2}
      />
      <span
        className={`font-sans text-[25px] font-bold leading-none tracking-[-1.4px] ${compact ? "lg:hidden xl:block" : ""}`}
      >
        Thapar Talks
      </span>
    </a>
  );
}
