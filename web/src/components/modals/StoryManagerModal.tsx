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
        className="w-full max-w-lg rounded-sm bg-white dark:bg-neutral-950 p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Campus moments</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage invitations and moments you have shared.
            </p>
          </div>
          <button className="grid size-9 place-items-center" onClick={onClose}>
            <X />
          </button>
        </header>
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-[#ed111c] py-3 text-sm font-semibold text-white"
          onClick={onCreate}
        >
          <Plus size={18} />
          Create a moment
        </button>
        {owned.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {owned.map(({ story, index }) => (
              <div
                className="overflow-hidden rounded-sm border border-black/10 dark:border-white/10"
                key={`${story.image}-${index}`}
              >
                <img
                  className="aspect-[9/16] w-full object-cover"
                  src={story.image}
                  alt="Your campus moment"
                />
                <div className="flex justify-around p-2">
                  <label
                    className="cursor-pointer text-neutral-500 dark:text-neutral-400"
                    title="Replace moment image"
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
                    title="Pin to profile"
                  >
                    <Star
                      size={20}
                      fill={story.highlighted ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => onDelete(index)}
                    title="Delete moment"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No active moments. Share an invitation or update to begin.
          </div>
        )}
      </section>
    </div>
  );
}
