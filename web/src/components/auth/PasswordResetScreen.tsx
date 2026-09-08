import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";
import { isTietEmail } from "../../utils/institutionalEmail";

export function PasswordResetScreen({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isTietEmail(email)) {
      setError("Enter your official TIET email (@thapar.edu).");
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <main className="relative grid min-h-screen place-items-center bg-[#f7f7f5] p-5 font-sans text-black dark:bg-[#050505] dark:text-white">
      <div className="absolute right-5 top-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
      </div>
      <section className="w-full max-w-md rounded-md border border-black/10 bg-white p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.12)] dark:border-white/10 dark:bg-[#111113]">
        <div className="flex justify-center">
          <Brand />
        </div>
        {sent ? (
          <>
            <CheckCircle2 className="mx-auto mt-8 text-green-500" size={48} />
            <h1 className="mt-4 text-xl font-semibold">Check your email</h1>
            <p className="mt-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
              A mock password-reset link was sent to <b>{email}</b>.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto mt-8 grid size-20 place-items-center rounded-full border-2 border-black dark:border-white">
              <LockKeyhole size={38} />
            </span>
            <h1 className="mt-4 text-xl font-semibold">Reset your password</h1>
            <p className="mt-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
              Enter your official TIET email and we’ll send a recovery link.
            </p>
            <form className="mt-6" onSubmit={submit}>
              <input
                className="h-11 w-full rounded-sm border border-neutral-300 bg-transparent px-3 text-sm outline-none focus:border-neutral-500 dark:border-white/15"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@thapar.edu"
              />
              {error ? (
                <p className="mt-2 text-left text-xs text-red-500">{error}</p>
              ) : null}
              <button className="mt-3 h-12 w-full rounded-sm bg-[#ed111c] text-sm font-semibold text-white shadow-lg shadow-red-600/15">
                Send reset link
              </button>
            </form>
          </>
        )}
        <Link
          className="mt-7 flex items-center justify-center gap-1 text-sm font-semibold"
          to="/"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
