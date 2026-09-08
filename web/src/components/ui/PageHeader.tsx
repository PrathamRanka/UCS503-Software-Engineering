import type { ReactNode } from "react";
type Props={title:string;action?:ReactNode;eyebrow?:string};
export function PageHeader({title,action,eyebrow="titalks"}:Props){return <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between border-b border-black/10 bg-[#f7f7f5]/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/90 sm:px-7"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.2em] text-[#ed111c]">{eyebrow}</p><h1 className="text-xl font-semibold tracking-[-.025em]">{title}</h1></div>{action}</header>}
