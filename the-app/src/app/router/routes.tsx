import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { AppShell } from "../layout/AppShell";
import { RedirectIfAuthenticated, RequireAuth } from "./guards";
import { CallbackPage } from "../../features/auth/CallbackPage";
import { ErrorPage } from "../../features/auth/ErrorPage";
import { LoginPage } from "../../features/auth/LoginPage";
import { NotFoundPage } from "../../features/auth/NotFoundPage";
import { GamePlayPage } from "../../features/games/GamePlayPage";
import { GamesPage } from "../../features/games/GamesPage";
import { gameById } from "../../features/games/games";
import { PausePage } from "../../features/pause/PausePage";
import { PausePlayPage } from "../../features/pause/PausePlayPage";
import { activityById, isPlayable } from "../../features/pause/catalog/catalog";
import { PauseSignInPage } from "../../features/pause/PauseSignInPage";
import { ProfilePage } from "../../features/profile/ProfilePage";

const protectedRoutes: Record<string, ComponentType<{ onNavigate: (path: string) => void }>> = {
  "/games": GamesPage,
  "/profile": ProfilePage,
  "/error": ErrorPage
};

export function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextPath: string) {
    const [nextPathname = "/", queryString = ""] = nextPath.split("?");
    window.history.pushState({}, "", nextPath);
    setPath(nextPathname);
    setSearch(queryString ? `?${queryString}` : "");
  }

  if (path === "/login/callback") {
    return <CallbackPage onNavigate={navigate} />;
  }

  // PAUSÉ is the public home page: full-page, outside the shell and guard.
  // /pause stays as an alias so earlier links keep working.
  if (path === "/" || path === "/pause") {
    return <PausePage onNavigate={navigate} />;
  }
  // Any playable PAUSÉ catalogue activity, open to everyone.
  const pauseActivity = /^\/pause\/play\/([a-z0-9-]+)$/.exec(path);
  if (pauseActivity) {
    const activity = activityById(pauseActivity[1] ?? "");
    return activity && isPlayable(activity) ? <PausePlayPage activity={activity} onNavigate={navigate} /> : <NotFoundPage onNavigate={navigate} />;
  }

  // PAUSÉ-branded sign-in, used only by the PAUSÉ page's Sign in link. The
  // app's own /login (used by the sign-in guard) is unchanged.
  if (path === "/pause/sign-in") {
    const returnTo = new URLSearchParams(search).get("returnTo") || undefined;
    return <PauseSignInPage onNavigate={navigate} returnTo={returnTo} />;
  }

  if (path === "/login") {
    const returnTo = new URLSearchParams(search).get("returnTo") || undefined;
    return (
      <RedirectIfAuthenticated onNavigate={navigate}>
        <LoginPage returnTo={returnTo} />
      </RedirectIfAuthenticated>
    );
  }

  // /games/<id> plays one game inside the shell; the sidebar keeps "Games" active.
  // (Visitors who aren't signed in play the same games at /pause/play/<id>.)
  const gameMatch = /^\/games\/([a-z0-9-]+)$/.exec(path);
  if (gameMatch) {
    const game = gameById(gameMatch[1] ?? "");
    if (!game) {
      return <NotFoundPage onNavigate={navigate} />;
    }
    return (
      <RequireAuth currentPath={path} onNavigate={navigate}>
        <AppShell activePath="/games" onNavigate={navigate}>
          <GamePlayPage game={game} onNavigate={navigate} />
        </AppShell>
      </RequireAuth>
    );
  }

  const Page = protectedRoutes[path];
  if (!Page) {
    return <NotFoundPage onNavigate={navigate} />;
  }

  return (
    <RequireAuth currentPath={path} onNavigate={navigate}>
      <AppShell activePath={path} onNavigate={navigate}>
        <Page onNavigate={navigate} />
      </AppShell>
    </RequireAuth>
  );
}
