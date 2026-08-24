import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthScreen } from "./components/auth/AuthScreen";
import { PasswordResetScreen } from "./components/auth/PasswordResetScreen";
import { FeedHeader } from "./components/feed/FeedHeader";
import { PostCard } from "./components/feed/PostCard";
import { Stories } from "./components/feed/Stories";
import { MobileNavigation } from "./components/layout/MobileNavigation";
import { RightRail } from "./components/layout/RightRail";
import { Sidebar } from "./components/layout/Sidebar";
import { ComposerModal } from "./components/modals/ComposerModal";
import { SocialListModal } from "./components/modals/SocialListModal";
import { StoryManagerModal } from "./components/modals/StoryManagerModal";
import { StoryViewer } from "./components/modals/StoryViewer";
import {
  posts as initialPosts,
  reels as initialReels,
  stories as initialStories,
} from "./data/mockData";
import type { ContentKind, NewContentInput, UserProfile } from "./types/social";
import { StatePanel } from "./components/ui/StatePanel";

const ExploreView = lazy(() =>
  import("./components/views/ExploreView").then((module) => ({
    default: module.ExploreView,
  })),
);
const SearchView = lazy(() =>
  import("./components/views/SearchView").then((module) => ({
    default: module.SearchView,
  })),
);
const ReelsView = lazy(() =>
  import("./components/views/ReelsView").then((module) => ({
    default: module.ReelsView,
  })),
);
const MessagesView = lazy(() =>
  import("./components/views/MessagesView").then((module) => ({
    default: module.MessagesView,
  })),
);
const NotificationsView = lazy(() =>
  import("./components/views/NotificationsView").then((module) => ({
    default: module.NotificationsView,
  })),
);
const ProfileView = lazy(() =>
  import("./components/views/ProfileView").then((module) => ({
    default: module.ProfileView,
  })),
);
const OtherProfileView = lazy(() =>
  import("./components/views/OtherProfileView").then((module) => ({
    default: module.OtherProfileView,
  })),
);
const SettingsView = lazy(() =>
  import("./components/views/SettingsView").then((module) => ({
    default: module.SettingsView,
  })),
);
const PostDetailView = lazy(() =>
  import("./components/views/PostDetailView").then((module) => ({
    default: module.PostDetailView,
  })),
);
const ArchivedPostsView = lazy(() =>
  import("./components/views/ArchivedPostsView").then((module) => ({
    default: module.ArchivedPostsView,
  })),
);

const SESSION_KEY = "thapar-talks-session-v1";
const THEME_KEY = "thapar-talks-theme-v1";
const routeMap: Record<string, string> = {
  Home: "/",
  Search: "/search",
  Explore: "/explore",
  Reels: "/reels",
  Messages: "/messages",
  Notifications: "/notifications",
  Profile: "/profile",
  Settings: "/settings",
  More: "/settings",
};

