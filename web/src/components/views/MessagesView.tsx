import { FormEvent, useMemo, useState } from 'react'
import { ChevronLeft, Edit, Image, Info, MessageCircle, Phone, Search, Send, Smile, Video } from 'lucide-react'
import { conversations as initialConversations } from '../../data/mockData'
import type { Conversation } from '../../types/social'
import { Avatar } from '../ui/Avatar'

export function MessagesView({ username, onPreview }: { username: string; onPreview: (label: string) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const selected = conversations.find((item) => item.id === selectedId)
  const filtered = useMemo(() => conversations.filter((item) => `${item.name} ${item.username}`.toLowerCase().includes(query.toLowerCase())), [conversations, query])

  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    const text = message.trim()
    if (!text || !selectedId) return
    setConversations((current) => current.map((conversation) => conversation.id === selectedId ? { ...conversation, lastMessage: text, time: 'now', messages: [...conversation.messages, { id: Date.now(), text, mine: true, time: 'Now' }] } : conversation))
    setMessage('')
  }

  return (
    <section className="mx-auto h-screen w-full max-w-5xl border-x border-neutral-200 bg-white lg:h-[calc(100vh-40px)] lg:translate-y-5 lg:overflow-hidden lg:rounded-xl lg:border">
      <div className="grid h-full md:grid-cols-[350px_1fr]">
        <aside className={`${selectedId ? 'hidden md:block' : 'block'} border-r border-neutral-200`}>
          <header className="flex h-[60px] items-center justify-between border-b border-neutral-200 px-5"><strong>{username}</strong><button onClick={() => onPreview('New message')}><Edit size={22} /></button></header>
          <div className="p-3"><label className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-3"><Search size={17} className="text-neutral-500" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages" /></label></div>
          <div className="overflow-y-auto">
            {filtered.map((conversation) => <button className={`flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-neutral-50 ${selectedId === conversation.id ? 'bg-neutral-100' : ''}`} onClick={() => setSelectedId(conversation.id)} key={conversation.id}><span className="relative"><Avatar src={conversation.avatar} size="lg" />{conversation.unread ? <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-blue-500" /> : null}</span><span className="min-w-0 flex-1"><b className="block truncate text-sm font-medium">{conversation.name}</b><small className="block truncate text-neutral-500">{conversation.lastMessage} · {conversation.time}</small></span></button>)}
          </div>
        </aside>

        {selected ? <div className="flex h-full min-h-0 flex-col">
          <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-neutral-200 px-3 sm:px-5"><button className="md:hidden" onClick={() => setSelectedId(null)}><ChevronLeft /></button><Avatar src={selected.avatar} size="sm" /><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{selected.name}</strong><span className="text-xs text-neutral-500">Active now</span></div><button onClick={() => onPreview('Audio call')}><Phone size={21} /></button><button onClick={() => onPreview('Video call')}><Video size={22} /></button><button onClick={() => onPreview('Conversation info')}><Info size={22} /></button></header>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-8 flex flex-col items-center"><Avatar src={selected.avatar} size="lg" /><strong className="mt-2">{selected.name}</strong><span className="text-sm text-neutral-500">@{selected.username}</span><button className="mt-3 rounded-lg bg-neutral-100 px-4 py-2 text-xs font-semibold" onClick={() => onPreview(`${selected.name}'s profile`)}>View profile</button></div>
            <div className="grid gap-2">{selected.messages.map((item) => <div className={`flex ${item.mine ? 'justify-end' : 'justify-start'}`} key={item.id}><div className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm ${item.mine ? 'bg-blue-500 text-white' : 'bg-neutral-100'}`}>{item.text}<span className={`mt-1 block text-[9px] ${item.mine ? 'text-white/70' : 'text-neutral-400'}`}>{item.time}</span></div></div>)}</div>
          </div>
          <form className="m-4 flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-neutral-300 px-3" onSubmit={sendMessage}><Smile size={21} /><input className="min-w-0 flex-1 border-0 text-sm outline-none" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message…" /><button type="button" onClick={() => onPreview('Photo picker')}><Image size={21} /></button>{message.trim() ? <button className="font-semibold text-blue-500" aria-label="Send"><Send size={20} /></button> : null}</form>
        </div> : <div className="hidden place-items-center md:grid"><div className="text-center"><span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-black"><MessageCircle size={38} /></span><h2 className="mt-4 text-xl">Your messages</h2><p className="mt-1 text-sm text-neutral-500">Send photos and private messages to a friend.</p><button className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => onPreview('New message')}>Send message</button></div></div>}
      </div>
    </section>
  )
}
