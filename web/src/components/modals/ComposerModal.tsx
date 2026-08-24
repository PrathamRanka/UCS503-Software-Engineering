import { ChangeEvent, useEffect, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import type { NewPostInput } from '../../types/social'

type ComposerModalProps = { onClose: () => void; onShare: (post: NewPostInput) => void }

export function ComposerModal({ onClose, onShare }: ComposerModalProps) {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const readImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const share = () => {
    if (!image) return
    onShare({ image, caption: caption.trim() || 'A new moment from campus.' })
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/65 p-5 motion-reduce:transition-none" role="presentation" onMouseDown={onClose}>
      <section className="w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="composer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="relative flex min-h-11 items-center justify-center border-b border-neutral-200 px-2.5">
          <h2 className="m-0 text-base font-semibold" id="composer-title">Create new post</h2>
          <button className="absolute right-2 top-1 grid size-9 place-items-center rounded-lg transition hover:bg-neutral-100 active:scale-95 motion-reduce:transition-none" onClick={onClose} aria-label="Close"><X /></button>
        </header>

        {image ? (
          <div className="relative m-4 aspect-square max-h-[330px] overflow-hidden rounded-lg bg-neutral-100">
            <img className="size-full object-cover" src={image} alt="New post preview" />
            <button className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/65 text-white" onClick={() => setImage('')} aria-label="Remove selected image"><X size={17} /></button>
          </div>
        ) : (
          <div className="m-4 flex h-[260px] w-[calc(100%_-_2rem)] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-400 bg-neutral-50">
            <ImagePlus size={48} strokeWidth={1.4} />
            <strong className="text-base font-normal">Choose a photo to share</strong>
            <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[.97] motion-reduce:transition-none">
              Select from device
              <input className="sr-only" type="file" accept="image/*" onChange={readImage} />
            </label>
            <button className="text-xs font-semibold text-blue-500" onClick={() => setImage('/images/library.jpg')}>Use demo photo</button>
          </div>
        )}

        <textarea className="mx-4 min-h-20 w-[calc(100%_-_2rem)] resize-y rounded-lg border border-neutral-200 p-3 outline-none focus:border-neutral-400" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={2200} placeholder="Write a caption…" />
        <div className="flex items-center justify-between px-4 py-3.5"><span className="text-xs text-neutral-500">{caption.length}/2,200</span><button className="bg-transparent font-semibold text-blue-500 disabled:cursor-not-allowed disabled:opacity-40" disabled={!image} onClick={share}>Share</button></div>
      </section>
    </div>
  )
}
