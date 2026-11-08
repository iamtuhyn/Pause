import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

// Shared pieces of the sign-in, create-account and reset screens.

// A labelled field with a leading icon. Password fields get a show/hide toggle,
// and an error message (when given) is tied to the input for screen readers.
export function AuthField({
  error,
  icon: Icon,
  label,
  type = "text",
  ...input
}: { error?: string; icon: LucideIcon; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="pause-field">
      <label htmlFor={id}>{label}</label>
      <span className="pause-field-box">
        <Icon size={18} aria-hidden="true" className="pause-field-icon" />
        <input
          id={id}
          type={isPassword && shown ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...input}
        />
        {isPassword ? (
          <button type="button" className="pause-field-toggle" aria-pressed={shown} onClick={() => setShown((value) => !value)}>
            {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            <span className="pause-sr-only">Show password</span>
          </button>
        ) : null}
      </span>
      {error ? <span id={`${id}-error`} className="pause-field-error">{error}</span> : null}
    </div>
  );
}

// The blue side panel: a big two-word title, a lead and a short list of perks,
// with the Esc key resting in the corner.
export function AuthSide({ accent, lead, perks, title }: { accent: string; lead: string; perks?: { icon: LucideIcon; text: string }[]; title: string }) {
  return (
    <section className="pause-auth-side">
      <span className="pause-auth-keys" aria-hidden="true">
        <span className="pause-auth-key">Esc</span>
      </span>
      <h1>{title} <span>{accent}</span></h1>
      <p className="pause-auth-lead">{lead}</p>
      {perks ? (
        <ul className="pause-auth-perks">
          {perks.map((perk) => (
            <li key={perk.text}>
              <span className="pause-auth-perk-icon"><perk.icon size={18} aria-hidden="true" /></span>
              {perk.text}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function AuthAlert({ children }: { children: ReactNode }) {
  return <p className="pause-signin-alert" role="alert">{children}</p>;
}
