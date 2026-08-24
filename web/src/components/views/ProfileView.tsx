import { useState } from 'react'
import { Bookmark, Grid3X3, Settings, UserRoundCheck } from 'lucide-react'
import { exploreItems } from '../../data/mockData'
import type { Post, UserProfile } from '../../types/social'
import { Avatar } from '../ui/Avatar'
import { PageHeader } from '../ui/PageHeader'

type ProfileViewProps = {
  user: UserProfile
  posts: Post[]
  savedIds: Set<number>
  onSettings: () => void
  onPreview: (label: string) => void
}

type ProfileTab = 'posts' | 'saved' | 'tagged'

export function ProfileView({ user, posts, savedIds, onSettings, onPreview }: ProfileViewProps) {
  const [tab, setTab] = useState<ProfileTab>('posts')
  const ownPosts = posts.filter((post) => post.handle === user.username)
  const savedPosts = posts.filter((post) => savedIds.has(post.id))
  const images = tab === 'posts' ? (ownPosts.length ? ownPosts.map((post) => post.image) : ['/images/library.jpg', '/images/friends.jpg', '/images/campus.jpg']) : tab === 'saved' ? savedPosts.map((post) => post.image) : exploreItems.slice(3, 9).map((item) => item.image)

  return (
    <section className="mx-auto min-h-screen w-full max-w-4xl">
      <PageHeader title={user.username} action={<button className="grid size-10 place-items-center" onClick={onSettings} aria-label="Settings"><Settings size={23} /></button>} />
      <div className="px-4 py-7 sm:px-10">
        <div className="grid grid-cols-[90px_1fr] gap-5 sm:grid-cols-[180px_1fr] sm:gap-8">
          <div className="flex justify-center"><span className="rounded-full bg-[conic-gradient(from_220deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] p-1"><img className="size-20 rounded-full border-2 border-white object-cover sm:size-36" src={user.avatar} alt={user.name} /></span></div>
          <div>
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-xl font-normal">{user.username}</h1><button className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-semibold hover:bg-neutral-200" onClick={onSettings}>Edit profile</button><button className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-semibold hover:bg-neutral-200" onClick={() => onPreview('Story archive')}>View archive</button></div>
            <div className="mt-5 hidden gap-8 text-sm sm:flex"><span><b>{images.length}</b> posts</span><span><b>{user.followers.toLocaleString()}</b> followers</span><span><b>{user.following.toLocaleString()}</b> following</span></div>
            <div className="mt-4 text-sm"><strong>{user.name}</strong><p className="mt-1 whitespace-pre-line leading-5">{user.bio}</p><span className="text-neutral-500">{user.branch} · {user.year}</span></div>
          </div>
        </div>
        <div className="mt-6 flex justify-around border-y border-neutral-200 py-3 text-center text-sm sm:hidden"><span><b className="block">{images.length}</b><small className="text-neutral-500">posts</small></span><span><b className="block">{user.followers.toLocaleString()}</b><small className="text-neutral-500">followers</small></span><span><b className="block">{user.following.toLocaleString()}</b><small className="text-neutral-500">following</small></span></div>
        <div className="mt-7 flex gap-5 overflow-x-auto border-b border-neutral-200 pb-5 sm:mt-10"><button className="grid shrink-0 justify-items-center gap-2 text-xs"><span className="grid size-16 place-items-center rounded-full border border-neutral-300 bg-neutral-50 text-2xl">+</span>New</button>{['Campus', 'Friends', 'Projects'].map((label, index) => <button className="grid shrink-0 justify-items-center gap-2 text-xs" key={label}><img className="size-16 rounded-full border border-neutral-200 object-cover p-0.5" src={['/images/campus.jpg', '/images/friends.jpg', '/images/coding.jpg'][index]} alt="" />{label}</button>)}</div>
        <div className="flex h-12 justify-center gap-14 border-b border-neutral-200">
          {([{ id: 'posts', icon: Grid3X3, label: 'POSTS' }, { id: 'saved', icon: Bookmark, label: 'SAVED' }, { id: 'tagged', icon: UserRoundCheck, label: 'TAGGED' }] as const).map(({ id, icon: Icon, label }) => <button className={`flex items-center gap-1.5 border-t text-[11px] font-semibold tracking-wider ${tab === id ? 'border-black text-black' : 'border-transparent text-neutral-400'}`} onClick={() => setTab(id)} key={id}><Icon size={14} />{label}</button>)}
        </div>
        {images.length ? <div className="grid grid-cols-3 gap-0.5 sm:gap-1">{images.map((image, index) => <button className="group relative aspect-square overflow-hidden bg-neutral-100" key={`${image}-${index}`}><img className="size-full object-cover" src={image} alt={`${tab} item`} /><span className="absolute inset-0 hidden items-center justify-center bg-black/35 text-sm font-semibold text-white group-hover:flex">View post</span></button>)}</div> : <div className="py-20 text-center"><Bookmark className="mx-auto text-neutral-300" size={45} /><h2 className="mt-4 text-xl font-semibold">No saved posts yet</h2><p className="mt-1 text-sm text-neutral-500">Posts you save will appear here.</p></div>}
      </div>
    </section>
  )
}
