import { ArrowLeft, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { isLoginConfigured } from "../../lib/blocks/config";
import { copy } from "./content";
import "./pause.css";

// PAUSÉ-styled sign-in at /pause/sign-in. It calls the same Blocks hosted
// login as the scaffold's LoginPage, which still serves /login for the app.
export function PauseSignInPage({ onNavigate, returnTo }: { onNavigate: (path: string) => void; returnTo?: string }) {
  const { login, status } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const configured = isLoginConfigured();

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

  async function handleLogin() {
    setError(undefined);
    setPending(true);
    try {
      await login(returnTo);
    } catch (caught) {
      setError((caught as Error).message);
      setPending(false);
    }
  }

  return (
    <div className="pause-root pause-signin">
      <header className="pause-nav">
        <a className="pause-logo" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <span className="pause-key" aria-hidden="true">Esc</span>
          <span>{copy.brand}</span>
        </a>
        <span className="pause-nav-spacer" />
        <a className="pause-button pause-button-quiet" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <ArrowLeft size={18} />
          {copy.backToPause}
        </a>
      </header>
      <main className="pause-signin-main">
        <div className="pause-signin-card">
          <h1>{copy.signInTitle}</h1>
          <p>{copy.signInLead}</p>
          {!configured ? <p className="pause-signin-alert" role="alert">{copy.signInNotConfigured}</p> : null}
          {error ? <p className="pause-signin-alert" role="alert">{error}</p> : null}
          <button className="pause-button pause-button-sun" disabled={!configured || pending} onClick={handleLogin}>
            <LogIn size={18} />
            {pending ? copy.signInPending : copy.signInCta}
          </button>
          <p className="pause-signin-note">{copy.signInNote}</p>
        </div>
      </main>
    </div>
  );
}
