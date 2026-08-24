import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  ChevronLeft,
  Edit,
  Image as ImageIcon,
  Info,
  MessageCircle,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  X,
} from "lucide-react";
import {
  conversations as initialConversations,
  people,
} from "../../data/mockData";
import type { Conversation } from "../../types/social";
import { Avatar } from "../ui/Avatar";

function NewConversationModal({
  onCreate,
  onClose,
}: {
  onCreate: (conversation: Conversation) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [groupName, setGroupName] = useState("");
  const create = () => {
    const members = people.slice(1).filter((person) => selected.has(person.id));
    if (!members.length) return;
    onCreate({
      id: Date.now(),
      name:
        members.length > 1 ? groupName.trim() || "TIET group" : members[0].name,
      username: members.length > 1 ? "tiet.group" : members[0].username,
      avatar: members.length > 1 ? "/images/team.webp" : members[0].avatar,
      lastMessage: "Start a conversation",
      time: "now",
      group: members.length > 1,
      messages: [],
    });
  };
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onMouseDown={onClose}
    >
      <section
        className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-950 p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New message</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        {selected.size > 1 ? (
          <input
            className="mt-4 h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-sm outline-none dark:border-neutral-700"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Group name"
          />
        ) : null}
        <div className="mt-4 max-h-80 overflow-y-auto">
          {people.slice(1).map((person) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              key={person.id}
            >
              <Avatar src={person.avatar} />
              <span className="min-w-0 flex-1">
                <b className="block truncate text-sm">{person.username}</b>
                <small className="text-neutral-500 dark:text-neutral-400">
                  {person.name}
                </small>
              </span>
              <input
                className="size-4 accent-blue-500"
                type="checkbox"
                checked={selected.has(person.id)}
                onChange={() =>
                  setSelected((current) => {
                    const next = new Set(current);
                    next.has(person.id)
                      ? next.delete(person.id)
                      : next.add(person.id);
                    return next;
                  })
                }
              />
            </label>
          ))}
        </div>
        <button
          className="mt-4 h-11 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white disabled:opacity-40"
          disabled={!selected.size}
          onClick={create}
        >
          {selected.size > 1 ? "Create group chat" : "Start chat"}
        </button>
      </section>
    </div>
  );
}

export function MessagesView({
  username,
  onPreview,
}: {
  username: string;
  onPreview: (label: string) => void;
}) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const selected = conversations.find((item) => item.id === selectedId);
  const filtered = useMemo(
    () =>
      conversations.filter((item) =>
        `${item.name} ${item.username}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [conversations, query],
  );

  const appendMessage = (text: string, image?: string) => {
    if (!selectedId) return;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedId
          ? {
              ...conversation,
              lastMessage: image ? "You sent a photo" : text,
              time: "now",
              messages: [
                ...conversation.messages,
                { id: Date.now(), text, image, mine: true, time: "Now" },
              ],
            }
          : conversation,
      ),
    );
  };
  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    appendMessage(text);
    setMessage("");
  };
  const sendImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => appendMessage("", String(reader.result));
    reader.readAsDataURL(file);
  };
  const createConversation = (conversation: Conversation) => {
    setConversations((current) => [conversation, ...current]);
    setSelectedId(conversation.id);
    setNewOpen(false);
  };

  return (
    <section className="mx-auto h-[calc(100dvh-52px)] w-full max-w-5xl overflow-hidden border-x border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:h-[calc(100dvh-40px)] lg:translate-y-5 lg:rounded-xl lg:border">
      <div className="grid h-full min-h-0 md:grid-cols-[350px_1fr]">
        <aside
          className={`${selectedId ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-neutral-200 dark:border-neutral-800`}
        >
          <header className="flex h-[60px] items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-5">
            <strong>{username}</strong>
            <button onClick={() => setNewOpen(true)} aria-label="New message">
              <Edit size={22} />
            </button>
          </header>
          <div className="p-3">
            <label className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3">
              <Search
                size={17}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search messages"
              />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {filtered.map((conversation) => (
              <button
                className={`flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 ${selectedId === conversation.id ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
                onClick={() => setSelectedId(conversation.id)}
                key={conversation.id}
              >
                <span className="relative">
                  <Avatar src={conversation.avatar} size="lg" />
                  {conversation.unread ? (
                    <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-blue-500" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm font-medium">
                    {conversation.name}
                  </b>
                  <small className="block truncate text-neutral-500 dark:text-neutral-400">
                    {conversation.lastMessage} · {conversation.time}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </aside>
        {selected ? (
          <div className="flex h-full min-h-0 flex-col">
            <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-5">
              <button className="md:hidden" onClick={() => setSelectedId(null)}>
                <ChevronLeft />
              </button>
              <Avatar src={selected.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm">
                  {selected.name}
                </strong>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {selected.group ? "Group chat" : "Active now"}
                </span>
              </div>
              <button onClick={() => onPreview("Audio call")}>
                <Phone size={21} />
              </button>
              <button onClick={() => onPreview("Video call")}>
                <Video size={22} />
              </button>
              <button onClick={() => onPreview("Conversation info")}>
                <Info size={22} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
              <div className="mb-8 flex flex-col items-center">
                <Avatar src={selected.avatar} size="lg" />
                <strong className="mt-2">{selected.name}</strong>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  @{selected.username}
                </span>
              </div>
              <div className="grid gap-2">
                {selected.messages.map((item) => (
                  <div
                    className={`flex ${item.mine ? "justify-end" : "justify-start"}`}
                    key={item.id}
                  >
                    <div
                      className={`max-w-[72%] overflow-hidden rounded-2xl text-sm ${item.image ? "" : "px-4 py-2.5"} ${item.mine ? "bg-blue-500 text-white" : "bg-neutral-100 dark:bg-neutral-800"}`}
                    >
                      {item.image ? (
                        <img
                          className="max-h-64 max-w-full object-cover"
                          src={item.image}
                          alt="Shared attachment"
                        />
                      ) : (
                        item.text
                      )}
                      <span
                        className={`block px-3 pb-1 pt-1 text-[9px] ${item.mine ? "text-white/70" : "text-neutral-400"}`}
                      >
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form
              className="m-4 flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-3"
              onSubmit={sendMessage}
            >
              <Smile size={21} />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Message…"
              />
              <label className="cursor-pointer">
                <ImageIcon size={21} />
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={sendImage}
                />
              </label>
              {message.trim() ? (
                <button
                  className="font-semibold text-blue-500"
                  aria-label="Send"
                >
                  <Send size={20} />
                </button>
              ) : null}
            </form>
          </div>
        ) : (
          <div className="hidden place-items-center md:grid">
            <div className="text-center">
              <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-black dark:border-white">
                <MessageCircle size={38} />
              </span>
              <h2 className="mt-4 text-xl">Your messages</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Send photos and private messages to a friend.
              </p>
              <button
                className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setNewOpen(true)}
              >
                Send message
              </button>
            </div>
          </div>
        )}
      </div>
      {newOpen ? (
        <NewConversationModal
          onCreate={createConversation}
          onClose={() => setNewOpen(false)}
        />
      ) : null}
    </section>
  );
}
