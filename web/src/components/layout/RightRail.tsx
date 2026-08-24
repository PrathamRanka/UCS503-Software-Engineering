import { suggestions } from '../../data/mockData'
import type { UserProfile } from '../../types/social'
import { Avatar } from '../ui/Avatar'

type RightRailProps = {
  following: Set<string>
  user: UserProfile
  onFollow: (handle: string) => void
  onPreview: (label: string) => void
}

const actionClass = 'bg-transparent p-0 text-xs font-semibold text-blue-500'

export function RightRail({ following, user, onFollow, onPreview }: RightRailProps) {
  return (
    <aside className="hidden w-80 pt-[50px] xl:block">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Avatar src={user.avatar} size="lg" />
        <div className="flex min-w-0 flex-col"><strong className="truncate text-sm">{user.username}</strong><span className="text-sm text-neutral-500">{user.name}</span></div>
        <button className={actionClass} onClick={() => onPreview('Account switcher')}>Switch</button>
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between"><h2 className="m-0 text-sm font-semibold text-neutral-500">Suggested for you</h2><button className="bg-transparent p-0 text-xs font-semibold" onClick={() => onPreview('Suggestions')}>See All</button></div>
        <div className="mt-4 grid gap-3.5">
          {suggestions.map(({ name, handle, image }) => (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3" key={handle}>
              <Avatar src={image} />
              <div className="flex min-w-0 flex-col"><strong className="truncate text-sm">{handle.slice(1)}</strong><span className="text-sm text-neutral-500">{name}</span><small className="mt-0.5 text-[11px] text-neutral-500">Suggested for you</small></div>
              <button className={following.has(handle) ? 'bg-transparent p-0 text-xs font-semibold text-neutral-500' : actionClass} onClick={() => onFollow(handle)}>{following.has(handle) ? 'Following' : 'Follow'}</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 text-[11px] leading-4 text-neutral-300">About · Help · Press · API · Jobs · Privacy · Terms<br />Locations · Language · Meta Verified<br /><br />© 2026 THAPAR TALKS</footer>
    </aside>
  )
}
