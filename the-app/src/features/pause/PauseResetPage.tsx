import { ArrowLeft, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { requestPasswordReset, resetPassword } from "../../lib/blocks/account";
import { copy } from "./content";
import { Wordmark } from "./Wordmark";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";

// Reset password at /pause/reset-password. Without a code it asks for the email;
// with the emailed code (?code=...) it asks for a new password.
export function PauseResetPage({ code, onNavigate }: { code?: string; onNavigate: (path: string) => void }) {
  useDisplayFont();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<"sent" | "reset">();

  useEffect(() => {
    const previous = document.title;
    document.title = `Reset password · ${copy.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (code && password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setPending(true);
    try {
      if (code) {
        await resetPassword(code, password);
        setDone("reset");
      } else {
        await requestPasswordReset(email.trim());
        setDone("sent");
      }
    } catch (caught) {
      setError((caught as Error).message || "Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pause-root pause-signin">
      <header className="pause-nav">
        <a className="pause-logo" aria-label={copy.brand} href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <Wordmark />
        </a>
        <span className="pause-nav-spacer" />
        <button className="pause-button pause-button-quiet" onClick={() => onNavigate("/pause/sign-in")}>
          <ArrowLeft size={18} aria-hidden="true" />
          Sign in
        </button>
      </header>

      <main className="pause-auth">
        <section className="pause-auth-side">
          <h1>reset <span>it</span></h1>
          <p>Forgotten passwords happen to everyone. It takes a minute to set a new one.</p>
        </section>

        <section className="pause-auth-card" aria-label="Reset password">
          <p className="pause-auth-title"><KeyRound size={20} aria-hidden="true" /> {code ? "Choose a new password" : "Reset your password"}</p>
          {error ? <p className="pause-signin-alert" role="alert">{error}</p> : null}

          {done === "sent" ? (
            <p className="pause-auth-done" role="status">If an account exists for that address, a reset link is on its way. Check your inbox and spam folder.</p>
          ) : done === "reset" ? (
            <div className="pause-auth-done" role="status">
              <p>Your password is changed.</p>
              <button className="pause-button pause-button-ink" onClick={() => onNavigate("/pause/sign-in")}>Sign in</button>
            </div>
          ) : code ? (
            <form className="pause-auth-form" onSubmit={submit}>
              <label>
                <span>New password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
              </label>
              <label>
                <span>Repeat new password</span>
                <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" required />
              </label>
              <button className="pause-button pause-button-ink" type="submit" disabled={pending}>{pending ? "One moment…" : "Save new password"}</button>
            </form>
          ) : (
            <form className="pause-auth-form" onSubmit={submit}>
              <label>
                <span>Email</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </label>
              <button className="pause-button pause-button-ink" type="submit" disabled={pending}>{pending ? "One moment…" : "Send reset link"}</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
