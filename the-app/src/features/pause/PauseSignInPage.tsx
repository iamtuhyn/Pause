import { ArrowLeft, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { signInWithPassword } from "../../lib/blocks/auth";
import { signUp } from "../../lib/blocks/account";
import { isLoginConfigured } from "../../lib/blocks/config";
import { copy } from "./content";
import { Wordmark } from "./Wordmark";
import { useDisplayFont } from "./useDisplayFont";
import "./pause.css";

// Descape's own sign-in and create-account screen at /pause/sign-in. Both forms
// call the Blocks SDK directly, so the Blocks hosted screen is never shown.
type Tab = "signin" | "signup";

const text = {
  signIn: "Sign in",
  signUp: "Create account",
  email: "Email",
  password: "Password",
  name: "Your name",
  remember: "Keep me signed in on this device",
  forgot: "Forgot your password?",
  signUpNote: "Use a password you don't use anywhere else. Your games and medals travel with your account.",
  signUpDone: "Account created. If we need to confirm your address, the email will have a link.",
  busy: "One moment…",
  lead: "Sign in to carry your medals to any device and step into the full app.",
  leadUp: "Make a new account and start a few minutes at a time.",
  guest: "No account? Every game here still plays without signing in.",
  back: "Back",
};

export function PauseSignInPage({ onNavigate, returnTo }: { onNavigate: (path: string) => void; returnTo?: string }) {
  const { refresh, status } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [created, setCreated] = useState(false);
  const configured = isLoginConfigured();
  useDisplayFont();

  useEffect(() => {
    const previous = document.title;
    document.title = `${copy.signInTitle} · ${copy.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  // Already signed in: go straight on. This replaces the scaffold guard,
  // whose dark loading screen would otherwise flash before this page.
  useEffect(() => {
    if (status === "authenticated") onNavigate(returnTo || "/games");
  }, [status, returnTo, onNavigate]);

  function switchTab(next: Tab) {
    setTab(next);
    setError(undefined);
    setCreated(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setPending(true);
    try {
      if (tab === "signin") {
        await signInWithPassword(email.trim(), password, remember);
        await refresh();
        onNavigate(returnTo || "/games");
      } else {
        await signUp(email.trim(), password, name);
        setCreated(true);
        setPassword("");
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
        <button className="pause-button pause-button-quiet" onClick={() => (window.history.length > 1 ? window.history.back() : onNavigate("/"))}>
          <ArrowLeft size={18} aria-hidden="true" />
          {text.back}
        </button>
        <a className="pause-button pause-button-quiet" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          {copy.backToPause}
        </a>
      </header>

      <main className="pause-auth">
        <section className="pause-auth-side">
          <h1>sign <span>in</span></h1>
          <p>{tab === "signin" ? text.lead : text.leadUp}</p>
          <p className="pause-auth-guest">{text.guest}</p>
        </section>

        <section className="pause-auth-card" aria-label={tab === "signin" ? text.signIn : text.signUp}>
          <div className="pause-auth-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "signin"} onClick={() => switchTab("signin")}>{text.signIn}</button>
            <button role="tab" aria-selected={tab === "signup"} onClick={() => switchTab("signup")}>{text.signUp}</button>
          </div>

          {!configured ? <p className="pause-signin-alert" role="alert">{copy.signInNotConfigured}</p> : null}
          {error ? <p className="pause-signin-alert" role="alert">{error}</p> : null}

          {tab === "signup" && created ? (
            <p className="pause-auth-done" role="status">{text.signUpDone}</p>
          ) : (
            <form className="pause-auth-form" onSubmit={submit}>
              {tab === "signup" ? (
                <label>
                  <span>{text.name}</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                </label>
              ) : null}
              <label>
                <span>{text.email}</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
              </label>
              <label>
                <span>{text.password}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={tab === "signin" ? "current-password" : "new-password"}
                  required
                />
              </label>
              {tab === "signin" ? (
                <div className="pause-auth-row">
                  <label className="pause-auth-check">
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                    <span>{text.remember}</span>
                  </label>
                  <a href="/pause/reset-password" onClick={(event) => { event.preventDefault(); onNavigate("/pause/reset-password"); }}>{text.forgot}</a>
                </div>
              ) : (
                <p className="pause-auth-note">{text.signUpNote}</p>
              )}
              <button className="pause-button pause-button-ink" type="submit" disabled={!configured || pending}>
                <LogIn size={18} aria-hidden="true" />
                {pending ? text.busy : tab === "signin" ? text.signIn : text.signUp}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
