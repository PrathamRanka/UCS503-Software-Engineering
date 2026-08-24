import { MessageCircle } from "lucide-react";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";

type FeedHeaderProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onPreview: (label: string) => void;
};

export function FeedHeader({
  theme,
  onToggleTheme,
  onPreview,
}: FeedHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-[60px] items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 px-4 lg:hidden">
      <Brand />
      <div className="flex items-center">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
        <button
          className="grid size-10 place-items-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => onPreview("Messages")}
          aria-label="Messages"
        >
          <MessageCircle size={25} />
        </button>
      </div>
    </header>
  );
}
