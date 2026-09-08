import { useState } from "react";
import { Bell } from "lucide-react";
import { notifications } from "../../data/mockData";
import { Avatar } from "../ui/Avatar";
import { PageHeader } from "../ui/PageHeader";

export function NotificationsView() {
  const [following, setFollowing] = useState<Set<number>>(() => new Set());

  return (
    <section className="mx-auto min-h-screen w-full max-w-3xl">
      <PageHeader title="Activity" eyebrow="What changed" />
      <div className="px-4 py-7 sm:px-8">
        <h2 className="mb-2 text-base font-bold">Today</h2>
        <div className="grid gap-1">
          {notifications.map((item, index) => (
            <div
              className="flex items-center gap-3 rounded-sm border border-transparent px-3 py-4 transition hover:border-black/10 hover:bg-white dark:hover:border-white/10 dark:hover:bg-white/5 motion-reduce:transition-none"
              key={item.id}
            >
              <Avatar src={item.avatar} />
              <p className="min-w-0 flex-1 text-sm">
                <b>{item.user}</b> {item.text}{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  {item.time}
                </span>
              </p>
              {item.image ? (
                <img
                  className="size-11 rounded object-cover"
                  src={item.image}
                  alt="Related campus update"
                />
              ) : null}
              {item.follow ? (
                <button
                  className={`rounded-sm px-4 py-2 text-xs font-semibold ${following.has(item.id) ? "bg-neutral-100 dark:bg-neutral-800" : "bg-[#ed111c] text-white"}`}
                  onClick={() =>
                    setFollowing((current) => {
                      const next = new Set(current);
                      next.has(item.id)
                        ? next.delete(item.id)
                        : next.add(item.id);
                      return next;
                    })
                  }
                >
                  {following.has(item.id) ? "Connected" : "Connect"}
                </button>
              ) : null}
              {index === 0 ? (
                <i className="size-2 rounded-full bg-[#ed111c]" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-black/10 dark:border-white/10 py-12 text-center text-neutral-400">
          <Bell className="mx-auto" size={32} />
          <p className="mt-3 text-sm">You’re all caught up</p>
        </div>
      </div>
    </section>
  );
}
