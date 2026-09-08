import { useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Clock3,
  MapPin,
  MoreHorizontal,
  Users,
} from "lucide-react";
import type { Post } from "../../types/social";
import { ContentMenuModal } from "../modals/ContentMenuModal";

type Props = {
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
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const category = post.tags[0]?.replace("#", "") || "Campus";
  const isStudent = post.authorType === "student";

  return (
    <article className="group grid overflow-hidden border-b border-[#171719]/10 py-8 dark:border-white/10 sm:grid-cols-[minmax(210px,.8fr)_minmax(0,1.2fr)] sm:gap-8">
      <button
        className="relative min-h-56 overflow-hidden rounded-sm bg-neutral-200 sm:min-h-64"
        onClick={onOpen}
      >
        <img
          className="absolute inset-0 size-full object-cover saturate-[.78] transition duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
          src={post.image}
          alt={`${post.place} campus update`}
          loading={post.id <= 2 ? "eager" : "lazy"}
        />
        <span
          className={`absolute left-4 top-4 px-3 py-2 text-[9px] font-bold tracking-[.12em] backdrop-blur-md ${isStudent ? "bg-[#ed111c] text-white" : "bg-[#f5f5ef]/90 text-[#171719]"}`}
        >
          {isStudent
            ? "STUDENT UPDATE"
            : post.featured
              ? "HAPPENING TODAY"
              : "SOCIETY UPDATE"}
        </span>
      </button>

      <div className="flex min-w-0 flex-col py-5 sm:py-3">
        <div className="flex items-start justify-between gap-4">
          <button className="text-left" onClick={onOpenProfile}>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[.16em] text-[#b4742f]">
              {isStudent ? "Student" : category} · {post.time}
            </p>
            <span className="flex items-center gap-3">
              {isStudent ? (
                <img
                  className="size-9 rounded-full object-cover"
                  src={post.avatar}
                  alt=""
                />
              ) : null}
              <span>
                <h2 className="font-serif text-[28px] font-normal leading-[1.05] tracking-[-.025em] sm:text-[34px]">
                  {post.author}
                </h2>
                {post.context ? (
                  <small className="mt-1 block text-[10px] text-neutral-500">
                    {post.context}
                  </small>
                ) : null}
              </span>
            </span>
          </button>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setMenuOpen(true)}
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <p className="mt-4 line-clamp-3 text-[12px] leading-6 text-neutral-500">
          {caption}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {post.place}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {post.likes.toLocaleString()} interested
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} /> {post.comments} conversations
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-6">
          <button
            className={`flex h-10 items-center gap-2 rounded-md px-4 text-[11px] font-semibold ${isLiked ? "bg-[#ed111c] text-white" : "bg-[#171719] text-white dark:bg-white dark:text-[#171719]"}`}
            onClick={onLike}
          >
            {isLiked ? <Check size={15} /> : <Users size={15} />}
            {isLiked ? "Interested" : "I’m interested"}
          </button>
          <button
            className={`grid size-10 place-items-center rounded-md border border-black/10 dark:border-white/10 ${isSaved ? "text-[#ed111c]" : "text-neutral-500"}`}
            onClick={onSave}
            aria-label="Save"
          >
            <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            className="ml-auto flex items-center gap-1 text-[10px] text-neutral-500"
            onClick={onShare}
          >
            Share <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-sm bg-white p-6 text-[#171719] dark:bg-[#111113] dark:text-white">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-neutral-500">
              Edit update
            </p>
            <textarea
              className="mt-4 min-h-36 w-full border-y border-black/10 bg-transparent py-4 font-serif text-xl outline-none dark:border-white/10"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-md px-4 py-2 text-xs" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-[#171719] px-4 py-2 text-xs font-semibold text-white"
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
