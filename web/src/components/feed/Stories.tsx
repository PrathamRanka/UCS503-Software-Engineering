import { Plus } from 'lucide-react'
import type { Story } from '../../types/social'
import { Avatar } from '../ui/Avatar'

type StoriesProps = {
  stories: Story[]
  onSelect: (index: number) => void
  onCreate: () => void
}

export function Stories({ stories, onSelect, onCreate }: StoriesProps) {
  return (
    <section className="flex w-full gap-[15px] overflow-x-auto border-b border-neutral-200 px-2 py-4 [scrollbar-width:none] lg:border-0 lg:pb-6 [&::-webkit-scrollbar]:hidden" aria-label="Stories">
      {stories.map((story, index) => (
        <button className="flex w-[70px] min-w-[70px] flex-col items-center gap-1.5 bg-transparent text-xs" key={story.name} onClick={() => story.mine ? onCreate() : onSelect(index)}>
          <span className={`relative grid size-[66px] place-items-center rounded-full p-[3px] ${story.mine ? 'bg-neutral-300' : 'bg-[conic-gradient(from_220deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)]'}`}>
            <span className="rounded-full bg-white p-0.5"><Avatar src={story.image} size="lg" /></span>
            {story.mine ? <i className="absolute -bottom-0.5 -right-0.5 z-10 grid size-[21px] place-items-center rounded-full border-2 border-white bg-blue-500 text-white"><Plus size={13} strokeWidth={3} /></i> : null}
          </span>
          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{story.name}</span>
        </button>
      ))}
    </section>
  )
}
