import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { people } from "../../data/mockData";
import { Avatar } from "../ui/Avatar";
import { PageHeader } from "../ui/PageHeader";

type SearchViewProps = {
  following: Set<string>;
  onFollow: (handle: string) => void;
};

export function SearchView({ following, onFollow }: SearchViewProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? people.filter((person) =>
          `${person.name} ${person.username} ${person.branch}`
            .toLowerCase()
            .includes(normalized),
        )
      : people.slice(1);
  }, [query]);

  return (
    <section className="mx-auto min-h-screen w-full max-w-5xl">
      <PageHeader title="People" eyebrow="Campus directory" />
      <div className="p-4 sm:p-8">
        <div className="mb-8"><h2 className="text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Find the person, not a following.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">Search by name, course, society, or the kind of help you need.</p></div>
        <label className="flex h-14 items-center gap-3 rounded-xl border border-black/10 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Search
            size={19}
            className="text-neutral-500 dark:text-neutral-400"
          />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
            placeholder="Search students, clubs and branches"
          />
          {query ? (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={17} />
            </button>
          ) : null}
        </label>
        <h2 className="mb-3 mt-7 text-sm font-semibold">
          {query ? "Results" : "People you may know"}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((person) => {
            const handle = `@${person.username}`;
            return (
              <div
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/[.035] motion-reduce:transition-none"
                key={person.id}
              >
                <button
                  onClick={() =>
                    navigate(
                      person.id === "user-pratham"
                        ? "/profile"
                        : `/profile/${person.username}`,
                    )
                  }
                >
                  <Avatar src={person.avatar} size="lg" />
                </button>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() =>
                    navigate(
                      person.id === "user-pratham"
                        ? "/profile"
                        : `/profile/${person.username}`,
                    )
                  }
                >
                  <strong className="block truncate text-sm">
                    {person.username}
                  </strong>
                  <span className="block truncate text-sm text-neutral-500 dark:text-neutral-400">
                    {person.name} · {person.branch}
                  </span>
                </button>
                {person.id !== "user-pratham" ? (
                  <button
                    className={`rounded-lg px-4 py-2 text-xs font-semibold ${following.has(handle) ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200" : "bg-[#ed111c] text-white"}`}
                    onClick={() => onFollow(handle)}
                  >
                    {following.has(handle) ? "Connected" : "Connect"}
                  </button>
                ) : null}
              </div>
            );
          })}
          {!results.length ? (
            <div className="py-16 text-center">
              <Search className="mx-auto text-neutral-300" size={40} />
              <p className="mt-3 font-semibold">No results found</p>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Try another name, username or branch.
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
