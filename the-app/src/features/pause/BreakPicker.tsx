import { ArrowRight, Shuffle, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { durations } from "./catalog/activity";
import type { Activity, Category, Minutes } from "./catalog/activity";
import { isPlayable, pickSuggestion } from "./catalog/catalog";
import type { Suggestion } from "./catalog/catalog";
import { categories, copy, pillars } from "./content";

// Break Picker: one question first (how much time). Choosing a time opens the
// pause in a centred pop-up, so the hero stays where it is. Mood is optional and
// offered inside the pop-up. Native radios (styled as chips) keep keyboard and
// screen-reader behaviour.
export function BreakPicker({ onStart }: { onStart: (activityId: string) => void }) {
  const [minutes, setMinutes] = useState<Minutes>();
  const [category, setCategory] = useState<Category>();
  const [result, setResult] = useState<Suggestion>();
  const [alone, setAlone] = useState(false);
  const [askMood, setAskMood] = useState(false);
  const [open, setOpen] = useState(false);
  const timeGroup = useRef<HTMLFieldSetElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const showing = result?.activity;

  // Escape closes the pop-up, as in most dialogs, and Tab stays inside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialog.current) return;
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, input, a[href]")).filter((el) => !el.hasAttribute("disabled") && !(el instanceof HTMLInputElement && el.type === "radio" && !el.checked));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus moves into the pop-up when it opens or changes.
  useEffect(() => {
    if (open) dialog.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open, result]);

  function suggest(nextMinutes: Minutes, nextCategory: Category | undefined) {
    setAlone(false);
    setResult(pickSuggestion(nextMinutes, nextCategory));
    setOpen(true);
  }

  // "Show me another" keeps the current pause when it's the only one that fits.
  function another() {
    if (!minutes) return;
    const next = pickSuggestion(minutes, category, showing?.id);
    if (next.activity) setResult(next);
    else setAlone(true);
  }

  function chooseMinutes(value: Minutes) {
    setMinutes(value);
    suggest(value, category);
  }

  function chooseCategory(value: Category | undefined) {
    setCategory(value);
    if (minutes) suggest(minutes, value);
  }

  // Closing returns focus to the chosen time, so keyboard users stay in place.
  function close() {
    setOpen(false);
    setAskMood(false);
    timeGroup.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
  }

  return (
    <div className="pause-picker">
      <fieldset ref={timeGroup}>
        <legend><Timer size={16} aria-hidden="true" /> {copy.pickerTime}</legend>
        <div className="pause-chips">
          {durations.map((value) => (
            <label key={value} className="pause-chip">
              <input
                type="radio"
                name="pause-minutes"
                checked={minutes === value}
                onChange={() => chooseMinutes(value)}
                // Choosing the time that is already selected only fires click, so reopen from here.
                onClick={() => {
                  if (minutes === value) suggest(value, category);
                }}
              />
              <span>{value} min</span>
            </label>
          ))}
        </div>
      </fieldset>

      {open && result ? (
        <div
          className="pause-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div ref={dialog} className="pause-dialog" role="dialog" aria-modal="true" aria-label={copy.resultLabel}>
            <button className="pause-dialog-close" onClick={close} aria-label={copy.closePopup}>×</button>
            <div className="pause-result-slot" aria-live="polite">
              {showing ? <Result activity={showing} alone={alone} onStart={onStart} /> : null}
              {showing ? null : (
                <div className="pause-result pause-result-empty">
                  <strong>{copy.emptyNoneTitle}</strong>
                  <span>{copy.emptyNoneText}</span>
                  <span className="pause-result-actions">
                    <button className="pause-button pause-button-ink" onClick={close}>{copy.emptyChangeTime}</button>
                    <button className="pause-button pause-button-ink" onClick={() => setAskMood(true)}>{copy.emptyChangeCategory}</button>
                  </span>
                </div>
              )}
            </div>
            {showing ? (
              <div className="pause-picker-more">
                {alone ? null : (
                  <button className="pause-text-button" onClick={another}>
                    <Shuffle size={16} aria-hidden="true" /> {copy.resultAnother}
                  </button>
                )}
                {askMood ? null : (
                  <button className="pause-text-button" onClick={() => setAskMood(true)}>{copy.moodOffer}</button>
                )}
              </div>
            ) : null}
            {askMood ? (
              <fieldset className="pause-picker-mood">
                <legend>{copy.moodAsk}</legend>
                <div className="pause-chips">
                  <label className="pause-chip">
                    <input type="radio" name="pause-category" checked={!category} onChange={() => chooseCategory(undefined)} />
                    <span>{copy.moodAny}</span>
                  </label>
                  {categories.map((option) => (
                    <label key={option.id} className="pause-chip">
                      <input type="radio" name="pause-category" checked={category === option.id} onChange={() => chooseCategory(option.id)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Result({ activity, alone, onStart }: { activity: Activity; alone: boolean; onStart: (activityId: string) => void }) {
  const pillar = pillars.find((p) => p.id === activity.pillar);
  return (
    <div className={`pause-result pause-tone-${activity.pillar}`}>
      <span className="pause-result-meta">
        {copy.resultLabel} · {pillar?.title} · {activity.maxMinutes} min
      </span>
      <strong>{activity.title}</strong>
      <span>{activity.summary}</span>
      {alone ? <em>{copy.emptyOnlyText}</em> : null}
      {isPlayable(activity) ? (
        <button className="pause-button pause-button-ink" onClick={() => onStart(activity.id)}>
          {copy.resultStart}
          <ArrowRight size={18} />
        </button>
      ) : (
        <em>{copy.resultPreview}</em>
      )}
    </div>
  );
}
