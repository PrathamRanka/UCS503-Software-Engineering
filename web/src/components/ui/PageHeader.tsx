import type { ReactNode } from "react";

type PageHeaderProps = { title: string; action?: ReactNode };

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 px-4 sm:px-6">
      <h1 className="text-xl font-bold">{title}</h1>
      {action}
    </header>
  );
}
