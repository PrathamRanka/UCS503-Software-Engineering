import { useState } from 'react'
import { FeedHeader } from './components/feed/FeedHeader'
import { PostCard } from './components/feed/PostCard'
import { Stories } from './components/feed/Stories'
import { MobileNavigation } from './components/layout/MobileNavigation'
import { RightRail } from './components/layout/RightRail'
import { Sidebar } from './components/layout/Sidebar'
import { ComposerModal } from './components/modals/ComposerModal'
import { StoryViewer } from './components/modals/StoryViewer'
import { posts, stories } from './data/mockData'

function App() {
  const [activeNav, setActiveNav] = useState('Home')
  const [liked, setLiked] = useState<Set<number>>(() => new Set([1]))
  const [saved, setSaved] = useState<Set<number>>(() => new Set())
  const [following, setFollowing] = useState<Set<string>>(() => new Set())
  const [composerOpen, setComposerOpen] = useState(false)
  const [storyIndex, setStoryIndex] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const toggleSetItem = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, item: T) => {
    setter((current) => {
      const next = new Set(current)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const navigate = (label: string) => {
    setActiveNav(label)
    if (label !== 'Home') flash(`${label} preview coming next`)
  }

  const savePost = (id: number) => {
    const willSave = !saved.has(id)
    toggleSetItem(setSaved, id)
    flash(willSave ? 'Saved to your collection' : 'Removed from saved')
  }

  const sharePost = () => {
    setComposerOpen(false)
    flash('Post shared with campus!')
  }

  const showPreview = (label: string) => flash(`${label} preview coming next`)

  return (
    <div className="min-h-screen bg-white text-black lg:grid lg:grid-cols-[minmax(470px,630px)] lg:justify-center lg:pl-[74px] xl:grid-cols-[minmax(470px,630px)_320px] xl:gap-[30px] xl:pl-[245px]">
      <Sidebar activeNav={activeNav} onNavigate={navigate} onCreate={() => setComposerOpen(true)} />

      <main className="mx-auto w-full min-w-0 max-w-[630px] pb-[60px] pt-[60px] lg:pt-[30px]" id="top">
        <FeedHeader onPreview={showPreview} />
        <Stories stories={stories} onSelect={setStoryIndex} onCreate={() => setComposerOpen(true)} />
        <div className="mx-auto grid w-full max-w-[470px] gap-0 sm:gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={liked.has(post.id)}
              isSaved={saved.has(post.id)}
              onLike={() => toggleSetItem(setLiked, post.id)}
              onSave={() => savePost(post.id)}
              onShare={() => flash('Share link copied')}
            />
          ))}
        </div>
      </main>

      <RightRail
        following={following}
        onFollow={(handle) => toggleSetItem(setFollowing, handle)}
      />
      <MobileNavigation onCreate={() => setComposerOpen(true)} onPreview={showPreview} />

      {composerOpen ? <ComposerModal onClose={() => setComposerOpen(false)} onShare={sharePost} /> : null}
      {storyIndex !== null ? (
        <StoryViewer
          story={stories[storyIndex]}
          onClose={() => setStoryIndex(null)}
          onNext={() => setStoryIndex((current) => current !== null && current < stories.length - 1 ? current + 1 : null)}
        />
      ) : null}
      {toast ? <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-md bg-neutral-800 px-[18px] py-3 text-[13px] text-white shadow-xl lg:bottom-6">{toast}</div> : null}
    </div>
  )
}

export default App
