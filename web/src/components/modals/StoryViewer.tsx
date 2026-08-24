import { X } from 'lucide-react'
import type { Story } from '../../types/social'
import { Avatar } from '../ui/Avatar'

type StoryViewerProps = { story: Story; onClose: () => void; onNext: () => void }

export function StoryViewer({ story, onClose, onNext }: StoryViewerProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-0 sm:p-5" role="dialog" aria-modal="true">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-neutral-950 text-white sm:rounded-lg">
        <div className="absolute left-2.5 right-2.5 top-2 z-10 h-0.5 rounded-full bg-white/35"><i className="block h-full w-full bg-white" /></div>
        <header className="absolute left-4 right-3 top-4 z-10 flex items-center gap-2 text-shadow-lg">
          <Avatar src={story.image} size="sm" /><strong className="text-[13px]">{story.name}</strong><span className="text-[11px] text-white/75">12m</span>
          <button className="ml-auto grid size-9 place-items-center bg-transparent" onClick={onClose} aria-label="Close story"><X /></button>
        </header>
        <img className="size-full object-cover" src={story.image} alt={`${story.name}'s story`} />
        <div className="absolute bottom-9 inset-x-5 text-center font-semibold drop-shadow-lg">A little moment from campus today ✨</div>
        <button className="absolute right-4 top-1/2 grid size-9 place-items-center rounded-full bg-black/35" onClick={onNext} aria-label="Next story">→</button>
      </div>
    </div>
  )
}
