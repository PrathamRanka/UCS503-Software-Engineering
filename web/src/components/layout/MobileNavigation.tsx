import { Clapperboard, Home, Search, SquarePlus } from 'lucide-react'
import { currentUser } from '../../data/mockData'
import { Avatar } from '../ui/Avatar'

type MobileNavigationProps = {
  onCreate: () => void
  onPreview: (label: string) => void
}

const buttonClass = 'grid size-11 place-items-center bg-transparent'

export function MobileNavigation({ onCreate, onPreview }: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex h-[52px] items-center justify-around border-t border-neutral-200 bg-white/95 lg:hidden" aria-label="Mobile navigation">
      <button className={buttonClass} aria-label="Home"><Home size={24} strokeWidth={2.6} /></button>
      <button className={buttonClass} onClick={() => onPreview('Search')} aria-label="Search"><Search size={24} /></button>
      <button className={buttonClass} onClick={onCreate} aria-label="Create post"><SquarePlus size={24} /></button>
      <button className={buttonClass} onClick={() => onPreview('Reels')} aria-label="Reels"><Clapperboard size={24} /></button>
      <button className={buttonClass} aria-label="Profile"><Avatar src={currentUser.avatar} size="sm" /></button>
    </nav>
  )
}
