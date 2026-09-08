import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import useInfiniteScroll from "react-easy-infinite-scroll-hook";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Heart,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Play,
  Trash2,
  Users,
  Volume2,
  X,
} from "lucide-react";
import type { Reel } from "../../types/social";
import { MotionBackdrop, MotionReveal } from "../ui/Motion";
import { PageHeader } from "../ui/PageHeader";

type Props = {
  username: string;
  reels: Reel[];
  onShare: () => void;
  onPreview: (label: string) => void;
  onEdit: (id: number, caption: string) => void;
  onDelete: (id: number) => void;
};

type ReelCardProps = {
  reel: Reel;
  activeId: number | null;
  liked: boolean;
  saved: boolean;
  joined: boolean;
  own: boolean;
  menuOpen: boolean;
  onActive: (id: number) => void;
  onLike: () => void;
  onSave: () => void;
  onJoin: () => void;
  onShare: () => void;
  onComments: () => void;
  onMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function LocalVideo({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) void video.play().catch(() => undefined);
    else video.pause();
  }, [active]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

function ReelCard({
  reel,
  activeId,
  liked,
  saved,
  joined,
  own,
  menuOpen,
  onActive,
  onLike,
  onSave,
  onJoin,
  onShare,
  onComments,
  onMenu,
  onEdit,
  onDelete,
}: ReelCardProps) {
  const ref = useRef<HTMLElement>(null);
  const active = activeId === reel.id;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.62)
          onActive(reel.id);
      },
      { threshold: [0.4, 0.62, 0.85] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [onActive, reel.id]);

  const embedUrl = reel.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${reel.youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0`
    : "";

  return (
    <article
      ref={ref}
      data-testid="reel-card"
      className="flex min-h-full snap-start items-center justify-center px-3 py-4 sm:px-6 sm:py-6"
    >
      <div className="grid w-full max-w-[690px] items-end gap-4 md:grid-cols-[minmax(0,430px)_190px]">
        <MotionReveal
          className="group relative mx-auto aspect-[9/16] max-h-[calc(100dvh-118px)] w-full max-w-[430px] overflow-hidden rounded-md bg-black text-white shadow-[0_28px_80px_rgba(0,0,0,.24)] ring-1 ring-white/10"
          distance={8}
          scale={0.985}
        >
          <img
            className="absolute inset-0 size-full object-cover opacity-80"
            src={reel.image}
            alt=""
            loading="lazy"
          />
          {active && reel.youtubeId ? (
            <iframe
              className="pointer-events-none absolute inset-0 size-full border-0"
              src={embedUrl}
              title={reel.caption}
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="lazy"
            />
          ) : null}
          {reel.video ? <LocalVideo src={reel.video} active={active} /> : null}
          {!reel.video && !reel.youtubeId ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur">
                <Play size={23} fill="currentColor" />
              </span>
            </span>
          ) : null}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <span className="rounded-full bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.15em] backdrop-blur-md">
              {reel.official ? "Official TIET" : "Campus reel"}
            </span>
            <button
              className="grid size-10 place-items-center rounded-full bg-black/40 backdrop-blur-md transition duration-150 hover:bg-black/60 active:scale-90 motion-reduce:transform-none motion-reduce:transition-none"
              onClick={onMenu}
              aria-label="Reel options"
            >
              <MoreHorizontal size={19} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-12 z-20 min-w-40 overflow-hidden rounded-sm bg-white py-1 text-sm text-black shadow-xl">
                {own ? (
                  <>
                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-neutral-100" onClick={onEdit}><Pencil size={15}/>Edit caption</button>
                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50" onClick={onDelete}><Trash2 size={15}/>Delete reel</button>
                  </>
                ) : (
                  <button className="w-full px-4 py-3 text-left hover:bg-neutral-100" onClick={onMenu}>Not interested</button>
                )}
              </div>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
            <button className="flex items-center gap-2 text-left" onClick={onJoin}>
              <img className="size-9 rounded-full object-cover ring-1 ring-white/30" src={reel.avatar} alt="" />
              <strong className="text-sm">@{reel.creator}</strong>
              {reel.official ? <Check className="text-[#ff4f58]" size={15}/> : null}
              {!own ? <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${joined ? "bg-white text-black" : "bg-[#ed111c] text-white"}`}>{joined ? "Following" : "Follow"}</span> : null}
            </button>
            <p className="mt-3 text-sm leading-5 text-white/90">{reel.caption}</p>
            <p className="mt-2 truncate text-[10px] text-white/60">{reel.audio}</p>
            {reel.sourceUrl ? (
              <a className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/80 hover:text-white" href={reel.sourceUrl} target="_blank" rel="noreferrer">
                <Volume2 size={13}/> Watch with sound <ArrowUpRight size={12}/>
              </a>
            ) : null}
          </div>
          <div className="absolute bottom-5 right-3 grid gap-3">
            <button className="grid justify-items-center gap-1 text-[9px]" onClick={onLike} aria-label={liked ? "Unlike reel" : "Like reel"}><span className={`grid size-11 place-items-center rounded-full backdrop-blur-md transition duration-150 active:scale-90 motion-reduce:transform-none motion-reduce:transition-none ${liked ? "bg-[#ed111c]" : "bg-black/45"}`}><Heart size={20} fill={liked ? "currentColor" : "none"}/></span>{reel.likes}</button>
            <button className="grid justify-items-center gap-1 text-[9px]" onClick={onComments} aria-label="Open comments"><span className="grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur-md transition duration-150 active:scale-90 motion-reduce:transform-none motion-reduce:transition-none"><MessageCircle size={20}/></span>{reel.comments}</button>
            <button className="grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur-md transition duration-150 active:scale-90 motion-reduce:transform-none motion-reduce:transition-none" onClick={onSave} aria-label={saved ? "Remove saved reel" : "Save reel"}><Bookmark size={20} fill={saved ? "currentColor" : "none"}/></button>
            <button className="grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur-md transition duration-150 active:scale-90 motion-reduce:transform-none motion-reduce:transition-none" onClick={onShare} aria-label="Share reel"><ArrowUpRight size={20}/></button>
          </div>
        </MotionReveal>
        <aside className="hidden pb-4 md:block">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#ed111c]">Now playing</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-.03em]">Campus, in motion.</h2>
          <p className="mt-3 text-xs leading-5 text-neutral-500">Scroll for the next moment. Official institute stories and student uploads live together here.</p>
          <div className="mt-7 h-px bg-black/10 dark:bg-white/10"/>
          <p className="mt-5 text-[10px] text-neutral-500">{reel.official ? "Published by TIET" : "Shared by the campus community"}</p>
        </aside>
      </div>
    </article>
  );
}

