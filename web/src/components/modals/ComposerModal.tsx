import { ImagePlus, X } from 'lucide-react'

type ComposerModalProps = { onClose: () => void; onShare: () => void }

export function ComposerModal({ onClose, onShare }: ComposerModalProps) {
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/65 p-5" role="presentation" onMouseDown={onClose}>
      <section className="w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="composer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="relative flex min-h-11 items-center justify-center border-b border-neutral-200 px-2.5">
          <h2 className="m-0 text-base font-semibold" id="composer-title">Create new post</h2>
          <button className="absolute right-2 top-1 grid size-9 place-items-center rounded-lg hover:bg-neutral-100" onClick={onClose} aria-label="Close"><X /></button>
        </header>
        <button className="m-4 flex h-[260px] w-[calc(100%_-_2rem)] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-400 bg-neutral-50">
          <ImagePlus size={48} strokeWidth={1.4} />
          <strong className="text-base font-normal">Drop a photo or video here</strong>
          <small className="text-neutral-500">or click to browse your device</small>
        </button>
        <textarea className="mx-4 min-h-20 w-[calc(100%_-_2rem)] resize-y rounded-lg border border-neutral-200 p-3 outline-none focus:border-neutral-400" placeholder="Write a caption…" />
        <div className="flex items-center justify-between px-4 py-3.5"><span className="text-xs text-neutral-500">Visible to everyone on campus</span><button className="bg-transparent font-semibold text-blue-500" onClick={onShare}>Share</button></div>
      </section>
    </div>
  )
}
