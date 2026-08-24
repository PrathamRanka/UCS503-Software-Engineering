import { FormEvent, useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import type { Post } from "../../types/social";
import { ContentMenuModal } from "../modals/ContentMenuModal";
import { Avatar } from "../ui/Avatar";

type PostCardProps = {
  post: Post;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  currentUsername: string;
  archived: boolean;
  onOpen: () => void;
  onOpenProfile: () => void;
  onEdit: (caption: string) => void;
  onArchive: () => void;
  onDelete: () => void;
  onAction: (message: string) => void;
  onUnfollow: () => void;
};

const iconButton =
  "grid size-10 place-items-center rounded-lg bg-transparent transition duration-150 ease-out hover:text-neutral-500 active:scale-90 motion-reduce:transition-none";

export function PostCard({
  post,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onShare,
  currentUsername,
  archived,
  onOpen,
  onOpenProfile,
  onEdit,
  onArchive,
  onDelete,
  onAction,
  onUnfollow,
}: PostCardProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showHeart, setShowHeart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const displayedLikes = post.likes + (isLiked ? 1 : 0);

  const likeFromImage = () => {
    if (!isLiked) onLike();
    setShowHeart(true);
    window.setTimeout(() => setShowHeart(false), 500);
  };

  const addComment = (event: FormEvent) => {
    event.preventDefault();
    const value = comment.trim();
    if (!value) return;
    setComments((current) => [...current, value]);
    setComment("");
  };

  return (
    <article className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pb-3.5 [content-visibility:auto]">
      <header className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 sm:px-0">
        <span className="rounded-full bg-[conic-gradient(from_220deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] p-0.5">
          <span className="block rounded-full bg-white dark:bg-neutral-950 p-0.5">
            <Avatar src={post.avatar} size="sm" />
          </span>
        </span>
        <div className="flex min-w-0 flex-col">
          <button
            className="flex items-center text-left text-sm font-semibold leading-[18px]"
            onClick={onOpenProfile}
          >
            {post.handle}
            {post.featured ? (
              <span className="ml-1 grid size-[13px] place-items-center rounded-full bg-blue-500 text-[8px] text-white">
                ✓
              </span>
            ) : null}
          </button>
          <span className="text-xs leading-4 text-neutral-500 dark:text-neutral-400">
            {post.place} · {post.time}
          </span>
        </div>
        <button
          className={iconButton}
          onClick={() => setMenuOpen(true)}
          aria-label="Post menu"
        >
          <MoreHorizontal size={22} />
        </button>
      </header>

      <button
        className="relative block aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 sm:rounded-[4px] sm:border sm:border-neutral-200 dark:sm:border-neutral-800"
        onDoubleClick={likeFromImage}
        aria-label="Double click to like post"
      >
        <img
          className="block size-full object-cover"
          src={post.image}
          alt={`${post.place} campus post`}
          loading={post.id <= 1 ? "eager" : "lazy"}
          decoding="async"
        />
        {showHeart ? (
          <Heart
            className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 scale-100 fill-white text-white drop-shadow-xl transition duration-150 ease-out motion-reduce:transition-none"
            strokeWidth={0}
            aria-hidden="true"
          />
        ) : null}
      </button>

      <div className="flex h-12 items-center justify-between px-1 sm:-mx-2 sm:px-0">
        <div className="flex gap-0.5">
          <button
            className={`${iconButton} ${isLiked ? "text-red-500" : ""}`}
            onClick={onLike}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart size={26} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button
            className={iconButton}
            onClick={onOpen}
            aria-label="Open comments"
          >
            <MessageCircle size={25} />
          </button>
          <button className={iconButton} onClick={onShare} aria-label="Share">
            <Send size={24} />
          </button>
        </div>
        <button
          className={iconButton}
          onClick={onSave}
          aria-label={isSaved ? "Remove from saved" : "Save post"}
        >
          <Bookmark size={25} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="px-3 text-sm leading-[18px] sm:px-0">
        <strong>{displayedLikes.toLocaleString()} likes</strong>
        <p className="my-1">
          <b className="mr-1">{post.handle}</b>
          {post.caption}
        </p>
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <button
              className="bg-transparent p-0 text-sm text-[#00376b]"
              key={tag}
            >
              {tag}
            </button>
          ))}
        </div>
        <button
          className="block bg-transparent pt-1 text-sm text-neutral-500 dark:text-neutral-400"
          onClick={onOpen}
        >
          View all {post.comments + comments.length} comments
        </button>
        {comments.map((item, index) => (
          <p className="my-1" key={`${item}-${index}`}>
            <b className="mr-1">riyasharma</b>
            {item}
          </p>
        ))}
        <span className="mt-1.5 block text-[10px] text-neutral-500 dark:text-neutral-400">
          {post.time.toUpperCase()} AGO
        </span>
      </div>

      <form
        className="hidden h-10 items-center gap-2.5 sm:flex"
        onSubmit={addComment}
      >
        <Smile size={21} />
        <input
          id={`comment-${post.id}`}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment…"
        />
        <button
          className="bg-transparent text-[13px] font-semibold text-blue-500 disabled:opacity-40"
          disabled={!comment.trim()}
        >
          Post
        </button>
      </form>
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <section className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-950 p-5">
            <h2 className="font-semibold">Edit caption</h2>
            <textarea
              className="mt-4 min-h-32 w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none dark:border-neutral-700"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-semibold"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  onEdit(caption);
                  setEditing(false);
                }}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {menuOpen ? (
        <ContentMenuModal
          own={post.handle === currentUsername}
          archived={archived}
          onEdit={() => setEditing(true)}
          onArchive={onArchive}
          onDelete={onDelete}
          onReport={() => onAction("Report submitted")}
          onBlock={() => onAction(`${post.handle} blocked`)}
          onMute={() => onAction(`${post.handle} muted`)}
          onUnfollow={onUnfollow}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </article>
  );
}
