import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { AuthScreen } from './components/auth/AuthScreen'
import { FeedHeader } from './components/feed/FeedHeader'
import { PostCard } from './components/feed/PostCard'
import { Stories } from './components/feed/Stories'
import { MobileNavigation } from './components/layout/MobileNavigation'
import { RightRail } from './components/layout/RightRail'
import { Sidebar } from './components/layout/Sidebar'
import { ComposerModal } from './components/modals/ComposerModal'
import { StoryViewer } from './components/modals/StoryViewer'
import { ExploreView } from './components/views/ExploreView'
import { MessagesView } from './components/views/MessagesView'
import { NotificationsView } from './components/views/NotificationsView'
import { ProfileView } from './components/views/ProfileView'
import { ReelsView } from './components/views/ReelsView'
import { SearchView } from './components/views/SearchView'
import { SettingsView } from './components/views/SettingsView'
import { posts as initialPosts, stories } from './data/mockData'
import type { NewPostInput, UserProfile } from './types/social'

const SESSION_KEY = 'thapar-talks-session-v1'

function loadSession(): UserProfile | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) as UserProfile : null
  } catch {
    return null
  }
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(loadSession)
  const [activeNav, setActiveNav] = useState('Home')
  const [feedPosts, setFeedPosts] = useState(initialPosts)
  const [liked, setLiked] = useState<Set<number>>(() => new Set([1]))
  const [saved, setSaved] = useState<Set<number>>(() => new Set())
  const [following, setFollowing] = useState<Set<string>>(() => new Set())
  const [composerOpen, setComposerOpen] = useState(false)
  const [storyIndex, setStoryIndex] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const flash = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(''), 2200)
  }, [])

  const authenticate = (profile: UserProfile) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
    setUser(profile)
    setActiveNav('Home')
  }

  const updateUser = (profile: UserProfile) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
    setUser(profile)
    flash('Profile updated')
  }

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setActiveNav('Home')
  }

  const toggleSetItem = <T,>(setter: Dispatch<SetStateAction<Set<T>>>, item: T) => {
    setter((current) => {
      const next = new Set(current)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const navigate = (label: string) => {
    setActiveNav(label === 'More' ? 'Settings' : label)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const savePost = (id: number) => {
    const willSave = !saved.has(id)
    toggleSetItem(setSaved, id)
    flash(willSave ? 'Saved to your collection' : 'Removed from saved')
  }

  const createPost = (input: NewPostInput) => {
    if (!user) return
    const id = Date.now()
    setFeedPosts((current) => [{ id, author: user.name, handle: user.username, avatar: user.avatar, image: input.image, place: 'TIET Campus', time: 'Now', caption: input.caption, likes: 0, comments: 0, tags: ['#ThaparTalks'] }, ...current])
    setComposerOpen(false)
    setActiveNav('Home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    flash('Your post is now live')
  }

  const sharePostLink = async (id?: number) => {
    try {
      await navigator.clipboard.writeText(id ? `${window.location.origin}/post/${id}` : window.location.href)
      flash('Link copied to clipboard')
    } catch {
      flash('Ready to share')
    }
  }

  const closeStory = useCallback(() => setStoryIndex(null), [])
  const nextStory = useCallback(() => setStoryIndex((current) => current !== null && current < stories.length - 1 ? current + 1 : null), [])
  const previousStory = useCallback(() => setStoryIndex((current) => current !== null && current > 1 ? current - 1 : current), [])
  const userStories = useMemo(() => user ? [{ ...stories[0], image: user.avatar }, ...stories.slice(1)] : stories, [user])

  if (!user) return <AuthScreen onAuthenticated={authenticate} />

  const home = (
    <div className="mx-auto grid min-h-screen w-full max-w-[980px] lg:grid-cols-[minmax(470px,630px)] xl:grid-cols-[minmax(470px,630px)_320px] xl:gap-[30px]">
      <main className="mx-auto w-full min-w-0 max-w-[630px] pb-[60px] pt-[60px] lg:pt-[30px]" id="top">
        <FeedHeader onPreview={navigate} />
        <Stories stories={userStories} onSelect={setStoryIndex} onCreate={() => setComposerOpen(true)} />
        <div className="mx-auto grid w-full max-w-[470px] gap-0 sm:gap-3">
          {feedPosts.map((post) => <PostCard key={post.id} post={post} isLiked={liked.has(post.id)} isSaved={saved.has(post.id)} onLike={() => toggleSetItem(setLiked, post.id)} onSave={() => savePost(post.id)} onShare={() => void sharePostLink(post.id)} />)}
        </div>
      </main>
      <RightRail user={user} following={following} onFollow={(handle) => toggleSetItem(setFollowing, handle)} onPreview={(label) => flash(`${label} preview opened`)} />
    </div>
  )

  const views: Record<string, React.ReactNode> = {
    Home: home,
    Search: <SearchView following={following} onFollow={(handle) => toggleSetItem(setFollowing, handle)} />,
    Explore: <ExploreView />,
    Reels: <ReelsView username={user.username} onShare={() => void sharePostLink()} onPreview={(label) => flash(`${label} opened`)} />,
    Messages: <MessagesView username={user.username} onPreview={(label) => flash(`${label} opened`)} />,
    Notifications: <NotificationsView />,
    Profile: <ProfileView user={user} posts={feedPosts} savedIds={saved} onSettings={() => navigate('Settings')} onPreview={(label) => flash(`${label} opened`)} />,
    Settings: <SettingsView user={user} onUpdate={updateUser} onLogout={logout} />,
  }

  return (
    <div className="min-h-screen bg-white text-black lg:pl-[74px] xl:pl-[245px]">
      <Sidebar activeNav={activeNav} user={user} onNavigate={navigate} onCreate={() => setComposerOpen(true)} />
      {views[activeNav] ?? home}
      <MobileNavigation activeNav={activeNav} user={user} onCreate={() => setComposerOpen(true)} onNavigate={navigate} />

      {composerOpen ? <ComposerModal onClose={() => setComposerOpen(false)} onShare={createPost} /> : null}
      {storyIndex !== null ? <StoryViewer story={userStories[storyIndex]} index={storyIndex - 1} total={userStories.length - 1} onClose={closeStory} onNext={nextStory} onPrevious={previousStory} /> : null}
      <div className={`fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-md bg-neutral-800 px-[18px] py-3 text-[13px] text-white shadow-xl transition duration-200 ease-out motion-reduce:transition-none lg:bottom-6 ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}

export default App
