import { Bell, Search } from "lucide-react";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";
type Props={theme:"light"|"dark";onToggleTheme:()=>void;onPreview:(label:string)=>void};
export function FeedHeader({theme,onToggleTheme,onPreview}:Props){return <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-black/10 bg-[#f7f7f5]/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/90 lg:hidden">
  <Brand/><div className="flex items-center gap-1"><button className="grid size-10 place-items-center rounded-full transition duration-150 hover:bg-black/5 active:scale-90 dark:hover:bg-white/5 motion-reduce:transform-none motion-reduce:transition-none" onClick={()=>onPreview("People")} aria-label="Find people"><Search size={19}/></button><ThemeToggle theme={theme} onToggle={onToggleTheme} compact/><button className="relative grid size-10 place-items-center rounded-full transition duration-150 hover:bg-black/5 active:scale-90 dark:hover:bg-white/5 motion-reduce:transform-none motion-reduce:transition-none" onClick={()=>onPreview("Activity")} aria-label="Activity"><Bell size={19}/><i className="absolute right-2 top-2 size-2 rounded-full bg-[#ed111c]"/></button></div>
</header>}
