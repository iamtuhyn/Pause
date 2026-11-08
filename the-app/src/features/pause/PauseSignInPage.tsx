import { ArrowLeft, ArrowRight, Gamepad2, Lock, Mail, Medal, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { signInWithPassword } from "../../lib/blocks/auth";
import { signUp } from "../../lib/blocks/account";
import { isLoginConfigured } from "../../lib/blocks/config";
import { AuthAlert, AuthField, AuthSide } from "./AuthParts";
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
  cardTitle: "Welcome back",
  cardTitleUp: "Make it yours",
  cardLead: "Good to see you. Your games kept your seat warm.",
  cardLeadUp: "One minute, then every break picks up where you left off.",
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

  // Arrow keys move between the two tabs, as in any tab list.
  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const next = tab === "signin" ? "signup" : "signin";
    switchTab(next);
    document.getElementById(`pause-tab-${next}`)?.focus();
  }

  const perks = [
    { icon: Medal, text: "Your medals, on any device" },
    { icon: Gamepad2, text: "The full app, with every game" },
    { icon: Sparkles, text: "Every break picks up where you left off" }
  ];

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
      </header>

      <main className="pause-auth">
        <AuthSide
          title={tab === "signin" ? "sign" : "join"}
          accent="in"
          lead={tab === "signin" ? text.lead : text.leadUp}
          perks={perks}
        />

        <section className="pause-auth-card" aria-labelledby="pause-auth-heading">
          <div className="pause-auth-tabs" role="tablist" aria-label="Account" onKeyDown={onTabKey}>
            {(["signin", "signup"] as Tab[]).map((option) => (
              <button
                key={option}
                id={`pause-tab-${option}`}
                role="tab"
                aria-selected={tab === option}
                aria-controls="pause-auth-panel"
                tabIndex={tab === option ? 0 : -1}
                onClick={() => switchTab(option)}
              >
                {option === "signin" ? text.signIn : text.signUp}
              </button>
            ))}
          </div>

          <div id="pause-auth-panel" role="tabpanel" aria-labelledby={`pause-tab-${tab}`} className="pause-auth-panel">
            <div className="pause-auth-head">
              <h2 id="pause-auth-heading">{tab === "signin" ? text.cardTitle : text.cardTitleUp}</h2>
              <p>{tab === "signin" ? text.cardLead : text.cardLeadUp}</p>
            </div>

            {!configured ? <AuthAlert>{copy.signInNotConfigured}</AuthAlert> : null}
            {error ? <AuthAlert>{error}</AuthAlert> : null}

            {tab === "signup" && created ? (
              <p className="pause-auth-done" role="status">{text.signUpDone}</p>
            ) : (
              <form className="pause-auth-form" onSubmit={submit} noValidate={false}>
                {tab === "signup" ? (
                  <AuthField icon={User} label={text.name} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                ) : null}
                <AuthField icon={Mail} label={text.email} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                <AuthField
                  icon={Lock}
                  label={text.password}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={tab === "signin" ? "current-password" : "new-password"}
                  required
                />
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
                <button className="pause-button pause-button-ink pause-auth-submit" type="submit" disabled={!configured || pending}>
                  {pending ? text.busy : tab === "signin" ? text.signIn : text.signUp}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
            )}
            <p className="pause-auth-guest">{text.guest}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
