import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, Smile } from 'lucide-react'
import type { Post } from '../../types/social'
import { Avatar } from '../ui/Avatar'

type PostCardProps = {
  post: Post
  isLiked: boolean
  isSaved: boolean
  onLike: () => void
  onSave: () => void
  onShare: () => void
}

const iconButton = 'grid size-10 place-items-center rounded-lg bg-transparent transition hover:text-neutral-500'

export function PostCard({ post, isLiked, isSaved, onLike, onSave, onShare }: PostCardProps) {
  const displayedLikes = post.likes + (isLiked && post.id !== 1 ? 1 : 0)

  return (
    <article className="w-full border-b border-neutral-200 bg-white pb-3.5 [content-visibility:auto]">
      <header className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 sm:px-0">
        <span className="rounded-full bg-[conic-gradient(from_220deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] p-0.5"><span className="block rounded-full bg-white p-0.5"><Avatar src={post.avatar} size="sm" /></span></span>
        <div className="flex min-w-0 flex-col">
          <strong className="flex items-center text-sm leading-[18px]">{post.handle}{post.featured ? <span className="ml-1 grid size-[13px] place-items-center rounded-full bg-blue-500 text-[8px] text-white">✓</span> : null}</strong>
          <span className="text-xs leading-4 text-neutral-500">{post.place} · {post.time}</span>
        </div>
        <button className={iconButton} aria-label="Post menu"><MoreHorizontal size={22} /></button>
      </header>

      <div className="aspect-square w-full overflow-hidden bg-neutral-100 sm:rounded-[4px] sm:border sm:border-neutral-200">
        <img className="block size-full object-cover" src={post.image} alt={`${post.place} campus post`} />
      </div>

      <div className="flex h-12 items-center justify-between px-1 sm:-mx-2 sm:px-0">
        <div className="flex gap-0.5">
          <button className={`${iconButton} ${isLiked ? 'text-red-500' : ''}`} onClick={onLike} aria-label="Like post"><Heart size={26} fill={isLiked ? 'currentColor' : 'none'} /></button>
          <button className={iconButton} aria-label="Comment"><MessageCircle size={25} /></button>
          <button className={iconButton} onClick={onShare} aria-label="Share"><Send size={24} /></button>
        </div>
        <button className={iconButton} onClick={onSave} aria-label="Save post"><Bookmark size={25} fill={isSaved ? 'currentColor' : 'none'} /></button>
      </div>

      <div className="px-3 text-sm leading-[18px] sm:px-0">
        <strong>{displayedLikes.toLocaleString()} likes</strong>
        <p className="my-1"><b className="mr-1">{post.handle}</b>{post.caption}</p>
        <div className="flex flex-wrap gap-1">{post.tags.map((tag) => <button className="bg-transparent p-0 text-sm text-[#00376b]" key={tag}>{tag}</button>)}</div>
        <button className="block bg-transparent pt-1 text-sm text-neutral-500">View all {post.comments} comments</button>
        <span className="mt-1.5 block text-[10px] text-neutral-500">{post.time.toUpperCase()} AGO</span>
      </div>

      <div className="hidden h-10 items-center gap-2.5 sm:flex">
        <Smile size={21} />
        <input className="min-w-0 flex-1 border-0 text-sm outline-none" placeholder="Add a comment…" />
        <button className="bg-transparent text-[13px] font-semibold text-blue-500">Post</button>
      </div>
    </article>
  )
}
