import { ChangeEvent } from "react";
import { Pencil, Plus, Star, Trash2, X } from "lucide-react";
import type { Story } from "../../types/social";

type StoryManagerModalProps = {
  stories: Story[];
  onCreate: () => void;
  onDelete: (index: number) => void;
  onEdit: (index: number, image: string) => void;
  onToggleHighlight: (index: number) => void;
  onClose: () => void;
};

export function StoryManagerModal({
  stories,
  onCreate,
  onDelete,
  onEdit,
  onToggleHighlight,
  onClose,
}: StoryManagerModalProps) {
  const owned = stories
    .map((story, index) => ({ story, index }))
    .filter(({ story }) => story.own);
  const editStory = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onEdit(index, String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onMouseDown={onClose}
    >
      <section
        className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-950 p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Stories and highlights</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your active campus stories.
            </p>
          </div>
          <button className="grid size-9 place-items-center" onClick={onClose}>
            <X />
          </button>
        </header>
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white"
          onClick={onCreate}
        >
          <Plus size={18} />
          Create story
        </button>
        {owned.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {owned.map(({ story, index }) => (
              <div
                className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
                key={`${story.image}-${index}`}
              >
                <img
                  className="aspect-[9/16] w-full object-cover"
                  src={story.image}
                  alt="Your story"
                />
                <div className="flex justify-around p-2">
                  <label
                    className="cursor-pointer text-neutral-500 dark:text-neutral-400"
                    title="Replace story image"
                  >
                    <Pencil size={19} />
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/*"
                      onChange={(event) => editStory(event, index)}
                    />
                  </label>
                  <button
                    className={
                      story.highlighted ? "text-amber-500" : "text-neutral-400"
                    }
                    onClick={() => onToggleHighlight(index)}
                    title="Toggle highlight"
                  >
                    <Star
                      size={20}
                      fill={story.highlighted ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => onDelete(index)}
                    title="Delete story"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No active stories. Create one to add it to a highlight.
          </div>
        )}
      </section>
    </div>
  );
}
