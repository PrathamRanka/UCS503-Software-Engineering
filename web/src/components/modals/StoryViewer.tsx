import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Story } from '../../types/social'
import { Avatar } from '../ui/Avatar'

type StoryViewerProps = {
  story: Story
  index: number
  total: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function StoryViewer({ story, index, total, onClose, onNext, onPrevious }: StoryViewerProps) {
  const [progressed, setProgressed] = useState(false)

  useEffect(() => {
    setProgressed(false)
    const frame = window.requestAnimationFrame(() => setProgressed(true))
    const timer = window.setTimeout(onNext, 5000)
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    }
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [story, onClose, onNext, onPrevious])

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-0 sm:p-5" role="dialog" aria-modal="true" aria-label={`${story.name}'s story`}>
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-neutral-950 text-white sm:rounded-lg">
        <div className="absolute inset-x-2.5 top-2 z-10 flex gap-1">
          {Array.from({ length: total }, (_, itemIndex) => (
            <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/35" key={itemIndex}>
              <i className={`block h-full bg-white ${itemIndex < index ? 'w-full' : itemIndex === index ? `transition-[width] duration-[5000ms] ease-linear motion-reduce:transition-none ${progressed ? 'w-full' : 'w-0'}` : 'w-0'}`} />
            </span>
          ))}
        </div>
        <header className="absolute left-4 right-3 top-4 z-10 flex items-center gap-2 drop-shadow-lg">
          <Avatar src={story.image} size="sm" /><strong className="text-[13px]">{story.name}</strong><span className="text-[11px] text-white/75">12m</span>
          <button className="ml-auto grid size-10 place-items-center bg-transparent" onClick={onClose} aria-label="Close story"><X /></button>
        </header>
        <img className="size-full object-cover" src={story.image} alt={`${story.name}'s story`} />
        <div className="absolute inset-x-5 bottom-9 text-center font-semibold drop-shadow-lg">A little moment from campus today ✨</div>
        <button className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 transition hover:bg-black/40 active:scale-95 motion-reduce:transition-none" onClick={onPrevious} aria-label="Previous story"><ChevronLeft /></button>
        <button className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 transition hover:bg-black/40 active:scale-95 motion-reduce:transition-none" onClick={onNext} aria-label="Next story"><ChevronRight /></button>
      </div>
    </div>
  )
}
