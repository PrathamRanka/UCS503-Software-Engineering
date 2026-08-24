import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Post, UserProfile } from "../../types/social";
import { ContentMenuModal } from "../modals/ContentMenuModal";
import { Avatar } from "../ui/Avatar";
import { StatePanel } from "../ui/StatePanel";

type PostDetailViewProps = {
  user: UserProfile;
  posts: Post[];
  liked: Set<number>;
  saved: Set<number>;
  archived: Set<number>;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onUpdate: (id: number, caption: string) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onAction: (message: string) => void;
};

export function PostDetailView({
  user,
  posts,
  liked,
  saved,
  archived,
  onLike,
  onSave,
  onUpdate,
  onDelete,
  onArchive,
  onAction,
}: PostDetailViewProps) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = posts.find((item) => item.id === Number(postId));
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    "FAPS would love this frame!",
    "TIET evenings always look special ✨",
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post?.caption ?? "");

  if (!post)
    return (
      <StatePanel
        type="error"
        title="Post unavailable"
        message="This post may have been deleted or archived."
        actionLabel="Back to feed"
        onAction={() => navigate("/")}
      />
    );
  const own = post.handle === user.username;
  const submitComment = (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments((current) => [...current, comment.trim()]);
    setComment("");
  };
  const saveEdit = () => {
    onUpdate(post.id, caption.trim() || post.caption);
    setEditing(false);
  };

  return (
    <section className="mx-auto min-h-screen w-full max-w-5xl">
      <header className="flex h-[60px] items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4">
        <button
          className="grid size-10 place-items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-bold">Post</h1>
      </header>
      <article className="mx-auto mt-5 grid max-w-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 md:grid-cols-[1.15fr_.85fr] md:rounded-lg">
        <img
          className="aspect-square size-full bg-neutral-100 dark:bg-neutral-800 object-cover"
          src={post.image}
          alt={post.caption}
        />
        <div className="flex min-h-[520px] flex-col">
          <header className="flex h-16 items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4">
            <Avatar src={post.avatar} size="sm" />
            <div className="flex-1">
              <button
                className="text-sm font-semibold"
                onClick={() => navigate(`/profile/${post.handle}`)}
              >
                {post.handle}
              </button>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                {post.place}
              </span>
            </div>
            <button onClick={() => setMenuOpen(true)}>
              <MoreHorizontal />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex gap-3">
              <Avatar src={post.avatar} size="sm" />
              <p className="text-sm leading-5">
                <b className="mr-1">{post.handle}</b>
                {post.caption}
              </p>
            </div>
            <div className="mt-6 grid gap-5">
              {comments.map((item, index) => (
                <div className="flex gap-3" key={`${item}-${index}`}>
                  <Avatar
                    src={
                      index % 2 ? "/images/meher.webp" : "/images/aarav.webp"
                    }
                    size="sm"
                  />
                  <p className="text-sm">
                    <b className="mr-1">
                      {index % 2 ? "meherkaur" : "aaravmehta"}
                    </b>
                    {item}
                    <span className="mt-1 block text-[10px] text-neutral-400">
                      {index + 2}m · Reply
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex">
                <button
                  className={`grid size-10 place-items-center ${liked.has(post.id) ? "text-red-500" : ""}`}
                  onClick={() => onLike(post.id)}
                >
                  <Heart fill={liked.has(post.id) ? "currentColor" : "none"} />
                </button>
                <button className="grid size-10 place-items-center">
                  <MessageCircle />
                </button>
                <button
                  className="grid size-10 place-items-center"
                  onClick={() => onAction("Link copied")}
                >
                  <Send />
                </button>
              </div>
              <button
                className="grid size-10 place-items-center"
                onClick={() => onSave(post.id)}
              >
                <Bookmark fill={saved.has(post.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="px-4 pb-3 text-sm">
              <b>
                {(post.likes + (liked.has(post.id) ? 1 : 0)).toLocaleString()}{" "}
                likes
              </b>
              <span className="mt-1 block text-[10px] text-neutral-400">
                {post.time.toUpperCase()} AGO
              </span>
            </div>
            <form
              className="flex h-12 items-center border-t border-neutral-200 dark:border-neutral-800 px-4"
              onSubmit={submitComment}
            >
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment…"
              />
              <button
                className="text-sm font-semibold text-blue-500"
                disabled={!comment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </article>
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
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {menuOpen ? (
        <ContentMenuModal
          own={own}
          archived={archived.has(post.id)}
          onEdit={() => setEditing(true)}
          onArchive={() => {
            onArchive(post.id);
            onAction(archived.has(post.id) ? "Post restored" : "Post archived");
          }}
          onDelete={() => {
            onDelete(post.id);
            navigate("/");
          }}
          onReport={() => onAction("Report submitted")}
          onBlock={() => onAction(`${post.handle} blocked`)}
          onMute={() => onAction(`${post.handle} muted`)}
          onUnfollow={() => onAction(`Unfollowed ${post.handle}`)}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </section>
  );
}
