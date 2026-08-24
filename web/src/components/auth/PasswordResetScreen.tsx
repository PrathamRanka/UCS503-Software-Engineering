import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";

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
    if (!email.toLowerCase().endsWith("@thapar.edu")) {
      setError("Enter your verified @thapar.edu email.");
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <main className="relative grid min-h-screen place-items-center bg-neutral-50 p-5 font-sans text-black dark:bg-black dark:text-white">
      <div className="absolute right-5 top-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
      </div>
      <section className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
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
              Enter your Thapar email and we’ll send a recovery link.
            </p>
            <form className="mt-6" onSubmit={submit}>
              <input
                className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@thapar.edu"
              />
              {error ? (
                <p className="mt-2 text-left text-xs text-red-500">{error}</p>
              ) : null}
              <button className="mt-3 h-11 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white">
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
