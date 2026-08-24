import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { people } from '../../data/mockData'
import { Avatar } from '../ui/Avatar'

type SocialListModalProps = {
  title: 'Followers' | 'Following'
  following: Set<string>
  onToggleFollow: (handle: string) => void
  onClose: () => void
  onOpenProfile: (username: string) => void
}

export function SocialListModal({ title, following, onToggleFollow, onClose, onOpenProfile }: SocialListModalProps) {
  const [query, setQuery] = useState('')
  const list = people.slice(1).filter((person) => `${person.name} ${person.username}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={onClose}><section className="w-full max-w-md overflow-hidden rounded-xl bg-white" onMouseDown={(event) => event.stopPropagation()}><header className="relative flex h-12 items-center justify-center border-b border-neutral-200"><strong>{title}</strong><button className="absolute right-2 grid size-9 place-items-center" onClick={onClose}><X /></button></header><label className="m-3 flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-3"><Search size={17} className="text-neutral-400" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label><div className="max-h-[430px] overflow-y-auto px-2 pb-3">{list.map((person) => { const handle = `@${person.username}`; return <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50" key={person.id}><button onClick={() => onOpenProfile(person.username)}><Avatar src={person.avatar} /></button><button className="min-w-0 flex-1 text-left" onClick={() => onOpenProfile(person.username)}><strong className="block truncate text-sm">{person.username}</strong><span className="block truncate text-sm text-neutral-500">{person.name}</span></button><button className={`rounded-lg px-3 py-2 text-xs font-semibold ${following.has(handle) ? 'bg-neutral-100' : 'bg-blue-500 text-white'}`} onClick={() => onToggleFollow(handle)}>{following.has(handle) ? 'Following' : 'Follow'}</button></div> })}</div></section></div>
}
