import { useState } from 'react'
import { Clapperboard, Heart, MessageCircle, X } from 'lucide-react'
import { exploreItems } from '../../data/mockData'
import type { ExploreItem } from '../../types/social'
import { PageHeader } from '../ui/PageHeader'

const topics = ['For you', 'Campus', 'Clubs', 'Tech', 'Sports', 'Events']

export function ExploreView() {
  const [topic, setTopic] = useState('For you')
  const [selected, setSelected] = useState<ExploreItem | null>(null)

  return (
    <section className="mx-auto min-h-screen w-full max-w-5xl">
      <PageHeader title="Explore" />
      <div className="flex gap-2 overflow-x-auto px-3 py-4 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
        {topics.map((item) => <button className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition motion-reduce:transition-none ${topic === item ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`} onClick={() => setTopic(item)} key={item}>{item}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {exploreItems.map((item, index) => <button className={`group relative overflow-hidden bg-neutral-100 ${index === 2 || index === 7 ? 'row-span-2' : ''}`} onClick={() => setSelected(item)} key={item.id}><img className="aspect-square size-full object-cover transition duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none" src={item.image} alt={`${topic} campus post`} loading="lazy" />{item.video ? <Clapperboard className="absolute right-2 top-2 text-white drop-shadow" size={20} /> : null}<span className="absolute inset-0 hidden items-center justify-center gap-5 bg-black/40 text-sm font-semibold text-white group-hover:flex"><b className="flex items-center gap-1.5"><Heart fill="white" size={19} />{item.likes}</b><b className="flex items-center gap-1.5"><MessageCircle fill="white" size={19} />{item.comments}</b></span></button>)}
      </div>
      {selected ? <div className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4" onMouseDown={() => setSelected(null)}><div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white" onMouseDown={(event) => event.stopPropagation()}><button className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-black/60 text-white" onClick={() => setSelected(null)}><X /></button><img className="max-h-[78vh] w-full object-cover" src={selected.image} alt="Explore post" /><div className="flex gap-6 p-4 text-sm font-semibold"><span className="flex items-center gap-2"><Heart size={20} />{selected.likes.toLocaleString()} likes</span><span className="flex items-center gap-2"><MessageCircle size={20} />{selected.comments} comments</span></div></div></div> : null}
    </section>
  )
}
