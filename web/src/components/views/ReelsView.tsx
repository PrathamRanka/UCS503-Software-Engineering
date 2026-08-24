import { FormEvent, useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Send,
  Volume2,
  X,
} from "lucide-react";
import type { Reel } from "../../types/social";
import { Avatar } from "../ui/Avatar";
import { PageHeader } from "../ui/PageHeader";

type ReelsViewProps = {
  username: string;
  reels: Reel[];
  onShare: () => void;
  onPreview: (label: string) => void;
  onEdit: (id: number, caption: string) => void;
  onDelete: (id: number) => void;
};

export function ReelsView({
  username,
  reels,
  onShare,
  onPreview,
  onEdit,
  onDelete,
}: ReelsViewProps) {
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const [following, setFollowing] = useState<Set<string>>(() => new Set());
  const [commenting, setCommenting] = useState<Reel | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [options, setOptions] = useState<Reel | null>(null);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const toggle = <T,>(
    setter: React.Dispatch<React.SetStateAction<Set<T>>>,
    item: T,
  ) =>
    setter((current) => {
      const next = new Set(current);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  const submitComment = (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments((current) => [...current, comment.trim()]);
    setComment("");
  };

  return (
    <section className="mx-auto h-screen w-full max-w-3xl overflow-hidden">
      <PageHeader title="Reels" />
      <div className="h-[calc(100vh-60px)] snap-y snap-mandatory overflow-y-auto bg-neutral-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reels.map((reel) => (
          <article
            className="relative mx-auto flex h-full max-w-[470px] snap-start items-center bg-black text-white"
            key={reel.id}
          >
            {reel.video ? (
              <video
                className="h-full max-h-[820px] w-full object-cover"
                src={reel.video}
                poster={reel.image}
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                className="h-full max-h-[820px] w-full object-cover"
                src={reel.image}
                alt={reel.caption}
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/15" />
            <button
              className="absolute right-3 top-4 grid size-10 place-items-center rounded-full bg-black/20"
              onClick={() => onPreview("Sound controls")}
              aria-label="Toggle sound"
            >
              <Volume2 size={21} />
            </button>
            <div className="absolute bottom-5 left-4 right-16">
              <div className="flex items-center gap-2.5">
                <Avatar src={reel.avatar} size="sm" />
                <strong className="text-sm">{reel.creator}</strong>
                <button
                  className={`rounded-lg border px-3 py-1 text-xs font-semibold ${following.has(reel.creator) ? "border-white/40 bg-white/15" : "border-white"}`}
                  onClick={() => toggle(setFollowing, reel.creator)}
                >
                  {following.has(reel.creator) ? "Following" : "Follow"}
                </button>
              </div>
              <p className="mb-3 mt-3 text-sm leading-5">{reel.caption}</p>
              <span className="flex items-center gap-2 text-xs">
                <Music2 size={14} />
                {reel.audio}
              </span>
            </div>
            <div className="absolute bottom-5 right-2 grid gap-4 text-center text-xs font-semibold">
              <button
                className="grid place-items-center gap-1"
                onClick={() => toggle(setLiked, reel.id)}
              >
                <Heart
                  size={28}
                  fill={liked.has(reel.id) ? "currentColor" : "none"}
                  className={liked.has(reel.id) ? "text-red-500" : ""}
                />
                <span>
                  {liked.has(reel.id) ? `${reel.likes}+` : reel.likes}
                </span>
              </button>
              <button
                className="grid place-items-center gap-1"
                onClick={() => setCommenting(reel)}
              >
                <MessageCircle size={27} />
                <span>{reel.comments}</span>
              </button>
              <button
                className="grid place-items-center gap-1"
                onClick={onShare}
              >
                <Send size={26} />
                <span>Share</span>
              </button>
              <button
                className="grid place-items-center"
                onClick={() => toggle(setSaved, reel.id)}
              >
                <Bookmark
                  size={26}
                  fill={saved.has(reel.id) ? "currentColor" : "none"}
                />
              </button>
              <button
                className="grid place-items-center"
                onClick={() => setOptions(reel)}
              >
                <MoreHorizontal size={25} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {commenting ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 sm:items-center"
          onMouseDown={() => setCommenting(null)}
        >
          <section
            className="w-full max-w-md rounded-t-2xl bg-white p-5 text-black dark:bg-neutral-950 dark:text-white sm:rounded-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <strong>Comments</strong>
              <button onClick={() => setCommenting(null)}>
                <X />
              </button>
            </header>
            <div className="grid min-h-48 content-start gap-4 py-5 text-sm">
              <p>
                <b>meherkaur</b> MUDRA rehearsals are looking great 🔥
              </p>
              <p>
                <b>aaravmehta</b> See you on campus!
              </p>
              {comments.map((item, index) => (
                <p key={`${item}-${index}`}>
                  <b>{username}</b> {item}
                </p>
              ))}
            </div>
            <form
              className="flex items-center gap-2 rounded-full border border-neutral-300 px-3 dark:border-neutral-700"
              onSubmit={submitComment}
            >
              <input
                className="h-11 min-w-0 flex-1 bg-transparent outline-none"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment…"
              />
              <button
                className="font-semibold text-blue-500"
                disabled={!comment.trim()}
              >
                Post
              </button>
            </form>
          </section>
        </div>
      ) : null}
      {options ? (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4"
          onMouseDown={() => setOptions(null)}
        >
          <section
            className="w-full max-w-sm overflow-hidden rounded-xl bg-white dark:bg-neutral-950 text-center text-black dark:text-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {options.creator === username ? (
              <>
                <button
                  className="w-full border-b border-neutral-100 dark:border-neutral-800 p-4 text-sm font-semibold"
                  onClick={() => {
                    setEditCaption(options.caption);
                    setEditing(options);
                    setOptions(null);
                  }}
                >
                  Edit reel caption
                </button>
                <button
                  className="w-full border-b border-neutral-100 dark:border-neutral-800 p-4 text-sm font-bold text-red-500"
                  onClick={() => {
                    onDelete(options.id);
                    setOptions(null);
                  }}
                >
                  Delete reel
                </button>
              </>
            ) : (
              <button
                className="w-full border-b border-neutral-100 dark:border-neutral-800 p-4 text-sm font-bold text-red-500"
                onClick={() => {
                  onPreview("Reel reported");
                  setOptions(null);
                }}
              >
                Report
              </button>
            )}
            <button
              className="w-full p-4 text-sm"
              onClick={() => setOptions(null)}
            >
              Cancel
            </button>
          </section>
        </div>
      ) : null}
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <section className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-950 p-5 text-black dark:text-white">
            <h2 className="font-semibold">Edit reel</h2>
            <textarea
              className="mt-4 min-h-28 w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none dark:border-neutral-700"
              value={editCaption}
              onChange={(event) => setEditCaption(event.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-semibold"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  onEdit(editing.id, editCaption);
                  setEditing(null);
                }}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