function loadSession(): UserProfile | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  } catch {
    return null;
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(loadSession);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light",
  );
  const [feedPosts, setFeedPosts] = useState(initialPosts);
  const [storyItems, setStoryItems] = useState(initialStories);
  const [reelItems, setReelItems] = useState(initialReels);
  const [liked, setLiked] = useState<Set<number>>(() => new Set([1]));
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const [archived, setArchived] = useState<Set<number>>(() => new Set());
  const [following, setFollowing] = useState<Set<string>>(() => new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerKind, setComposerKind] = useState<ContentKind>("post");
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [storyManagerOpen, setStoryManagerOpen] = useState(false);
  const [socialList, setSocialList] = useState<
    "Followers" | "Following" | null
  >(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  const flash = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);
  const toggleSetItem = <T,>(
    setter: Dispatch<SetStateAction<Set<T>>>,
    item: T,
  ) =>
    setter((current) => {
      const next = new Set(current);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  const activeNav = location.pathname.startsWith("/profile")
    ? "Profile"
    : location.pathname.startsWith("/settings") ||
        location.pathname.startsWith("/archive")
      ? "Settings"
      : (Object.entries(routeMap).find(
          ([, path]) => path !== "/" && location.pathname.startsWith(path),
        )?.[0] ?? "Home");
  const go = (label: string) => {
    navigate(routeMap[label] ?? "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openComposer = (kind: ContentKind) => {
    setComposerKind(kind);
    setComposerOpen(true);
  };

  const authenticate = (profile: UserProfile) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
    navigate("/");
  };
  const updateUser = (profile: UserProfile) => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
    flash("Profile updated");
  };
  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
    navigate("/");
  };
  const updatePost = (id: number, caption: string) => {
    setFeedPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, caption } : post)),
    );
    flash("Post updated");
  };
  const deletePost = (id: number) => {
    setFeedPosts((current) => current.filter((post) => post.id !== id));
    setArchived((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    flash("Post deleted");
  };
  const archivePost = (id: number) => {
    toggleSetItem(setArchived, id);
  };
  const updateReel = (id: number, caption: string) => {
    setReelItems((current) =>
      current.map((reel) => (reel.id === id ? { ...reel, caption } : reel)),
    );
    flash("Reel updated");
  };
  const deleteReel = (id: number) => {
    setReelItems((current) => current.filter((reel) => reel.id !== id));
    flash("Reel deleted");
  };
  const savePost = (id: number) => {
    const willSave = !saved.has(id);
    toggleSetItem(setSaved, id);
    flash(willSave ? "Saved to your collection" : "Removed from saved");
  };
  const toggleFollow = (handle: string) => toggleSetItem(setFollowing, handle);

  const createContent = (input: NewContentInput) => {
    if (!user) return;
    const id = Date.now();
    if (input.kind === "post")
      setFeedPosts((current) => [
        {
          id,
          author: user.name,
          handle: user.username,
          avatar: user.avatar,
          image: input.image,
          place: "TIET Campus",
          time: "Now",
          caption: input.caption,
          likes: 0,
          comments: 0,
          tags: ["#ThaparTalks"],
        },
        ...current,
      ]);
    if (input.kind === "story")
      setStoryItems((current) => [
        current[0],
        { name: user.username, image: input.image, own: true },
        ...current.slice(1),
      ]);
    if (input.kind === "reel")
      setReelItems((current) => [
        {
          id,
          creator: user.username,
          avatar: user.avatar,
          image:
            input.mediaType === "image" ? input.image : "/images/event.webp",
          video: input.mediaType === "video" ? input.image : undefined,
          caption: input.caption,
          likes: "0",
          comments: "0",
          audio: "Original audio",
        },
        ...current,
      ]);
    setComposerOpen(false);
    navigate(input.kind === "reel" ? "/reels" : "/");
    flash(`${input.kind[0].toUpperCase()}${input.kind.slice(1)} shared`);
  };

  const shareLink = async (id?: number) => {
    try {
      await navigator.clipboard.writeText(
        id ? `${window.location.origin}/post/${id}` : window.location.href,
      );
      flash("Link copied to clipboard");
    } catch {
      flash("Ready to share");
    }
  };
  const closeStory = useCallback(() => setStoryIndex(null), []);
  const nextStory = useCallback(
    () =>
      setStoryIndex((current) =>
        current !== null && current < storyItems.length - 1
          ? current + 1
          : null,
      ),
    [storyItems.length],
  );
  const previousStory = useCallback(
    () =>
      setStoryIndex((current) =>
        current !== null && current > 1 ? current - 1 : current,
      ),
    [],
  );
  const userStories = useMemo(
    () =>
      user
        ? [{ ...storyItems[0], image: user.avatar }, ...storyItems.slice(1)]
        : storyItems,
    [storyItems, user],
  );
  const highlights = storyItems.filter(
    (story) => story.own && story.highlighted,
  );
  const visiblePosts = feedPosts.filter((post) => !archived.has(post.id));

  if (!user)
    return (
      <Routes>
        <Route
          path="/reset-password"
          element={
            <PasswordResetScreen
              theme={theme}
              onToggleTheme={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
            />
          }
        />
        <Route
          path="*"
          element={
            <AuthScreen
              theme={theme}
              onToggleTheme={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
              onAuthenticated={authenticate}
            />
          }
        />
      </Routes>
    );
  if (location.pathname === "/reset-password")
    return (
      <PasswordResetScreen
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
      />
    );

  const home = (
    <div className="mx-auto grid min-h-screen w-full max-w-[980px] lg:grid-cols-[minmax(470px,630px)] xl:grid-cols-[minmax(470px,630px)_320px] xl:gap-[30px]">
      <main className="mx-auto w-full min-w-0 max-w-[630px] pb-[60px] pt-[60px] lg:pt-[30px]">
        <FeedHeader
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
          onPreview={go}
        />
        <Stories
          stories={userStories}
          onSelect={setStoryIndex}
          onCreate={() => openComposer("story")}
        />
        <div className="mx-auto grid w-full max-w-[470px] gap-0 sm:gap-3">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUsername={user.username}
              archived={archived.has(post.id)}
              isLiked={liked.has(post.id)}
              isSaved={saved.has(post.id)}
              onLike={() => toggleSetItem(setLiked, post.id)}
              onSave={() => savePost(post.id)}
              onShare={() => void shareLink(post.id)}
              onOpen={() => navigate(`/post/${post.id}`)}
              onOpenProfile={() =>
                navigate(
                  post.handle === user.username
                    ? "/profile"
                    : `/profile/${post.handle}`,
                )
              }
              onEdit={(caption) => updatePost(post.id, caption)}
              onArchive={() => {
                archivePost(post.id);
                flash(
                  archived.has(post.id) ? "Post restored" : "Post archived",
                );
              }}
              onDelete={() => deletePost(post.id)}
              onAction={flash}
              onUnfollow={() => toggleFollow(`@${post.handle}`)}
            />
          ))}
        </div>
      </main>
      <RightRail
        user={user}
        following={following}
        onFollow={toggleFollow}
        onPreview={(label) => flash(`${label} preview opened`)}
      />
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white font-sans text-black dark:bg-black dark:text-white lg:pl-[74px] xl:pl-[245px]">
      <Sidebar
        activeNav={activeNav}
        user={user}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
        onNavigate={go}
        onCreate={() => openComposer("post")}
      />
      <Suspense
        fallback={<StatePanel type="loading" title="Loading page..." />}
      >
        <Routes>
          <Route path="/" element={home} />
          <Route
            path="/search"
            element={
              <SearchView following={following} onFollow={toggleFollow} />
            }
          />
          <Route path="/explore" element={<ExploreView />} />
          <Route
            path="/reels"
            element={
              <ReelsView
                username={user.username}
                reels={reelItems}
                onShare={() => void shareLink()}
                onPreview={flash}
                onEdit={updateReel}
                onDelete={deleteReel}
              />
            }
          />
          <Route
            path="/messages"
            element={
              <MessagesView username={user.username} onPreview={flash} />
            }
          />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route
            path="/profile"
            element={
              <ProfileView
                user={user}
                posts={visiblePosts}
                savedIds={saved}
                highlights={highlights}
                onSettings={() => navigate("/settings")}
                onPreview={() => navigate("/archive")}
                onFollowers={() => setSocialList("Followers")}
                onFollowing={() => setSocialList("Following")}
                onManageStories={() => setStoryManagerOpen(true)}
              />
            }
          />
          <Route
            path="/profile/:username"
            element={
              <OtherProfileView
                following={following}
                onFollow={toggleFollow}
                onAction={flash}
              />
            }
          />
          <Route
            path="/post/:postId"
            element={
              <PostDetailView
                user={user}
                posts={feedPosts}
                liked={liked}
                saved={saved}
                archived={archived}
                onLike={(id) => toggleSetItem(setLiked, id)}
                onSave={savePost}
                onUpdate={updatePost}
                onDelete={deletePost}
                onArchive={archivePost}
                onAction={flash}
              />
            }
          />
          <Route
            path="/archive"
            element={
              <ArchivedPostsView
                posts={feedPosts.filter((post) => archived.has(post.id))}
                onRestore={archivePost}
                onDelete={deletePost}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsView
                user={user}
                theme={theme}
                onToggleTheme={() =>
                  setTheme((current) =>
                    current === "light" ? "dark" : "light",
                  )
                }
                onUpdate={updateUser}
                onLogout={logout}
                onPasswordReset={() => navigate("/reset-password")}
                onDeleteAccount={logout}
              />
            }
          />
          <Route
            path="*"
            element={
              <StatePanel
                type="error"
                title="Page not found"
                message="This page does not exist in Thapar Talks."
                actionLabel="Return home"
                onAction={() => navigate("/")}
              />
            }
          />
        </Routes>
      </Suspense>
      <MobileNavigation
        activeNav={activeNav}
        user={user}
        onCreate={() => openComposer("post")}
        onNavigate={go}
      />
      {composerOpen ? (
        <ComposerModal
          initialKind={composerKind}
          onClose={() => setComposerOpen(false)}
          onShare={createContent}
        />
      ) : null}
      {storyIndex !== null ? (
        <StoryViewer
          story={userStories[storyIndex]}
          index={storyIndex - 1}
          total={userStories.length - 1}
          onClose={closeStory}
          onNext={nextStory}
          onPrevious={previousStory}
        />
      ) : null}
      {storyManagerOpen ? (
        <StoryManagerModal
          stories={storyItems}
          onCreate={() => {
            setStoryManagerOpen(false);
            openComposer("story");
          }}
          onDelete={(index) =>
            setStoryItems((current) =>
              current.filter((_, itemIndex) => itemIndex !== index),
            )
          }
          onEdit={(index, image) =>
            setStoryItems((current) =>
              current.map((story, itemIndex) =>
                itemIndex === index ? { ...story, image } : story,
              ),
            )
          }
          onToggleHighlight={(index) =>
            setStoryItems((current) =>
              current.map((story, itemIndex) =>
                itemIndex === index
                  ? { ...story, highlighted: !story.highlighted }
                  : story,
              ),
            )
          }
          onClose={() => setStoryManagerOpen(false)}
        />
      ) : null}
      {socialList ? (
        <SocialListModal
          title={socialList}
          following={following}
          onToggleFollow={toggleFollow}
          onClose={() => setSocialList(null)}
          onOpenProfile={(username) => {
            setSocialList(null);
            navigate(`/profile/${username}`);
          }}
        />
      ) : null}
      <div
        className={`fixed bottom-16 left-1/2 z-[60] -translate-x-1/2 rounded-md bg-neutral-800 px-[18px] py-3 text-[13px] text-white shadow-xl transition duration-200 ease-out motion-reduce:transition-none lg:bottom-6 ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}

export default App;
