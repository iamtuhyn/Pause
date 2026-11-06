import { Gamepad2, UserRound } from "lucide-react";

export const navItems = [
  { href: "/games", labelKey: "nav.games", icon: Gamepad2 },
  { href: "/profile", labelKey: "nav.profile", icon: UserRound }
] as const;
