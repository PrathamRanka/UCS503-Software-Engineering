import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/social";
import { StatePanel } from "../ui/StatePanel";

type ArchivedPostsViewProps = {
  posts: Post[];
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
};

export function ArchivedPostsView({
  posts,
  onRestore,
  onDelete,
}: ArchivedPostsViewProps) {
  const navigate = useNavigate();
  return (
    <section className="mx-auto min-h-screen w-full max-w-3xl">
      <header className="flex h-[60px] items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4">
        <button
          className="grid size-10 place-items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-bold">Post archive</h1>
      </header>
      {posts.length ? (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {posts.map((post) => (
            <article
              className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
              key={post.id}
            >
              <img
                className="aspect-square w-full object-cover"
                src={post.image}
                alt={post.caption}
              />
              <div className="flex justify-around p-2">
                <button
                  className="flex items-center gap-1 text-xs font-semibold"
                  onClick={() => onRestore(post.id)}
                >
                  <RotateCcw size={16} />
                  Restore
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-red-500"
                  onClick={() => onDelete(post.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <StatePanel
          type="empty"
          title="No archived posts"
          message="Posts you archive will remain private here until you restore or delete them."
          actionLabel="Back to profile"
          onAction={() => navigate("/profile")}
        />
      )}
    </section>
  );
}
