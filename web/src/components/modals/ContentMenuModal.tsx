import { X } from 'lucide-react'

type ContentMenuModalProps = {
  own: boolean
  archived: boolean
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
  onReport: () => void
  onBlock: () => void
  onMute: () => void
  onUnfollow: () => void
  onClose: () => void
}

export function ContentMenuModal(props: ContentMenuModalProps) {
  const action = (callback: () => void) => { callback(); props.onClose() }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={props.onClose}><section className="w-full max-w-sm overflow-hidden rounded-xl bg-white text-center" onMouseDown={(event) => event.stopPropagation()}>{props.own ? <><button className="w-full border-b border-neutral-100 p-4 text-sm font-semibold" onClick={() => action(props.onEdit)}>Edit post</button><button className="w-full border-b border-neutral-100 p-4 text-sm font-semibold" onClick={() => action(props.onArchive)}>{props.archived ? 'Show on profile' : 'Archive'}</button><button className="w-full border-b border-neutral-100 p-4 text-sm font-bold text-red-500" onClick={() => action(props.onDelete)}>Delete</button></> : <><button className="w-full border-b border-neutral-100 p-4 text-sm font-bold text-red-500" onClick={() => action(props.onReport)}>Report</button><button className="w-full border-b border-neutral-100 p-4 text-sm font-bold text-red-500" onClick={() => action(props.onUnfollow)}>Unfollow</button><button className="w-full border-b border-neutral-100 p-4 text-sm" onClick={() => action(props.onMute)}>Mute</button><button className="w-full border-b border-neutral-100 p-4 text-sm font-bold text-red-500" onClick={() => action(props.onBlock)}>Block</button></>}<button className="flex w-full items-center justify-center gap-2 p-4 text-sm" onClick={props.onClose}><X size={17} />Cancel</button></section></div>
}
