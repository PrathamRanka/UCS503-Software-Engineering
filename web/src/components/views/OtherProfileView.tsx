import { useState } from 'react'
import { Grid3X3, MoreHorizontal, UserRoundCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { exploreItems, people } from '../../data/mockData'
import { SocialListModal } from '../modals/SocialListModal'
import { Avatar } from '../ui/Avatar'
import { PageHeader } from '../ui/PageHeader'
import { StatePanel } from '../ui/StatePanel'

type OtherProfileViewProps = { following: Set<string>; onFollow: (handle: string) => void; onAction: (message: string) => void }

export function OtherProfileView({ following, onFollow, onAction }: OtherProfileViewProps) {
  const { username } = useParams()
  const navigate = useNavigate()
  const person = people.find((item) => item.username === username)
  const [list, setList] = useState<'Followers' | 'Following' | null>(null)
  const [menu, setMenu] = useState(false)
  if (!person) return <StatePanel type="error" title="User not found" message="This profile does not exist in the demo data." actionLabel="Explore people" onAction={() => navigate('/search')} />
  const handle = `@${person.username}`
  const isFollowing = following.has(handle)
  return <section className="mx-auto min-h-screen w-full max-w-4xl"><PageHeader title={person.username} action={<button onClick={() => setMenu((current) => !current)}><MoreHorizontal /></button>} /><div className="px-4 py-7 sm:px-10"><div className="grid grid-cols-[90px_1fr] gap-5 sm:grid-cols-[180px_1fr]"><div className="flex justify-center"><Avatar src={person.avatar} size="lg" /></div><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-xl">{person.username}</h1><button className={`rounded-lg px-5 py-2 text-xs font-semibold ${isFollowing ? 'bg-neutral-100' : 'bg-blue-500 text-white'}`} onClick={() => onFollow(handle)}>{isFollowing ? 'Following' : 'Follow'}</button><button className="rounded-lg bg-neutral-100 px-5 py-2 text-xs font-semibold" onClick={() => navigate('/messages')}>Message</button></div><div className="mt-5 flex gap-8 text-sm"><span><b>18</b> posts</span><button onClick={() => setList('Followers')}><b>{person.followers.toLocaleString()}</b> followers</button><button onClick={() => setList('Following')}><b>{person.following.toLocaleString()}</b> following</button></div><div className="mt-4 text-sm"><strong>{person.name}</strong><p className="mt-1">{person.bio}</p></div></div></div><div className="mt-10 flex h-12 items-center justify-center gap-2 border-t border-neutral-200 text-xs font-semibold"><Grid3X3 size={15} />POSTS</div><div className="grid grid-cols-3 gap-0.5 sm:gap-1">{exploreItems.slice(0, 9).map((item) => <button className="group relative aspect-square overflow-hidden" key={item.id}><img className="size-full object-cover" src={item.image} alt="Profile post" /><span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex"><UserRoundCheck /></span></button>)}</div></div>{menu ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={() => setMenu(false)}><section className="w-full max-w-sm overflow-hidden rounded-xl bg-white text-center" onMouseDown={(event) => event.stopPropagation()}>{['Report', 'Block', 'Mute', isFollowing ? 'Unfollow' : 'Follow'].map((action) => <button className={`w-full border-b border-neutral-100 p-4 text-sm font-semibold ${action === 'Report' || action === 'Block' ? 'text-red-500' : ''}`} onClick={() => { action === 'Follow' || action === 'Unfollow' ? onFollow(handle) : onAction(`${person.username} ${action.toLowerCase()}ed`); setMenu(false) }} key={action}>{action}</button>)}<button className="w-full p-4 text-sm" onClick={() => setMenu(false)}>Cancel</button></section></div> : null}{list ? <SocialListModal title={list} following={following} onToggleFollow={onFollow} onClose={() => setList(null)} onOpenProfile={(value) => { setList(null); navigate(`/profile/${value}`) }} /> : null}</section>
}
