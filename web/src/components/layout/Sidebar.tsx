import { Bell, BookOpen, Compass, Home, Menu, MessageCircle, Search, SquarePlus, type LucideIcon } from "lucide-react";
import type { UserProfile } from "../../types/social";
import { Avatar } from "../ui/Avatar";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";

const navItems = [
  { label: "Today", icon: Home },
  { label: "Pulse", icon: Compass },
  { label: "Spaces", icon: BookOpen },
  { label: "People", icon: Search },
  { label: "Inbox", icon: MessageCircle, badge: 4 },
  { label: "Activity", icon: Bell, dot: true },
];
type SidebarProps = { activeNav:string; user:UserProfile; theme:"light"|"dark"; onToggleTheme:()=>void; onNavigate:(label:string)=>void; onCreate:()=>void };
type NavButtonProps = { label:string; title?:string; icon?:LucideIcon; active?:boolean; badge?:number; dot?:boolean; avatar?:boolean; avatarSrc?:string; onClick:()=>void };

function NavButton({ label,title,icon:Icon,active,badge,dot,avatar,avatarSrc,onClick }:NavButtonProps) {
  return <button className={`group relative flex h-12 w-12 items-center justify-center gap-3 rounded-xl px-0 text-left transition duration-150 ease-out motion-reduce:transition-none xl:w-full xl:justify-start xl:px-3 ${active ? "bg-white text-[#171719] shadow-[0_8px_30px_rgba(30,48,38,0.07)] dark:bg-[#1a211d] dark:text-white" : "text-neutral-500 hover:bg-white/70 hover:text-[#171719] dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"}`} onClick={onClick} aria-label={title ?? label}>
    {active ? <i className="absolute -left-5 h-5 w-[3px] rounded-r-full bg-[#ed111c]" /> : null}
    <span className="relative grid place-items-center">{avatar&&avatarSrc?<Avatar src={avatarSrc} size="sm"/>:Icon?<Icon size={20} strokeWidth={active?2.2:1.7}/>:null}{dot?<i className="absolute -right-1 -top-1 size-2 rounded-full border border-[#f7f7f5] bg-[#ed111c]"/>:null}{badge?<b className="absolute -right-3 -top-2 grid min-w-4 place-items-center rounded-full bg-[#ed111c] px-1 text-[9px] leading-4 text-white">{badge}</b>:null}</span>
    <span className="hidden text-[13px] font-medium xl:block">{title ?? label}</span>
  </button>;
}

export function Sidebar({activeNav,user,theme,onToggleTheme,onNavigate,onCreate}:SidebarProps){return <aside className="fixed inset-y-0 left-0 z-20 hidden w-[76px] flex-col border-r border-[#171719]/10 bg-[#f7f7f5]/95 px-[18px] py-7 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/95 lg:flex xl:w-[238px]">
  <Brand compact/><nav className="mt-16 grid gap-1.5" aria-label="Main navigation">{navItems.map(item=><NavButton key={item.label} {...item} active={activeNav===item.label} onClick={()=>onNavigate(item.label)}/>)}<NavButton label="Create" title="Add to campus" icon={SquarePlus} onClick={onCreate}/></nav>
  <div className="mt-auto grid gap-2"><div className="xl:hidden"><ThemeToggle theme={theme} onToggle={onToggleTheme} compact/></div><div className="hidden xl:block"><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div><NavButton label="Profile" title={user.name} avatar avatarSrc={user.avatar} active={activeNav==="Profile"} onClick={()=>onNavigate("Profile")}/><NavButton label="More" title="Settings" icon={Menu} active={activeNav==="Settings"} onClick={()=>onNavigate("More")}/></div>
</aside>}
