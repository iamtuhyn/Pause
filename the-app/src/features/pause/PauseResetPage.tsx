import { ArrowLeft, KeyRound, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { requestPasswordReset, resetPassword } from "../../lib/blocks/account";
import { AuthAlert, AuthField, AuthSide } from "./AuthParts";
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
        <AuthSide title="reset" accent="it" lead="Forgotten passwords happen to everyone. It takes a minute to set a new one." />

        <section className="pause-auth-card" aria-labelledby="pause-auth-heading">
          <div className="pause-auth-head">
            <h2 id="pause-auth-heading"><KeyRound size={22} aria-hidden="true" /> {code ? "Choose a new password" : "Reset your password"}</h2>
            <p>{code ? "Pick something you don't use anywhere else." : "Tell us your email and we'll send a link."}</p>
          </div>
          {error ? <AuthAlert>{error}</AuthAlert> : null}

          {done === "sent" ? (
            <p className="pause-auth-done" role="status">If an account exists for that address, a reset link is on its way. Check your inbox and spam folder.</p>
          ) : done === "reset" ? (
            <div className="pause-auth-done" role="status">
              <p>Your password is changed.</p>
              <button className="pause-button pause-button-ink" onClick={() => onNavigate("/pause/sign-in")}>Sign in</button>
            </div>
          ) : code ? (
            <form className="pause-auth-form" onSubmit={submit}>
              <AuthField icon={Lock} label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
              <AuthField icon={Lock} label="Repeat new password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" required />
              <button className="pause-button pause-button-ink pause-auth-submit" type="submit" disabled={pending}>{pending ? "One moment…" : "Save new password"}</button>
            </form>
          ) : (
            <form className="pause-auth-form" onSubmit={submit}>
              <AuthField icon={Mail} label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              <button className="pause-button pause-button-ink pause-auth-submit" type="submit" disabled={pending}>{pending ? "One moment…" : "Send reset link"}</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
