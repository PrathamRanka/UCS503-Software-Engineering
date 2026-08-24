import { MessageCircle } from 'lucide-react'
import { Brand } from '../ui/Brand'

type FeedHeaderProps = { onPreview: (label: string) => void }

export function FeedHeader({ onPreview }: FeedHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-[60px] items-center justify-between border-b border-neutral-200 bg-white/95 px-4 lg:hidden">
      <Brand />
      <button className="grid size-10 place-items-center rounded-lg hover:bg-neutral-100" onClick={() => onPreview('Messages')} aria-label="Messages"><MessageCircle size={25} /></button>
    </header>
  )
}
