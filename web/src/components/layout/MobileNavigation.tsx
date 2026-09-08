import { BookOpen, Compass, Home, Plus, Search } from "lucide-react";
import type { UserProfile } from "../../types/social";
type Props={onCreate:()=>void;activeNav:string;user:UserProfile;onNavigate:(label:string)=>void};
const items=[{label:"Today",title:"Today",icon:Home},{label:"Pulse",title:"Pulse",icon:Compass},{label:"People",title:"People",icon:Search},{label:"Spaces",title:"Spaces",icon:BookOpen}];
export function MobileNavigation({onCreate,activeNav,onNavigate}:Props){return <nav className="fixed inset-x-3 bottom-3 z-30 grid h-16 grid-cols-5 rounded-md border border-black/10 bg-[#ffffff]/90 px-2 shadow-[0_18px_50px_rgba(25,40,32,.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111113]/90 lg:hidden" aria-label="Mobile navigation">
  {items.map(({label,title,icon:Icon})=><button key={label} className={`flex flex-col items-center justify-center gap-1 bg-transparent text-[8px] ${activeNav===label?"text-[#171719] dark:text-white":"text-neutral-500"}`} onClick={()=>onNavigate(label)}><Icon size={20} strokeWidth={activeNav===label?2.3:1.7}/><span>{title}</span></button>)}
  <button className="flex flex-col items-center justify-center gap-1 bg-transparent text-[8px] text-neutral-500" onClick={onCreate}><span className="grid size-9 place-items-center rounded-full bg-[#171719] text-white dark:bg-white dark:text-[#171719]"><Plus size={21}/></span><span>Add</span></button>
</nav>}
