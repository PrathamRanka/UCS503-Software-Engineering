import { Bell, Clapperboard, Compass, Home, Menu, MessageCircle, Search, SquarePlus, type LucideIcon } from 'lucide-react'
import type { UserProfile } from '../../types/social'
import { Avatar } from '../ui/Avatar'
import { Brand } from '../ui/Brand'

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Search', icon: Search },
  { label: 'Explore', icon: Compass },
  { label: 'Reels', icon: Clapperboard },
  { label: 'Messages', icon: MessageCircle, badge: 4 },
  { label: 'Notifications', icon: Bell, dot: true },
]

type SidebarProps = {
  activeNav: string
  user: UserProfile
  onNavigate: (label: string) => void
  onCreate: () => void
}

type NavButtonProps = {
  label: string
  icon?: LucideIcon
  active?: boolean
  badge?: number
  dot?: boolean
  avatar?: boolean
  avatarSrc?: string
  onClick: () => void
}

function NavButton({ label, icon: Icon, active, badge, dot, avatar, avatarSrc, onClick }: NavButtonProps) {
  return (
    <button
      className={`flex h-[50px] w-[50px] items-center justify-center gap-4 rounded-lg px-0 text-left text-base transition hover:bg-neutral-100 xl:w-full xl:justify-start xl:px-3 ${active ? 'font-bold' : ''}`}
      onClick={onClick}
    >
      <span className="relative grid place-items-center transition group-hover:scale-105">
        {avatar && avatarSrc ? <Avatar src={avatarSrc} size="sm" /> : Icon ? <Icon size={25} strokeWidth={active ? 2.7 : 1.9} /> : null}
        {dot ? <i className="absolute -right-0.5 -top-1 size-2 rounded-full border border-white bg-red-500" /> : null}
        {badge ? <b className="absolute -right-2 -top-2 grid min-w-[18px] place-items-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] leading-[14px] text-white">{badge}</b> : null}
      </span>
      <span className="hidden xl:block">{label}</span>
    </button>
  )
}

export function Sidebar({ activeNav, user, onNavigate, onCreate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[74px] flex-col items-center border-r border-neutral-200 bg-white px-3 py-8 lg:flex xl:w-[245px] xl:items-stretch">
      <div className="px-3"><Brand compact /></div>
      <nav className="mt-9 grid gap-1" aria-label="Main navigation">
        {navItems.map(({ label, icon, badge, dot }) => (
          <NavButton key={label} label={label} icon={icon} active={activeNav === label} badge={badge} dot={dot} onClick={() => onNavigate(label)} />
        ))}
        <NavButton label="Create" icon={SquarePlus} onClick={onCreate} />
        <NavButton label="Profile" avatar avatarSrc={user.avatar} active={activeNav === 'Profile'} onClick={() => onNavigate('Profile')} />
      </nav>
      <div className="mt-auto"><NavButton label="More" icon={Menu} active={activeNav === 'Settings'} onClick={() => onNavigate('More')} /></div>
    </aside>
  )
}
