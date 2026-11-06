import { ArrowRight, Shuffle, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { durations } from "./catalog/activity";
import type { Activity, Category, Minutes } from "./catalog/activity";
import { isPlayable, pickSuggestion } from "./catalog/catalog";
import type { Suggestion } from "./catalog/catalog";
import { categories, copy, pillars } from "./content";

// Break Picker: one question first (how much time), and picking a time is the
// whole decision: a pause appears straight away. Mood is optional and only
// offered after a suggestion, so nobody has to choose twice before resting.
// Native radios (styled as chips) give keyboard and screen-reader behaviour for free.
export function BreakPicker({ onStart }: { onStart: (activityId: string) => void }) {
  const [minutes, setMinutes] = useState<Minutes>();
  const [category, setCategory] = useState<Category>();
  const [result, setResult] = useState<Suggestion>();
  const [alone, setAlone] = useState(false);
  const [askMood, setAskMood] = useState(false);
  const timeGroup = useRef<HTMLFieldSetElement>(null);
  const moodGroup = useRef<HTMLFieldSetElement>(null);
  const showing = result?.activity;

  function suggest(nextMinutes: Minutes, nextCategory: Category | undefined) {
    setAlone(false);
    setResult(pickSuggestion(nextMinutes, nextCategory));
  }
  // "Show me another" keeps the current pause when it's the only one that fits,
  // rather than taking it away.
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
  function focusGroup(group: HTMLFieldSetElement | null) {
    group?.querySelector<HTMLInputElement>("input:checked, input")?.focus();
  }

  return (
    <div className="pause-picker">
      <fieldset ref={timeGroup}>
        <legend><Timer size={16} aria-hidden="true" /> {copy.pickerTime}</legend>
        <div className="pause-chips">
          {durations.map((value) => (
            <label key={value} className="pause-chip">
              <input type="radio" name="pause-minutes" checked={minutes === value} onChange={() => chooseMinutes(value)} />
              <span>{value} min</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="pause-result-slot" aria-live="polite">
        {showing ? <Result activity={showing} alone={alone} onStart={onStart} /> : null}
        {result && !showing ? (
          <div className="pause-result pause-result-empty">
            <strong>{copy.emptyNoneTitle}</strong>
            <span>{copy.emptyNoneText}</span>
            <span className="pause-result-actions">
              <button className="pause-button pause-button-ink" onClick={() => focusGroup(timeGroup.current)}>{copy.emptyChangeTime}</button>
              <button className="pause-button pause-button-ink" onClick={() => focusGroup(moodGroup.current)}>{copy.emptyChangeCategory}</button>
            </span>
          </div>
        ) : null}
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

      {askMood && minutes ? (
        <fieldset ref={moodGroup} className="pause-picker-mood">
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