export function ReelsView({
  username,
  reels,
  onShare,
  onPreview,
  onEdit,
  onDelete,
}: Props) {
  const orderedReels = useMemo(() => {
    const own = reels.filter((reel) => reel.creator === username);
    const official = reels.filter((reel) => reel.creator !== username && reel.official);
    const community = reels.filter((reel) => reel.creator !== username && !reel.official);
    return [...own, ...official, ...community];
  }, [reels, username]);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(5, orderedReels.length));
  const [activeId, setActiveId] = useState<number | null>(orderedReels[0]?.id ?? null);
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const [joined, setJoined] = useState<Set<number>>(() => new Set());
  const [menuId, setMenuId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [caption, setCaption] = useState("");
  const visibleReels = useMemo(() => orderedReels.slice(0, visibleCount), [orderedReels, visibleCount]);
  const hasMore = visibleCount < orderedReels.length;

  useEffect(() => {
    setVisibleCount((current) => Math.min(Math.max(current, 5), orderedReels.length));
  }, [orderedReels.length]);

  const loadMore = useCallback(async () => {
    setVisibleCount((current) => Math.min(current + 4, orderedReels.length));
  }, [orderedReels.length]);

  const scrollRef = useInfiniteScroll<HTMLDivElement>({
    next: loadMore,
    rowCount: visibleReels.length,
    hasMore: { down: hasMore },
    scrollThreshold: "320px",
  });

  const toggle = (setter: Dispatch<SetStateAction<Set<number>>>, id: number) =>
    setter((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section className="mx-auto min-h-screen w-full max-w-6xl">
      <PageHeader title="Reels" eyebrow="TIET in motion" />
      <div
        ref={scrollRef}
        data-testid="reels-feed"
        className="h-[calc(100dvh-76px)] snap-y snap-mandatory overflow-y-auto overscroll-contain bg-[#efefec] [scrollbar-width:none] dark:bg-[#080809] [&::-webkit-scrollbar]:hidden"
      >
        {visibleReels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            activeId={activeId}
            liked={liked.has(reel.id)}
            saved={saved.has(reel.id)}
            joined={joined.has(reel.id)}
            own={reel.creator === username}
            menuOpen={menuId === reel.id}
            onActive={setActiveId}
            onLike={() => toggle(setLiked, reel.id)}
            onSave={() => toggle(setSaved, reel.id)}
            onJoin={() => toggle(setJoined, reel.id)}
            onShare={onShare}
            onComments={() => onPreview(`${reel.comments} comments`)}
            onMenu={() => {
              if (reel.creator === username) setMenuId((current) => current === reel.id ? null : reel.id);
              else {
                setMenuId(null);
                onPreview("Reel preferences opened");
              }
            }}
            onEdit={() => {
              setMenuId(null);
              setEditing(reel);
              setCaption(reel.caption);
            }}
            onDelete={() => {
              setMenuId(null);
              onDelete(reel.id);
            }}
          />
        ))}
        {hasMore ? (
          <div className="flex h-20 items-center justify-center gap-2 text-xs text-neutral-500" role="status">
            <LoaderCircle className="animate-spin motion-reduce:animate-none" size={16}/>
            Loading more campus reels
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-xs text-neutral-500">You’re caught up with TIET.</div>
        )}
      </div>
      {editing ? (
        <MotionBackdrop className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md" onMouseDown={() => setEditing(null)}>
          <MotionReveal className="w-full max-w-md rounded-md bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] dark:bg-[#111113]" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#ed111c]">Your reel</p><h2 className="mt-1 text-xl font-semibold">Edit caption</h2></div><button className="grid size-10 place-items-center rounded-full transition active:scale-90 motion-reduce:transform-none motion-reduce:transition-none" onClick={() => setEditing(null)} aria-label="Close editor"><X/></button></div>
            <textarea className="mt-5 min-h-32 w-full resize-none border-y border-black/10 bg-transparent py-4 text-sm leading-6 outline-none dark:border-white/10" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={1200}/>
            <button className="mt-5 w-full rounded-sm bg-[#ed111c] py-3 text-sm font-semibold text-white transition active:scale-[.98] motion-reduce:transform-none motion-reduce:transition-none" onClick={() => {onEdit(editing.id, caption.trim());setEditing(null)}}>Save caption</button>
          </MotionReveal>
        </MotionBackdrop>
      ) : null}
    </section>
  );
}
