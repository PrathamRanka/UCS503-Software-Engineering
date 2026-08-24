import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggle: () => void;
  compact?: boolean;
};

export function ThemeToggle({
  theme,
  onToggle,
  compact = false,
}: ThemeToggleProps) {
  const Icon = theme === "light" ? Moon : Sun;
  return (
    <button
      className={`flex h-11 items-center gap-3 rounded-lg transition hover:bg-neutral-100 active:scale-[.98] dark:hover:bg-neutral-800 motion-reduce:transition-none ${compact ? "w-11 justify-center" : "w-full px-3"}`}
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Icon size={23} />
      <span className={compact ? "hidden" : ""}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}
